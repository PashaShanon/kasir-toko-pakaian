## ✅ Pre-Deployment Checklist

Pastikan semua ini sudah selesai sebelum deploy ke Vercel:

### 📦 Setup Local
- [ ] Semua dependencies sudah ter-install: `npm run install:all`
- [ ] `npm run dev:all` berjalan tanpa error
- [ ] Database schema sudah updated dengan `add-product-columns.sql`
- [ ] Bisa login dengan admin account di local

### 🔧 Code & Config
- [ ] Semua file `.env` sudah di-setup untuk local development
- [ ] `.gitignore` includes: `node_modules/`, `.env`, `.env.local`
- [ ] Tidak ada hardcoded API URLs (gunakan env variables)
- [ ] Frontend API calls menggunakan `VITE_API_URL`
- [ ] Backend menggunakan environment variables untuk database

### 📂 Repository
- [ ] Code sudah di-push ke GitHub repository
- [ ] Branch main/master sudah updated
- [ ] Tidak ada uncommitted changes

### 🏢 Database Setup
- [ ] PostgreSQL database sudah siap (Supabase atau Railway)
- [ ] Database credentials tersedia:
  - [ ] Host
  - [ ] Port
  - [ ] User
  - [ ] Password
  - [ ] Database name
- [ ] SQL scripts sudah dijalankan:
  - [ ] `schema.sql`
  - [ ] `add-product-columns.sql`

### 🔑 Secrets & Keys
- [ ] JWT_SECRET sudah ter-generate (random 32+ chars)
  - Run: `bash generate-secrets.sh`
- [ ] REFRESH_TOKEN_SECRET sudah ter-generate (random 32+ chars)
- [ ] Admin email dan password sudah ditentukan

### ☁️ Vercel Setup
- [ ] Vercel account sudah dibuat
- [ ] GitHub repository sudah terconnect ke Vercel
- [ ] Siap untuk add new projects
- [ ] (Optional) Vercel CLI installed: `npm install -g vercel`

### 📝 Deployment Methods

Choose one of these methods:

#### **Method 1: Web Dashboard (Recommended for beginners)**
See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md#-langkah-3-deploy-backend-ke-vercel)

#### **Method 2: Vercel CLI (For experienced users)**

**For Linux/Mac:**
```bash
bash deploy-to-vercel.sh
```

**For Windows:**
```powershell
powershell -ExecutionPolicy Bypass -File deploy-to-vercel.ps1
```

---

## 🚀 Follow Steps
Setelah semua checklist di atas completed:

1. **Deploy Backend**
   - [ ] Create new project di Vercel
   - [ ] Set root directory ke `backend/API-TokoPakaian`
   - [ ] Set environment variables
   - [ ] Deploy ✅

2. **Deploy Frontend**
   - [ ] Create new project di Vercel
   - [ ] Set root directory ke `frontend`
   - [ ] Set `VITE_API_URL` ke backend URL dari step 1
   - [ ] Deploy ✅

3. **Test**
   - [ ] Frontend URL accessible
   - [ ] Backend API URL accessible
   - [ ] Login berhasil
   - [ ] Bisa create/edit/delete produk
   - [ ] Database operations berhasil

---

## 📝 Environment Variables Summary

### Backend (.env atau Vercel)
```
NODE_ENV=production
DB_HOST=your-database-host
DB_PORT=5432
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=your-db-name
JWT_SECRET=your-secret-key-min-32-chars
REFRESH_TOKEN_SECRET=your-refresh-secret-min-32-chars
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=strong-password
CLIENT_URL=https://your-frontend.vercel.app
```

### Frontend (.env atau Vercel)
```
VITE_API_URL=https://your-backend.vercel.app/api
```

---

## 🎯 Quick Commands

```bash
# Generate secrets
bash generate-secrets.sh

# Deploy via CLI (Linux/Mac)
bash deploy-to-vercel.sh

# Deploy via CLI (Windows PowerShell)
powershell -ExecutionPolicy Bypass -File deploy-to-vercel.ps1

# Local testing
npm run install:all
npm run dev:all

# Frontend build only
cd frontend
npm run build

# Backend test only
cd backend/API-TokoPakaian
npm start
```

---

## 📞 Support

Jika ada issues:
1. Check error logs di Vercel dashboard
2. Verify environment variables
3. Check database connection
4. Review [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
