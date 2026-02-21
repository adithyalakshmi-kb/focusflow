import { useState, useEffect } from 'react';
import { habitsAPI } from '@/api';
import { Plus, Trash2, Flame, TrendingUp, Undo2, MessageSquare } from 'lucide-react';

const CATEGORIES = ['health', 'productivity', 'learning', 'exercise', 'mindfulness', 'social', 'other'];
const CATEGORY_COLORS = {
  health: '#ef4444',
  productivity: '#3b82f6',
  learning: '#8b5cf6',
  exercise: '#10b981',
  mindfulness: '#f59e0b',
  social: '#ec4899',
  other: '#6b7280',
};

export default function Habits() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showNotes, setShowNotes] = useState({});
  const [notesInput, setNotesInput] = useState({});
  const [amountInput, setAmountInput] = useState({});
  const [selectedAnalytics, setSelectedAnalytics] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [milestone, setMilestone] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'health',
    frequency: 'daily',
    goal: '',
    goalUnit: '',
  });

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const response = await habitsAPI.getHabits();
      setHabits(response.data.habits);
    } catch (error) {
      console.error('Failed to fetch habits', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        frequency: formData.frequency,
      };
      if (formData.goal) payload.goal = Number(formData.goal);
      if (formData.goalUnit) payload.goalUnit = formData.goalUnit;

      await habitsAPI.createHabit(payload);
      setFormData({
        name: '',
        description: '',
        category: 'health',
        frequency: 'daily',
        goal: '',
        goalUnit: '',
      });
      setShowForm(false);
      fetchHabits();
    } catch (error) {
      console.error('Failed to create habit', error);
    }
  };

  const markComplete = async (id) => {
    try {
      const notes = notesInput[id] || '';
      const payload = {};
      if (notes) payload.notes = notes;
      if (amountInput[id]) payload.amount = Number(amountInput[id]);

      const response = await habitsAPI.markComplete(id, payload);

      if (response.data?.milestone) {
        setMilestone(response.data.milestone);
        setTimeout(() => setMilestone(null), 4000);
      }

      setShowNotes({ ...showNotes, [id]: false });
      setNotesInput({ ...notesInput, [id]: '' });
      setAmountInput({ ...amountInput, [id]: '' });
      fetchHabits();
    } catch (error) {
      console.error('Failed to mark habit complete', error);
    }
  };

  const undoComplete = async (id) => {
    try {
      await habitsAPI.undoComplete(id);
      fetchHabits();
    } catch (error) {
      console.error('Failed to undo habit completion', error);
    }
  };

  const deleteHabit = async (id) => {
    try {
      await habitsAPI.deleteHabit(id);
      fetchHabits();
    } catch (error) {
      console.error('Failed to delete habit', error);
    }
  };

  const viewAnalytics = async (id) => {
    try {
      const response = await habitsAPI.getAnalytics(id);
      setSelectedAnalytics(id);
      setAnalytics(response.data);
    } catch (error) {
      console.error('Failed to fetch analytics', error);
    }
  };

  const isCompletedToday = (habit) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return habit.completedDates?.some((entry) => {
      const completedDate = new Date(entry.date || entry);
      completedDate.setHours(0, 0, 0, 0);
      return completedDate.getTime() === today.getTime();
    });
  };

  const getTodayCompletion = (habit) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return habit.completedDates?.find((entry) => {
      const completedDate = new Date(entry.date || entry);
      completedDate.setHours(0, 0, 0, 0);
      return completedDate.getTime() === today.getTime();
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Habits</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          <Plus size={20} />
          New Habit
        </button>
      </div>

      {milestone && (
        <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 text-center">
          <p className="font-bold text-lg">🎉 {milestone}!</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">Keep up the amazing work!</p>
        </div>
      )}

      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Habit name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
            />
            <textarea
              placeholder="Description (optional)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
            />
            <div className="grid grid-cols-2 gap-4">
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
              <select
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Goal amount (optional)"
                value={formData.goal}
                onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              />
              <input
                type="text"
                placeholder="Goal unit (e.g., min, km)"
                value={formData.goalUnit}
                onChange={(e) => setFormData({ ...formData, goalUnit: e.target.value })}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
              >
                Create Habit
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {selectedAnalytics && analytics && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full max-h-96 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Analytics</h2>
            <div className="space-y-3">
              <p>
                <span className="text-gray-600 dark:text-gray-400">Total Completions:</span>
                <span className="font-bold ml-2">{analytics.totalCompletions}</span>
              </p>
              <p>
                <span className="text-gray-600 dark:text-gray-400">Completion Rate:</span>
                <span className="font-bold ml-2">{(analytics.completionRate * 100).toFixed(1)}%</span>
              </p>
              <p>
                <span className="text-gray-600 dark:text-gray-400">Current Streak:</span>
                <span className="font-bold ml-2">{analytics.currentStreak}</span>
              </p>
              <p>
                <span className="text-gray-600 dark:text-gray-400">Best Streak:</span>
                <span className="font-bold ml-2">{analytics.bestStreak}</span>
              </p>
              {analytics.bestDay && (
                <p>
                  <span className="text-gray-600 dark:text-gray-400">Best Day:</span>
                  <span className="font-bold ml-2">{analytics.bestDay}</span>
                </p>
              )}
            </div>
            <button
              onClick={() => {
                setSelectedAnalytics(null);
                setAnalytics(null);
              }}
              className="mt-4 w-full bg-gray-400 hover:bg-gray-500 text-white py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">Loading habits...</div>
      ) : habits.length === 0 ? (
        <div className="text-center py-12 text-gray-600 dark:text-gray-400">
          No habits yet. Create your first habit!
        </div>
      ) : (
        <div className="grid gap-4">
          {habits.map((habit) => {
            const completed = isCompletedToday(habit);
            const todayEntry = getTodayCompletion(habit);
            const categoryColor = CATEGORY_COLORS[habit.category] || '#3b82f6';

            return (
              <div
                key={habit._id}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow"
                style={{ borderLeft: `4px solid ${categoryColor}` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{habit.name}</h3>
                      <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: `${categoryColor}20`, color: categoryColor }}>
                        {habit.category}
                      </span>
                    </div>
                    {habit.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{habit.description}</p>
                    )}
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-1">
                        <Flame className="text-orange-500" size={18} />
                        <span className="font-bold">{habit.streak}</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">day streak</span>
                      </div>
                      {habit.totalCompletions !== undefined && (
                        <div className="flex items-center gap-1">
                          <TrendingUp className="text-blue-500" size={18} />
                          <span className="font-bold">{habit.totalCompletions}</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">total</span>
                        </div>
                      )}
                    </div>
                    {habit.goal && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        Goal: {habit.goal} {habit.goalUnit || 'units'}
                      </p>
                    )}
                  </div>
                </div>

                {showNotes[habit._id] && !completed && (
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4 space-y-2">
                    {habit.goalUnit && (
                      <input
                        type="number"
                        placeholder={`Amount (${habit.goalUnit})`}
                        value={amountInput[habit._id] || ''}
                        onChange={(e) => setAmountInput({ ...amountInput, [habit._id]: e.target.value })}
                        className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-600 text-sm"
                      />
                    )}
                    <textarea
                      placeholder="Add notes (optional)"
                      value={notesInput[habit._id] || ''}
                      onChange={(e) => setNotesInput({ ...notesInput, [habit._id]: e.target.value })}
                      className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-600 text-sm"
                      rows="2"
                    />
                    <button
                      onClick={() => markComplete(habit._id)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded text-sm font-medium"
                    >
                      Confirm
                    </button>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {completed ? (
                    <>
                      <button
                        onClick={() => undoComplete(habit._id)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-800 text-sm"
                      >
                        <Undo2 size={16} />
                        Undo
                      </button>
                      {todayEntry?.notes && (
                        <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                          <MessageSquare size={14} />
                          {todayEntry.notes.substring(0, 30)}...
                        </div>
                      )}
                    </>
                  ) : (
                    <button
                      onClick={() => setShowNotes({ ...showNotes, [habit._id]: !showNotes[habit._id] })}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm"
                    >
                      <MessageSquare size={16} />
                      Mark Done
                    </button>
                  )}
                  <button
                    onClick={() => viewAnalytics(habit._id)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-sm"
                  >
                    <TrendingUp size={16} />
                    Analytics
                  </button>
                  <button
                    onClick={() => deleteHabit(habit._id)}
                    className="ml-auto text-red-600 hover:text-red-700 text-sm px-3 py-2"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
