import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import StatCard from '../components/StatCard';
import Badge from '../components/Badge';
import { useMembers } from '../context/MembersContext';
import { usePayments } from '../context/PaymentsContext';
import { weeklyAttendance, todayAttendance } from '../data/attendance';

export default function Dashboard() {
  const { members } = useMembers();
  const { payments } = usePayments();
  const totalMembers = members.length;
  const activeMembers = members.filter(m => m.status === 'Active').length;
  const expiringSoon = members.filter(m => m.status === 'Expiring').length;
  const presentToday = todayAttendance.filter(a => a.present).length;

  const monthlyRevenue = payments
    .filter(p => p.status === 'Paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const recentMembers = [...members]
    .sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate))
    .slice(0, 5);

  return (
    <div>
      <h1 className="page-title">Good Morning, Admin 👋</h1>
      <p className="page-subtitle">Here's what's happening at your gym today.</p>

      <div className="stat-grid">
        <StatCard label="Total Members" value={totalMembers} delta="4.2% this month" deltaDirection="up" />
        <StatCard label="Active Members" value={activeMembers} delta="2.1% this month" deltaDirection="up" />
        <StatCard label="Expiring Soon" value={expiringSoon} delta="Needs follow-up" deltaDirection="down" />
        <StatCard label="Today's Attendance" value={presentToday} delta="vs 74 yesterday" deltaDirection="up" />
      </div>

      <div className="grid-2col">
        <div className="card card-pad">
          <div className="section-head">
            <h3 className="section-title">Recent Members</h3>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Plan</th>
                  <th>Status</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {recentMembers.map(m => (
                  <tr key={m.id}>
                    <td className="cell-primary">
                      <div className="avatar" style={{ width: 28, height: 28, fontSize: 11 }}>
                        {m.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      {m.name}
                    </td>
                    <td className="cell-muted">{m.plan}</td>
                    <td><Badge status={m.status} /></td>
                    <td className="cell-muted">{m.joinDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card card-pad">
            <div className="section-head">
              <h3 className="section-title">Attendance Overview</h3>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyAttendance}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} width={30} />
                <Tooltip
                  cursor={{ fill: 'var(--accent-wash)' }}
                  contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12.5 }}
                />
                <Bar dataKey="count" fill="var(--accent)" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card card-pad">
            <div className="stat-card-label">Monthly Revenue</div>
            <div className="stat-card-value" style={{ color: 'var(--accent)' }}>
              Rs. {monthlyRevenue.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
