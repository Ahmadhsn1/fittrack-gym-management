import { useState } from 'react';
import Modal from './Modal';

const emptyForm = { name: '', price: '', duration: '', features: '' };

export default function EditPlanModal({ plan, onClose, onSubmit }) {
  const isEdit = Boolean(plan);
  const [form, setForm] = useState(
    plan
      ? { name: plan.name, price: plan.price, duration: plan.duration, features: plan.features.join(', ') }
      : emptyForm
  );

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.duration) return;
    onSubmit({
      ...form,
      price: Number(form.price) || 0,
      features: form.features.split(',').map(f => f.trim()).filter(Boolean)
    });
  };

  return (
    <Modal
      title={isEdit ? 'Edit Plan' : 'Add Plan'}
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" form="edit-plan-form" type="submit">
            {isEdit ? 'Save Changes' : 'Add Plan'}
          </button>
        </>
      }
    >
      <form id="edit-plan-form" onSubmit={handleSubmit} className="form-grid">
        <div className="form-field full">
          <label>Plan Name</label>
          <input required value={form.name} onChange={update('name')} placeholder="e.g. Standard" />
        </div>
        <div className="form-field">
          <label>Price (Rs.)</label>
          <input required type="number" min="0" value={form.price} onChange={update('price')} />
        </div>
        <div className="form-field">
          <label>Duration</label>
          <input required value={form.duration} onChange={update('duration')} placeholder="e.g. 3 Months" />
        </div>
        <div className="form-field full">
          <label>Features (comma separated)</label>
          <input value={form.features} onChange={update('features')} placeholder="Gym Access, Locker, Diet Plan" />
        </div>
      </form>
    </Modal>
  );
}
