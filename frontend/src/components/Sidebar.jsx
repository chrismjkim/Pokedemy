import React, { useEffect, useState } from "react";
import "../styles/Sidebar.css";
import api from "../api";
import MatchDropdownList from "./MatchDropdownList";
import MatchPokemonRankingList from "./MatchPokemonRankingList";

function Sidebar() {

  const [selectedMatch, setSelectedMatch] = useState(""); // 선택된 매치
  const [error, setError] = useState(null);

  useEffect(() => {

  }, []);

  return (
    <aside className="sidebar">
      <div className="sidebar-content">
      <MatchDropdownList 
        selectedMatch={selectedMatch} 
        setSelectedMatch={setSelectedMatch}
      />
      <div className="info-area">
        <p className="info-title">포켓몬 랭킹</p>
        <MatchPokemonRankingList 
          selectedMatch={selectedMatch} 
          setSelectedMatch={setSelectedMatch}
        />
      </div>
      </div>


      {error && <p className="sidebar__error">{error}</p>}
    </aside>
  );
}

export default Sidebar;
