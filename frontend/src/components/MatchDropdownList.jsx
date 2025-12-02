import React, { useEffect, useState } from "react";
// import "../styles/MatchDropdownList.css";
import api from "../api";

function MatchDropdownList({selectedMatch, setSelectedMatch}) {
  const [rule, setRule] = useState("single"); // 매치 룰(싱글/더블)
  const [matches, setMatches] = useState([]); // 매치 목록
  const [error, setError] = useState(null); // 에러

  const getMatches = async (rule) => {
    try {
      const res = await api.get(`/api/matches/${rule}/`);
      setMatches(res.data);
      // 룰이 바뀔 때마다 해당 룰의 첫 번째 매치를 기본 선택값으로 반영해
      // 하위 랭킹 리스트가 즉시 갱신되도록 한다.
      if (res.data.length > 0) {
        setSelectedMatch(res.data[0].cid);
      } else {
        setSelectedMatch("");
      }
    } catch (err) {
      console.error("Failed to fetch matches", err);
      setError("시즌 목록을 불러오지 못했습니다.");
    }
  };

  useEffect(() => {
    getMatches(rule);
  }, [rule]);

  return (
    <div className="season-box">
      {/* 라디오 버튼 */}
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
      <select
        value={selectedMatch}
        onChange={(e) => setSelectedMatch(e.target.value)}
      >
        {matches.map((m) => (
          <option key={m.cid} value={m.cid}>{m.name} - {m.rule}</option>
        ))}

      </select>

    </div>
  );
}

export default MatchDropdownList;
