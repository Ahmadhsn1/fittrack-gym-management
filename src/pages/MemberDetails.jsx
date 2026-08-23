import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Phone, Mail, Cake, MapPin, Pencil } from 'lucide-react';
import Badge from '../components/Badge';
import AddMemberModal from '../components/AddMemberModal';
import { useMembers } from '../context/MembersContext';
import { usePayments } from '../context/PaymentsContext';

export default function MemberDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { members, updateMember } = useMembers();
  const { payments } = usePayments();
  const [editing, setEditing] = useState(false);

  const member = members.find(m => String(m.id) === id);
  const memberPayments = payments.filter(p => p.memberId === Number(id));

  if (!member) {
    return (
      <div>
        <Link to="/members" className="btn btn-ghost btn-sm" style={{ marginBottom: 16 }}>
          <ArrowLeft size={15} /> Back to Members
        </Link>
        <p style={{ color: 'var(--text-secondary)' }}>Member not found.</p>
      </div>
    );
  }

  return (
    <div>
      <button className="btn btn-ghost btn-sm" onClick={() => navigate('/members')} style={{ marginBottom: 16 }}>
        <ArrowLeft size={15} /> Back to Members
      </button>

      <div className="grid-2col">
        <div className="card card-pad">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div className="avatar" style={{ width: 54, height: 54, fontSize: 18 }}>
                {member.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h2 style={{ fontSize: 18, marginBottom: 4 }}>{member.name}</h2>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <Badge status={member.status} />
                  <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>{member.plan} Plan</span>
                </div>
              </div>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => setEditing(true)}>
              <Pencil size={14} /> Edit
            </button>
          </div>

          <h3 className="section-title" style={{ marginBottom: 12 }}>Personal Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <InfoRow icon={Phone} label="Phone" value={member.phone} />
            <InfoRow icon={Mail} label="Email" value={member.email || '—'} />
            <InfoRow icon={Cake} label="Age" value={member.age} />
            <InfoRow icon={MapPin} label="Address" value={member.address || '—'} />
          </div>

          <div className="sidebar-divider" style={{ margin: '4px 0 20px' }} />

          <h3 className="section-title" style={{ marginBottom: 12 }}>Membership</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            <InfoRow label="Plan" value={member.plan} />
            <InfoRow label="Started" value={member.joinDate} />
            <InfoRow label="Expires" value={member.expiryDate} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card card-pad">
            <h3 className="section-title" style={{ marginBottom: 14 }}>Attendance</h3>
            <div style={{ display: 'flex', gap: 24 }}>
              <div>
                <div className="stat-card-value" style={{ fontSize: 24, color: 'var(--success)' }}>
                  {member.attendance?.present ?? 0}
                </div>
                <div className="stat-card-label">Present</div>
              </div>
              <div>
                <div className="stat-card-value" style={{ fontSize: 24, color: 'var(--danger)' }}>
                  {member.attendance?.absent ?? 0}
                </div>
                <div className="stat-card-label">Absent</div>
              </div>
            </div>
          </div>

          <div className="card card-pad">
            <h3 className="section-title" style={{ marginBottom: 14 }}>Payment History</h3>
            {memberPayments.length === 0 ? (
              <p style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>No payment records yet.</p>
            ) : (
              memberPayments.map(p => (
                <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
                  <span className="cell-muted">{p.date}</span>
                  <span style={{ fontWeight: 500 }}>Rs. {p.amount.toLocaleString()}</span>
                  <Badge status={p.status} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {editing && (
        <AddMemberModal
          initialData={member}
          onClose={() => setEditing(false)}
          onSubmit={(data) => { updateMember(member.id, data); setEditing(false); }}
        />
      )}
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 11.5, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        {Icon && <Icon size={12} />} {label}
      </div>
      <div style={{ fontSize: 13.5 }}>{value}</div>
    </div>
  );
}
