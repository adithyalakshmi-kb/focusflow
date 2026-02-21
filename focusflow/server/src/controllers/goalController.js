import GoalModel from '../models/Goal.js';

export const getGoals = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { completed } = req.query;

    const goals = await GoalModel.findAll(userId, completed !== undefined ? completed === 'true' : undefined);
    
    res.status(200).json({
      success: true,
      count: goals.length,
      goals,
    });
  } catch (error) {
    next(error);
  }
};

export const createGoal = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { title, description, dueDate, priority, category } = req.validatedBody;

    const goal = await GoalModel.create({
      user_id: userId,
      title,
      description,
      due_date: dueDate,
      priority,
      category,
    });

    res.status(201).json({
      success: true,
      message: 'Goal created successfully',
      goal,
    });
  } catch (error) {
    next(error);
  }
};

export const updateGoal = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;
    const { completed, title, description, dueDate, priority, category } = req.body;

    // Check if goal exists and belongs to user
    const goal = await GoalModel.findById(id, userId);
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    // Prepare updates
    const updates = {};
    if (completed !== undefined) {
      updates.completed = completed;
      if (completed) {
        updates.completed_at = new Date().toISOString();
      }
    }
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (dueDate !== undefined) updates.due_date = dueDate;
    if (priority !== undefined) updates.priority = priority;
    if (category !== undefined) updates.category = category;

    const updatedGoal = await GoalModel.update(id, userId, updates);

    res.status(200).json({
      success: true,
      message: 'Goal updated successfully',
      goal: updatedGoal,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteGoal = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;

    // Check if goal exists
    const goal = await GoalModel.findById(id, userId);
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    await GoalModel.delete(id, userId);

    res.status(200).json({
      success: true,
      message: 'Goal deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export default { getGoals, createGoal, updateGoal, deleteGoal };
