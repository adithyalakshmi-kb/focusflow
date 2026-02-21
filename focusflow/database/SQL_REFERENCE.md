# SQL Query Reference for FocusFlow

Quick reference for common SQL queries you might need.

---

## User Queries

### Get user by email
```sql
SELECT * FROM users WHERE email = 'user@example.com';
```

### Get user by ID
```sql
SELECT * FROM users WHERE id = 'user-uuid-here';
```

### Count total users
```sql
SELECT COUNT(*) as total_users FROM users;
```

### Update user profile
```sql
UPDATE users 
SET display_name = 'New Name', dark_mode = true, updated_at = NOW()
WHERE id = 'user-uuid-here';
```

### Delete user (cascades to all related data)
```sql
DELETE FROM users WHERE id = 'user-uuid-here';
```

---

## Goal Queries

### Get all goals for a user
```sql
SELECT * FROM goals 
WHERE user_id = 'user-uuid-here'
ORDER BY created_at DESC;
```

### Get uncompleted goals
```sql
SELECT * FROM goals 
WHERE user_id = 'user-uuid-here' AND completed = false
ORDER BY due_date ASC;
```

### Get goals by priority
```sql
SELECT * FROM goals 
WHERE user_id = 'user-uuid-here' AND priority = 'high'
ORDER BY due_date ASC;
```

### Mark goal as completed
```sql
UPDATE goals 
SET completed = true, completed_at = NOW(), updated_at = NOW()
WHERE id = 'goal-uuid-here' AND user_id = 'user-uuid-here';
```

### Count goals by status
```sql
SELECT completed, COUNT(*) as count
FROM goals
WHERE user_id = 'user-uuid-here'
GROUP BY completed;
```

---

## Habit Queries

### Get all active habits for a user
```sql
SELECT * FROM habits 
WHERE user_id = 'user-uuid-here' AND is_active = true
ORDER BY category, name;
```

### Get habits by category
```sql
SELECT * FROM habits 
WHERE user_id = 'user-uuid-here' AND category = 'health'
ORDER BY name;
```

### Get habit statistics
```sql
SELECT 
  name,
  category,
  streak,
  longest_streak,
  total_completions,
  ROUND((total_completions::numeric / NULLIF(EXTRACT(DAY FROM (NOW() - created_at)), 0)) * 100, 2) as daily_avg
FROM habits
WHERE user_id = 'user-uuid-here'
ORDER BY streak DESC;
```

### Get habits with completion counts
```sql
SELECT 
  h.id,
  h.name,
  h.category,
  COUNT(hc.id) as completions_this_month
FROM habits h
LEFT JOIN habit_completions hc ON h.id = hc.habit_id 
  AND hc.completion_date >= DATE_TRUNC('month', NOW())
WHERE h.user_id = 'user-uuid-here'
GROUP BY h.id, h.name, h.category
ORDER BY completions_this_month DESC;
```

### Update habit streak
```sql
UPDATE habits 
SET streak = 5, updated_at = NOW()
WHERE id = 'habit-uuid-here' AND user_id = 'user-uuid-here';
```

---

## Habit Completion Queries

### Get completions for a habit
```sql
SELECT * FROM habit_completions 
WHERE habit_id = 'habit-uuid-here'
ORDER BY completion_date DESC;
```

### Check if habit completed today
```sql
SELECT * FROM habit_completions 
WHERE habit_id = 'habit-uuid-here' 
  AND completion_date = CURRENT_DATE;
```

### Get completions this week
```sql
SELECT * FROM habit_completions 
WHERE habit_id = 'habit-uuid-here'
  AND completion_date >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY completion_date DESC;
```

### Get completions with notes
```sql
SELECT completion_date, notes, amount
FROM habit_completions 
WHERE habit_id = 'habit-uuid-here' AND notes IS NOT NULL
ORDER BY completion_date DESC;
```

### Count completions by day of week
```sql
SELECT 
  TO_CHAR(completion_date, 'Day') as day_of_week,
  COUNT(*) as completions
FROM habit_completions 
WHERE habit_id = 'habit-uuid-here'
GROUP BY day_of_week, EXTRACT(DOW FROM completion_date)
ORDER BY EXTRACT(DOW FROM completion_date);
```

