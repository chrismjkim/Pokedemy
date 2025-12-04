import { useEffect, useState } from "react";
import { useStore } from "../store/Store";
import api from "../api";

function PokemonStats () {

  const [error, setError] =useState(null);

  const selected = useStore((s) => s.selectedPokemon);
  const pdetails = useStore((s) => s.pokemonDetails);

  const detail =
    selected && pdetails
      ? pdetails?.[String(selected.id)]?.[String(selected.form ?? 0)]
      : null;

  if (!detail) return <div>포켓몬을 선택하세요</div>;
  return <p>{detail.temoti.waza[0].id}, {detail.temoti.waza[0].val} %</p>;
}

export default PokemonStats;