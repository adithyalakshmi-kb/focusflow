import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { useState } from 'react';
import { LogOut, Moon, Sun, User, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, logout, updateUser } = useAuth();
  const { isDark, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [saved, setSaved] = useState(false);

  const handleSaveName = () => {
    if (displayName.trim()) {
      updateUser({ displayName });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

      {/* User Info */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow mb-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <User size={24} />
          Personal Information
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Mail size={20} />
              {user?.email}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Display Name</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              />
              <button
                onClick={handleSaveName}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Save
              </button>
            </div>
            {saved && (
              <p className="text-green-600 dark:text-green-400 text-sm mt-2">
                Name updated successfully!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow mb-6">
        <h2 className="text-xl font-bold mb-4">Preferences</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isDark ? <Moon size={20} /> : <Sun size={20} />}
              <span className="font-medium">Dark Mode</span>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`relative inline-flex h-8 w-14 rounded-full ${
                isDark ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition ${
                  isDark ? 'translate-x-7' : 'translate-x-1'
                } mt-1`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4 text-red-700 dark:text-red-300">Danger Zone</h2>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
}