### Add completion record
```sql
INSERT INTO habit_completions (habit_id, user_id, completion_date, notes, amount)
VALUES ('habit-uuid', 'user-uuid', CURRENT_DATE, 'Notes here', 1);
```

---

## Mood Queries

### Get mood history for user
```sql
SELECT * FROM moods 
WHERE user_id = 'user-uuid-here'
ORDER BY created_at DESC;
```

### Get mood this week
```sql
SELECT * FROM moods 
WHERE user_id = 'user-uuid-here'
  AND created_at >= NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;
```

### Get average mood rating
```sql
SELECT 
  ROUND(AVG(rating), 2) as average_rating,
  COUNT(*) as total_moods,
  MIN(rating) as lowest,
  MAX(rating) as highest
FROM moods
WHERE user_id = 'user-uuid-here'
  AND created_at >= NOW() - INTERVAL '30 days';
```

### Get mood by day of week
```sql
SELECT 
  TO_CHAR(created_at, 'Day') as day,
  ROUND(AVG(rating), 2) as average_rating,
  COUNT(*) as count
FROM moods
WHERE user_id = 'user-uuid-here'
GROUP BY day, EXTRACT(DOW FROM created_at)
ORDER BY EXTRACT(DOW FROM created_at);
```

### Get moods with notes only
```sql
SELECT created_at, emoji, rating, note
FROM moods
WHERE user_id = 'user-uuid-here' AND note IS NOT NULL
ORDER BY created_at DESC;
```

---

## Session (Pomodoro) Queries

### Get all sessions for user
```sql
SELECT * FROM sessions 
WHERE user_id = 'user-uuid-here'
ORDER BY start_time DESC;
```

### Get sessions this week
```sql
SELECT * FROM sessions 
WHERE user_id = 'user-uuid-here'
  AND start_time >= NOW() - INTERVAL '7 days'
  AND type = 'work'
ORDER BY start_time DESC;
```

### Calculate total focus time
```sql
SELECT 
  COALESCE(SUM(focus_minutes), 0) as total_minutes,
  COUNT(*) as total_sessions,
  ROUND(COALESCE(AVG(focus_minutes), 0), 2) as average_minutes
FROM sessions
WHERE user_id = 'user-uuid-here' 
  AND type = 'work'
  AND created_at >= DATE_TRUNC('month', NOW());
```

### Get sessions by day
```sql
SELECT 
  DATE(start_time) as date,
  COUNT(*) as sessions,
  COALESCE(SUM(focus_minutes), 0) as total_minutes
FROM sessions
WHERE user_id = 'user-uuid-here' AND type = 'work'
GROUP BY DATE(start_time)
ORDER BY date DESC;
```

### Complete a session
```sql
UPDATE sessions 
SET end_time = NOW(), focus_minutes = 25, completed = true
WHERE id = 'session-uuid-here' AND user_id = 'user-uuid-here';
```

---

## Dashboard Queries

### Get overview stats
```sql
SELECT
  (SELECT COUNT(*) FROM goals WHERE user_id = 'user-uuid-here' AND completed = false) as active_goals,
  (SELECT COUNT(*) FROM habits WHERE user_id = 'user-uuid-here' AND is_active = true) as active_habits,
  (SELECT ROUND(AVG(rating), 1) FROM moods WHERE user_id = 'user-uuid-here' AND created_at >= NOW() - INTERVAL '7 days') as week_mood,
  (SELECT COALESCE(SUM(focus_minutes), 0) FROM sessions WHERE user_id = 'user-uuid-here' AND type = 'work' AND created_at >= DATE_TRUNC('month', NOW())) as month_focus_minutes;
```

