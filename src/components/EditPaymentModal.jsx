import { useState } from 'react';
import Modal from './Modal';
import { useMembers } from '../context/MembersContext';
import { useMemberships } from '../context/MembershipsContext';

export default function EditPaymentModal({ payment, onClose, onSubmit }) {
  const isEdit = Boolean(payment);
  const { members } = useMembers();
  const { plans } = useMemberships();
  const [form, setForm] = useState(
    isEdit
      ? { memberId: payment.memberId, plan: payment.plan, amount: payment.amount, date: payment.date, status: payment.status }
      : { memberId: members[0]?.id ?? '', plan: plans[0]?.name ?? '', amount: '', date: '', status: 'Pending' }
  );

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.date || !form.amount || !form.memberId) return;
    const member = isEdit ? { id: payment.memberId, name: payment.member } : members.find(m => m.id === Number(form.memberId));
    onSubmit({
      ...form,
      memberId: member.id,
      member: member.name,
      amount: Number(form.amount)
    });
  };

  return (
    <Modal
      title={isEdit ? 'Edit Payment' : 'Add Payment'}
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" form="edit-payment-form" type="submit">
            {isEdit ? 'Save Changes' : 'Add Payment'}
          </button>
        </>
      }
    >
      <form id="edit-payment-form" onSubmit={handleSubmit} className="form-grid">
        <div className="form-field full">
          <label>Member</label>
          {isEdit ? (
            <input value={payment.member} disabled />
          ) : (
            <select value={form.memberId} onChange={update('memberId')}>
              {members.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          )}
        </div>
        <div className="form-field">
          <label>Plan</label>
          <select value={form.plan} onChange={update('plan')}>
            {plans.map(p => (
              <option key={p.id} value={p.name}>{p.name}</option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label>Amount</label>
          <input required type="number" min="0" value={form.amount} onChange={update('amount')} />
        </div>
        <div className="form-field">
          <label>Date</label>
          <input required type="date" value={form.date} onChange={update('date')} />
        </div>
        <div className="form-field">
          <label>Status</label>
          <select value={form.status} onChange={update('status')}>
            <option>Paid</option>
            <option>Pending</option>
            <option>Failed</option>
          </select>
        </div>
      </form>
    </Modal>
  );
}
