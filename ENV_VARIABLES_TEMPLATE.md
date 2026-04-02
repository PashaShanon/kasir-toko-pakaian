# Environment Variables Template
# Gunakan file ini sebagai referensi untuk setup environment variables di Vercel

## BACKEND ENVIRONMENT VARIABLES
# Set these in Vercel Dashboard → Settings → Environment Variables

# Server Configuration
NODE_ENV=production                                    # Set to "production" for Vercel

# Database Configuration (PostgreSQL)
DB_HOST=your-postgres-host.com                        # e.g., db.supabase.co
DB_PORT=5432                                          # Default PostgreSQL port
DB_USER=postgres                                      # Your database user
DB_PASSWORD=your-secure-database-password            # Your database password
DB_NAME=toko_online                                  # Your database name

# JWT Secrets (Generate with: bash generate-secrets.sh)
JWT_SECRET=your-generated-jwt-secret-min-32-chars    # Min 32 characters
REFRESH_TOKEN_SECRET=your-generated-refresh-secret   # Min 32 characters

# Admin Account (First time login credentials)
ADMIN_EMAIL=admin@example.com                        # Admin email
ADMIN_PASSWORD=strong-secure-password                # Admin password

# CORS Configuration
CLIENT_URL=https://your-frontend.vercel.app          # Your frontend URL
# OR for multiple origins:
# CLIENT_URL=https://your-frontend.vercel.app,https://other-domain.com

# Optional: Rate Limiting
RATE_LIMIT_WINDOW_MS=900000                          # 15 minutes in ms
RATE_LIMIT_MAX_REQUESTS=1000                         # Max requests per window

---

## FRONTEND ENVIRONMENT VARIABLES
# Set these in Vercel Dashboard → Settings → Environment Variables

# API Configuration
VITE_API_URL=https://your-backend.vercel.app/api    # Your backend API URL

---

## QUICK SETUP INSTRUCTION

### 1. Generate Secrets (Backend)
Run this command locally:
```bash
bash generate-secrets.sh
```
Copy the JWT_SECRET and REFRESH_TOKEN_SECRET output

### 2. Database Setup
Create database on Supabase or Railway and get these credentials:
- DB_HOST
- DB_PORT
- DB_USER
- DB_PASSWORD
- DB_NAME

### 3. Vercel Dashboard Setup

#### Backend Project Environment Variables:
1. Go to: https://vercel.com/dashboard
2. Select your backend project
3. Go to: Settings → Environment Variables
4. Add all BACKEND variables listed above

#### Frontend Project Environment Variables:
1. Go to: https://vercel.com/dashboard
2. Select your frontend project
3. Go to: Settings → Environment Variables
4. Add all FRONTEND variables listed above

### 4. Re-deploy
After setting environment variables, re-deploy both projects:
1. Backend: Click "Deployments" → Latest → "Redeploy"
2. Frontend: Click "Deployments" → Latest → "Redeploy"

---

## ENVIRONMENT VARIABLES EXPLANATION

### Backend

**NODE_ENV**
- Controls what features are enabled (debug info, error details)
- Must be "production" on Vercel

**Database Variables (DB_*)**
- Connection credentials for PostgreSQL
- Get these from your database provider (Supabase/Railway)

**JWT Variables**
- Used for authentication tokens
- MUST be different from each other
- MUST be 32+ characters long
- Keep them SECRET! Don't share!

**Admin Account**
- Initial login credentials for first admin user
- Change password after first login

**Client URL**
- Frontend URL for CORS configuration
- Allows requests from your frontend domain only

### Frontend

**VITE_API_URL**
- Backend API URL that frontend uses for all requests
- Must match your backend Vercel deployment URL
- Ends with /api

---

## VERCEL ENV VARIABLE NAMING

In Vercel, you can use special references:
- `@db_host` - Database host (if you create a secret)
- `@jwt_secret` - JWT secret (if you create a secret)

OR just type the values directly.

### Creating Secrets in Vercel:
1. Settings → Environment Variables
2. Click "Add Variable"
3. Name: `db_host`, Value: `your-host`
4. Use it in other variables as: `@db_host`

---

## TESTING ENV VARIABLES

After deployment, verify variables are set:

### Test Backend
```bash
# Check if backend is running
curl https://your-backend.vercel.app/health

# Should return:
# {
#   "status": "OK",
#   "timestamp": "2024-04-02T...",
#   "database": "Connected",
#   "uptime": 123.45
# }
```

### Test Frontend
```bash
# Check if frontend loads
curl https://your-frontend.vercel.app

# Should return HTML page
```

### Test API Connection
1. Open frontend in browser
2. Wait for page to load
3. Open DevTools Console (F12)
4. Should NOT see CORS errors
5. Try to login (if database is connected)

---

## PRODUCTION SECURITY BEST PRACTICES

✅ DO:
- [ ] Use strong passwords (16+ characters)
- [ ] Generate secrets with cryptographic randomness
- [ ] Never commit secrets to GitHub
- [ ] Use Vercel Secrets for sensitive data
- [ ] Rotate secrets periodically
- [ ] Enable HTTPS (automatic on Vercel)
- [ ] Use strong JWT secrets (32+ chars)
- [ ] Limit database access by IP (Railway/Supabase)

❌ DON'T:
- [ ] Hardcode secrets in code
- [ ] Use weak passwords
- [ ] Share secrets via Slack/Email
- [ ] Use same secret for different purposes
- [ ] Store secrets in .env.local in production
- [ ] Use default/example passwords
- [ ] Share your Vercel dashboard access

---

## HELP & SUPPORT

- Variables not loading? → Redeploy project
- Still not working? → Check Vercel deployment logs
- Database error? → Verify credentials with your provider
- Need help? → See DEPLOYMENT_GUIDE.md

---

Generated: April 2, 2024
For use with Toko Pakaian API & Frontend
