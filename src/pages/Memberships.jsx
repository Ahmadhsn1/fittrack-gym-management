import { useState } from 'react';
import { Check, Plus, Pencil, Trash2 } from 'lucide-react';
import { useMembers } from '../context/MembersContext';
import { useMemberships } from '../context/MembershipsContext';
import EditPlanModal from '../components/EditPlanModal';
import ConfirmDialog from '../components/ConfirmDialog';

export default function Memberships() {
  const { members } = useMembers();
  const { plans, addPlan, updatePlan, deletePlan } = useMemberships();
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: 4 }}>Membership Plans</h1>
          <p className="page-subtitle" style={{ marginBottom: 0 }}>Manage the plans available to your gym members.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
          <Plus size={15} /> Add Plan
        </button>
      </div>

      <div className="plans-grid">
        {plans.map((plan, idx) => {
          const activeCount = members.filter(m => m.plan === plan.name).length;
          const featured = idx === 2;
          return (
            <div
              key={plan.id}
              className="card card-pad"
              style={featured ? { border: '1px solid var(--accent)', boxShadow: '0 0 0 1px var(--accent-wash)' } : undefined}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                {featured ? (
                  <div style={{ color: 'var(--accent)', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 8 }}>
                    Most Popular
                  </div>
                ) : <span />}
                <div className="row-actions">
                  <button className="icon-btn" onClick={() => setEditing(plan)} aria-label="Edit">
                    <Pencil size={15} />
                  </button>
                  <button className="icon-btn danger" onClick={() => setDeleting(plan)} aria-label="Delete">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              <h3 style={{ fontSize: 17, marginBottom: 6 }}>{plan.name}</h3>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 2 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700 }}>
                  Rs. {plan.price.toLocaleString()}
                </span>
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: 12.5, marginBottom: 18 }}>{plan.duration}</div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                    <Check size={15} color="var(--accent)" /> {f}
                  </div>
                ))}
              </div>

              <div className="sidebar-divider" style={{ margin: '0 0 14px' }} />
              <div style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
                <strong style={{ color: 'var(--text-primary)' }}>{activeCount}</strong> members on this plan
              </div>
            </div>
          );
        })}
      </div>

      {showAdd && (
        <EditPlanModal
          onClose={() => setShowAdd(false)}
          onSubmit={(data) => { addPlan(data); setShowAdd(false); }}
        />
      )}

      {editing && (
        <EditPlanModal
          plan={editing}
          onClose={() => setEditing(null)}
          onSubmit={(data) => { updatePlan(editing.id, data); setEditing(null); }}
        />
      )}

      {deleting && (
        <ConfirmDialog
          title="Remove Plan"
          message={`Are you sure you want to remove the ${deleting.name} plan? This action cannot be undone.`}
          confirmLabel="Delete"
          danger
          onCancel={() => setDeleting(null)}
          onConfirm={() => { deletePlan(deleting.id); setDeleting(null); }}
        />
      )}
    </div>
  );
}
