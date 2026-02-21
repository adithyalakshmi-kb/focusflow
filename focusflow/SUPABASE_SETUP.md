# Supabase Setup Guide for FocusFlow

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Project Name**: focusflow
   - **Database Password**: Create strong password (save it!)
   - **Region**: Choose closest to you
5. Click "Create new project"
6. Wait for project to initialize (~2 minutes)

## Step 2: Get Your Credentials

1. Go to **Project Settings** → **API**
2. Copy:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** key → `SUPABASE_ANON_KEY`
   - **service_role secret** key → `SUPABASE_SERVICE_ROLE_KEY`

## Step 3: Create Database Tables

Go to **SQL Editor** and run each query:

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  display_name VARCHAR(255),
  dark_mode BOOLEAN DEFAULT false,
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
```

### Goals Table
```sql
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  due_date DATE,
  completed BOOLEAN DEFAULT false,
  priority VARCHAR(20) DEFAULT 'medium',
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_goals_user ON goals(user_id);
```

### Habits Table
```sql
CREATE TABLE habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  frequency VARCHAR(20) DEFAULT 'daily',
  goal NUMERIC,
  goal_unit VARCHAR(100),
  streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  total_completions INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  color VARCHAR(7) DEFAULT '#3b82f6',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_habits_user_category ON habits(user_id, category);
```

### Habit Completions Table
```sql
CREATE TABLE habit_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  completion_date DATE NOT NULL,
  notes TEXT,
  amount NUMERIC,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_completions_habit ON habit_completions(habit_id);
CREATE INDEX idx_completions_date ON habit_completions(completion_date);
```

### Moods Table
```sql
CREATE TABLE moods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  emoji VARCHAR(10),
  rating SMALLINT CHECK (rating >= 1 AND rating <= 5),
  note TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_moods_user_date ON moods(user_id, created_at);
```

### Sessions (Pomodoro) Table
```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP,
  focus_minutes INTEGER,
  type VARCHAR(20) DEFAULT 'work',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_sessions_user ON sessions(user_id);
```

### Habit Templates Table
```sql
CREATE TABLE habit_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  icon VARCHAR(50),
  goal NUMERIC,
  goal_unit VARCHAR(100),
  frequency VARCHAR(20) DEFAULT 'daily',
  color VARCHAR(7),
  popularity INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Step 4: Update Environment Variables

Update `focusflow/server/.env`:

```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRY=7d
REFRESH_TOKEN_SECRET=your_refresh_secret_here
REFRESH_TOKEN_EXPIRY=30d
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

## Step 5: Install Dependencies

```bash
cd focusflow/server
npm install
```

## Step 6: Start the Server

```bash
npm run dev
```

You should see: `✅ Connected to Supabase`

## Troubleshooting

### "Missing Supabase environment variables"
- Check `.env` file exists
- Verify `SUPABASE_URL` and `SUPABASE_ANON_KEY` are filled
- Restart server after updating `.env`

### "Cannot insert into table"
- Make sure all tables are created (run all SQL queries above)
- Check column names match (PostgreSQL uses snake_case)
- Verify keys in `.env` are correct

### Connection works but operations fail
- Go to Supabase Dashboard → **Authentication** → Enable email/password
- Check RLS (Row Level Security) policies if needed
- Verify user has correct permissions

## Security Notes

⚠️ **Never commit `.env` to git!** Add to `.gitignore`:
```
.env
.env.local
.env.*.local
```

For production:
- Use strong JWT_SECRET and REFRESH_TOKEN_SECRET
- Use SUPABASE_SERVICE_ROLE_KEY only on server-side
- Enable RLS policies on Supabase tables
- Use environment variables from hosting platform (Vercel, Railway, etc.)
