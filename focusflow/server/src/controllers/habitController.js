import HabitModel from '../models/Habit.js';
import HabitTemplateModel from '../models/HabitTemplate.js';
import { calculateStreak, getToday } from '../utils/helpers.js';

export const getHabits = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { category, isActive } = req.query;

    const habits = await HabitModel.findAll(userId, category, isActive !== undefined ? isActive === 'true' : undefined);

    // Fetch completions for each habit to calculate streak
    const habitsWithStreak = await Promise.all(
      habits.map(async (habit) => {
        const completions = await HabitModel.getCompletions(habit.id);
        const completionDates = completions.map((c) => new Date(c.completion_date));
        const streak = calculateStreak(completionDates);

        return {
          ...habit,
          streak,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: habits.length,
      habits: habitsWithStreak,
    });
  } catch (error) {
    next(error);
  }
};

export const createHabit = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { name, description, frequency, category, color, goal, goalUnit } = req.validatedBody;

    const habit = await HabitModel.create({
      user_id: userId,
      name,
      description,
      frequency,
      category,
      color: color || '#3b82f6',
      goal: goal || 1,
      goal_unit: goalUnit || 'times',
      is_active: true,
    });

    res.status(201).json({
      success: true,
      message: 'Habit created successfully',
      habit,
    });
  } catch (error) {
    next(error);
  }
};

export const markHabitComplete = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;
    const { notes = '', amount = 1 } = req.body;

    const habit = await HabitModel.findById(id, userId);
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    const today = getToday();
    const todayDateString = today.toISOString().split('T')[0];

    // Check if already completed today
    const completions = await HabitModel.getCompletions(id);
    const todayCompletion = completions.find((c) => c.completion_date === todayDateString);

    let alreadyCompleted = false;
    if (!todayCompletion) {
      // Add new completion
      await HabitModel.addCompletion(id, userId, {
        completion_date: todayDateString,
        notes,
        amount: parseFloat(amount),
      });
    } else {
      alreadyCompleted = true;
    }

    // Recalculate streak
    const updatedCompletions = await HabitModel.getCompletions(id);
    const completionDates = updatedCompletions.map((c) => new Date(c.completion_date));
    const streak = calculateStreak(completionDates);

    // Update habit with new stats
    const totalCompletions = updatedCompletions.length;
    const longestStreak = habit.longest_streak || 0;

    const updatedHabit = await HabitModel.update(id, userId, {
      streak,
      longest_streak: Math.max(longestStreak, streak),
      total_completions: totalCompletions,
    });

    // Check for milestones
    const milestones = [7, 30, 100, 365];
    const reachedMilestone = milestones.find((m) => streak === m);

    res.status(200).json({
      success: true,
      message: 'Habit marked complete',
      habit: updatedHabit,
      streak,
      milestone: reachedMilestone ? `🎉 ${reachedMilestone}-day streak!` : null,
      alreadyCompleted,
    });
  } catch (error) {
    next(error);
  }
};

export const undoHabitComplete = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;

    const habit = await HabitModel.findById(id, userId);
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    const today = getToday();
    const todayDateString = today.toISOString().split('T')[0];

    // Delete today's completion from habit_completions table
    const completions = await HabitModel.getCompletions(id);
    const todayCompletion = completions.find((c) => c.completion_date === todayDateString);

    if (!todayCompletion) {
      return res.status(400).json({ message: 'No completion to undo for today' });
    }

    // Recalculate stats
    const remainingCompletions = completions.filter((c) => c.completion_date !== todayDateString);
    const completionDates = remainingCompletions.map((c) => new Date(c.completion_date));
    const streak = calculateStreak(completionDates);

    await HabitModel.update(id, userId, {
      streak,
      total_completions: remainingCompletions.length,
    });

    res.status(200).json({
      success: true,
      message: 'Completion undone',
      streak,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteHabit = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;

    const habit = await HabitModel.findById(id, userId);
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    await HabitModel.delete(id, userId);

    res.status(200).json({
      success: true,
      message: 'Habit deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getHabitAnalytics = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;
    const { days = 30 } = req.query;

    const habit = await HabitModel.findById(id, userId);
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    const completions = await HabitModel.getCompletions(id);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const recentCompletions = completions.filter(
      (c) => new Date(c.completion_date) >= startDate
    );

    // Calculate completion rate
    const completionRate = Math.round((recentCompletions.length / days) * 100);

    // Find best and worst days of week
    const dayStats = {};
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    recentCompletions.forEach((c) => {
      const date = new Date(c.completion_date);
      const dayName = dayNames[date.getDay()];
      dayStats[dayName] = (dayStats[dayName] || 0) + 1;
    });

    const bestDay = Object.entries(dayStats).reduce(
      (best, [day, count]) => (count > (best?.count || 0) ? { day, count } : best),
      null
    );

    const worstDay = Object.entries(dayStats).reduce(
      (worst, [day, count]) => (count < (worst?.count || Infinity) ? { day, count } : worst),
      null
    );

    res.status(200).json({
      success: true,
      totalCompletions: habit.total_completions || 0,
      completionRate: completionRate / 100,
      currentStreak: habit.streak || 0,
      bestStreak: habit.longest_streak || 0,
      recentCompletions: recentCompletions.length,
      bestDay: bestDay?.day || 'N/A',
      worstDay: worstDay?.day || 'N/A',
      averagePerWeek: (recentCompletions.length / (days / 7)).toFixed(1),
      lastCompletion: completions[0]?.completion_date || null,
      completionsByDay: dayStats,
    });
  } catch (error) {
    next(error);
  }
};

export const getHabitStreak = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;

    const habit = await HabitModel.findById(id, userId);
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    const completions = await HabitModel.getCompletions(id);
    const completionDates = completions.map((c) => new Date(c.completion_date));
    const streak = calculateStreak(completionDates);

    res.status(200).json({
      success: true,
      streak: habit.streak || 0,
      longestStreak: habit.longest_streak || 0,
      completionDates: completions.map((c) => c.completion_date),
    });
  } catch (error) {
    next(error);
  }
};

export const getHabitTemplates = async (req, res, next) => {
  try {
    const { category } = req.query;

    const templates = category
      ? await HabitTemplateModel.findByCategory(category)
      : await HabitTemplateModel.findAll();

    res.status(200).json({
      success: true,
      templates,
    });
  } catch (error) {
    next(error);
  }
};

export const createHabitFromTemplate = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { templateId } = req.body;

    const template = await HabitTemplateModel.findById(templateId);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    const habit = await HabitModel.create({
      user_id: userId,
      name: template.name,
      description: template.description,
      category: template.category,
      frequency: template.frequency,
      goal: template.goal,
      goal_unit: template.goal_unit,
      color: template.color,
      is_active: true,
    });

    // Increment template popularity
    await HabitTemplateModel.incrementPopularity(templateId);

    res.status(201).json({
      success: true,
      message: 'Habit created from template',
      habit,
    });
  } catch (error) {
    next(error);
  }
};

export const updateHabit = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;
    const updateData = req.body;

    const habit = await HabitModel.findById(id, userId);
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    const updatedHabit = await HabitModel.update(id, userId, updateData);

    res.status(200).json({
      success: true,
      message: 'Habit updated successfully',
      habit: updatedHabit,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getHabits,
  createHabit,
  markHabitComplete,
  undoHabitComplete,
  deleteHabit,
  getHabitAnalytics,
  getHabitStreak,
  getHabitTemplates,
  createHabitFromTemplate,
  updateHabit,
};
