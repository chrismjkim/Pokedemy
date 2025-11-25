import React, { useEffect, useState } from "react";
import "../styles/Sidebar.css";
import api from "../../api";

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
              {p.name}
              <span className="sidebar__name">HP: {p.hp}</span>
              <span className="sidebar__name">ATK: {p.attack}</span>
              <span className="sidebar__name">DEF: {p.defense}</span>
              <span className="sidebar__name">SPA: {p.special_attack}</span>
              <span className="sidebar__name">SPD: {p.special_defense}</span>
              <span className="sidebar__name">SPE: {p.speed}</span>
              {/* 필요하면 타입도 함께 표시 */}
              {/* <span className="sidebar__type">{p.type1_id}</span> */}
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}

export default Sidebar;
