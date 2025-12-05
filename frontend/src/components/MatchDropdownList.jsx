import React, { useEffect, useState } from "react";
import "../styles/MatchDropdownList.css";
import { useStore } from "../store/Store";
import api from "../api";

function MatchDropdownList() {
  const [rule, setRule] = useState("single"); // 매치 룰(싱글/더블)
  const [matches, setMatches] = useState([]); // 매치 목록
  const [error, setError] = useState(null); // 에러

  const match = useStore((s) => s.selectedMatch);
  const setMatch = useStore((s) => s.setSelectedMatch);

  const pokemonDetails = useStore((s) => s.pokemonDetails);
  const setPokemonDetails = useStore((s) => s.setPokemonDetails);

  const getMatches = async (rule) => {
    try {
      const res = await api.get(`/api/matches/${rule}/`);
      setMatches(res.data);
      // 룰이 바뀔 때마다 해당 룰의 첫 번째 매치를 기본 선택값으로 반영해
      // 하위 랭킹 리스트가 즉시 갱신되도록 한다.
      if (res.data.length > 0) {
        setMatch(res.data[0].cid);
      } else {
        setMatch("");
      }
    } catch (err) {
      console.error("Failed to fetch matches", err);
      setError("시즌 목록을 불러오지 못했습니다.");
    }
  };
  
  const getPDetails = async (match) => {
    try {
      if (match != "") {
        const res = await api.get(`/api/pdetails/${match}/`);
        setPokemonDetails(res.data);
        console.log("PokemonDetails setted");
      } else {
        setPokemonDetails("");
      } 
    } catch (err) {
      console.error("Failed to fetch further information", err);
      setError("세부정보를 불러오지 못했습니다.");
    }
  };
  

  useEffect(() => {
    getMatches(rule);
  }, [rule]);

  // 선택된 매치가 바뀔 때마다 상세 정보를 다시 불러온다
  useEffect(() => {
    if (match) {
      getPDetails(match);
    } else {
      setPokemonDetails("");
    }
  }, [match]);

  return (
    <div className="info-area-match">
      <p className="info-title">시즌 정보</p>
      <div className="info-box">
        <div className="radio-group">
          <label>
            <input type="radio" name="rule" value="single"
            checked={rule === "single"} onChange={() => setRule("single")}
            />
            싱글
          </label>
          <label>
            <input
              type="radio" name="rule" value="double"
              checked={rule === "double"} onChange={() => setRule("double")}
            />
            더블
          </label>
        </div>
        {/* 시즌 드롭다운 */}
        <select className="season-list text-body"
          value={match}
          onChange={(e) => setMatch(e.target.value)}
        >
          {matches.map((m) => (
            <option className="center-input" key={m.cid} value={m.cid}>{m.name} ({m.start} - {m.end})</option>
          ))}

        </select>
      </div>

    </div>
  );
}

export default MatchDropdownList;
