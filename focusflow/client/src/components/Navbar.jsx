import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, LogOut } from 'lucide-react';

export default function Navbar({ onToggleSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const firstName = user?.displayName?.split(' ')[0] || 'Friend';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <header style={{
      background: '#FFFFFF',
      borderBottom: '1.5px solid #E2E8F0',
      padding: '0 32px',
      height: '68px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    }}>
      {/* Left: toggle + greeting */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={onToggleSidebar}
          style={{
            width: 38, height: 38,
            borderRadius: '10px',
            border: '1.5px solid #E2E8F0',
            background: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#64748B',
          }}
        >
          <Menu size={18} />
        </button>

        <div>
          <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#1E293B', lineHeight: 1.2 }}>
            {greeting}, {firstName} ✨
          </h2>
          <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '1px' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Right: actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button style={{
          width: 38, height: 38,
          borderRadius: '10px',
          border: '1.5px solid #E2E8F0',
          background: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#64748B',
        }}>
          <Bell size={17} />
        </button>

        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Avatar */}
            <div style={{
              width: 36, height: 36,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #C7D2FE, #BAE6FD)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: '14px', color: '#4338CA',
            }}>
              {firstName[0]?.toUpperCase()}
            </div>

            <div style={{ lineHeight: 1.3 }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>{user.displayName}</div>
              <div style={{ fontSize: '11px', color: '#94A3B8' }}>{user.email}</div>
            </div>

            <button
              onClick={handleLogout}
              title="Logout"
              style={{
                width: 34, height: 34,
                borderRadius: '10px',
                border: '1.5px solid #FEE2E2',
                background: '#FFF5F5',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#EF4444',
              }}
            >
              <LogOut size={15} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
