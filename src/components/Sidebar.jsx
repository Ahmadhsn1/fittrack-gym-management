import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Users, CreditCard, ClipboardCheck,
  Dumbbell, Wallet, Settings, Activity
} from 'lucide-react';

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/members', label: 'Members', icon: Users },
  { to: '/memberships', label: 'Memberships', icon: CreditCard },
  { to: '/attendance', label: 'Attendance', icon: ClipboardCheck },
  { to: '/trainers', label: 'Trainers', icon: Dumbbell },
  { to: '/payments', label: 'Payments', icon: Wallet },
];

export default function Sidebar({ open, onNavigate }) {
  return (
    <>
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="sidebar-brand-mark"><Activity size={17} strokeWidth={2.5} /></div>
          <span className="sidebar-brand-name">FITTRACK</span>
        </div>

        <nav className="sidebar-nav">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onNavigate}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={17} strokeWidth={2} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-divider" />
        <div className="sidebar-nav" style={{ paddingTop: 0 }}>
          <NavLink
            to="/settings"
            onClick={onNavigate}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <Settings size={17} strokeWidth={2} />
            Settings
          </NavLink>
        </div>

        <div className="sidebar-footer">FITTRACK v1.0</div>
      </aside>
    </>
  );
}
