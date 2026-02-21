import { Link, useLocation } from 'react-router-dom';
import { Home, CheckCircle2, Zap, Smile, Activity, Settings } from 'lucide-react';

const menuItems = [
  { label: 'Dashboard', path: '/', icon: Home },
  { label: 'Goals', path: '/goals', icon: CheckCircle2 },
  { label: 'Habits', path: '/habits', icon: Activity },
  { label: 'Timer', path: '/timer', icon: Zap },
  { label: 'Mood', path: '/mood', icon: Smile },
  { label: 'Profile', path: '/profile', icon: Settings },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      <nav className="flex-1 pt-4">
        {menuItems.map(({ label, path, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`
                flex items-center gap-3 px-6 py-3 text-sm font-medium
                ${isActive
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 border-r-4 border-blue-600'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }
              `}
            >
              <Icon size={20} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
