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
  ? Object.values(detail.temoti.waza) : [];

const items = detail?.temoti?.motimono
  ? Object.values(detail.temoti.motimono) : [];

const natures = detail?.temoti?.seikaku
  ? Object.values(detail.temoti.seikaku) : [];

const abilities = detail?.temoti?.tokusei
  ? Object.values(detail.temoti.tokusei) : [];

const tera_types = detail?.temoti?.terastal
  ? Object.values(detail.temoti.terastal) : [];
return (
  <div>
    {moves.map((m, idx) => (
      <div className="moves" key={m.id ?? idx}>
        {idx + 1}. {m.name_ko || m.name || m.id} ({m.usage_rate ?? m.val}%)
      </div>
    ))}

    {items.map((m, idx) => (
      <div className="items" key={m.id ?? idx}>
        {idx + 1}. {m.name_ko || m.name || m.id} ({m.usage_rate ?? m.val}%)
      </div>
    ))}

    {natures.map((m, idx) => (
      <div className="natures" key={m.id ?? idx}>
        {idx + 1}. {m.name_ko || m.name || m.id} ({m.usage_rate ?? m.val}%)
      </div>
    ))}

    {abilities.map((m, idx) => (
      <div className="abilities" key={m.id ?? idx}>
        {idx + 1}. {m.name_ko || m.name || m.id} ({m.usage_rate ?? m.val}%)
      </div>
    ))}

    {tera_types.map((m, idx) => (
      <div className="terastal-types" key={m.id ?? idx}>
        {idx + 1}. {m.name_ko || m.name || m.id} ({m.usage_rate ?? m.val}%)
      </div>
    ))}

  </div>
);
}

export default PokemonStats;