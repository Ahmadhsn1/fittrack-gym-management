import { useState, useMemo } from 'react';
import { Search, Plus, Pencil, Trash2 } from 'lucide-react';
import Badge from '../components/Badge';
import EmptyState from '../components/EmptyState';
import EditPaymentModal from '../components/EditPaymentModal';
import ConfirmDialog from '../components/ConfirmDialog';
import { usePayments } from '../context/PaymentsContext';

export default function Payments() {
  const { payments, addPayment, updatePayment, deletePayment } = usePayments();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const filtered = useMemo(() => {
    return payments.filter(p => {
      const matchesQuery = p.member.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [payments, query, statusFilter]);

  const totalPaid = payments.filter(p => p.status === 'Paid').reduce((s, p) => s + p.amount, 0);
  const totalPending = payments.filter(p => p.status === 'Pending').reduce((s, p) => s + p.amount, 0);

  return (
    <div>
      <h1 className="page-title">Payments</h1>
      <p className="page-subtitle">
        Rs. {totalPaid.toLocaleString()} collected · Rs. {totalPending.toLocaleString()} pending
      </p>

      <div className="toolbar">
        <div className="search-box">
          <Search size={15} />
          <input placeholder="Search by member..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <select className="select-filter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="All">All Status</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
          <option value="Failed">Failed</option>
        </select>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
          <Plus size={15} /> Add Payment
        </button>
      </div>

      <div className="card">
        {filtered.length === 0 ? (
          <EmptyState title="No payments found" description="Try adjusting your search or filters." />
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Plan</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id}>
                    <td className="cell-primary">{p.member}</td>
                    <td className="cell-muted">{p.plan}</td>
                    <td style={{ fontWeight: 500 }}>Rs. {p.amount.toLocaleString()}</td>
                    <td className="cell-muted">{p.date}</td>
                    <td><Badge status={p.status} /></td>
                    <td>
                      <div className="row-actions">
                        <button className="icon-btn" onClick={() => setEditing(p)} aria-label="Edit">
                          <Pencil size={15} />
                        </button>
                        <button className="icon-btn danger" onClick={() => setDeleting(p)} aria-label="Delete">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showAdd && (
        <EditPaymentModal
          onClose={() => setShowAdd(false)}
          onSubmit={(data) => { addPayment(data); setShowAdd(false); }}
        />
      )}

      {editing && (
        <EditPaymentModal
          payment={editing}
          onClose={() => setEditing(null)}
          onSubmit={(data) => { updatePayment(editing.id, data); setEditing(null); }}
        />
      )}

      {deleting && (
        <ConfirmDialog
          title="Remove Payment"
          message={`Are you sure you want to remove this payment record for ${deleting.member}? This action cannot be undone.`}
          confirmLabel="Delete"
          danger
          onCancel={() => setDeleting(null)}
          onConfirm={() => { deletePayment(deleting.id); setDeleting(null); }}
        />
      )}
    </div>
  );
}
