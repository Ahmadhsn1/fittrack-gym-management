import { useState } from 'react';
import { Search, Bell, Menu, AlertTriangle, UserPlus, Wallet } from 'lucide-react';

const notifications = [
  { icon: AlertTriangle, color: 'var(--warning)', text: '5 memberships expire this week.' },
  { icon: UserPlus, color: 'var(--success)', text: 'New member registered: Hamza Sheikh.' },
  { icon: Wallet, color: 'var(--accent)', text: 'Payment received from Ali Khan.' },
];

export default function Topbar({ onMenuClick }) {
  const [query, setQuery] = useState('');
  const [showNotifs, setShowNotifs] = useState(false);

  return (
    <header className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button className="hamburger-btn" onClick={onMenuClick} aria-label="Open menu">
          <Menu size={22} />
        </button>
        <div className="topbar-search">
          <Search size={15} />
          <input
            placeholder="Search anything..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="topbar-right" style={{ position: 'relative' }}>
        <button
          className="topbar-icon-btn"
          aria-label="Notifications"
          onClick={() => setShowNotifs(v => !v)}
        >
          <Bell size={18} />
          <span className="notif-dot" />
        </button>

        {showNotifs && (
          <>
            <div
              style={{ position: 'fixed', inset: 0, zIndex: 45 }}
              onClick={() => setShowNotifs(false)}
            />
            <div
              className="card"
              style={{
                position: 'absolute', top: 44, right: 90, width: 280, zIndex: 50,
                padding: '10px 0'
              }}
            >
              <div style={{ padding: '4px 16px 10px', fontSize: 12.5, fontWeight: 600, color: 'var(--text-secondary)' }}>
                Notifications
              </div>
              {notifications.map((n, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 16px', fontSize: 12.5, alignItems: 'flex-start' }}>
                  <n.icon size={15} color={n.color} style={{ flexShrink: 0, marginTop: 1 }} />
                  <span style={{ color: 'var(--text-primary)' }}>{n.text}</span>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="topbar-admin">
          <div className="avatar">A</div>
          <span>Admin</span>
        </div>
      </div>
    </header>
  );
}
