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
      <p className="sidebar__label">Sidebar</p>
      <MatchDropdownList 
        selectedMatch={selectedMatch} 
        setSelectedMatch={setSelectedMatch}
      />
      <MatchPokemonRankingList 
        selectedMatch={selectedMatch} 
        setSelectedMatch={setSelectedMatch}
      />
      {error && <p className="sidebar__error">{error}</p>}
    </aside>
  );
}

export default Sidebar;
