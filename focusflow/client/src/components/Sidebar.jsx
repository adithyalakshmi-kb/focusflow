import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Target, Activity, Timer, Smile, UserCircle, Sparkles } from 'lucide-react';

const menuItems = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard, accent: '#C7D2FE', accentText: '#4338CA' },
  { label: 'Goals', path: '/goals', icon: Target, accent: '#BBF7D0', accentText: '#15803D' },
  { label: 'Habits', path: '/habits', icon: Activity, accent: '#FED7AA', accentText: '#C2410C' },
  { label: 'Study Timer', path: '/timer', icon: Timer, accent: '#BAE6FD', accentText: '#0369A1' },
  { label: 'Mood', path: '/mood', icon: Smile, accent: '#FBCFE8', accentText: '#BE185D' },
  { label: 'Profile', path: '/profile', icon: UserCircle, accent: '#E9D5FF', accentText: '#7E22CE' },
];

export default function Sidebar({ open }) {
  const location = useLocation();

  return (
    <aside style={{
      width: open ? '230px' : '0px',
      minWidth: open ? '230px' : '0px',
      overflow: 'hidden',
      background: '#FFFFFF',
      borderRight: '1.5px solid #E2E8F0',
      transition: 'width 0.3s ease, min-width 0.3s ease',
      display: 'flex',
      flexDirection: 'column',
      padding: open ? '24px 12px' : '0',
      boxShadow: '4px 0 20px rgba(0,0,0,0.03)',
    }}>
      {/* Logo */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '0 8px 24px 8px',
        borderBottom: '1.5px solid #F1F5F9',
        marginBottom: '8px',
      }}>
        <div style={{
          width: 34, height: 34, borderRadius: '10px',
          background: 'linear-gradient(135deg, #C7D2FE, #BAE6FD)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Sparkles size={16} color="#4338CA" />
        </div>
        <span style={{ fontWeight: 800, fontSize: '16px', color: '#1E293B', whiteSpace: 'nowrap' }}>
          FocusFlow
        </span>
      </div>

      {/* Menu Label */}
      <p style={{ fontSize: '10px', fontWeight: 700, color: '#94A3B8', letterSpacing: '0.1em', padding: '0 10px 8px', textTransform: 'uppercase' }}>
        Menu
      </p>

      {/* Nav Items */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {menuItems.map(({ label, path, icon: Icon, accent, accentText }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '12px',
                textDecoration: 'none',
                fontWeight: isActive ? 600 : 500,
                fontSize: '13.5px',
                color: isActive ? accentText : '#64748B',
                background: isActive ? accent : 'transparent',
                whiteSpace: 'nowrap',
                boxShadow: isActive ? `0 2px 10px ${accent}99` : 'none',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.background = '#F8FAFC';
                  e.currentTarget.style.color = accentText;
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#64748B';
                }
              }}
            >
              <div style={{
                width: 30, height: 30,
                borderRadius: '8px',
                background: isActive ? `${accent}CC` : '#F8FAFC',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Icon size={15} color={isActive ? accentText : '#94A3B8'} />
              </div>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer card */}
      <div style={{
        marginTop: 'auto',
        background: 'linear-gradient(135deg, #EDE9FE, #E0F2FE)',
        borderRadius: '14px',
        padding: '16px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '22px', marginBottom: '6px' }}>🎓</div>
        <p style={{ fontSize: '12px', fontWeight: 600, color: '#4338CA' }}>Stay consistent!</p>
        <p style={{ fontSize: '11px', color: '#64748B', marginTop: '3px' }}>Small steps daily.</p>
      </div>
    </aside>
  );
}
