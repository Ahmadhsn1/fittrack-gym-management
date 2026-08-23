import { useState } from 'react';
import Modal from './Modal';
import { useMemberships } from '../context/MembershipsContext';

export default function AddMemberModal({ onClose, onSubmit, initialData }) {
  const isEdit = Boolean(initialData);
  const { plans } = useMemberships();
  const emptyForm = {
    name: '', email: '', phone: '', age: '', gender: 'Male',
    address: '', plan: plans[0]?.name ?? '', startDate: '', expiryDate: '', emergencyContact: ''
  };
  const [form, setForm] = useState(
    initialData
      ? {
          name: initialData.name, email: initialData.email, phone: initialData.phone,
          age: initialData.age, gender: initialData.gender, address: initialData.address,
          plan: initialData.plan, startDate: initialData.joinDate, expiryDate: initialData.expiryDate,
          emergencyContact: initialData.emergencyContact
        }
      : emptyForm
  );
  const [dateError, setDateError] = useState('');

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.startDate || !form.expiryDate) return;
    if (form.expiryDate <= form.startDate) {
      setDateError('Expiry date must be after the start date.');
      return;
    }
    setDateError('');
    onSubmit({
      ...form,
      age: Number(form.age) || 0,
      status: initialData ? initialData.status : 'Active',
      joinDate: form.startDate,
      attendance: initialData ? initialData.attendance : { present: 0, absent: 0 }
    });
  };

  return (
    <Modal
      title={isEdit ? 'Edit Member' : 'Add Member'}
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" form="add-member-form" type="submit">
            {isEdit ? 'Save Changes' : 'Add Member'}
          </button>
        </>
      }
    >
      <form id="add-member-form" onSubmit={handleSubmit} className="form-grid">
        <div className="form-field full">
          <label>Full Name</label>
          <input required value={form.name} onChange={update('name')} placeholder="e.g. Ali Khan" />
        </div>
        <div className="form-field">
          <label>Email</label>
          <input type="email" value={form.email} onChange={update('email')} placeholder="ali@gmail.com" />
        </div>
        <div className="form-field">
          <label>Phone</label>
          <input required value={form.phone} onChange={update('phone')} placeholder="03001234567" />
        </div>
        <div className="form-field">
          <label>Age</label>
          <input type="number" min="10" max="90" value={form.age} onChange={update('age')} />
        </div>
        <div className="form-field">
          <label>Gender</label>
          <select value={form.gender} onChange={update('gender')}>
            <option>Male</option>
            <option>Female</option>
          </select>
        </div>
        <div className="form-field full">
          <label>Address</label>
          <input value={form.address} onChange={update('address')} placeholder="Block 4, Lahore" />
        </div>
        <div className="form-field">
          <label>Membership Plan</label>
          <select value={form.plan} onChange={update('plan')}>
            {plans.map(p => (
              <option key={p.id} value={p.name}>{p.name}</option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label>Emergency Contact</label>
          <input value={form.emergencyContact} onChange={update('emergencyContact')} placeholder="03011234567" />
        </div>
        <div className="form-field">
          <label>Start Date</label>
          <input
            required
            type="date"
            value={form.startDate}
            onChange={(e) => { setForm({ ...form, startDate: e.target.value }); setDateError(''); }}
          />
        </div>
        <div className="form-field">
          <label>Expiry Date</label>
          <input
            required
            type="date"
            min={form.startDate || undefined}
            value={form.expiryDate}
            onChange={(e) => { setForm({ ...form, expiryDate: e.target.value }); setDateError(''); }}
          />
        </div>
        {dateError && (
          <div className="form-field full" style={{ color: 'var(--danger)', fontSize: 12.5 }}>
            {dateError}
          </div>
        )}
      </form>
    </Modal>
  );
}
