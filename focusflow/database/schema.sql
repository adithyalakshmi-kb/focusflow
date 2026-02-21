-- FocusFlow Database Schema for Supabase
-- Run this entire script in Supabase SQL Editor

-- ============================================================================
-- USERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  display_name VARCHAR(255),
  dark_mode BOOLEAN DEFAULT false,
  email_verified BOOLEAN DEFAULT false,
  email_verification_token VARCHAR(255),
  email_verification_expires TIMESTAMP,
  password_reset_token VARCHAR(255),
  password_reset_expires TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- GOALS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  due_date DATE,
  completed BOOLEAN DEFAULT false,
  priority VARCHAR(20) DEFAULT 'medium',
  category VARCHAR(100),
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_goals_user ON goals(user_id);
CREATE INDEX idx_goals_user_completed ON goals(user_id, completed);
CREATE INDEX idx_goals_user_created ON goals(user_id, created_at DESC);
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- HABITS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) DEFAULT 'other',
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

CREATE INDEX idx_habits_user ON habits(user_id);
CREATE INDEX idx_habits_user_category ON habits(user_id, category);
CREATE INDEX idx_habits_user_active ON habits(user_id, is_active);
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- HABIT COMPLETIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS habit_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  completion_date DATE NOT NULL,
  notes TEXT,
  amount NUMERIC,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_completions_habit ON habit_completions(habit_id);
CREATE INDEX idx_completions_habit_date ON habit_completions(habit_id, completion_date);
CREATE INDEX idx_completions_user_date ON habit_completions(user_id, completion_date);
ALTER TABLE habit_completions ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- MOODS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS moods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  emoji VARCHAR(10),
  rating SMALLINT CHECK (rating >= 1 AND rating <= 5),
  note TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_moods_user ON moods(user_id);
CREATE INDEX idx_moods_user_date ON moods(user_id, created_at DESC);
ALTER TABLE moods ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- SESSIONS TABLE (Pomodoro)
-- ============================================================================
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP,
  focus_minutes INTEGER,
  type VARCHAR(20) DEFAULT 'work',
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_sessions_user ON sessions(user_id);
CREATE INDEX idx_sessions_user_date ON sessions(user_id, created_at DESC);
CREATE INDEX idx_sessions_user_type ON sessions(user_id, type);
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- HABIT TEMPLATES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS habit_templates (
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
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_templates_category ON habit_templates(category);
CREATE INDEX idx_templates_popularity ON habit_templates(popularity DESC);
ALTER TABLE habit_templates ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Users can only see/update their own data
CREATE POLICY "Users can view their own user data"
  ON users FOR SELECT
  USING (auth.uid()::text = id::text OR id::text = NULL);

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth.uid()::text = id::text);

-- Goals policies
CREATE POLICY "Users can view their own goals"
  ON goals FOR SELECT
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create goals"
  ON goals FOR INSERT
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own goals"
  ON goals FOR UPDATE
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own goals"
  ON goals FOR DELETE
  USING (auth.uid()::text = user_id::text);

-- Habits policies
CREATE POLICY "Users can view their own habits"
  ON habits FOR SELECT
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create habits"
  ON habits FOR INSERT
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own habits"
  ON habits FOR UPDATE
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own habits"
  ON habits FOR DELETE
  USING (auth.uid()::text = user_id::text);

-- Habit Completions policies
CREATE POLICY "Users can view their habit completions"
  ON habit_completions FOR SELECT
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can log habit completions"
  ON habit_completions FOR INSERT
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their habit completions"
  ON habit_completions FOR DELETE
  USING (auth.uid()::text = user_id::text);

-- Moods policies
CREATE POLICY "Users can view their own moods"
  ON moods FOR SELECT
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can log moods"
  ON moods FOR INSERT
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their moods"
  ON moods FOR DELETE
  USING (auth.uid()::text = user_id::text);

-- Sessions policies
CREATE POLICY "Users can view their sessions"
  ON sessions FOR SELECT
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create sessions"
  ON sessions FOR INSERT
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their sessions"
  ON sessions FOR UPDATE
  USING (auth.uid()::text = user_id::text);

-- Habit Templates are public for reading
CREATE POLICY "Everyone can view habit templates"
  ON habit_templates FOR SELECT
  USING (true);

-- ============================================================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================================================

-- Insert some default habit templates
INSERT INTO habit_templates (name, description, category, goal, goal_unit, frequency, color, popularity)
VALUES
  ('Morning Exercise', 'Start your day with physical activity', 'exercise', 30, 'minutes', 'daily', '#10b981', 45),
  ('Read', 'Expand your knowledge through reading', 'learning', 30, 'minutes', 'daily', '#8b5cf6', 38),
  ('Meditation', 'Practice mindfulness and reduce stress', 'mindfulness', 10, 'minutes', 'daily', '#f59e0b', 42),
  ('Drink Water', 'Stay hydrated throughout the day', 'health', 8, 'glasses', 'daily', '#3b82f6', 35),
  ('Write Journal', 'Reflect on your day and thoughts', 'mindfulness', 10, 'minutes', 'daily', '#ec4899', 28),
  ('Code Practice', 'Improve programming skills', 'learning', 60, 'minutes', 'daily', '#06b6d4', 32),
  ('Sleep Early', 'Get proper rest', 'health', 8, 'hours', 'daily', '#6366f1', 40),
  ('Social Connection', 'Reach out to friends or family', 'social', 1, 'interaction', 'daily', '#ec4899', 25)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- DATABASE NOTES
-- ============================================================================
-- 1. Make sure Supabase authentication is enabled
-- 2. Update RLS policies if using custom auth
-- 3. For development, you can disable RLS by running:
--    ALTER TABLE users DISABLE ROW LEVEL SECURITY;
--    (Run for each table)
-- 4. All timestamps use UTC by default
-- 5. IDs use UUID v4 for better security and distribution
