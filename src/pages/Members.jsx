import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Pencil, Trash2 } from 'lucide-react';
import Badge from '../components/Badge';
import EmptyState from '../components/EmptyState';
import AddMemberModal from '../components/AddMemberModal';
import ConfirmDialog from '../components/ConfirmDialog';
import { useMembers } from '../context/MembersContext';
import { useMemberships } from '../context/MembershipsContext';

export default function Members() {
  const { members, addMember, updateMember, deleteMember } = useMembers();
  const { plans } = useMemberships();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [planFilter, setPlanFilter] = useState('All');
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const filtered = useMemo(() => {
    return members.filter(m => {
      const matchesQuery =
        m.name.toLowerCase().includes(query.toLowerCase()) ||
        m.phone.includes(query);
      const matchesStatus = statusFilter === 'All' || m.status === statusFilter;
      const matchesPlan = planFilter === 'All' || m.plan === planFilter;
      return matchesQuery && matchesStatus && matchesPlan;
    });
  }, [members, query, statusFilter, planFilter]);

  return (
    <div>
      <h1 className="page-title">Members</h1>
      <p className="page-subtitle">{members.length} total members registered</p>

      <div className="toolbar">
        <div className="search-box">
          <Search size={15} />
          <input
            placeholder="Search by name or phone..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select className="select-filter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Expiring">Expiring</option>
          <option value="Expired">Expired</option>
        </select>
        <select className="select-filter" value={planFilter} onChange={(e) => setPlanFilter(e.target.value)}>
          <option value="All">All Plans</option>
          {plans.map(p => (
            <option key={p.id} value={p.name}>{p.name}</option>
          ))}
        </select>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
          <Plus size={15} /> Add Member
        </button>
      </div>

      <div className="card">
        {filtered.length === 0 ? (
          <EmptyState title="No members found" description="Try adjusting your search or filters." />
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Phone</th>
                  <th>Membership</th>
                  <th>Status</th>
                  <th>Join Date</th>
                  <th>Expiry</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(m => (
                  <tr key={m.id} onClick={() => navigate(`/members/${m.id}`)}>
                    <td className="cell-primary">
                      <div className="avatar" style={{ width: 28, height: 28, fontSize: 11 }}>
                        {m.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      {m.name}
                    </td>
                    <td className="cell-muted">{m.phone}</td>
                    <td className="cell-muted">{m.plan}</td>
                    <td><Badge status={m.status} /></td>
                    <td className="cell-muted">{m.joinDate}</td>
                    <td className="cell-muted">{m.expiryDate}</td>
                    <td>
                      <div className="row-actions" onClick={(e) => e.stopPropagation()}>
                        <button className="icon-btn" onClick={() => setEditing(m)} aria-label="Edit">
                          <Pencil size={15} />
                        </button>
                        <button className="icon-btn danger" onClick={() => setDeleting(m)} aria-label="Delete">
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
        <AddMemberModal
          onClose={() => setShowAdd(false)}
          onSubmit={(data) => { addMember(data); setShowAdd(false); }}
        />
      )}

      {editing && (
        <AddMemberModal
          initialData={editing}
          onClose={() => setEditing(null)}
          onSubmit={(data) => { updateMember(editing.id, data); setEditing(null); }}
        />
      )}

      {deleting && (
        <ConfirmDialog
          title="Remove Member"
          message={`Are you sure you want to remove ${deleting.name}? This action cannot be undone.`}
          confirmLabel="Delete"
          danger
          onCancel={() => setDeleting(null)}
          onConfirm={() => { deleteMember(deleting.id); setDeleting(null); }}
        />
      )}
    </div>
  );
}
