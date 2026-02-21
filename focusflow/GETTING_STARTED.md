# 🚀 FocusFlow - Complete Setup Guide

Welcome to FocusFlow! This guide will help you set up the entire application from scratch.

---

## 📋 Prerequisites

Before starting, make sure you have:
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** (optional, for version control)
- **Browser** (Chrome, Firefox, Safari, Edge)
- **Supabase Account** (free) - [Create here](https://supabase.com)

Verify installation:
```bash
node --version  # Should be v16+
npm --version   # Should be v7+
```

---

## 🗂️ Project Structure

```
focusflow/
├── server/                  # Node.js + Express backend
│   ├── src/
│   │   ├── controllers/    # API logic
│   │   ├── models/         # Supabase data helpers
│   │   ├── routes/         # API endpoints
│   │   ├── middleware/     # Auth, validation, error handling
│   │   ├── utils/          # Helper functions
│   │   ├── db/
│   │   │   └── supabase.js # Supabase client
│   │   └── server.js       # Express app entry
│   ├── package.json
│   ├── .env               # Environment variables (create this)
│   └── .env.example       # Template
│
├── client/                  # React + Vite frontend
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # React components
│   │   ├── contexts/      # Context providers
│   │   ├── hooks/         # Custom hooks
│   │   ├── api/           # API client
│   │   ├── styles/        # Global CSS
│   │   └── App.jsx        # Root component
│   ├── package.json
│   ├── vite.config.js
│   └── .env.local         # Environment variables (create this)
│
├── database/
│   ├── schema.sql         # Complete database schema
│   └── VERIFICATION.md    # Verification queries
│
├── DATABASE_SETUP.md      # Detailed database setup guide
├── SUPABASE_SETUP.md      # Supabase credentials guide
├── STARTUP.md             # Quick start commands
└── MIGRATION_NOTES.md     # MongoDB → Supabase details
```

---

## Step 1️⃣ Supabase Database Setup

### 1.1 Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Click **Sign Up** (use GitHub for faster signup)
3. Verify your email

### 1.2 Create a New Project
1. Click **New Project**
2. Fill in details:
   - **Project Name**: `focusflow`
   - **Database Password**: Use strong password (save it!)
   - **Region**: Choose nearest to you
3. Click **Create new project**
4. Wait 2-3 minutes for initialization

### 1.3 Get Your API Keys
1. Go to **Settings** → **API** (left sidebar, scroll down)
2. Copy these values:
   ```
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=eyJh...
   SUPABASE_SERVICE_ROLE_KEY=eyJh...
   ```
3. Save them somewhere safe!

### 1.4 Create Database Tables
1. Go to **SQL Editor** (left sidebar)
2. Click **New Query**
3. Open `focusflow/database/schema.sql`
4. Copy entire content
5. Paste in SQL Editor
6. Click **Run** button
7. Wait for success message ✅

**Verify**: Go to **Database** → **Tables** in left sidebar. You should see 7 tables!

---

## Step 2️⃣ Backend Setup

### 2.1 Install Dependencies
```bash
cd focusflow/server
npm install
```

### 2.2 Create Environment File
Create `focusflow/server/.env`:
```ini
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Server
PORT=5000
NODE_ENV=development

# JWT Tokens
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRY=7d
REFRESH_TOKEN_SECRET=your_super_secret_refresh_token
REFRESH_TOKEN_EXPIRY=30d

# Email (optional, for password reset)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### 2.3 Start Backend Server
```bash
npm run dev
```

**Expected output:**
```
✅ Connected to Supabase
╔════════════════════════════════════╗
║  FocusFlow Backend Server Running  ║
║  Port: 5000                        ║
║  Environment: development          ║
╚════════════════════════════════════╝
```

### 2.4 Test API
Open browser → `http://localhost:5000/health`

Should see:
```json
{ "status": "Server is running" }
```

---

## Step 3️⃣ Frontend Setup

### 3.1 Install Dependencies
```bash
cd focusflow/client
npm install
```

### 3.2 Create Environment File
Create `focusflow/client/.env.local`:
```
VITE_API_BASE_URL=http://localhost:5000
```

### 3.3 Start Frontend Server
```bash
npm run dev
```

**Expected output:**
```
VITE v5.x.x  build 0.00s
➜  Local:   http://localhost:5173/
```

---

## Step 4️⃣ Access the Application

1. Open browser
2. Go to **`http://localhost:5173`**
3. You should see FocusFlow login page!

---

## 📝 First Time Usage

### Create an Account
1. Click **Register** on login page
2. Fill in:
   - Email: your_email@example.com
   - Password: strong password (6+ chars)
   - Display Name: Your Name
3. Click **Register**
4. You'll be logged in automatically

### Try Features
- **Dashboard**: See your stats (empty at first)
- **Goals**: Create a new goal
- **Habits**: Add a habit and mark it complete
- **Timer**: Start a Pomodoro session
- **Mood**: Log your mood
- **Profile**: Change dark mode, logout

---

## 🧪 Verify Everything Works

### Backend Verification
```bash
# In focusflow/server terminal
npm run dev

# Should connect to Supabase
# Check: http://localhost:5000/api
```

### Frontend Verification
```bash
# In focusflow/client terminal
npm run dev

# Should show Vite dev server
# Check: http://localhost:5173
```

### Database Verification
1. Go to Supabase Dashboard
2. Click **SQL Editor**
3. Paste verification queries from `database/VERIFICATION.md`
4. Run and check results

---

## 🛑 Common Issues & Solutions

### Issue: "Cannot find package '@supabase/supabase-js'"
```bash
cd focusflow/server
npm install
```

### Issue: "Supabase connection failed"
1. Check `.env` file exists in `focusflow/server/`
2. Verify `SUPABASE_URL` and `SUPABASE_ANON_KEY` are correct
3. Restart server: `npm run dev`

### Issue: "CORS error when accessing API"
Usually means frontend and backend URLs don't match:
- Server: `http://localhost:5000`
- Frontend: `http://localhost:5173`
- Check `VITE_API_BASE_URL` in `client/.env.local`

### Issue: "Cannot login - authentication failed"
1. Go to Supabase Dashboard
2. Click **Authentication** (left sidebar)
3. Enable **Email / Password** provider
4. Try registering again

### Issue: "Port 5000 already in use"
```bash
# Change port in server/.env
PORT=5001

# Or find what's using port 5000:
# Windows: netstat -ano | findstr :5000
# Mac/Linux: lsof -i :5000
```

### Issue: "Port 5173 already in use"
```bash
# Vite will automatically use next available port
# Just check console output for the actual URL
```

---

## 📚 Available Commands

### Server
```bash
cd focusflow/server

npm run dev     # Start with hot reload (nodemon)
npm start       # Start production server
npm test        # Run tests (if configured)
```

### Client
```bash
cd focusflow/client

npm run dev     # Start dev server (Vite)
npm run build   # Build for production
npm run preview # Preview production build
npm run lint    # Check code quality
```

### From Root
```bash
npm run setup          # Install all dependencies
npm start             # Start client dev server
npm run server:dev    # Start server dev
```

---

## 🔐 Security

### Development
⚠️ These are for development ONLY!
- JWT secrets are basic examples
- SUPABASE_ANON_KEY is public (that's intentional)
- SUPABASE_SERVICE_ROLE_KEY should NEVER be shared

### Production (When Deploying)
1. Change JWT secrets to long random strings
2. Use environment variables from hosting platform
3. Enable Row Level Security (RLS) on Supabase
4. Use strong database passwords
5. Set HTTPS only
6. Never commit `.env` files to git

---

## 📖 API Documentation

Base URL: `http://localhost:5000/api`

### Authentication
```
POST   /auth/register          - Create new account
POST   /auth/login             - Login with email/password
POST   /auth/logout            - Logout
POST   /auth/refresh-token     - Get new access token
```

### Goals
```
GET    /goals                  - Get all user goals
POST   /goals                  - Create new goal
PATCH  /goals/:id              - Update goal
DELETE /goals/:id              - Delete goal
```

### Habits
```
GET    /habits                 - Get all habits
POST   /habits                 - Create new habit
PATCH  /habits/:id/complete    - Mark habit complete
PATCH  /habits/:id/undo        - Undo completion
GET    /habits/:id/analytics   - Get habit stats
DELETE /habits/:id             - Delete habit
```

### Mood
```
POST   /mood                   - Log mood
GET    /mood                   - Get mood history
GET    /mood/today             - Get today's mood
```

### Pomodoro
```
POST   /pomodoro/start         - Start session
PATCH  /pomodoro/:id/end       - End session
GET    /pomodoro/current       - Get current session
GET    /pomodoro/stats         - Get pomodoro stats
```

### Dashboard
```
GET    /dashboard              - Get all dashboard data
GET    /dashboard/quote        - Get motivational quote
```

---

## 🎯 Next Steps

1. ✅ Database created
2. ✅ Backend running
3. ✅ Frontend running
4. ⏳ Try all features
5. ⏳ Customize theme/colors
6. ⏳ Deploy to production

---

## 📞 Need Help?

### Check These First
- [FocusFlow Docs](./README.md)
- [Database Guide](./DATABASE_SETUP.md)
- [Supabase Docs](https://supabase.com/docs)
- [React Docs](https://react.dev)
- [Express Docs](https://expressjs.com)

### Debug Tips
1. Check browser console (F12) for errors
2. Check server terminal for errors
3. Check Supabase logs (Dashboard → Logs)
4. Use network tab to see API requests
5. Check `.env` files are created and correct

---

## 🎉 You're All Set!

Your FocusFlow productivity app is ready to use!

**Happy tracking!** 📊✨

---

**Last Updated**: February 21, 2026  
**Version**: 1.0.0 (Supabase Edition)
