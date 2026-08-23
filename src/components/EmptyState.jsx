import { SearchX } from 'lucide-react';

export default function EmptyState({ title, description }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon"><SearchX size={22} /></div>
      <div className="empty-state-title">{title}</div>
      <div className="empty-state-desc">{description}</div>
    </div>
  );
}
