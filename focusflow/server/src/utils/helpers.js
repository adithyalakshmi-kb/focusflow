import crypto from 'crypto';

export const generateRandomToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

export const getToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

export const getLastNDays = (n) => {
  const dates = [];
  for (let i = 0; i < n; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    dates.push(date);
  }
  return dates;
};

export const calculateStreak = (completedDates) => {
  if (!completedDates || completedDates.length === 0) return 0;

  const sortedDates = completedDates
    .map((d) => new Date(d))
    .sort((a, b) => b - a);

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (let i = 0; i < sortedDates.length; i++) {
    const date = sortedDates[i];
    date.setHours(0, 0, 0, 0);

    const expectedDate = new Date(currentDate);
    expectedDate.setDate(expectedDate.getDate() - i);

    if (date.getTime() === expectedDate.getTime()) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};

export const calculateProductivityScore = (goals, habits, sessions) => {
  let score = 0;

  // Goals contribution (30%)
  if (goals.length > 0) {
    const completedGoals = goals.filter((g) => g.completed).length;
    score += (completedGoals / goals.length) * 30;
  }

  // Habits contribution (40%)
  if (habits.length > 0) {
    const totalStreak = habits.reduce((acc, h) => acc + h.streak, 0);
    const avgStreak = totalStreak / habits.length;
    score += Math.min((avgStreak / 30) * 40, 40); // Cap at 40
  }

  // Focus time contribution (30%)
  const totalFocusMinutes = sessions.reduce((acc, s) => acc + s.focusMinutes, 0);
  const focusHours = totalFocusMinutes / 60;
  score += Math.min((focusHours / 10) * 30, 30); // Cap at 30 (equivalent to 10 hours)

  return Math.round(score);
};

export default {
  generateRandomToken,
  getToday,
  getLastNDays,
  calculateStreak,
  calculateProductivityScore,
};
