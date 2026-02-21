import { useEffect, useState } from 'react';
import { dashboardAPI } from '@/api';
import { TrendingUp, Target, Zap, Smile, Trophy, Quote } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [dashData, quoteData] = await Promise.all([
          dashboardAPI.getDashboard(),
          dashboardAPI.getQuote(),
        ]);
        setDashboard(dashData.data.dashboard);
        setQuote(quoteData.data.quote);
      } catch (error) {
        console.error('Failed to fetch dashboard', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="text-center py-12">Loading dashboard...</div>;
  }

  if (!dashboard) {
    return <div className="text-center py-12 text-red-600">Failed to load dashboard</div>;
  }

  return (
    <div className="space-y-6">
      {/* Quote Card */}
      {quote && (
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg p-6 shadow-lg flex gap-4">
          <Quote size={32} className="flex-shrink-0" />
          <div>
            <p className="text-lg font-medium italic">"{quote.text}"</p>
            <p className="text-sm opacity-90 mt-2">— {quote.author}</p>
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Goals */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Goals Completed</p>
              <p className="text-3xl font-bold mt-2">
                {dashboard.goals.completed}/{dashboard.goals.total}
              </p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                {dashboard.goals.percentage}% progress
              </p>
            </div>
            <Target className="text-blue-600 dark:text-blue-400" size={40} />
          </div>
        </div>

        {/* Focus Time */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Focus Time (7d)</p>
              <p className="text-3xl font-bold mt-2">{dashboard.focus.totalHours}h</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {dashboard.focus.sessionsCount} sessions
              </p>
            </div>
            <Zap className="text-yellow-600 dark:text-yellow-400" size={40} />
          </div>
        </div>

        {/* Mood */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Avg. Mood</p>
              <p className="text-3xl font-bold mt-2">{dashboard.mood.average}/5</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {dashboard.mood.count} entries
              </p>
            </div>
            <Smile className="text-pink-600 dark:text-pink-400" size={40} />
          </div>
        </div>

        {/* Productivity Score */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Productivity Score</p>
              <p className="text-3xl font-bold mt-2">{dashboard.productivityScore}</p>
              <p className="text-xs text-gradient-600 dark:text-green-400 mt-1">
                {dashboard.productivityScore >= 70 ? '🔥 Great!' : 'Keep it up!'}
              </p>
            </div>
            <Trophy className="text-amber-600 dark:text-amber-400" size={40} />
          </div>
        </div>
      </div>

      {/* Weekly Progress Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
        <h2 className="text-lg font-bold mb-4">Weekly Progress</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dashboard.weeklyProgress}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
              }}
            />
            <Line
              type="monotone"
              dataKey="completedGoals"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Habits Overview */}
      {dashboard.habits.total > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h2 className="text-lg font-bold mb-4">Habit Streaks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dashboard.habits.streaks.map((habit, idx) => (
              <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="font-medium">{habit.name}</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {habit.streak}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">day streak</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Longest: {habit.longestStreak} days
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
