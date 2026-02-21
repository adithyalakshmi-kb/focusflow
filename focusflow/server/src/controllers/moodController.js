import MoodModel from '../models/Mood.js';

export const logMood = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { emoji, rating, note } = req.validatedBody;

    const mood = await MoodModel.create({
      user_id: userId,
      emoji,
      rating,
      note,
    });

    res.status(201).json({
      success: true,
      message: 'Mood logged successfully',
      mood,
    });
  } catch (error) {
    next(error);
  }
};

export const getMoodHistory = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { days = 7 } = req.query;

    const moods = await MoodModel.findByUser(userId, parseInt(days));

    // Calculate average mood rating
    const avgRating =
      moods.length > 0
        ? (moods.reduce((sum, m) => sum + m.rating, 0) / moods.length).toFixed(2)
        : 0;

    res.status(200).json({
      success: true,
      count: moods.length,
      averageRating: parseFloat(avgRating),
      moods,
    });
  } catch (error) {
    next(error);
  }
};

export const getTodayMood = async (req, res, next) => {
  try {
    const { userId } = req.user;

    const mood = await MoodModel.findTodayMood(userId);

    res.status(200).json({
      success: true,
      mood: mood || null,
    });
  } catch (error) {
    next(error);
  }
};

export default { logMood, getMoodHistory, getTodayMood };
