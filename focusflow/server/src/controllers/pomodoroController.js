import SessionModel from '../models/Session.js';

export const startSession = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { type = 'work' } = req.body;

    const session = await SessionModel.create({
      user_id: userId,
      start_time: new Date().toISOString(),
      type,
      completed: false,
    });

    res.status(201).json({
      success: true,
      message: 'Pomodoro session started',
      session,
    });
  } catch (error) {
    next(error);
  }
};

export const endSession = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;
    const { focusMinutes } = req.body;

    const session = await SessionModel.findById(id, userId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const endTime = new Date();
    const calculatedFocusMinutes = focusMinutes || Math.round((endTime - new Date(session.start_time)) / 60000);

    const updatedSession = await SessionModel.update(id, userId, {
      end_time: endTime.toISOString(),
      focus_minutes: calculatedFocusMinutes,
      completed: true,
    });

    res.status(200).json({
      success: true,
      message: 'Session ended successfully',
      session: updatedSession,
    });
  } catch (error) {
    next(error);
  }
};

export const getSessionStats = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { days = 7 } = req.query;

    const sessions = await SessionModel.findByUser(userId, parseInt(days));

    const completedSessions = sessions.filter((s) => s.completed);
    const workSessions = completedSessions.filter((s) => s.type === 'work');
    const breakSessions = completedSessions.filter((s) => s.type === 'break');

    const totalFocusMinutes = workSessions.reduce((sum, s) => sum + (s.focus_minutes || 0), 0);

    res.status(200).json({
      success: true,
      totalFocusMinutes,
      totalFocusHours: (totalFocusMinutes / 60).toFixed(2),
      workSessions: workSessions.length,
      breakSessions: breakSessions.length,
      sessionsPerDay: (completedSessions.length / days).toFixed(2),
      sessions: completedSessions,
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentSession = async (req, res, next) => {
  try {
    const { userId } = req.user;

    const sessions = await SessionModel.findByUser(userId, 1);
    const activeSession = sessions.find((s) => !s.completed) || null;

    res.status(200).json({
      success: true,
      session: activeSession,
    });
  } catch (error) {
    next(error);
  }
};

export default { startSession, endSession, getSessionStats, getCurrentSession };
