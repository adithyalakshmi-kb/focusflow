# Complete Database Setup Guide

## Overview
This guide walks you through creating the entire FocusFlow database in Supabase using the provided SQL schema.

## What Will Be Created

### Tables (7 total)
1. **users** - User accounts and authentication
2. **goals** - User goals and objectives
3. **habits** - Daily/weekly habit tracking
4. **habit_completions** - Individual habit completion records
5. **moods** - Daily mood tracking
6. **sessions** - Pomodoro timer sessions
7. **habit_templates** - Pre-made habit templates for users to choose from

### Features
✅ Automatic timestamps (created_at, updated_at)
✅ Row-level security (RLS) - users can only see their own data
✅ Foreign key constraints - data integrity
✅ Performance indexes on frequently queried columns
✅ Sample habit templates for users to choose from

---

## Step-by-Step Setup

### 1. Create Supabase Account
```
1. Go to https://supabase.com
2. Click "Sign Up"
3. Use GitHub or email
4. Verify you email
```

### 2. Create a New Project
```
1. Click "New Project"
2. Project Name: focusflow
3. Database Password: Use strong password (save it!)
4. Region: Choose closest to your location
5. Click "Create new project"
6. Wait 2-3 minutes for initialization
```

### 3. Access SQL Editor
```
1. In Supabase dashboard, click "SQL Editor" (left sidebar)
2. You should see a blank SQL editor
```

### 4. Run the Schema
```
Option A - Copy & Paste:
1. Open: focusflow/database/schema.sql
2. Copy ALL content
3. Paste into Supabase SQL Editor
4. Click "Run" button
5. Wait for success message

Option B - Direct File:
1. In SQL Editor, click "New Query"
2. Copy schema.sql content
3. Execute
```

### 5. Verify Tables Created
```
1. Go to "Database" section (left sidebar)
2. Click "Tables"
3. You should see:
   - users
   - goals
   - habits
   - habit_completions
   - moods
   - sessions
   - habit_templates
```

### 6. Get Your Credentials
```
1. Go to "Settings" → "API" (bottom of left sidebar)
2. Save these values to focusflow/server/.env:

SUPABASE_URL=https://[project-id].supabase.co
SUPABASE_ANON_KEY=[copy from "anon public" field]
SUPABASE_SERVICE_ROLE_KEY=[copy from "service_role secret" field]
```

### 7. Test Database Connection
```
1. Open terminal in focusflow/server
2. Run: npm install (if not already done)
3. Run: npm run dev
4. Should see: ✅ Connected to Supabase
```

---

## Database Schema Details

### users
```javascript
{
  id: UUID (primary key)
  email: string (unique)
  password: string (hashed)
  display_name: string
  dark_mode: boolean
  email_verified: boolean
  created_at: timestamp
  updated_at: timestamp
}
```

### goals
```javascript
{
  id: UUID
  user_id: UUID (foreign key)
  title: string
  description: text
  due_date: date
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  category: string
  created_at: timestamp
  updated_at: timestamp
}
```

### habits
```javascript
{
  id: UUID
  user_id: UUID
  name: string
  description: text
  category: 'health' | 'productivity' | 'learning' | 'exercise' | 'mindfulness' | 'social' | 'other'
  frequency: 'daily' | 'weekly'
  goal: number
  goal_unit: string (e.g., "minutes", "km", "pages")
  streak: integer
  longest_streak: integer
  total_completions: integer
  is_active: boolean
  color: hex string
  created_at: timestamp
  updated_at: timestamp
}
```

### habit_completions
```javascript
{
  id: UUID
  habit_id: UUID
  user_id: UUID
  completion_date: date
  notes: text
  amount: number
  created_at: timestamp
}
```

### moods
```javascript
{
  id: UUID
  user_id: UUID
  emoji: string
  rating: number (1-5)
  note: text
  created_at: timestamp
}
```

### sessions
```javascript
{
  id: UUID
  user_id: UUID
  start_time: timestamp
  end_time: timestamp
  focus_minutes: integer
  type: 'work' | 'break'
  completed: boolean
  created_at: timestamp
}
```

### habit_templates
```javascript
{
  id: UUID
  name: string
  description: text
  category: string
  goal: number
  goal_unit: string
  frequency: 'daily' | 'weekly'
  color: hex string
  popularity: integer (for sorting)
  created_at: timestamp
}
```

---

## Security Notes

### Row-Level Security (RLS)
By default, RLS is **enabled**. This means:
- ✅ Users can only view their own data
- ✅ Users cannot access other users' goals, habits, etc.
- ✅ Secure by default

If you need to disable RLS for development:
```sql
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE goals DISABLE ROW LEVEL SECURITY;
-- ... etc for each table
```

### Important
⚠️ **Never commit these to git:**
- `.env` file with Supabase keys
- `SUPABASE_SERVICE_ROLE_KEY` (server-only)

---

## Troubleshooting

### "Table already exists"
The schema includes `IF NOT EXISTS` clauses, so running it multiple times is safe.

### "Foreign key constraint failed"
Make sure tables are created in correct order. The schema file handles this automatically.

### "Authentication error"
If seeing auth errors:
1. Go to Supabase Dashboard
2. Click "Authentication" (left sidebar)
3. Enable "Email / Password" provider
4. Save

### "RLS blocking queries"
If you get permission errors:
1. Check that current user matches user_id in policies
2. Or temporarily disable RLS (see Security Notes above)
3. Make sure using correct JWT token in headers

### "Cannot find module '@supabase/supabase-js'"
```bash
cd focusflow/server
npm install
```

---

## Next Steps After Setup

1. ✅ Database schema created
2. ✅ Tables with sample habit templates
3. ⏳ Update server controllers to use Supabase models
4. ⏳ Test API with Postman or Insomnia
5. ⏳ Frontend should work without changes

## API Examples

### Create a goal (POST /api/goals)
```javascript
{
  "title": "Complete FocusFlow",
  "description": "Finish the productivity app",
  "dueDate": "2026-03-01",
  "priority": "high",
  "category": "development"
}
```

### Mark habit complete (PATCH /api/habits/:id/complete)
```javascript
{
  "notes": "Did 30 min of exercise",
  "amount": 30
}
```

### Log mood (POST /api/mood)
```javascript
{
  "emoji": "😊",
  "rating": 4,
  "note": "Had a productive day"
}
```

---

## Support

For issues:
1. Check Supabase status: https://status.supabase.com
2. Supabase docs: https://supabase.com/docs
3. SQL query reference: https://www.postgresql.org/docs/
4. Common RLS issues: https://supabase.com/docs/guides/auth/row-level-security
