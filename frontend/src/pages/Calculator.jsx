import React, { useState, useEffect, useMemo } from "react";
import { calculate, Generations, Pokemon, Move, Field} from "@smogon/calc";
import { useCalcStore } from "../store/calcStore";
import api from "../api";
import Navbar from "../components/Navbar";
import PokemonForm from "../components/calculator/PokemonForm";
import FieldForm from "../components/calculator/FieldForm";
import "../styles/Calculator.css";

function Calculator() {

  const apiBase = import.meta.env.VITE_API_URL;

  const compareRows = [
    { label: "스피드", left: "201", right: "160" },
    { label: "물리내구", left: "48000", right: "87000" },
    { label: "특수내구", left: "39600", right: "55520" },
  ];

  // const [pokemonOptions, setPokemonOptions] = useState(null);

  const lookups = useCalcStore((s) => s.lookups);
  const lookupsLoaded = useCalcStore((s) => s.lookupsLoaded);
  const setLookupsLoaded = useCalcStore((s) => s.setLookupsLoaded);
  const setLookups = useCalcStore((s) => s.setLookups);
  
  const [attackerMoves, setAttackerMoves] = useState([]);
  const [defenderMoves, setDefenderMoves] = useState([]);

  /* 이 옵션들은 포켓몬마다 다를 수 있으므로 추후엔 PokemonForm에서 선언 */
  const pokemonOptions = lookups?.pokemon
    ? Object.values(lookups.pokemon).map((obj) => {
        const species = obj.pokemon_species_id?.name_ko;
        const form = obj.name_ko;
        const label = form ? `${species} (${form})` : species;
        
        const species_smogon = obj.pokemon_species_id?.name;
        const form_smogon = obj.name_smogon;
        const value = form_smogon ? `${species_smogon}-${form_smogon}` : species_smogon; 

        // 여기에서 만약 p 전체를 전달해버린다면?
        return { label: label, value: value, object: obj};
      })
    : [];

  const abilityOptions = lookups?.ability
    ? Object.values(lookups.ability).map((obj) => {
      return { label: obj.name_ko, value: obj.name, object: obj}
    })
    : [];

  const itemOptions = lookups?.item
    ? Object.values(lookups.item).map((obj) => {
          const label = obj.name_ko || "";
          const value = obj.name || "";
          if (!label.trim() || !value.trim()) return null;
          return { label, value, object: obj};
        })
        .filter(Boolean)
    : [];
  
  const natureOptions = lookups?.nature
    ? Object.values(lookups.nature).map((obj) => {
      const label = `${obj.name_ko} ( +${obj.raise_stat_id.name_ko}, -${obj.lower_stat_id.name_ko})`;
      return { label: label, value: obj.name, object: obj};
    })
    : [];
  const typeOptions = lookups?.type
    ? Object.values(lookups.type).map((obj) => {
      return { label: obj.name_ko, value: obj.name, object: obj};
    })
    : [];
  const moveOptions = lookups?.move
    ? Object.values(lookups.move).map((obj) => {
      return { label: obj.name_ko, value: obj.name, object: obj};
    })
    : [];

  const gen = Generations.get(9);
  const attacker = useCalcStore((s) => s.attacker);
  const defender = useCalcStore((s) => s.defender);
  const move = useCalcStore((s) => s.attacker.moves[0])
  const field = useCalcStore((s) => s.field);

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

  const getLookups = async () => {
    try {
      if (lookupsLoaded) {
        return;
      }
      const res = await api.get(`/api/lookups/`);
      setLookups(res.data);
      setLookupsLoaded(true);

    } catch (err) {
      console.error("Failed to fetch lookups", err);
      setError("데이터를 불러오지 못했습니다.");
    } 
      finally {
    }
  };

  useEffect(() => {
    getLookups();
  }, [lookupsLoaded, setLookups]);



  return (
    <div className="calculator bg-gray-soft">
      <Navbar />
      <div className="calculator__body flex-col">
        <section className="calculator__top-grid">
          <div className="calc-panel bg-white flex-col">
            <h3 className="calc-panel__title text-body">공격측 계산 결과</h3>
            <ul className="calc-result-list flex-col">
              {attackerMoves.map((move) => (
                <li
                  className="calc-result-item bg-gray-soft"
                  key={`def-${move.name}`}
                >
                  <div
                    className="calc-sprite sprite-m flex-row-center"
                    aria-hidden="true"
                  >
                    {move.type_id.icon_url && (
                      <img
                        src={`${apiBase}${move.type_id.icon_url}`}
                        alt={move.type_id.name_ko || "type"}
                        className="poke-sprite"
                      />
                    )}
                  </div>
                  <div className="calc-result-text flex-col text-body">
                    <div className="calc-result-line">
                      <span className="calc-result-name text-body">
                        {move.name_ko}
                      </span>
                      <span className="calc-result-damage text-body">
                        계산결과
                      </span>
                    </div>
                    <div className="calc-result-sub text-body"></div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="calc-panel calc-panel--center bg-white flex-col">
            <h3 className="calc-panel__title text-body">비교</h3>
            <div className="calc-compare flex-col">
              {compareRows.map((row) => (
                <div className="calc-compare-row text-body" key={row.label}>
                  <span className="calc-compare-value">{row.left}</span>
                  <span className="calc-compare-label">{row.label}</span>
                  <span className="calc-compare-value">{row.right}</span>
                </div>
              ))}
            </div>
            <div className="calc-compare-actions flex-col">
              <button type="button" className="calc-button bg-white text-label">
                공수 교대
              </button>
              <button type="button" className="calc-button bg-white text-label">
                계산 결과 저장
              </button>
              <button type="button" className="calc-button bg-white text-label">
                샘플 저장
              </button>
            </div>
            {/* 
            result 테스트용 출력 
            <div>{result.attacker.species.name}</div>
            <div>{result.attacker.ability}</div>
            <div>{result.attacker.item}</div>
            <div>{result.attacker.nature}</div>
            <div>{result.rawDesc.moveName}</div>
            <div>{result.field.gameType || ""}</div>
            <div>{result.field.terrain}</div>
            <div>{result.field.weather}</div>
            <div>{result.damage[0]}</div>
            <div>{result.move.isCrit === true ? "true" : "false"}</div>
            */}
            <div>공격측: {result_atk[0].attacker.species.name}</div>
            <div>수비측: {result_atk[0].defender.species.name}</div>
            <div>
              수비측 내구력:{" "}
              {(result_atk[0].defender.stats.hp *
                result_atk[0].defender.stats.def) /
                0.4114}
            </div>
            <div>
              결정력:{" "}
              {(result_atk[0].damage[7] * result_atk[0].defender.stats.def) /
                0.411}
            </div>
            <div>최저 데미지: {result_atk[0].damage[0]}</div>
            <div>최고 데미지: {result_atk[0].damage[15]}</div>
          </div>

          <div className="calc-panel bg-white flex-col">
            <h3 className="calc-panel__title text-body">수비측 계산 결과</h3>
            <ul className="calc-result-list flex-col">
              {defenderMoves.map((move) => (
                <li
                  className="calc-result-item bg-gray-soft"
                  key={`def-${move.name}`}
                >
                  <div
                    className="calc-sprite sprite-m flex-row-center"
                    aria-hidden="true"
                  >
                    {move.type_id.icon_url && (
                      <img
                        src={`${apiBase}${move.type_id.icon_url}`}
                        alt={move.type_id.name_ko || "type"}
                        className="poke-sprite"
                      />
                    )}
                  </div>
                  <div className="calc-result-text flex-col text-body">
                    <div className="calc-result-line">
                      <span className="calc-result-name text-body">
                        {move.name_ko}
                      </span>
                      <span className="calc-result-damage text-body">
                        계산결과
                      </span>
                    </div>
                    <div className="calc-result-sub text-body"></div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="calculator__bottom-grid">
          <PokemonForm
            sideKey="attacker"
            pokemonOptions={pokemonOptions}
            abilityOptions={abilityOptions}
            itemOptions={itemOptions}
            natureOptions={natureOptions}
            typeOptions={typeOptions}
            moveOptions={moveOptions}
            result={result_atk[0]}
            moves={attackerMoves}
            setMoves={setAttackerMoves}
          />
          <FieldForm />
          <PokemonForm
            sideKey="defender"
            pokemonOptions={pokemonOptions}
            abilityOptions={abilityOptions}
            itemOptions={itemOptions}
            natureOptions={natureOptions}
            typeOptions={typeOptions}
            moveOptions={moveOptions}
            result={result_atk[0]}
            moves={defenderMoves}
            setMoves={setDefenderMoves}
          />
        </section>
      </div>
    </div>
  );
}

export default Calculator;
