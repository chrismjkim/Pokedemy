import { useEffect, useRef, useState } from "react";
import { useStore } from "../store/Store";
import api from "../api";

export function useMatchDropdownData() {
  const [error, setError] = useState(null);

  const rule = useStore((s) => s.selectedRule);
  const setRule = useStore((s) => s.setSelectedRule);

  const matchesByRule = useStore((s) => s.matchesByRule);
  const setMatchesByRule = useStore((s) => s.setMatchesByRule);

  const match = useStore((s) => s.selectedMatch);
  const setMatch = useStore((s) => s.setSelectedMatch);

  const pokemonDetailsByMatch = useStore((s) => s.pokemonDetailsByMatch);
  const setPokemonDetailsForMatch = useStore((s) => s.setPokemonDetailsForMatch);
  const setIsLoadingPDetails = useStore((s) => s.setIsLoadingPDetails);

  const pendingDetailsRef = useRef(new Set());
  const pendingMatchesRef = useRef(new Set());

  const matches = matchesByRule?.[rule] ?? [];

  const getMatches = async (ruleValue) => {
    try {
      if (pendingMatchesRef.current.has(ruleValue)) {
        return;
      }
      pendingMatchesRef.current.add(ruleValue);
      const res = await api.get(`/api/matches/${ruleValue}/`);
      setMatchesByRule(ruleValue, res.data);
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
      pendingMatchesRef.current.delete(ruleValue);
    }
  };

  const getPDetails = async (matchValue) => {
    try {
      if (matchValue && matchValue.cid) {
        const cached = pokemonDetailsByMatch?.[matchValue.cid];
        if (cached) {
          return;
        }
        if (pendingDetailsRef.current.has(matchValue.cid)) {
          return;
        }
        pendingDetailsRef.current.add(matchValue.cid);
        setIsLoadingPDetails(true);
        const res = await api.get(`/api/pdetails/${matchValue.cid}/`);
        setPokemonDetailsForMatch(matchValue.cid, res.data);
        setIsLoadingPDetails(false);
        pendingDetailsRef.current.delete(matchValue.cid);
      }
    } catch (err) {
      console.error("Failed to fetch further information", err);
      setError("세부정보를 불러오지 못했습니다.");
      setIsLoadingPDetails(false);
      if (matchValue?.cid) {
        pendingDetailsRef.current.delete(matchValue.cid);
      }
    }
  };

  useEffect(() => {
    if (matches.length === 0) {
      getMatches(rule);
    } else if (!match && matches.length > 0) {
      setMatch(matches[0]);
    }
  }, [rule, matches, match, setMatch]);

  useEffect(() => {
    if (match && match.cid) {
      getPDetails(match);
    }
  }, [match]);

  return {
    rule,
    setRule,
    matches,
    match,
    setMatch,
    error,
  };
}
