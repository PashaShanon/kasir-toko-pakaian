# Toko Pakaian - POS & E-Commerce Platform

Aplikasi Point of Sale (POS) dan dashboard e-commerce untuk toko pakaian online.

## 🌟 Features

- ✅ **User Management** - Admin & Kasir roles
- ✅ **Product Management** - Upload foto, SKU, ukuran, warna
- ✅ **Categories** - Organize products by category
- ✅ **POS System** - Real-time transaction processing
- ✅ **Sales Report** - Analytics & sales insights
- ✅ **Authentication** - JWT-based auth dengan refresh tokens
- ✅ **Responsive UI** - Tailwind CSS styled interface

## 🏗️ Tech Stack

- **Frontend**: React 19 + Vite + Tailwind CSS
- **Backend**: Node.js + Express + PostgreSQL
- **Database**: PostgreSQL with advanced features
- **Deployment**: Vercel (Frontend & Backend)
- **UI Icons**: Lucide React

## 📦 Project Structure

```
.
├── frontend/                 # React Vite App
│   ├── src/
│   │   ├── pages/           # Page components
│   │   ├── components/      # Reusable components
│   │   ├── services/        # API services
│   │   └── App.jsx
│   ├── package.json
│   └── vercel.json
│
├── backend/
│   └── API-TokoPakaian/      # Express API
│       ├── routes/          # API routes
│       ├── middleware/       # Auth, admin middleware
│       ├── database/        # DB connection
│       ├── config/          # Swagger docs
│       ├── server.js
│       ├── package.json
│       └── vercel.json
│
├── DEPLOYMENT_GUIDE.md       # 📝 Step-by-step deployment
├── PRE_DEPLOYMENT_CHECKLIST.md
└── generate-secrets.sh       # Generate JWT secrets
```

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Setup Database
```bash
# Create PostgreSQL database
createdb toko_online

# Run schema
psql toko_online < backend/schema.sql
psql toko_online < backend/add-product-columns.sql
```

### 3. Setup Environment Variables

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:8000/api
```

**Backend** (`backend/API-TokoPakaian/.env`):
```env
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=toko_online
JWT_SECRET=your-secret-key-min-32-chars
REFRESH_TOKEN_SECRET=your-refresh-secret-min-32-chars
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

### 4. Start Development Servers
```bash
npm run dev:all
```

- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/api-docs

### 5. Login
- Email: `admin@example.com`
- Password: `admin123`

---

## ☁️ Deployment to Vercel

**Project is fully configured and ready for deployment!**

### 📚 Available Deployment Resources:

Choose your preferred guide:

| Resource | Time | Level | Use Case |
|----------|------|-------|----------|
| 🚀 [QUICK_START_DEPLOY.md](./QUICK_START_DEPLOY.md) | 5 min | Beginner | Just want it live ASAP |
| 📖 [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) | 15 min | Intermediate | Detailed step-by-step |
| ✅ [PRE_DEPLOYMENT_CHECKLIST.md](./PRE_DEPLOYMENT_CHECKLIST.md) | 10 min | Intermediate | Verify everything first |
| 🔑 [ENV_VARIABLES_TEMPLATE.md](./ENV_VARIABLES_TEMPLATE.md) | 5 min | All | Environment setup |
| 📦 [DEPLOYMENT_SUMMARY.md](./DEPLOYMENT_SUMMARY.md) | 3 min | All | What's prepared overview |

### ⚡ Ultra-Quick Deploy (Choose One)

**Option 1: Web Dashboard (Easiest)**
1. Read [QUICK_START_DEPLOY.md](./QUICK_START_DEPLOY.md) - Takes 5 minutes
2. Follow visual guide in Vercel dashboard

**Option 2: CLI (Fastest)**
```bash
# Linux/Mac
bash deploy-to-vercel.sh

# Windows PowerShell
powershell -ExecutionPolicy Bypass -File deploy-to-vercel.ps1
```

**Option 3: Manual Steps**
1. Generate secrets: `bash generate-secrets.sh`
2. Setup database (Supabase/Railway)
3. Push to GitHub
4. Deploy on Vercel dashboard

### ⚠️ Important Before Deploying:

1. ✅ Check [PRE_DEPLOYMENT_CHECKLIST.md](./PRE_DEPLOYMENT_CHECKLIST.md)
2. ✅ Setup PostgreSQL database
3. ✅ Generate JWT secrets: `bash generate-secrets.sh`
4. ✅ Push code to GitHub

**Fully Deployed URLs will be:**
```
Frontend: https://your-frontend.vercel.app
Backend:  https://your-backend.vercel.app
Docs:     https://your-backend.vercel.app/api-docs
```

---

## 📚 API Documentation

Backend includes Swagger API documentation:
- **Local**: http://localhost:8000/api-docs
- **Production**: https://your-backend.vercel.app/api-docs

### Available Endpoints

#### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `POST /api/auth/refresh` - Refresh token

#### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

#### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (Admin)
- `PUT /api/categories/:id` - Update category (Admin)
- `DELETE /api/categories/:id` - Delete category (Admin)

#### Transactions (POS)
- `GET /api/transactions` - Get transactions
- `POST /api/transactions` - Create transaction

#### Users
- `GET /api/users` - Get all users (Admin)
- `POST /api/users/register` - Register user
- `PUT /api/users/update/:id` - Update user info

---

## 🛠️ Available Scripts

### Root level
```bash
npm run dev         # Start frontend dev server
npm run server      # Start backend server
npm run dev:all     # Start both frontend and backend
npm run build       # Build frontend
npm run install:all # Install all dependencies
```

### Frontend
```bash
npm run dev         # Vite dev server
npm run build       # Production build
npm run preview     # Preview production build
```

### Backend
```bash
npm start          # Start server
npm run dev:watch  # Start with nodemon (if available)
```

---

## 📝 Database Schema

Key tables:
- **users** - Store user accounts
- **categories** - Product categories
- **products** - Product data with image, SKU, size, color
- **transactions** - POS transactions
- **transaction_items** - Items in each transaction

---

## 🔐 Security Features

- JWT authentication with refresh tokens
- Admin role-based access control
- Password hashing with bcrypt
- HTTPS-ready for production
- CORS configuration
- Environment variable protection

---

## 🐛 Troubleshooting

### Port already in use
```bash
# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9

# Kill process on port 8000 (backend)
lsof -ti:8000 | xargs kill -9
```

### Database connection error
- Verify PostgreSQL is running
- Check credentials in `.env`
- Ensure database exists

### Frontend can't connect to API
- Check `VITE_API_URL` environment variable
- Verify backend is running
- Check CORS settings in backend

See **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** for more troubleshooting.

---

## 📞 Support & Documentation

- 📖 [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- ✅ [Pre-Deployment Checklist](./PRE_DEPLOYMENT_CHECKLIST.md)
- 🔧 [Vite Documentation](https://vitejs.dev)
- 🚀 [Express Documentation](https://expressjs.com)
- ☁️ [Vercel Documentation](https://vercel.com/docs)

---

## 📄 License

Private Project - All rights reserved

---

## 👨‍💻 Development

### Local Development Workflow

1. Create feature branch
   ```bash
   git checkout -b feature/your-feature
   ```

2. Make changes and test locally
   ```bash
   npm run dev:all
   ```

3. Commit changes
   ```bash
   git add .
   git commit -m "Your commit message"
   ```

4. Push and create pull request
   ```bash
   git push origin feature/your-feature
   ```

---

**Happy coding! 🚀**"# kasir-toko-pakaian" 
