import { useState } from 'react';
import Modal from './Modal';

const emptyForm = { name: '', specialty: '', phone: '', experience: '', availability: '', rating: '' };

export default function EditTrainerModal({ trainer, onClose, onSubmit }) {
  const isEdit = Boolean(trainer);
  const [form, setForm] = useState(
    trainer
      ? {
          name: trainer.name, specialty: trainer.specialty, phone: trainer.phone,
          experience: trainer.experience, availability: trainer.availability, rating: trainer.rating
        }
      : emptyForm
  );

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    onSubmit({
      ...form,
      rating: Number(form.rating) || 0,
      initials: form.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
      assignedMembers: isEdit ? trainer.assignedMembers : 0
    });
  };

  return (
    <Modal
      title={isEdit ? 'Edit Trainer' : 'Add Trainer'}
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" form="edit-trainer-form" type="submit">
            {isEdit ? 'Save Changes' : 'Add Trainer'}
          </button>
        </>
      }
    >
      <form id="edit-trainer-form" onSubmit={handleSubmit} className="form-grid">
        <div className="form-field full">
          <label>Full Name</label>
          <input required value={form.name} onChange={update('name')} placeholder="e.g. Ali Khan" />
        </div>
        <div className="form-field full">
          <label>Specialty</label>
          <input required value={form.specialty} onChange={update('specialty')} placeholder="e.g. Strength Trainer" />
        </div>
        <div className="form-field">
          <label>Phone</label>
          <input required value={form.phone} onChange={update('phone')} placeholder="03001234567" />
        </div>
        <div className="form-field">
          <label>Rating</label>
          <input type="number" min="0" max="5" step="0.1" value={form.rating} onChange={update('rating')} />
        </div>
        <div className="form-field">
          <label>Experience</label>
          <input value={form.experience} onChange={update('experience')} placeholder="e.g. 5 Years" />
        </div>
        <div className="form-field">
          <label>Availability</label>
          <input value={form.availability} onChange={update('availability')} placeholder="e.g. Mon - Sat, 6AM - 2PM" />
        </div>
      </form>
    </Modal>
  );
}
