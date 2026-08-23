import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import Badge from '../components/Badge';
import EmptyState from '../components/EmptyState';
import { todayAttendance } from '../data/attendance';

const todayLabel = new Date(2026, 7, 13).toISOString().slice(0, 10);

export default function Attendance() {
  const [roster, setRoster] = useState(todayAttendance);
  const [date, setDate] = useState(todayLabel);
  const [query, setQuery] = useState('');

  const toggle = (memberId) => {
    setRoster(prev => prev.map(r => (r.memberId === memberId ? { ...r, present: !r.present } : r)));
  };

  const filtered = useMemo(
    () => roster.filter(r => r.member.toLowerCase().includes(query.toLowerCase())),
    [roster, query]
  );

  const presentCount = roster.filter(r => r.present).length;
  const absentCount = roster.length - presentCount;

  return (
    <div>
      <h1 className="page-title">Attendance</h1>
      <p className="page-subtitle">Mark and track daily gym attendance.</p>

      <div className="toolbar">
        <div className="search-box">
          <Search size={15} />
          <input placeholder="Search member..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <input
          type="date"
          className="select-filter"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', marginBottom: 20 }}>
        <div className="card stat-card">
          <div className="stat-card-label">Present Today</div>
          <div className="stat-card-value" style={{ color: 'var(--success)' }}>{presentCount}</div>
        </div>
        <div className="card stat-card">
          <div className="stat-card-label">Absent Today</div>
          <div className="stat-card-value" style={{ color: 'var(--danger)' }}>{absentCount}</div>
        </div>
      </div>

      <div className="card">
        {filtered.length === 0 ? (
          <EmptyState title="No members found" description="Try a different search term." />
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Plan</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.memberId}>
                    <td className="cell-primary">
                      <div className="avatar" style={{ width: 28, height: 28, fontSize: 11 }}>
                        {r.member.split(' ').map(n => n[0]).join('')}
                      </div>
                      {r.member}
                    </td>
                    <td className="cell-muted">{r.plan}</td>
                    <td><Badge status={r.present ? 'Present' : 'Absent'} /></td>
                    <td>
                      <button
                        className={`btn btn-sm ${r.present ? 'btn-secondary' : 'btn-primary'}`}
                        onClick={() => toggle(r.memberId)}
                      >
                        Mark {r.present ? 'Absent' : 'Present'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
