import { Star, Phone, Users, Clock, Pencil, Trash2 } from 'lucide-react';

export default function TrainerCard({ trainer, onView, onEdit, onDelete }) {
  return (
    <div className="card card-pad trainer-card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="row-actions trainer-card-actions">
        <button className="icon-btn" onClick={onEdit} aria-label="Edit">
          <Pencil size={14} />
        </button>
        <button className="icon-btn danger" onClick={onDelete} aria-label="Delete">
          <Trash2 size={14} />
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div
          className="avatar trainer-card-avatar-ring"
          style={{ width: 48, height: 48, fontSize: 16, background: 'var(--accent-wash)', color: 'var(--accent)' }}
        >
          {trainer.initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="trainer-card-name">{trainer.name}</div>
          <span className="trainer-specialty-tag">{trainer.specialty}</span>
        </div>
      </div>

      <div className="trainer-rating-chip">
        <Star size={13} fill="var(--warning)" color="var(--warning)" />
        {trainer.rating} <span style={{ opacity: 0.7, fontWeight: 500 }}>· {trainer.experience}</span>
      </div>

      <div className="sidebar-divider" style={{ margin: 0 }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div className="trainer-stat-row">
          <div className="trainer-stat-icon"><Users size={13} /></div>
          <div className="trainer-stat-text">
            <strong>{trainer.assignedMembers}</strong> Assigned Members
          </div>
        </div>
        <div className="trainer-stat-row">
          <div className="trainer-stat-icon"><Clock size={13} /></div>
          <div className="trainer-stat-text">{trainer.availability}</div>
        </div>
        <div className="trainer-stat-row">
          <div className="trainer-stat-icon"><Phone size={13} /></div>
          <div className="trainer-stat-text">{trainer.phone}</div>
        </div>
      </div>

      <button className="btn btn-secondary btn-sm" onClick={onView}>
        View Profile
      </button>
    </div>
  );
}
