import { useEffect, useState } from "react";
import { useStore } from "../store/Store";

import api from "../api";
import PokemonCard from "./PokemonCard";
import "../styles/MatchPokemonRankingList.css"

function MatchPokemonRankingList() {
  const [pokemons, setPokemons] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const selectedMatch = useStore((s) => s.selectedMatch);

  const getPokemons = async (selectedMatch) => {
    try {
      setLoading(true);
      const res = await api.get(`/api/pokemons/${selectedMatch.cid}/`);
      setPokemons(res.data);
    } catch (err) {
      console.error("Failed to fetch matches", err);
      setError("포켓몬 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

    useEffect(() => {
      // 선택된 매치가 없으면 요청을 건너뛰도록 가드
      if (!selectedMatch) return;
      // MatchDropdownList에서 selectedMatch가 생기면 getPokemons 호출
      getPokemons(selectedMatch);
    }, [selectedMatch]);

  return (
    <div className="scrollable">
      {loading && (
        <div className="loading-overlay" aria-live="polite" aria-busy="true">
          <div className="loading-spinner" />
        </div>
      )}
      {pokemons.map((p) => (
        <div key={p.id}>
          <PokemonCard pokemon={p} />
        </div>
      ))}
    </div>
  );
}

export default MatchPokemonRankingList;
