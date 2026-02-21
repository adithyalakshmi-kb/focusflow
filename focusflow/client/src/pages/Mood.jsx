import { useState, useEffect } from 'react';
import { moodAPI } from '@/api';
import { Frown, Meh, Smile, Heart, Laugh } from 'lucide-react';

const moods = [
  { emoji: '😢', label: 'Sad', value: 1, icon: Frown },
  { emoji: '😐', label: 'Neutral', value: 2, icon: Meh },
  { emoji: '😊', label: 'Good', value: 3, icon: Smile },
  { emoji: '😄', label: 'Great', value: 4, icon: Heart },
  { emoji: '🤩', label: 'Excellent', value: 5, icon: Laugh },
];

export default function Mood() {
  const [todayMood, setTodayMood] = useState(null);
  const [note, setNote] = useState('');
  const [moodHistory, setMoodHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMoodData();
  }, []);

  const fetchMoodData = async () => {
    try {
      const [today, history] = await Promise.all([
        moodAPI.getTodayMood(),
        moodAPI.getMoodHistory(7),
      ]);
      setTodayMood(today.data.mood);
      if (today.data.mood) {
        setNote(today.data.mood.note || '');
      }
      setMoodHistory(history.data.moods);
    } catch (error) {
      console.error('Failed to fetch mood data', error);
    } finally {
      setLoading(false);
    }
  };

  const logMood = async (rating, emojiLabel) => {
    try {
      const mood = moods.find((m) => m.value === rating);
      await moodAPI.logMood({
        emoji: mood.emoji,
        rating,
        note,
      });
      setNote('');
      fetchMoodData();
    } catch (error) {
      console.error('Failed to log mood', error);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading mood data...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Today's Mood */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow max-w-2xl">
        <h2 className="text-2xl font-bold mb-6">How are you feeling today?</h2>
        <div className="flex justify-around mb-8">
          {moods.map((mood) => (
            <button
              key={mood.value}
              onClick={() => logMood(mood.value, mood.label)}
              className={`flex flex-col items-center gap-2 p-4 rounded-lg transition ${
                todayMood?.rating === mood.value
                  ? 'bg-blue-100 dark:bg-blue-900 scale-110'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              title={mood.label}
            >
              <span className="text-4xl">{mood.emoji}</span>
              <span className="text-sm font-medium">{mood.label}</span>
            </button>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Add a note (optional)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 resize-none"
            rows="4"
          />
        </div>
      </div>

      {/* Mood History */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
        <h2 className="text-2xl font-bold mb-4">Last 7 Days</h2>
        {moodHistory.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400 text-center py-8">
            No mood entries yet. Start logging your mood!
          </p>
        ) : (
          <div className="space-y-3">
            {moodHistory.map((mood) => (
              <div
                key={mood._id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{mood.emoji}</span>
                  <div>
                    <p className="font-medium">{mood.rating}/5</p>
                    {mood.note && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">{mood.note}</p>
                    )}
                  </div>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(mood.timestamp).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
