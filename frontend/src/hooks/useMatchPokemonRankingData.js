import { useEffect, useRef, useState } from "react";
import { useStore } from "../store/Store";
import api from "../api";

export function useMatchPokemonRankingData() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const selectedMatch = useStore((s) => s.selectedMatch);
  const pokemonsByMatch = useStore((s) => s.pokemonsByMatch);
  const setPokemonsForMatch = useStore((s) => s.setPokemonsForMatch);
  const pendingPokemonsRef = useRef(new Set());

  const pokemons =
    (selectedMatch && pokemonsByMatch?.[selectedMatch.cid]) || [];

  const getPokemons = async (matchValue) => {
    try {
      if (pendingPokemonsRef.current.has(matchValue.cid)) {
        return;
      }
      pendingPokemonsRef.current.add(matchValue.cid);
      setLoading(true);
      const res = await api.get(`/api/pokemons/${matchValue.cid}/`);
      setPokemonsForMatch(matchValue.cid, res.data);
    } catch (err) {
      console.error("Failed to fetch matches", err);
      setError("포켓몬 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
      if (matchValue?.cid) {
        pendingPokemonsRef.current.delete(matchValue.cid);
      }
    }
  };

  useEffect(() => {
    if (!selectedMatch) return;
    if (!pokemonsByMatch?.[selectedMatch.cid]) {
      getPokemons(selectedMatch);
    }
  }, [selectedMatch, pokemonsByMatch]);

  return { pokemons, loading, error };
}
