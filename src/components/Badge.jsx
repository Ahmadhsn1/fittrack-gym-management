const map = {
  Active: 'badge-active',
  Expiring: 'badge-expiring',
  Expired: 'badge-expired',
  Paid: 'badge-paid',
  Pending: 'badge-pending',
  Failed: 'badge-failed',
  Present: 'badge-present',
  Absent: 'badge-absent',
};

export default function Badge({ status }) {
  const cls = map[status] || 'badge-active';
  return <span className={`badge ${cls}`}>{status}</span>;
}
