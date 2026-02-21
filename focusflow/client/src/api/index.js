import apiClient from './client';

export const authAPI = {
  register: (email, password, displayName) =>
    apiClient.post('/auth/register', { email, password, displayName }),
  login: (email, password) =>
    apiClient.post('/auth/login', { email, password }),
  verifyEmail: (token) =>
    apiClient.post('/auth/verify-email', { token }),
  forgotPassword: (email) =>
    apiClient.post('/auth/forgot-password', { email }),
  resetPassword: (token, newPassword) =>
    apiClient.post('/auth/reset-password', { token, newPassword }),
  logout: () =>
    apiClient.post('/auth/logout'),
};

export const goalsAPI = {
  getGoals: (completed) =>
    apiClient.get('/goals', { params: { completed } }),
  createGoal: (goal) =>
    apiClient.post('/goals', goal),
  updateGoal: (id, goal) =>
    apiClient.patch(`/goals/${id}`, goal),
  deleteGoal: (id) =>
    apiClient.delete(`/goals/${id}`),
};

export const habitsAPI = {
  getHabits: () =>
    apiClient.get('/habits'),
  createHabit: (habit) =>
    apiClient.post('/habits', habit),
  markComplete: (id, payload) =>
    apiClient.patch(`/habits/${id}/complete`, payload || {}),
  undoComplete: (id) =>
    apiClient.patch(`/habits/${id}/undo`),
  deleteHabit: (id) =>
    apiClient.delete(`/habits/${id}`),
  getStreak: (id) =>
    apiClient.get(`/habits/${id}/streak`),
  getAnalytics: (id) =>
    apiClient.get(`/habits/${id}/analytics`),
  getTemplates: () =>
    apiClient.get('/habits/templates/list'),
  createFromTemplate: (templateId) =>
    apiClient.post('/habits/templates/create', { templateId }),
  updateHabit: (id, updates) =>
    apiClient.patch(`/habits/${id}`, updates),
};

export const moodAPI = {
  logMood: (mood) =>
    apiClient.post('/mood', mood),
  getMoodHistory: (days) =>
    apiClient.get('/mood', { params: { days } }),
  getTodayMood: () =>
    apiClient.get('/mood/today'),
};

export const pomodoroAPI = {
  startSession: (type) =>
    apiClient.post('/pomodoro/start', { type }),
  endSession: (id, focusMinutes) =>
    apiClient.patch(`/pomodoro/${id}/end`, { focusMinutes }),
  getStats: (days) =>
    apiClient.get('/pomodoro/stats', { params: { days } }),
  getCurrentSession: () =>
    apiClient.get('/pomodoro/current'),
};

export const dashboardAPI = {
  getDashboard: () =>
    apiClient.get('/dashboard'),
  getQuote: () =>
    apiClient.get('/dashboard/quote'),
};
