import { useState, useEffect } from 'react';
import { goalsAPI } from '@/api';
import { Plus, Trash2, Check, Calendar } from 'lucide-react';

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    category: 'general',
  });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await goalsAPI.getGoals();
      setGoals(response.data.goals);
    } catch (error) {
      console.error('Failed to fetch goals', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await goalsAPI.createGoal(formData);
      setFormData({ title: '', description: '', dueDate: '', priority: 'medium', category: 'general' });
      setShowForm(false);
      fetchGoals();
    } catch (error) {
      console.error('Failed to create goal', error);
    }
  };

  const toggleComplete = async (id, completed) => {
    try {
      await goalsAPI.updateGoal(id, { completed: !completed });
      fetchGoals();
    } catch (error) {
      console.error('Failed to update goal', error);
    }
  };

  const deleteGoal = async (id) => {
    try {
      await goalsAPI.deleteGoal(id);
      fetchGoals();
    } catch (error) {
      console.error('Failed to delete goal', error);
    }
  };

  const priorityColors = {
    low: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
    medium: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
    high: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Goals</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          <Plus size={20} />
          New Goal
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Goal title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              />
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
              >
                Create Goal
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

      {loading ? (
        <div className="text-center py-12">Loading goals...</div>
      ) : goals.length === 0 ? (
        <div className="text-center py-12 text-gray-600 dark:text-gray-400">
          No goals yet. Create your first goal to get started!
        </div>
      ) : (
        <div className="grid gap-4">
          {goals.map((goal) => (
            <div
              key={goal._id}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow flex items-start justify-between"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleComplete(goal._id, goal.completed)}
                    className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                      goal.completed
                        ? 'bg-green-600 border-green-600'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    {goal.completed && <Check size={18} className="text-white" />}
                  </button>
                  <div className="flex-1">
                    <h3 className={`font-semibold ${goal.completed ? 'line-through text-gray-500' : ''}`}>
                      {goal.title}
                    </h3>
                    {goal.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{goal.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-3 flex-wrap">
                  <span className={`text-xs px-3 py-1 rounded-full ${priorityColors[goal.priority]}`}>
                    {goal.priority}
                  </span>
                  {goal.dueDate && (
                    <span className="text-xs flex items-center gap-1 text-gray-600 dark:text-gray-400">
                      <Calendar size={14} />
                      {new Date(goal.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => deleteGoal(goal._id)}
                className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
