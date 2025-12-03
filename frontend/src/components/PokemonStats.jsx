import { useEffect, useState } from "react";
import { useStore } from "../store/Store";
import api from "../api";

function PokemonStats () {

  const [stats, setStats] = useState();
  const [error, setError] =useState(null);

  const match = useStore((s) => s.selectedMatch);
  const pokemon = useStore((s) => s.selectedPokemon);

  const getStats = async (match, pokemon) => {
    try {
      const res = api.get(``);
    } catch (err) {
      console.error("Failed to fetch matches", err);
      setError("포켓몬 목록을 불러오지 못했습니다.");
    }
  }
  return (
    <>
    something
    </>
  )
}

export default PokemonStats;