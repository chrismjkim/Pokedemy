import { useState } from "react";
import { useStore } from "../store/Store";
import api from "../api";

import "../styles/PokemonStats.css";

import StatsAbilityList from "./StatsList/StatsAbilityList";
import StatsItemList from "./StatsList/StatsItemList";
import StatsMoveList from "./StatsList/StatsMoveList";
import StatsNatureList from "./StatsList/StatsNatureList";
import StatsPokemonList from "./StatsList/StatsPokemonList";
import StatsTypeList from "./StatsList/StatsTypeList";

function PokemonStats () {

  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("stats"); // stats | matchup

  const selected = useStore((s) => s.selectedPokemon);
  const selectedMatch = useStore((s) => s.selectedMatch);
  const pdetails = useStore((s) => s.pokemonDetails);
  const isLoadingPDetails = useStore((s) => s.isLoadingPDetails);

  const p_id = selected ? String(selected.pokemon_species_id.id) : null;
  const p_form = selected ? String(selected.form ?? 0) : null;
  const detail = p_id && p_form ? pdetails?.[p_id]?.[p_form] : null;

  if (!detail) return <div className="">포켓몬을 선택하세요</div>;

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

  const team_members = detail?.temoti?.pokemon
  ? Object.values(detail.temoti.pokemon) : [];

  const win_pokemons = detail?.win?.pokemon
  ? Object.values(detail.win.pokemon) : [];

  const lose_pokemons = detail?.lose?.pokemon
  ? Object.values(detail.lose.pokemon) : [];

  const win_moves = detail?.win?.waza
  ? Object.values(detail.win.waza) : [];

  const lose_moves = detail?.lose?.waza
  ? Object.values(detail.lose.waza) : [];

return (
  <div className="fill-column stats-wrapper">
    {isLoadingPDetails && (
      <div className="loading-overlay" aria-live="polite" aria-busy="true">
        <div className="loading-spinner" />
      </div>
    )}
    <div className="view-toggle card-white">
      <button
        type="button"
        className={`view-option ${viewMode === "stats" ? "active" : ""} text-subtitle`}
        onClick={() => setViewMode("stats")}
      >
        통계 상세
      </button>
      <button
        type="button"
        className={`view-option ${viewMode === "matchup" ? "active" : ""} text-subtitle`}
        onClick={() => setViewMode("matchup")}
      >
        상성 보기
      </button>
    </div>

    {viewMode === "stats" ? (
      <div className="stats-table card-white fill-column">
        <div className="stats-grid fill-row">
          <div className="stats-chart fill-column">
            <div className="stats-title fill-column text-subtitle">기술 TOP 10</div>
            <StatsMoveList stats={moves} />
          </div>
          <div className="stats-chart fill-column">
            <div className="stats-title fill-column text-subtitle">지닌물건 TOP 10</div>
            <StatsItemList stats={items} />
          </div>
        </div>
        <div className="stats-grid fill-row">
          <div className="stats-chart fill-column">
            <div className="stats-title fill-column text-subtitle">성격 TOP 10</div>
            <StatsNatureList stats={natures} />
          </div>
          <div className="stats-chart fill-column">
            <div className="stats-title fill-column text-subtitle">테라스탈타입 TOP 10</div>
            <StatsTypeList stats={tera_types} />
          </div>
        </div>
      </div>
    ) : (
      <div className="stats-table card-white fill-column">
        <div className="stats-grid fill-row">
          <div className="stats-chart fill-column">
            <div className="stats-title fill-column text-subtitle">쓰러뜨린 상대 포켓몬 TOP 10</div>
            <StatsPokemonList stats={win_pokemons} />
          </div>
          <div className="stats-chart fill-column">
            <div className="stats-title fill-column text-subtitle">상대를 쓰러뜨릴 때 사용한 기술 TOP 10</div>
            <StatsMoveList stats={win_moves} />
          </div>
        </div>
        <div className="stats-grid fill-row">
          <div className="stats-chart fill-column">
            <div className="stats-title fill-column text-subtitle">이 포켓몬을 쓰러뜨린 포켓몬 TOP 10</div>
            <StatsPokemonList stats={lose_pokemons} />
          </div>
          <div className="stats-chart fill-column">
            <div className="stats-title fill-column text-subtitle">쓰러질 때 받은 기술 TOP 10</div>
            <StatsMoveList stats={lose_moves} />
          </div>
        </div>
      </div>
    )}
  </div>
);
}

export default PokemonStats;
