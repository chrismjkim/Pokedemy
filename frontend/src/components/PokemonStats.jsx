import { useEffect, useState } from "react";
import { useStore } from "../store/Store";
import api from "../api";

function PokemonStats () {

  const [error, setError] =useState(null);

const selected = useStore((s) => s.selectedPokemon);
const pdetails = useStore((s) => s.pokemonDetails);

const p_id = selected ? String(selected.pokemon_species_id.id) : null;
const p_form = selected ? String(selected.form ?? 0) : null;
const detail = p_id && p_form ? pdetails?.[p_id]?.[p_form] : null;

if (!detail) return <div>포켓몬을 선택하세요</div>;

const moves = detail?.temoti?.waza
  ? Object.values(detail.temoti.waza)
  : [];

return (
  <div>
    {moves.slice(0, 10).map((m, idx) => (
      <div key={m.id ?? idx}>
        {idx + 1}. {m.name_ko || m.name || m.id} ({m.usage_rate ?? m.val}%)
      </div>
    ))}
  </div>
);
}

export default PokemonStats;