import React, { useEffect, useState } from "react";
// import "../styles/MatchDropdownList.css";
import api from "../api";

function MatchDropdownList() {
    const [matches, setMatches] = useState([]);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
    const getMatches = async () => {
      try {
        const res = await api.get("/api/matches/");
        setMatches(res.data);
      } catch (err) {
        console.error("Failed to fetch matches", err);
        setError("시즌 목록을 불러오지 못했습니다.");
      }
    };

    getMatches();
  }, []);

  return (
    <div className="match-dropdown">
      <button
        type="button"
        className="match-dropdown__toggle"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        {open ? "시즌 닫기" : "시즌 보기"}
      </button>

      {error && <p className="match-dropdown__error">{error}</p>}

      {!error && matches.length === 0 && (
        <p className="match-dropdown__empty">불러온 시즌이 없습니다.</p>
      )}

      {open && !error && matches.length > 0 && (
        <ul className="match-dropdown__list">
          {matches.map((match) => (
            <li key={match.id ?? match.name} className="match-dropdown__item">
              <span className="match-dropdown__name">{match.name}</span>
              <span className="match-dropdown__rule"> - {match.rule}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default MatchDropdownList;
