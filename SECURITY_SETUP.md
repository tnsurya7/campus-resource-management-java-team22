# 🔒 Security Setup Guide

## ⚠️ IMPORTANT: Never Commit Credentials to Git!

This guide explains how to properly configure your application without exposing sensitive credentials.

---

## 🚨 Files That Should NEVER Be Committed

These files are already in `.gitignore`:
- `backend/.env` - Contains real database credentials
- `backend/.env.local` - Local environment overrides
- `backend/application-secret.properties` - Production secrets

**Always check `.gitignore` before committing!**

---

## 📝 Environment Variables Setup

### Step 1: Copy the Example File

```bash
cd backend
cp .env.example .env
```

### Step 2: Edit `.env` with Your Real Credentials

```bash
# Open .env in your editor
nano .env  # or use your preferred editor
```

### Step 3: Fill in Your Values

```env
# Database Configuration
DB_URL=jdbc:postgresql://your-actual-database-host:5432/your-database-name
DB_USERNAME=your_actual_username
DB_PASSWORD=your_actual_password

# JWT Configuration (Optional - has defaults)
JWT_SECRET=your_strong_secret_key_here
JWT_EXPIRATION=86400000
```

---

## 🔐 Generate Strong JWT Secret

For production, generate a strong JWT secret:

```bash
# Using OpenSSL (recommended)
openssl rand -base64 64

# Using Python
python3 -c "import secrets; print(secrets.token_urlsafe(64))"

# Using Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"
```

Copy the output and set it as `JWT_SECRET` in your `.env` file.

---

## 🚀 Running the Application

### Option 1: Using Environment Variables (Recommended)

```bash
cd backend

# Export environment variables
export DB_URL="jdbc:postgresql://your-host:5432/your-db"
export DB_USERNAME="your_username"
export DB_PASSWORD="your_password"
export JWT_SECRET="your_generated_secret"

# Run the application
mvn spring-boot:run
```

### Option 2: Using .env File

The application will automatically read from `backend/.env` file if it exists.

```bash
cd backend
mvn spring-boot:run
```

---

## 🔍 Verify No Credentials in Git

Before committing, always check:

```bash
# Check what will be committed
git status

# Search for potential credentials
git grep -i "password"
git grep -i "secret"
git grep -E "[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}"

# Check if .env is ignored
git check-ignore backend/.env
# Should output: backend/.env
```

---

## 📋 Configuration Files Overview

### `application.properties` (Safe to Commit)
- Uses environment variable placeholders: `${DB_URL:default_value}`
- No hardcoded credentials
- Safe defaults for local development

### `.env.example` (Safe to Commit)
- Template file with placeholder values
- Shows what variables are needed
- No real credentials

### `.env` (NEVER Commit)
- Contains your actual credentials
- Already in `.gitignore`
- Each developer has their own copy

---

## 🏭 Production Deployment

### For Cloud Platforms (Heroku, AWS, Azure, etc.)

Set environment variables through the platform's dashboard or CLI:

**Heroku:**
```bash
heroku config:set DB_URL="jdbc:postgresql://..."
heroku config:set DB_USERNAME="username"
heroku config:set DB_PASSWORD="password"
heroku config:set JWT_SECRET="your_secret"
```

**AWS Elastic Beanstalk:**
```bash
eb setenv DB_URL="jdbc:postgresql://..." \
         DB_USERNAME="username" \
         DB_PASSWORD="password" \
         JWT_SECRET="your_secret"
```

**Docker:**
```bash
docker run -e DB_URL="..." \
           -e DB_USERNAME="..." \
           -e DB_PASSWORD="..." \
           -e JWT_SECRET="..." \
           your-image
```

---

## ✅ Security Checklist

Before pushing to Git:

- [ ] `.env` file is in `.gitignore`
- [ ] No hardcoded credentials in `application.properties`
- [ ] `.env.example` has only placeholder values
- [ ] JWT secret is strong (64+ characters)
- [ ] Database password is strong
- [ ] No credentials in documentation files
- [ ] Ran `git status` to verify
- [ ] Ran `git grep` to search for credentials

---

## 🆘 If You Accidentally Committed Credentials

### Immediate Actions:

1. **Change all exposed credentials immediately!**
   - Database password
   - JWT secret
   - Any API keys

2. **Remove from Git history:**

```bash
# Remove the file from Git history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch backend/.env" \
  --prune-empty --tag-name-filter cat -- --all

# Force push (WARNING: This rewrites history)
git push origin --force --all
```

3. **Notify your team** about the credential change

---

## 📚 Example Credentials for Documentation

When writing documentation, use these example credentials:

```
Database:
- Host: your-database-host
- Port: 5432
- Database: your-database-name
- Username: your_username
- Password: your_password

JWT:
- Secret: your_jwt_secret_key_here

Email (for examples):
- user@example.com
- test@example.com
- demo@example.com
```

**Never use real credentials in documentation!**

---

## 🔗 Additional Resources

- [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [GitHub: Removing sensitive data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
- [12-Factor App: Config](https://12factor.net/config)

---

## 📞 Questions?

If you're unsure about any security aspect, ask your team lead or security officer before committing.

**Remember: It's easier to prevent a leak than to fix one!** 🔒
