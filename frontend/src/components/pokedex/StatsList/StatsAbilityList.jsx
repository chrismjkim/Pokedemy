function StatsList ({stats}) {

  const apiBase = import.meta.env.VITE_API_URL;

  return (
    <div className="stats-list">
      {stats.map((m, idx) => (
        <div className="fill-column" key={m.id ?? idx}>
          #{idx + 1} {m.name_ko || m.name || m.id} ({m.usage_rate}%)
        </div>
      ))}
    </div>
    );
}

export default StatsList;