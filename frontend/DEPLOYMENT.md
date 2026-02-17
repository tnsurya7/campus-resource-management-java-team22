# 🚀 CRMS Frontend - Deployment Guide

## 📋 Pre-Deployment Checklist

- [ ] All features tested locally
- [ ] Backend API is accessible
- [ ] Environment variables configured
- [ ] No console errors
- [ ] Responsive design verified
- [ ] All roles tested
- [ ] Error handling verified

## 🏗️ Build for Production

### 1. Update Environment Variables

Create `.env.production`:

```env
VITE_API_BASE_URL=https://your-backend-api.com
```

### 2. Build the Application

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

### 3. Test Production Build Locally

```bash
npm run preview
```

Visit `http://localhost:4173` to test the production build.

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)

**Pros**: Free, automatic deployments, CDN, HTTPS

**Steps**:

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow prompts:
   - Link to existing project or create new
   - Set build command: `npm run build`
   - Set output directory: `dist`

4. Set environment variables in Vercel dashboard:
   - Go to Project Settings → Environment Variables
   - Add `VITE_API_BASE_URL`

5. Redeploy:
```bash
vercel --prod
```

**Custom Domain**: Add in Vercel dashboard under Domains

---

### Option 2: Netlify

**Pros**: Free, drag-and-drop, form handling, serverless functions

**Steps**:

1. Build the app:
```bash
npm run build
```

2. Go to [Netlify](https://netlify.com)

3. Drag and drop the `dist` folder

**OR** use Netlify CLI:

```bash
npm install -g netlify-cli
netlify deploy --prod
```

4. Set environment variables:
   - Go to Site Settings → Environment Variables
   - Add `VITE_API_BASE_URL`

5. Create `netlify.toml` for configuration:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

### Option 3: GitHub Pages

**Pros**: Free, integrated with GitHub

**Steps**:

1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Update `package.json`:
```json
{
  "homepage": "https://yourusername.github.io/crms-frontend",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. Update `vite.config.js`:
```javascript
export default {
  base: '/crms-frontend/',
  // ... rest of config
}
```

4. Deploy:
```bash
npm run deploy
```

---

### Option 4: AWS S3 + CloudFront

**Pros**: Scalable, fast, professional

**Steps**:

1. Build the app:
```bash
npm run build
```

2. Create S3 bucket:
   - Enable static website hosting
   - Set index document: `index.html`
   - Set error document: `index.html`

3. Upload `dist` folder contents to S3

4. Set bucket policy for public access:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

5. Create CloudFront distribution:
   - Origin: S3 bucket
   - Default root object: `index.html`
   - Error pages: 404 → /index.html (for SPA routing)

6. Update DNS to point to CloudFront

---

### Option 5: Docker + Any Cloud

**Pros**: Portable, consistent, works anywhere

**Steps**:

1. Create `Dockerfile`:

```dockerfile
# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

2. Create `nginx.conf`:

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

3. Create `.dockerignore`:

```
node_modules
dist
.git
.env
```

4. Build Docker image:
```bash
docker build -t crms-frontend .
```

5. Run locally to test:
```bash
docker run -p 8080:80 crms-frontend
```

6. Deploy to any cloud:
   - AWS ECS
   - Google Cloud Run
   - Azure Container Instances
   - DigitalOcean App Platform

---

## 🔒 Security Considerations

### 1. Environment Variables
- Never commit `.env` files
- Use platform-specific environment variable management
- Rotate API keys regularly

### 2. CORS Configuration
Ensure backend allows your frontend domain:

```java
@CrossOrigin(origins = "https://your-frontend-domain.com")
```

### 3. HTTPS
- Always use HTTPS in production
- Most platforms provide free SSL certificates
- Redirect HTTP to HTTPS

### 4. Content Security Policy
Add to `index.html`:

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline'; 
               connect-src 'self' https://your-api.com;">
```

---

## 🎯 Performance Optimization

### 1. Code Splitting
Already handled by Vite automatically.

### 2. Lazy Loading
Update `App.jsx` for lazy loading:

```javascript
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Users = lazy(() => import('./pages/Users'));
// ... other imports

// Wrap routes with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <Dashboard />
</Suspense>
```

### 3. Image Optimization
- Use WebP format
- Compress images
- Use CDN for assets

### 4. Caching
Configure in `vite.config.js`:

```javascript
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['react-toastify']
        }
      }
    }
  }
}
```

---

## 📊 Monitoring & Analytics

### 1. Error Tracking
Add Sentry:

```bash
npm install @sentry/react
```

```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production"
});
```

### 2. Analytics
Add Google Analytics:

```html
<!-- In index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

---

## 🧪 Post-Deployment Testing

- [ ] Test login functionality
- [ ] Test all user roles
- [ ] Test CRUD operations
- [ ] Test error handling
- [ ] Test on different devices
- [ ] Test on different browsers
- [ ] Check console for errors
- [ ] Verify API calls work
- [ ] Test responsive design
- [ ] Check loading times

---

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
      env:
        VITE_API_BASE_URL: ${{ secrets.API_BASE_URL }}
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

---

## 📝 Environment Variables Reference

### Development (`.env`)
```env
VITE_API_BASE_URL=http://localhost:8080
```

### Production (`.env.production`)
```env
VITE_API_BASE_URL=https://api.yourcompany.com
```

### Staging (`.env.staging`)
```env
VITE_API_BASE_URL=https://staging-api.yourcompany.com
```

---

## 🆘 Troubleshooting

### Issue: Blank page after deployment
**Solution**: Check browser console, verify API URL, check CORS

### Issue: 404 on refresh
**Solution**: Configure server to redirect all routes to index.html

### Issue: Environment variables not working
**Solution**: Ensure variables start with `VITE_`, rebuild after changes

### Issue: Slow loading
**Solution**: Enable gzip compression, use CDN, optimize images

---

## 🎉 Deployment Complete!

Your CRMS frontend is now live and accessible to users!

**Next Steps**:
1. Monitor error logs
2. Gather user feedback
3. Plan feature updates
4. Optimize performance

---

**Happy Deploying! 🚀**
