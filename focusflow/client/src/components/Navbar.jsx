import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Moon, Sun, LogOut } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { isDark, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              ✨ FocusFlow
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              title={isDark ? 'Light mode' : 'Dark mode'}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {user && (
              <>
                <div className="text-sm">
                  <div className="font-medium">{user.displayName}</div>
                  <div className="text-gray-500 dark:text-gray-400 text-xs">{user.email}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400"
                >
                  <LogOut size={20} />
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button onClick={toggleDarkMode} className="p-2">
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && user && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-800 py-4">
            <div className="text-sm mb-4">
              <div className="font-medium">{user.displayName}</div>
              <div className="text-gray-500 dark:text-gray-400 text-xs">{user.email}</div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 rounded"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
