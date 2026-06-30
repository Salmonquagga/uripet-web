interface StatCardProps {
  icon: string;
  value: string;
  label: string;
  note?: string;
}

function StatCard({ icon, value, label, note }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <div className="stat-icon">{icon}</div>
        {note && <span>{note}</span>}
      </div>

      <h3>{value}</h3>
      <p>{label}</p>
    </div>
  );
}

export default StatCard;