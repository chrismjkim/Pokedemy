function StatsList ({stats}) {

  const apiBase = import.meta.env.VITE_API_URL;

  return (
    <div className="stats-list fill-column">
      {stats.map((m, idx) => (
        <div className="stat-row" key={m.id ?? idx}>
          <div className="stat-rank">
            <div className="ranking text-subtitle">{idx + 1}</div>
          </div>
          <div className="sprite-and-name fill-row">
            <div className="sprite-wrap sprite-s">
              <img src={`${apiBase}${m.sprite_url || ''}`} className="sprite-s" alt="type" />
            </div>
            <div className="name">{m.pokemon_species_id?.name_ko}</div>
          </div>
        </div>
      ))}
    </div>
    );
}

export default StatsList;