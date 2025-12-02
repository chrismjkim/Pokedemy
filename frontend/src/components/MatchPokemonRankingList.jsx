import { useEffect, useState } from "react";
import api from "../api";
import PokemonCard from "./PokemonCard";

// selectedMatch: cid 문자열
function MatchPokemonRankingList({selectedMatch, setSelectedMatch}) {
  const [pokemons, setPokemons] = useState([]);
  const [error, setError] = useState(null);

  const getPokemons = async (selectedMatch) => {
    try {
      const res = await api.get(`/api/pokemons/${selectedMatch}/`);
      setPokemons(res.data);
    } catch (err) {
      console.error("Failed to fetch matches", err);
      setError("포켓몬 목록을 불러오지 못했습니다.");
    }
  };

    useEffect(() => {
      // 선택된 매치가 없으면 요청을 건너뛰도록 가드
      if (!selectedMatch) return;
      // MatchDropdownList에서 selectedMatch가 생기면 getPokemons 호출
      getPokemons(selectedMatch);
    }, [selectedMatch]);

  return (
    <div>
      {pokemons.map((p) => (
        <div key={p.id}>
          <PokemonCard pokemon={p} />
        </div>
      ))}
    </div>
  );
}

export default MatchPokemonRankingList;