### Get productivity score
```sql
WITH stats AS (
  SELECT
    (SELECT COUNT(*) FROM goals WHERE user_id = 'user-uuid-here' AND completed = true)::numeric as completed_goals,
    (SELECT COUNT(*) FROM goals WHERE user_id = 'user-uuid-here')::numeric as total_goals,
    (SELECT COALESCE(AVG(total_completions), 0) FROM habits WHERE user_id = 'user-uuid-here') as avg_habit_completions,
    (SELECT COALESCE(SUM(focus_minutes), 0) FROM sessions WHERE user_id = 'user-uuid-here' AND created_at >= DATE_TRUNC('month', NOW())) as monthly_focus
)
SELECT
  ROUND(
    ((completed_goals / NULLIF(total_goals, 0)) * 40 +
     (LEAST(avg_habit_completions / 10, 1)) * 30 +
     (LEAST(monthly_focus / 600, 1)) * 30),
    1
  ) as productivity_score
FROM stats;
```

---

## Habit Templates Queries

### Get all templates
```sql
SELECT * FROM habit_templates 
ORDER BY popularity DESC;
```

### Get templates by category
```sql
SELECT * FROM habit_templates 
WHERE category = 'health'
ORDER BY popularity DESC;
```

### Get most popular templates
```sql
SELECT * FROM habit_templates 
ORDER BY popularity DESC
LIMIT 10;
```

### Update template popularity
```sql
UPDATE habit_templates 
SET popularity = popularity + 1
WHERE id = 'template-uuid-here';
```

---

## Advanced Queries

### User activity summary
```sql
SELECT
  u.email,
  u.display_name,
  COUNT(DISTINCT g.id) as total_goals,
  COUNT(DISTINCT h.id) as total_habits,
  COUNT(DISTINCT m.id) as total_moods,
  COUNT(DISTINCT s.id) as total_sessions,
  MAX(s.created_at) as last_session
FROM users u
LEFT JOIN goals g ON u.id = g.user_id
LEFT JOIN habits h ON u.id = h.user_id
LEFT JOIN moods m ON u.id = m.user_id
LEFT JOIN sessions s ON u.id = s.user_id AND s.type = 'work'
WHERE u.id = 'user-uuid-here'
GROUP BY u.id, u.email, u.display_name;
```

### Find inactive users
```sql
SELECT
  u.id,
  u.email,
  u.created_at,
  MAX(s.created_at) as last_activity
FROM users u
LEFT JOIN sessions s ON u.id = s.user_id
GROUP BY u.id, u.email, u.created_at
HAVING MAX(s.created_at) < NOW() - INTERVAL '30 days'
  OR MAX(s.created_at) IS NULL;
```

### Best performing habits
```sql
SELECT
  h.name,
  h.category,
  h.streak,
  h.longest_streak,
  COUNT(hc.id) as total_completions,
  ROUND(COUNT(hc.id)::numeric / NULLIF(EXTRACT(DAY FROM (NOW() - h.created_at)), 0) * 100, 2) as completion_percentage
FROM habits h
LEFT JOIN habit_completions hc ON h.id = hc.habit_id
WHERE h.user_id = 'user-uuid-here'
GROUP BY h.id, h.name, h.category, h.streak, h.longest_streak
ORDER BY completion_percentage DESC;
```

---

## Export/Backup Queries

### Export user data (CSV ready)
```sql
\COPY (
  SELECT 
    u.email,
    g.title as goal,
    h.name as habit,
    m.rating as mood,
    s.focus_minutes as pomodoro_minutes
  FROM users u
  LEFT JOIN goals g ON u.id = g.user_id
  LEFT JOIN habits h ON u.id = h.user_id
  LEFT JOIN moods m ON u.id = m.user_id
  LEFT JOIN sessions s ON u.id = s.user_id
  WHERE u.id = 'user-uuid-here'
) TO '/path/to/exported_data.csv' WITH CSV HEADER;
```

---

## Performance Tips

- Always include `WHERE user_id = ...` to leverage indexes
- Use `LIMIT` for large result sets
- Use `EXPLAIN ANALYZE` to check query performance
- Index frequently filtered columns (already done in schema)
- Use aggregation functions instead of fetching all rows

## More Help

- PostgreSQL Docs: https://postgresql.org/docs
- Supabase SQL Guide: https://supabase.com/docs/guides/database/sql
- SQL Tutorial: https://www.w3schools.com/sql/
