import React, { useEffect, useState } from "react";
import { useStore } from "../store/Store"; 
import "../styles/Sidebar.css";
import api from "../api";
import MatchDropdownList from "./MatchDropdownList";
import MatchPokemonRankingList from "./MatchPokemonRankingList";

function Sidebar() {

  const [error, setError] = useState(null);

  const selectedMatch = useStore((s) => s.selectedMatch); // 선택된 매치
  const setSelectedMatch = useStore((s) => s.setSelectedMatch);

  useEffect(() => {

  }, []);

  return (
    <aside className="sidebar">
      <div className="sidebar-content">
      <MatchDropdownList />
      <div className="info-area">
        <p className="info-title">포켓몬 랭킹</p>
        <MatchPokemonRankingList />
      </div>
      </div>


      {error && <p className="sidebar__error">{error}</p>}
    </aside>
  );
}

export default Sidebar;
