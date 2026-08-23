import { useState } from 'react';
import { Star, Phone, Users, Clock, Plus } from 'lucide-react';
import TrainerCard from '../components/TrainerCard';
import Modal from '../components/Modal';
import EditTrainerModal from '../components/EditTrainerModal';
import ConfirmDialog from '../components/ConfirmDialog';
import { trainers as initialTrainers } from '../data/trainers';

export default function Trainers() {
  const [trainers, setTrainers] = useState(initialTrainers);
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const addTrainer = (data) => {
    const nextId = trainers.length ? Math.max(...trainers.map(t => t.id)) + 1 : 1;
    setTrainers(prev => [{ ...data, id: nextId }, ...prev]);
  };

  const updateTrainer = (id, data) => {
    setTrainers(prev => prev.map(t => (t.id === id ? { ...t, ...data } : t)));
  };

  const deleteTrainer = (id) => {
    setTrainers(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: 4 }}>Trainers</h1>
          <p className="page-subtitle" style={{ marginBottom: 0 }}>{trainers.length} trainers on staff</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
          <Plus size={15} /> Add Trainer
        </button>
      </div>

      <div className="cards-grid">
        {trainers.map(t => (
          <TrainerCard
            key={t.id}
            trainer={t}
            onView={() => setSelected(t)}
            onEdit={() => setEditing(t)}
            onDelete={() => setDeleting(t)}
          />
        ))}
      </div>

      {selected && (
        <Modal title={selected.name} onClose={() => setSelected(null)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
            <div className="avatar" style={{ width: 54, height: 54, fontSize: 18, background: 'var(--accent-wash)', color: 'var(--accent)' }}>
              {selected.initials}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 15 }}>{selected.specialty}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12.5, marginTop: 4 }}>
                <Star size={13} fill="var(--warning)" color="var(--warning)" />
                {selected.rating} rating
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13.5 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Clock size={15} color="var(--text-secondary)" /> {selected.availability}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Users size={15} color="var(--text-secondary)" /> {selected.assignedMembers} assigned members · {selected.experience} experience
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Phone size={15} color="var(--text-secondary)" /> {selected.phone}
            </div>
          </div>
        </Modal>
      )}

      {showAdd && (
        <EditTrainerModal
          onClose={() => setShowAdd(false)}
          onSubmit={(data) => { addTrainer(data); setShowAdd(false); }}
        />
      )}

      {editing && (
        <EditTrainerModal
          trainer={editing}
          onClose={() => setEditing(null)}
          onSubmit={(data) => { updateTrainer(editing.id, data); setEditing(null); }}
        />
      )}

      {deleting && (
        <ConfirmDialog
          title="Remove Trainer"
          message={`Are you sure you want to remove ${deleting.name}? This action cannot be undone.`}
          confirmLabel="Delete"
          danger
          onCancel={() => setDeleting(null)}
          onConfirm={() => { deleteTrainer(deleting.id); setDeleting(null); }}
        />
      )}
    </div>
  );
}
