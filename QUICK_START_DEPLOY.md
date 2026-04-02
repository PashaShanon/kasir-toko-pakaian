# 🚀 QUICK START - Deploy ke Vercel

Ini adalah quick guide untuk deploy project ke Vercel dalam 5 langkah.

## 5️⃣ Langkah Cepat

### 1. 🗄️ Setup Database
Pilih salah satu dan buat PostgreSQL database:
- **Supabase**: https://supabase.com → Create project → Copy credentials
- **Railway**: https://railway.app → New project → PostgreSQL

### 2. 🔐 Generate Secrets
```bash
bash generate-secrets.sh
```
Copy output JWT_SECRET dan REFRESH_TOKEN_SECRET untuk nanti.

### 3. 📤 Push ke GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push
```

### 4. ☁️ Deploy Backend
- Buka https://vercel.com/dashboard
- Click **"Add New"** → **"Project"**
- Select your GitHub repo
- **Root Directory**: `backend/API-TokoPakaian`
- **Build Command**: `npm install`
- Click **"Environment Variables"** dan add:
  ```
  NODE_ENV = production
  DB_HOST = [database host]
  DB_USER = [database user]
  DB_PASSWORD = [database password]
  DB_PORT = 5432
  DB_NAME = [database name]
  JWT_SECRET = [from step 2]
  REFRESH_TOKEN_SECRET = [from step 2]
  ADMIN_EMAIL = admin@example.com
  ADMIN_PASSWORD = admin123
  ```
- Click **"Deploy"** ✅
- Copy URL backend (e.g., `https://api-xxx.vercel.app`)

### 5. 🎨 Deploy Frontend
- Click **"Add New"** → **"Project"** again
- Select same GitHub repo
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- Click **"Environment Variables"** dan add:
  ```
  VITE_API_URL = https://api-xxx.vercel.app/api
  ```
  (Replace dengan URL backend dari step 4)
- Click **"Deploy"** ✅

---

## ✅ Done! 

- **Frontend**: https://your-frontend.vercel.app
- **Backend**: https://your-backend.vercel.app
- **Login**: admin@example.com / admin123

---

## 🆘 Masalah?

- ❌ **Frontend blank**: Check browser console (F12)
- ❌ **Cannot login**: Check environment variables di Vercel dashboard
- ❌ **Database error**: Verify database credentials & firewall settings
- ❌ **500 error**: Check backend logs di Vercel dashboard

### Debug
```bash
# Test locally
npm run dev:all

# Check database connection
curl https://your-backend.vercel.app/health

# View logs
# Go to Vercel Dashboard → Select project → Deployments → View logs
```

---

## 📚 Docs

- **Full Guide**: See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- **Checklist**: See [PRE_DEPLOYMENT_CHECKLIST.md](./PRE_DEPLOYMENT_CHECKLIST.md)
- **Troubleshooting**: See [DEPLOYMENT_GUIDE.md#-troubleshooting](./DEPLOYMENT_GUIDE.md#-troubleshooting)

---

Happy deploying! 🎉
