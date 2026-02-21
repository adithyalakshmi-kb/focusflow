import { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#F8FAFC' }}>
      <Navbar onToggleSidebar={() => setSidebarOpen(o => !o)} />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar open={sidebarOpen} />
        <main style={{
          flex: 1,
          padding: '28px 32px',
          overflowY: 'auto',
          minWidth: 0,
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
