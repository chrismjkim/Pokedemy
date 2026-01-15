import { useMatchPokemonRankingData } from "../../hooks/useMatchPokemonRankingData";
import PokemonCard from "./PokemonCard";
import "../../styles/MatchPokemonRankingList.css";

function MatchPokemonRankingList() {
  const { pokemons, loading } = useMatchPokemonRankingData();

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
