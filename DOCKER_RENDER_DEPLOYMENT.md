# Docker Deployment to Render

## Overview
Since Render doesn't have native Java support, we'll deploy the backend as a Docker container.

## Prerequisites
- GitHub account with your repository
- Render account (free tier available)
- Supabase database credentials

## Deployment Steps

### Step 1: Verify Docker Files

Your repository should have:
- ✅ `backend/Dockerfile` - Multi-stage build configuration
- ✅ `backend/.dockerignore` - Excludes unnecessary files
- ✅ `render.yaml` - Render configuration

### Step 2: Test Docker Build Locally (Optional)

```bash
# Build the image
cd backend
docker build -t crms-backend .

# Test run locally
docker run -p 8080:8080 \
  -e DB_URL="jdbc:postgresql://your-supabase-url:5432/postgres?sslmode=require" \
  -e DB_USERNAME="postgres.xxxxx" \
  -e DB_PASSWORD="your-password" \
  -e JWT_SECRET="your-secret" \
  crms-backend

# Test endpoint
curl http://localhost:8080/
```

### Step 3: Push to GitHub

```bash
git add backend/Dockerfile backend/.dockerignore render.yaml
git commit -m "feat: add Docker support for Render deployment"
git push origin main
```

### Step 4: Create Render Web Service

1. **Go to Render Dashboard**
   - Visit https://dashboard.render.com
   - Click **"New +"** → **"Web Service"**

2. **Connect Repository**
   - Select "Build and deploy from a Git repository"
   - Click "Connect" next to your repository
   - Authorize Render if prompted

3. **Configure Service**

   **Name**: `crms-backend`
   
   **Region**: `Oregon (US West)` or closest to you
   
   **Branch**: `main`
   
   **Root Directory**: Leave empty (Dockerfile path is in render.yaml)
   
   **Environment**: `Docker`
   
   **Dockerfile Path**: `./backend/Dockerfile`
   
   **Docker Context**: `./backend`
   
   **Docker Build Context**: `./backend`
   
   **Instance Type**: `Free`

4. **Add Environment Variables**

   Click **"Advanced"** → **"Add Environment Variable"**
   
   Add these one by one:

   | Key | Value | Example |
   |-----|-------|---------|
   | `DB_URL` | Your Supabase JDBC URL | `jdbc:postgresql://aws-1-ap-south-1.pooler.supabase.com:5432/postgres?sslmode=require` |
   | `DB_USERNAME` | Your Supabase username | `postgres.dunbtzykbnuorphezkot` |
   | `DB_PASSWORD` | Your Supabase password | `your-secure-password` |
   | `JWT_SECRET` | Secure random string | Generate with: `openssl rand -base64 64` |
   | `PORT` | Port number | `8080` |

   **IMPORTANT**: Use your actual credentials, never commit them to Git!

5. **Deploy**
   - Click **"Create Web Service"**
   - Render will start building the Docker image
   - First build takes 5-10 minutes
   - Watch logs for progress

### Step 5: Monitor Deployment

Watch the build logs for:

```
==> Downloading cache...
==> Building image...
[+] Building 120.5s
 => [build 1/6] FROM docker.io/library/maven:3.9-eclipse-temurin-17-alpine
 => [build 2/6] WORKDIR /app
 => [build 3/6] COPY pom.xml .
 => [build 4/6] RUN mvn dependency:go-offline -B
 => [build 5/6] COPY src ./src
 => [build 6/6] RUN mvn clean package -DskipTests
 => [stage-1 1/2] FROM docker.io/library/eclipse-temurin:17-jre-alpine
 => [stage-1 2/2] COPY --from=build /app/target/crms-0.0.1-SNAPSHOT.jar app.jar
==> Uploading build...
==> Build successful!
==> Starting service...
Started CrmsApplication in 8.234 seconds
```

### Step 6: Get Your Backend URL

After successful deployment:
- Your URL: `https://crms-backend.onrender.com`
- Or custom: `https://your-service-name.onrender.com`

## Post-Deployment Configuration

### 1. Update Vercel Environment Variable

1. Go to Vercel Dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Update `VITE_API_URL`:
   ```
   https://crms-backend.onrender.com
   ```
5. Click **"Save"**
6. Go to **Deployments** → **"Redeploy"**

### 2. Update Backend CORS

