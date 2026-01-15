import { useState } from "react";
import { usePokemonStatsData } from "../../hooks/usePokemonStatsData";

import "../../styles/PokemonStats.css";

import StatsItemList from "./StatsList/StatsItemList";
import StatsMoveList from "./StatsList/StatsMoveList";
import StatsNatureList from "./StatsList/StatsNatureList";
import StatsPokemonList from "./StatsList/StatsPokemonList";
import StatsTypeList from "./StatsList/StatsTypeList";

function PokemonStats () {

  const [viewMode, setViewMode] = useState("stats"); // stats | matchup
  
  const {
    detail,
    isLoadingPDetails,
    moves,
    items,
    natures,
    teraTypes,
    winPokemons,
    losePokemons,
    winMoves,
    loseMoves,
  } = usePokemonStatsData();

  if (!detail) return <div className="">포켓몬을 선택하세요</div>;

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
              <StatsTypeList stats={teraTypes} />
            </div>
          </div>
        </div>
      ) : (
        <div className="stats-table card-white fill-column">
          <div className="stats-grid fill-row">
            <div className="stats-chart fill-column">
              <div className="stats-title fill-column text-subtitle">쓰러뜨린 상대 포켓몬 TOP 10</div>
              <StatsPokemonList stats={winPokemons} />
            </div>
            <div className="stats-chart fill-column">
              <div className="stats-title fill-column text-subtitle">상대를 쓰러뜨릴 때 사용한 기술 TOP 10</div>
              <StatsMoveList stats={winMoves} />
            </div>
          </div>
          <div className="stats-grid fill-row">
            <div className="stats-chart fill-column">
              <div className="stats-title fill-column text-subtitle">이 포켓몬을 쓰러뜨린 포켓몬 TOP 10</div>
              <StatsPokemonList stats={losePokemons} />
            </div>
            <div className="stats-chart fill-column">
              <div className="stats-title fill-column text-subtitle">쓰러질 때 받은 기술 TOP 10</div>
              <StatsMoveList stats={loseMoves} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PokemonStats;
