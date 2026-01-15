import { useMemo } from "react";
import { calculate, Generations, Pokemon, Move, Field } from "@smogon/calc";
import { useCalcStore } from "../store/calcStore";

export function useCalcResultsData() {
  const attacker = useCalcStore((s) => s.attacker);
  const defender = useCalcStore((s) => s.defender);
  const field = useCalcStore((s) => s.field);

  const gen = useMemo(() => Generations.get(9), []);

  const { result_atk, result_def } = useMemo(() => {
    const empty = {
      result_atk: [null, null, null, null],
      result_def: [null, null, null, null],
    };
    try {
      if (!attacker?.species || !defender?.species) {
        return empty;
      }

      const buildResults = (atk, def) =>
        Array.from({ length: 4 }, (_, idx) => {
          const move = atk?.moves?.[idx];
          if (!move?.name) return null;
          try {
            return calculate(
              gen,
              new Pokemon(gen, atk.species, atk),
              new Pokemon(gen, def.species, def),
              new Move(gen, move.name, move),
              new Field(field)
            );
          } catch (err) {
            console.warn("damage calculation failed", err);
            return null;
          }
        });
      return {
        result_atk: buildResults(attacker, defender),
        result_def: buildResults(defender, attacker),
      };
    } catch (err) {
      console.warn("damage calculation failed", err);
      return empty;
    }
  }, [gen, attacker, defender, field]);

  const attackerStats = result_atk?.[0]?.attacker?.stats;
  const defenderStats = result_atk?.[0]?.defender?.stats;
  const calcDurability = (stats, key) =>
    stats ? Math.round((stats.hp * stats[key]) / 0.411) : 0;

  const compareRows = useMemo(
    () => [
      {
        label: "스피드",
        left: attackerStats?.spe ?? 0,
        right: defenderStats?.spe ?? 0,
      },
      {
        label: "물리내구",
        left: calcDurability(attackerStats, "def"),
        right: calcDurability(defenderStats, "def"),
      },
      {
        label: "특수내구",
        left: calcDurability(attackerStats, "spd"),
        right: calcDurability(defenderStats, "spd"),
      },
    ],
    [attackerStats, defenderStats]
  );

  return { result_atk, result_def, compareRows };
}
