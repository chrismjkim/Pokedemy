import React, { useEffect, useState } from "react";
import "../styles/Sidebar.css";
import api from "../api";

function Sidebar() {
  const [pokemons, setPokemons] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getPokemons = async () => {
      try {
        const res = await api.get("/api/pokemons/");
        setPokemons(res.data);
      } catch (err) {
        console.error("Failed to fetch pokemons", err);
        setError("포켓몬 목록을 불러오지 못했습니다.");
      }
    };

    getPokemons();
  }, []);

  return (
    <aside className="sidebar">
      <p className="sidebar__label">Sidebar</p>

      {error && <p className="sidebar__error">{error}</p>}

      {!error && pokemons.length === 0 ? (
        <p className="sidebar__empty">불러온 포켓몬이 없습니다.</p>
      ) : (
        <ul className="sidebar__list">
          {pokemons.map((p) => (
            <li key={p.pokemon_species_id ?? p.name}>
              <div className="sidebar__pokemon-name">
                {p.pokemon_species_id?.name_ko}
                {p.name_ko ? ` - (${p.name_ko})` : ""}
              </div>

            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}

export default Sidebar;
