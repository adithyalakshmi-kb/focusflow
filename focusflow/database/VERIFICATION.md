# Unit Test: Database Schema Verification

Run this script in Supabase SQL Editor to verify all tables are set up correctly.

```sql
-- Verify all tables exist and have correct structure

-- 1. Check Users Table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name='users'
ORDER BY ordinal_position;

-- Expected columns:
-- id (UUID), email (varchar), password (varchar), display_name (varchar),
-- dark_mode (boolean), email_verified (boolean), created_at (timestamp), updated_at (timestamp)

-- 2. Check Goals Table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name='goals'
ORDER BY ordinal_position;

-- Expected columns:
-- id (UUID), user_id (UUID), title (varchar), description (text), due_date (date),
-- completed (boolean), priority (varchar), category (varchar), created_at (timestamp), updated_at (timestamp)

-- 3. Check Habits Table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name='habits'
ORDER BY ordinal_position;

-- Expected columns:
-- id (UUID), user_id (UUID), name (varchar), description (text), category (varchar),
-- frequency (varchar), goal (numeric), goal_unit (varchar), streak (integer),
-- longest_streak (integer), total_completions (integer), is_active (boolean),
-- color (varchar), created_at (timestamp), updated_at (timestamp)

-- 4. Check Habit Completions Table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name='habit_completions'
ORDER BY ordinal_position;

-- Expected columns:
-- id (UUID), habit_id (UUID), user_id (UUID), completion_date (date),
-- notes (text), amount (numeric), created_at (timestamp)

-- 5. Check Moods Table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name='moods'
ORDER BY ordinal_position;

-- Expected columns:
-- id (UUID), user_id (UUID), emoji (varchar), rating (smallint), note (text), created_at (timestamp)

-- 6. Check Sessions Table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name='sessions'
ORDER BY ordinal_position;

-- Expected columns:
-- id (UUID), user_id (UUID), start_time (timestamp), end_time (timestamp),
-- focus_minutes (integer), type (varchar), completed (boolean), created_at (timestamp)

-- 7. Check Habit Templates Table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name='habit_templates'
ORDER BY ordinal_position;

-- Expected columns:
-- id (UUID), name (varchar), description (text), category (varchar), icon (varchar),
-- goal (numeric), goal_unit (varchar), frequency (varchar), color (varchar),
-- popularity (integer), created_at (timestamp), updated_at (timestamp)

-- 8. Count total tables
SELECT COUNT(*) as table_count 
FROM information_schema.tables 
WHERE table_schema='public' 
AND table_type='BASE TABLE'
AND table_name NOT LIKE 'pg_%';

-- Expected: 7 tables

-- 9. Check indexes
SELECT tablename, indexname 
FROM pg_indexes 
WHERE schemaname='public' 
AND tablename IN ('users', 'goals', 'habits', 'habit_completions', 'moods', 'sessions', 'habit_templates')
ORDER BY tablename, indexname;

-- Expected: Multiple indexes for performance

-- 10. Check sample habit templates
SELECT COUNT(*) as template_count 
FROM habit_templates;

-- Expected: 8 templates

SELECT name, category, goal, goal_unit 
FROM habit_templates 
LIMIT 5;

-- 11. Verify Row Level Security
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname='public'
AND tablename IN ('users', 'goals', 'habits', 'habit_completions', 'moods', 'sessions', 'habit_templates');

-- Expected: rowsecurity = true for all tables

-- 12. Check foreign key constraints
SELECT
  constraint_name,
  table_name,
  column_name,
  foreign_table_name,
  foreign_column_name
FROM information_schema.key_column_usage
WHERE table_name IN ('goals', 'habits', 'habit_completions', 'moods', 'sessions')
AND foreign_table_name IS NOT NULL;

-- Expected: All child tables have references to users table
```

## Expected Results Checklist

- [ ] 7 tables created (users, goals, habits, habit_completions, moods, sessions, habit_templates)
- [ ] All columns present with correct data types
- [ ] All indexes created (for performance)
- [ ] Row Level Security enabled on all tables
- [ ] Foreign key constraints in place
- [ ] 8 habit templates inserted
- [ ] No errors when running verification script

## Quick Status Check

Run this single query to see overall status:

```sql
-- Quick Database Status
SELECT 
  'users' as table_name, COUNT(*) as row_count 
FROM users
UNION ALL
SELECT 'goals', COUNT(*) FROM goals
UNION ALL
SELECT 'habits', COUNT(*) FROM habits
UNION ALL
SELECT 'habit_completions', COUNT(*) FROM habit_completions
UNION ALL
SELECT 'moods', COUNT(*) FROM moods
UNION ALL
SELECT 'sessions', COUNT(*) FROM sessions
UNION ALL
SELECT 'habit_templates', COUNT(*) FROM habit_templates;

-- Expected (newly created): 0 rows in most tables, 8 in habit_templates
```

## If Something Fails

### Option 1: Reset and Rebuild
```sql
-- CAUTION: This deletes all data!
DROP TABLE IF EXISTS habit_completions CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS moods CASCADE;
DROP TABLE IF EXISTS habits CASCADE;
DROP TABLE IF EXISTS goals CASCADE;
DROP TABLE IF EXISTS habit_templates CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Then re-run schema.sql
```

### Option 2: Check specific table
```sql
-- See what's in a table
SELECT * FROM users LIMIT 10;
SELECT * FROM habit_templates;

-- Check table structure
\d users

-- Check constraints
SELECT constraint_name, constraint_type 
FROM information_schema.table_constraints 
WHERE table_name='goals';
```

## Database Performance Tips

1. **Use EXPLAIN ANALYZE** to check query performance:
```sql
EXPLAIN ANALYZE
SELECT h.name, COUNT(hc.id) as completions
FROM habits h
LEFT JOIN habit_completions hc ON h.id = hc.habit_id
WHERE h.user_id = 'user-uuid-here'
GROUP BY h.id;
```

2. **Monitor slow queries** in Supabase dashboard:
   - Settings → Database → Query Performance

3. **Use LIMIT in queries** to avoid fetching too much data

4. **Index frequently filtered columns** (already done in schema)
