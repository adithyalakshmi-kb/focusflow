import GoalModel from '../models/Goal.js';
import HabitModel from '../models/Habit.js';
import MoodModel from '../models/Mood.js';
import SessionModel from '../models/Session.js';
import { calculateStreak, calculateProductivityScore } from '../utils/helpers.js';

export const getDashboard = async (req, res, next) => {
  try {
    const { userId } = req.user;

    // Fetch all data
    const goals = await GoalModel.findAll(userId);
    const habits = await HabitModel.findAll(userId);
    const moods = await MoodModel.findByUser(userId, 7);
    const sessions = await SessionModel.findByUser(userId, 7);

    // Calculate metrics
    const completedGoals = goals.filter((g) => g.completed).length;
    const totalGoals = goals.length;

    // Get streaks for habits
    const habitStreak = await Promise.all(
      habits.map(async (h) => {
        const completions = await HabitModel.getCompletions(h.id);
        const completionDates = completions.map((c) => new Date(c.completion_date));
        const streak = calculateStreak(completionDates);

        return {
          name: h.name,
          streak: streak || 0,
          longestStreak: h.longest_streak || 0,
        };
      })
    );

    // Calculate mood average
    const avgRating = moods.length > 0 ? (moods.reduce((sum, m) => sum + m.rating, 0) / moods.length).toFixed(2) : 0;

    // Calculate total focus minutes
    const completedSessions = sessions.filter((s) => s.completed);
    const totalFocusMinutes = completedSessions
      .filter((s) => s.type === 'work')
      .reduce((sum, s) => sum + (s.focus_minutes || 0), 0);

    // Calculate productivity score (simple version)
    const productivityScore = Math.min(100, Math.round(
      ((completedGoals / Math.max(totalGoals, 1)) * 30 +
        (habitStreak.reduce((sum, h) => sum + h.streak, 0) / Math.max(habitStreak.length, 1)) * 30 +
        (totalFocusMinutes / 480) * 40)
    ));

    // Weekly progress (last 7 days)
    const weeklyProgress = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const dayGoals = goals.filter((g) => g.completed_at && g.completed_at.startsWith(dateStr)).length;

      weeklyProgress.push({
        date: date.toDateString(),
        completedGoals: dayGoals,
      });
    }

    res.status(200).json({
      success: true,
      dashboard: {
        goals: {
          completed: completedGoals,
          total: totalGoals,
          percentage: totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0,
        },
        habits: {
          total: habits.length,
          streaks: habitStreak,
        },
        mood: {
          average: parseFloat(avgRating),
          count: moods.length,
        },
        focus: {
          totalMinutes: totalFocusMinutes,
          totalHours: (totalFocusMinutes / 60).toFixed(2),
          sessionsCount: completedSessions.length,
        },
        productivityScore,
        weeklyProgress,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getQuote = async (req, res, next) => {
  try {
    // Try to fetch motivational quote from external API
    try {
      const response = await fetch(process.env.QUOTE_API_URL + '?limit=1&query=motivation');
      const data = await response.json();
      const quote = data.results?.[0];

      if (quote) {
        return res.status(200).json({
          success: true,
          quote: {
            text: quote.content || 'You are capable of amazing things!',
            author: quote.author || 'FocusFlow',
          },
        });
      }
    } catch (apiError) {
      console.error('Quote API error:', apiError);
    }

    // Fallback quote
    res.status(200).json({
      success: true,
      quote: {
        text: 'The only way to do great work is to love what you do.',
        author: 'Steve Jobs',
      },
    });
  } catch (error) {
    next(error);
  }
};

export default { getDashboard, getQuote };
