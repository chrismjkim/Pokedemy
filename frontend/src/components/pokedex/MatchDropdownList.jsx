import React, { useEffect, useRef, useState } from "react";
import "../../styles/MatchDropdownList.css";
import { useStore } from "../../store/Store";
import api from "../../api";

function MatchDropdownList() {
  const [error, setError] = useState(null); // 에러

  const rule = useStore((s) => s.selectedRule);
  const setRule = useStore((s) => s.setSelectedRule);
  // 매치 목록
  const matchesByRule = useStore((s) => s.matchesByRule);
  // 싱글, 더블에 따라 매치 목록을 만듦
  const setMatchesByRule = useStore((s) => s.setMatchesByRule);

  // 현재 설정된 매치
  const match = useStore((s) => s.selectedMatch);
  const setMatch = useStore((s) => s.setSelectedMatch);

  // 현재 선택된 포켓몬에 대한 상세 데이터
  const setPokemonDetails = useStore((s) => s.setPokemonDetails);
  const pokemonDetailsByMatch = useStore((s) => s.pokemonDetailsByMatch);
  const setPokemonDetailsForMatch = useStore((s) => s.setPokemonDetailsForMatch);

  // 로딩 중 bool
  const setIsLoadingPDetails = useStore((s) => s.setIsLoadingPDetails);
  const pendingDetailsRef = useRef(new Set());
  const pendingMatchesRef = useRef(new Set());

  const matches = matchesByRule?.[rule] ?? [];

  const getMatches = async (rule) => {
    try {
      if (pendingMatchesRef.current.has(rule)) {
        return;
      }
      pendingMatchesRef.current.add(rule);
      const res = await api.get(`/api/matches/${rule}/`);
      setMatchesByRule(rule, res.data);
      // 룰이 바뀔 때마다 해당 룰의 첫 번째 매치를 기본 선택값으로 반영해
      // 하위 랭킹 리스트가 즉시 갱신되도록 한다.
      if (res.data.length > 0) {
        const nextMatch =
          match && res.data.some((m) => m.cid === match.cid)
            ? match
            : res.data[0];
        setMatch(nextMatch);
      } else {
        setMatch(null);
      }
    } catch (err) {
      console.error("Failed to fetch matches", err);
      setError("시즌 목록을 불러오지 못했습니다.");
    } finally {
      pendingMatchesRef.current.delete(rule);
    }
  };
  
  const getPDetails = async (match) => {
    try {
      if (match && match.cid) {
        const cached = pokemonDetailsByMatch?.[match.cid];
        if (cached) {
          setPokemonDetails(cached);
          return;
        }
        if (pendingDetailsRef.current.has(match.cid)) {
          return;
        }
        pendingDetailsRef.current.add(match.cid);
        setIsLoadingPDetails(true);
        const res = await api.get(`/api/pdetails/${match.cid}/`);
        setPokemonDetails(res.data);
        setPokemonDetailsForMatch(match.cid, res.data);
        console.log("PokemonDetails setted");
        setIsLoadingPDetails(false);
        pendingDetailsRef.current.delete(match.cid);
      }
    } catch (err) {
      console.error("Failed to fetch further information", err);
      setError("세부정보를 불러오지 못했습니다.");
      setIsLoadingPDetails(false);
      if (match?.cid) {
        pendingDetailsRef.current.delete(match.cid);
      }
    }
  };
  

  useEffect(() => {
    if (matches.length === 0) {
      getMatches(rule);
    } else if (!match && matches.length > 0) {
      setMatch(matches[0]);
    }
  }, [rule, matches, match]);

  // 선택된 매치가 바뀔 때마다 상세 정보를 다시 불러온다
  useEffect(() => {
    if (match && match.cid) {
      getPDetails(match);
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
          value={match?.cid || ""}
          onChange={(e) => {
            const next = matches.find((m) => m.cid === e.target.value);
            setMatch(next || null);
          }}
        >
          {matches.map((m) => (
            <option className="center-input" key={m.cid} value={m.cid}>{m.name} ({m.start} - {m.end})</option>
          ))}

        </select>
        {match && (
          <span>
            총 {match.cnt}명, 마스터볼 이상 {match.rank_cnt}명
          </span>
        )}
      </div>

    </div>
  );
}

export default MatchDropdownList;