Edit `backend/src/main/java/com/ksr/crms/security/SecurityConfig.java`:

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList(
        "http://localhost:5173",
        "http://localhost:3000",
        "https://campus-resource-management-java-tea.vercel.app"  // Add your Vercel URL
    ));
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setAllowCredentials(true);
    configuration.setMaxAge(3600L);
    
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}
```

Commit and push - Render will auto-redeploy.

### 3. Run Database Migrations

In Supabase SQL Editor, run these scripts in order:

1. **database-update.sql** - Update booking constraints
2. **database-admin-role.sql** - Add admin role and user
3. **database-password-migration.sql** - Migrate passwords to BCrypt

## Testing Deployment

### Test 1: Health Check
```bash
curl https://crms-backend.onrender.com/
```

Expected response:
```json
{
  "application": "Campus Resource Management System",
  "status": "running",
  "version": "1.0.0"
}
```

### Test 2: API Documentation
Open in browser:
```
https://crms-backend.onrender.com/swagger-ui.html
```

### Test 3: Login Endpoint
```bash
curl -X POST https://crms-backend.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@crms.com","password":"YOUR_PASSWORD"}'
```

Should return JWT token and user data.

### Test 4: Frontend Integration
1. Open: https://campus-resource-management-java-tea.vercel.app
2. Try logging in
3. Check browser console - API calls should go to Render backend
4. Verify no CORS errors

## Troubleshooting

### Build Fails

**Error**: "failed to solve: failed to compute cache key"
- Check Dockerfile syntax
- Verify paths are correct
- Try building locally first

**Error**: "BUILD FAILURE" during Maven build
- Check pom.xml is valid
- Verify all dependencies are available
- Check build logs for specific error

### Container Won't Start

**Error**: "Application failed to start"
- Check environment variables are set correctly
- Verify database connection string
- Check logs for specific error

**Error**: "Connection refused" to database
- Verify DB_URL includes `?sslmode=require`
- Check Supabase credentials
- Ensure Supabase allows connections from Render IPs

### CORS Errors

**Error**: "CORS policy: No 'Access-Control-Allow-Origin'"
- Add Vercel URL to SecurityConfig.java
- Commit and push (triggers redeploy)
- Clear browser cache

### Memory Issues

**Error**: "Out of memory" or container crashes
- Free tier has 512MB RAM limit
- Optimize JVM settings in Dockerfile:
  ```dockerfile
  ENTRYPOINT ["java", "-Xmx400m", "-Xms256m", "-jar", "app.jar"]
  ```

## Docker Image Optimization

Current image size: ~200MB (multi-stage build)

Further optimizations:
1. Use Alpine Linux (already done)
2. Multi-stage build (already done)
3. Layer caching for dependencies (already done)

## Render Free Tier Limitations

- **Spin Down**: Service sleeps after 15 minutes of inactivity
- **Cold Start**: First request takes 30-60 seconds to wake up
- **Memory**: 512MB RAM limit
- **Build Time**: 15 minutes max
- **Bandwidth**: 100GB/month

**Tip**: Keep service awake with cron job:
```bash
# Ping every 14 minutes
*/14 * * * * curl https://crms-backend.onrender.com/
```

Or use a free service like:
- UptimeRobot (https://uptimerobot.com)
- Cron-job.org (https://cron-job.org)

## Monitoring

### View Logs
```bash
# In Render Dashboard
1. Click your service
2. Click "Logs" tab
3. Real-time logs appear
```

### Metrics
- CPU usage
- Memory usage  
- Request count
- Response times

### Set Up Alerts
1. Go to Settings → Notifications
2. Add email for alerts
3. Configure thresholds

## Updating Deployment

### Auto-Deploy (Default)
- Push to main branch
- Render automatically rebuilds and deploys
- Takes 5-10 minutes

### Manual Deploy
1. Go to Manual Deploy tab
2. Click "Deploy latest commit"
3. Or select specific commit

### Rollback
1. Go to Events tab
2. Find previous successful deployment
3. Click "Rollback to this version"

## Environment Variables Management

### Update Variables
1. Go to Environment tab
2. Edit variable value
3. Click "Save"
4. Service automatically restarts

### Add New Variable
1. Click "Add Environment Variable"
2. Enter key and value
3. Click "Save"
4. Service restarts

## Custom Domain (Optional)

1. Go to Settings → Custom Domains
2. Add domain: `api.yourdomain.com`
3. Update DNS:
   ```
   Type: CNAME
   Name: api
   Value: crms-backend.onrender.com
   ```
4. SSL certificate auto-generated

## Security Best Practices

- ✅ Use environment variables for secrets
- ✅ Never commit credentials to Git
- ✅ Use strong JWT secret (256+ bits)
- ✅ Enable HTTPS (automatic on Render)
- ✅ Configure CORS for production URLs only
- ✅ Use BCrypt for password hashing
- ✅ Rotate secrets regularly

## Cost Estimation

### Free Tier
- Backend: $0 (with limitations)
- Database: $0 (Supabase free tier)
- Frontend: $0 (Vercel free tier)
- **Total**: $0/month

### Paid Tier (Production)
- Backend: $7/month (Starter - no spin down)
- Database: $25/month (Supabase Pro)
- Frontend: $20/month (Vercel Pro)
- **Total**: $52/month

## Complete Deployment Checklist

### Pre-Deployment
- [x] Dockerfile created
- [x] .dockerignore created
- [x] render.yaml configured
- [x] Code pushed to GitHub
- [ ] Database migrations ready
- [ ] Environment variables documented

### Deployment
- [ ] Render service created
- [ ] Docker environment selected
- [ ] Environment variables set
- [ ] Build succeeds
- [ ] Container starts successfully
- [ ] Health check passes

### Post-Deployment
- [ ] API endpoints tested
- [ ] Swagger UI accessible
- [ ] Login works
- [ ] JWT tokens generated
- [ ] Database connected
- [ ] Frontend connected to backend
- [ ] CORS configured
- [ ] Database migrations run
- [ ] All features tested

## Success Criteria

✅ Docker image builds successfully
✅ Container starts without errors
✅ Backend accessible via HTTPS
✅ Swagger UI loads
✅ Login endpoint works
✅ JWT tokens generated correctly
✅ Database connected
✅ Frontend can call backend APIs
✅ CORS working
✅ No errors in logs

---

**Your URLs**:
- Frontend: https://campus-resource-management-java-tea.vercel.app
- Backend: https://crms-backend.onrender.com (after deployment)
- API Docs: https://crms-backend.onrender.com/swagger-ui.html

**Next Steps**:
1. Push Docker files to GitHub
2. Create Render web service with Docker
3. Add environment variables
4. Wait for build to complete
5. Update Vercel with backend URL
6. Update backend CORS
7. Run database migrations
8. Test complete integration

**Congratulations!** Your full-stack application with Docker is ready to deploy! 🐳🚀
