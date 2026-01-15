import { useEffect, useState } from "react";
import { useCalcStore } from "../store/calcStore";

export function useCalcMovesData(moveOptions, moveByValue) {
  const attacker = useCalcStore((s) => s.attacker);
  const defender = useCalcStore((s) => s.defender);

  const [attackerMoves, setAttackerMoves] = useState([]);
  const [defenderMoves, setDefenderMoves] = useState([]);

  useEffect(() => {
    if (!moveOptions.length) {
      return;
    }
    const buildMoves = (sideMoves) =>
      Array.from({ length: 4 }, (_, idx) => {
        const moveName = sideMoves?.[idx]?.name;
        return moveByValue.get(moveName) ?? null;
      });
    const sameMoveNames = (prev, next) => {
      if (prev.length !== next.length) return false;
      for (let i = 0; i < prev.length; i += 1) {
        if ((prev[i]?.name ?? null) !== (next[i]?.name ?? null)) {
          return false;
        }
      }
      return true;
    };

    const nextAttackerMoves = buildMoves(attacker?.moves);
    const nextDefenderMoves = buildMoves(defender?.moves);

    setAttackerMoves((prev) =>
      sameMoveNames(prev, nextAttackerMoves) ? prev : nextAttackerMoves
    );
    setDefenderMoves((prev) =>
      sameMoveNames(prev, nextDefenderMoves) ? prev : nextDefenderMoves
    );
  }, [moveOptions.length, moveByValue, attacker?.moves, defender?.moves]);

  const swapSides = () => {
    const nextAttackerMoves = defenderMoves;
    const nextDefenderMoves = attackerMoves;
    setAttackerMoves(nextAttackerMoves);
    setDefenderMoves(nextDefenderMoves);
    useCalcStore.setState((state) => ({
      attacker: state.defender,
      defender: state.attacker,
      field: {
        ...state.field,
        attackerSide: state.field.defenderSide,
        defenderSide: state.field.attackerSide,
      },
    }));
  };

  return {
    attackerMoves,
    defenderMoves,
    setAttackerMoves,
    setDefenderMoves,
    swapSides,
  };
}
