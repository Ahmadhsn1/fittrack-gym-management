import { useState } from 'react';
import { Sun, Moon, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const [profile, setProfile] = useState({ name: 'Admin', email: 'admin@fittrack.com', phone: '03001234567' });
  const [saved, setSaved] = useState(false);

  const update = (key) => (e) => setProfile({ ...profile, [key]: e.target.value });

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <h1 className="page-title">Settings</h1>
      <p className="page-subtitle">Manage your admin profile and app preferences.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 560 }}>
        <div className="card card-pad">
          <h3 className="section-title" style={{ marginBottom: 16 }}>Profile</h3>
          <form onSubmit={handleSave} className="form-grid">
            <div className="form-field full">
              <label>Name</label>
              <input value={profile.name} onChange={update('name')} />
            </div>
            <div className="form-field full">
              <label>Email</label>
              <input type="email" value={profile.email} onChange={update('email')} />
            </div>
            <div className="form-field full">
              <label>Phone</label>
              <input value={profile.phone} onChange={update('phone')} />
            </div>
            <div className="form-field full" style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 4 }}>
              <button className="btn btn-primary" type="submit">Save Changes</button>
              {saved && (
                <span style={{ color: 'var(--success)', fontSize: 12.5, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Check size={14} /> Saved
                </span>
              )}
            </div>
          </form>
        </div>

        <div className="card card-pad">
          <h3 className="section-title" style={{ marginBottom: 16 }}>Appearance</h3>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              className={`btn ${theme === 'dark' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => theme !== 'dark' && toggleTheme()}
            >
              <Moon size={15} /> Dark Mode
            </button>
            <button
              className={`btn ${theme === 'light' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => theme !== 'light' && toggleTheme()}
            >
              <Sun size={15} /> Light Mode
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
