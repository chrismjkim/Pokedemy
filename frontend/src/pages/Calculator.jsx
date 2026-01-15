import { useCalcLookupsData } from "../hooks/useCalcLookupsData";
import { useCalcMovesData } from "../hooks/useCalcMovesData";
import { useCalcResultsData } from "../hooks/useCalcResultsData";
import Navbar from "../components/Navbar";
import CalcResult from "../components/calculator/CalcResult";
import PokemonForm from "../components/calculator/PokemonForm";
import FieldForm from "../components/calculator/FieldForm";
import "../styles/Calculator.css";

function Calculator() {
  const {
    pokemonOptions,
    abilityOptions,
    itemOptions,
    natureOptions,
    typeOptions,
    moveOptions,
    moveByValue,
  } = useCalcLookupsData();

  const {
    attackerMoves,
    defenderMoves,
    setAttackerMoves,
    setDefenderMoves,
    swapSides,
  } = useCalcMovesData(moveOptions, moveByValue);

  const { result_atk, result_def, compareRows } = useCalcResultsData();

  return (
    <div className="calculator bg-gray-soft">
      <Navbar />
      <div className="calculator__body flex-col">
        <section className="calculator__top-grid">
          <CalcResult moves={ attackerMoves } result={ result_atk } sideKey="attacker"/>

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
              <button
                type="button"
                className="calc-button bg-white text-small"
                onClick={swapSides}
              >
                공수 교대
              </button>
              <button type="button" className="calc-button bg-white text-small">
                계산 결과 저장
              </button>
              <button type="button" className="calc-button bg-white text-small">
                샘플 저장
              </button>
            </div>
          </div>

          <CalcResult moves={defenderMoves} result={result_def} sideKey="defender"/>
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
