import { useEffect, useState } from "react";
import api from "../api";

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
      getPokemons(selectedMatch);
    }, [selectedMatch]);

  return (
    <div>
      {pokemons.map((p) => (
          <div>
            <p>{p.pokemon_species_id?.name_ko}
            {p.name_ko ? ` - (${p.name_ko})` : ""}</p>
          </div>
        ))}
    </div>
  );
}

export default MatchPokemonRankingList;