export default function StatCard({ label, value, delta, deltaDirection }) {
  return (
    <div className="card stat-card">
      <div className="stat-card-label">{label}</div>
      <div className="stat-card-value">{value}</div>
      {delta && (
        <div className={`stat-card-delta ${deltaDirection}`}>
          {deltaDirection === 'up' ? '▲' : '▼'} {delta}
        </div>
      )}
      <svg className="stat-card-pulse" viewBox="0 0 200 34" preserveAspectRatio="none">
        <path
          d="M0,24 L30,24 L40,8 L52,30 L62,16 L72,24 L110,24 L120,4 L132,32 L145,24 L200,24"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
