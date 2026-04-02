# 📦 Panduan Deployment ke Vercel

Project ini terdiri dari 2 bagian yang harus di-deploy terpisah:
- **Frontend**: React + Vite (Static Site)
- **Backend**: Node.js Express API

## 🚀 Prerequisites

1. **Vercel Account** - Buat akun di [vercel.com](https://vercel.com)
2. **GitHub Account** - Push code ke GitHub repository
3. **PostgreSQL Database** - Siapkan database (bisa gunakan Supabase atau Railway)
4. **Install Vercel CLI** (opsional):
   ```bash
   npm install -g vercel
   ```

---

## 📋 Langkah 1: Setup Database (PostgreSQL)

Pilih salah satu:

### Option A: Supabase (Recommended)
1. Buka [supabase.com](https://supabase.com)
2. Login/Daftar
3. Buat project baru
4. Di "SQL Editor", jalankan script dari `backend/schema.sql` dan `backend/add-product-columns.sql`
5. Copy connection credentials (host, port, user, password, database)

### Option B: Railway
1. Buka [railway.app](https://railway.app)
2. Buat project baru PostgreSQL
3. Copy connection credentials
4. Jalankan SQL scripts

---

## 🔧 Langkah 2: Push ke GitHub

```bash
# Initialize git jika belum
git init

# Add files
git add .

# Commit
git commit -m "Initial commit - ready for deployment"

# Tambahkan remote
git remote add origin https://github.com/USERNAME/REPO-NAME.git

# Push
git push -u origin main
```

---

## 🌐 Langkah 3: Deploy Backend ke Vercel

### 3.1 Via Web Dashboard:

1. Buka [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Select GitHub repository Anda
4. Configure project:
   - **Framework Preset**: Node.js
   - **Root Directory**: `backend/API-TokoPakaian` ✅
   - **Build Command**: `npm install`
   - **Output Directory**: (leave empty)
   - **Start Command**: `npm start`

5. Click **"Environment Variables"** dan tambahkan:

```
NODE_ENV                 = production
DB_HOST                  = [supabase/railway host]
DB_PORT                  = [supabase/railway port]
DB_USER                  = [supabase/railway user]
DB_PASSWORD              = [supabase/railway password]
DB_NAME                  = [supabase/railway database]
JWT_SECRET               = [Generate random secret - minimal 32 chars]
REFRESH_TOKEN_SECRET     = [Generate random secret - minimal 32 chars]
ADMIN_EMAIL              = admin@example.com
ADMIN_PASSWORD           = [Strong password]
```

6. Click **"Deploy"**
7. Tunggu hingga deployment selesai
8. Copy URL backend: `https://your-backend.vercel.app`

### 3.2 Via CLI (Alternative):

```bash
cd backend/API-TokoPakaian
npm install -g vercel
vercel --prod
# Follow prompts for configuration
```

---

## 🎨 Langkah 4: Deploy Frontend ke Vercel

### 4.1 Via Web Dashboard:

1. Buka [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Select GitHub repository yang sama
4. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend` ✅
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

5. Click **"Environment Variables"** dan tambahkan:

```
VITE_API_URL = https://your-backend.vercel.app/api
```
*(Ganti dengan URL backend yang sudah di-deploy di step 3)*

6. Click **"Deploy"**
7. Tunggu hingga deployment selesai

### 4.2 Via CLI (Alternative):

```bash
cd frontend
npm run build
vercel --prod
# Follow prompts for configuration
```

---

## 🗄️ Langkah 5: Setup Database (First Time Only)

Setelah backend dan frontend di-deploy, jalankan initialization:

1. Buka URL frontend Anda
2. Login dengan default admin:
   - Email: `admin@example.com`
   - Password: `[ADMIN_PASSWORD dari env]`
3. Database akan ter-initialize otomatis saat first login

---

## ✅ Testing Deployment

1. **Frontend**: https://your-frontend.vercel.app
2. **Backend**: https://your-backend.vercel.app/api/products (harus auth)
3. **Admin Interface**: Login dan test create, edit, delete produk

---

## 🐛 Troubleshooting

### Frontend Error: `Cannot connect to API`
- Pastikan `VITE_API_URL` sudah set dengan benar di environment variables
- Pastikan backend URL bisa diakses

### Backend Error: `Database connection failed`
- Verify database credentials di environment variables
- Pastikan IP Vercel sudah diallow di database firewall
- Untuk Supabase: https://supabase.com/docs/guides/platform/network-restrictions

### Build Error: `Module not found`
- Pastikan semua dependencies sudah di-install
- Check `package.json` dan `package-lock.json`

---

## 🔄 Continuous Deployment

Setelah setup awal, setiap `git push` ke branch main akan otomatis:
1. Rebuild frontend/backend
2. Deploy ke Vercel
3. Check environment variables dan secrets

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
```

### Frontend (.env atau Vercel)
```
VITE_API_URL=https://your-backend.vercel.app/api
```

---

## 🎯 Selesai! 🎉

Aplikasi Anda sudah live di Vercel!

**Frontend**: https://your-frontend.vercel.app
**Backend API**: https://your-backend.vercel.app/api

Support docs:
- [Vercel Docs](https://vercel.com/docs)
- [Vite Deployment](https://vitejs.dev/guide/static-deploy.html)
- [Node.js on Vercel](https://vercel.com/docs/nodejs)
