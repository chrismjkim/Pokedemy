import { useEffect, useRef, useState, useMemo } from "react";
import { useCalcLookupsData } from "../hooks/useCalcLookupsData";
import { useCalcMovesData } from "../hooks/useCalcMovesData";
import { useCalcResultsData } from "../hooks/useCalcResultsData";
import Navbar from "../components/Navbar";
import CalcResult from "../components/calculator/CalcResult";
import PokemonForm from "../components/calculator/PokemonForm";
import FieldForm from "../components/calculator/FieldForm";
import { useCalcStore } from "../store/calcStore";
import "../styles/Calculator.css";

function Calculator() {
  const attacker = useCalcStore((s) => s.attacker);
  const defender = useCalcStore((s) => s.defender);
  const field = useCalcStore((s) => s.field);
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);
  const [saveNotice, setSaveNotice] = useState("");
  const [copyNotice, setCopyNotice] = useState("");
  const saveTimerRef = useRef(null);
  const copyTimerRef = useRef(null);

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

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
      if (copyTimerRef.current) {
        clearTimeout(copyTimerRef.current);
      }
    };
  }, []);
  const formatSampleText = (side) => {
    return (side.species + " @ " + side.item + "\n"
      + side.nature + " / " + side.ability + "\n"
      + "terastal: " + side.teraType + "\n"
      + "IVs: " + side.ivs.hp + " / " + side.ivs.atk + " / "
      + side.ivs.def + " / " + side.ivs.spa + " / "
      + side.ivs.spd + " / " + side.ivs.spe + "\n"
      + "EVs: " + side.evs.hp + " / " + side.evs.atk + " / "
      + side.evs.def + " / " + side.evs.spa + " / "
      + side.evs.spd + " / " + side.evs.spe + "\n"
      + "- " + side.moves[0].name + "\n"
      + "- " + side.moves[1].name + "\n"
      + "- " + side.moves[2].name + "\n"
      + "- " + side.moves[3].name + "\n"
    );
  };

  const sampleTextMap = useMemo(() => {
    return {
      attacker: formatSampleText(attacker),
      defender: formatSampleText(defender)
    }

  })
  const getDamageText = (result) => {
    if (!result) return "-";
    const damageIsList = Array.isArray(result?.damage);
    if (!damageIsList) return String(result?.damage ?? "-");
    const damageList = result.damage ?? [];
    const minDmg = damageList[0] ?? 0;
    const maxDmg = damageList[damageList.length - 1] ?? 0;
    const defHP = result?.defender?.stats?.hp ?? 0;
    if (!defHP || result?.move?.category === "Status") return "-";
    return `${((minDmg / defHP) * 100).toFixed(2)}% - ${(
      (maxDmg / defHP) *
      100
    ).toFixed(2)}%`;
  };

  const buildSideSummary = (moves, results) =>
    (moves ?? []).map((move, idx) => ({
      name: move?.name_ko ?? move?.name ?? "",
      damage: getDamageText(results?.[idx]),
    }));

  const handleSaveResult = () => {
    const savedAt = new Date().toISOString();
    const snapshot = {
      id:
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : String(Date.now()),
      savedAt,
      attacker,
      defender,
      field,
      compareRows,
      results: {
        attacker: buildSideSummary(attackerMoves, result_atk),
        defender: buildSideSummary(defenderMoves, result_def),
      },
    };

    try {
      const key = "pokedemy_calc_results";
      const existing = JSON.parse(localStorage.getItem(key) || "[]");
      localStorage.setItem(key, JSON.stringify([snapshot, ...existing]));
      setSaveNotice("저장 완료");
    } catch (err) {
      console.warn("calc result save failed", err);
      setSaveNotice("저장 실패");
    }

    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }
    saveTimerRef.current = setTimeout(() => {
      setSaveNotice("");
    }, 1600);
  };

  const handleCopySample = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyNotice("샘플이 클립보드에 복사되었습니다");
        if (copyTimerRef.current) {
        clearTimeout(copyTimerRef.current);
      }
      copyTimerRef.current = setTimeout(() => {
        setCopyNotice("");
      }, 1600);
    } catch (err) {
      console.warn("clipboard copy failed", err);
    }
  };

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
              <button
                type="button"
                className="calc-button bg-white text-small"
                onClick={handleSaveResult}
              >
                계산 결과 저장
              </button>
              <button
                type="button"
                className="calc-button bg-white text-small"
                onClick={() => setIsSampleModalOpen(true)}
              >
                샘플 저장
              </button>
              {saveNotice && (
                <span
                  className="calc-save-notice text-label text-gray"
                  aria-live="polite"
                >
                  {saveNotice}
                </span>
              )}
            </div>
          </div>

          <CalcResult
            moves={defenderMoves}
            result={result_def}
            sideKey="defender"
          />
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

      {isSampleModalOpen && (
        <div
          className="calc-modal-overlay"
          role="presentation"
          onClick={() => setIsSampleModalOpen(false)}
        >
          <div
            className="calc-modal bg-white flex-col"
            role="dialog"
            aria-modal="true"
            aria-labelledby="calc-sample-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="calc-modal__close"
              onClick={() => setIsSampleModalOpen(false)}
              aria-label="닫기"
            >
              ×
            </button>
            <h3 id="calc-sample-title" className="calc-modal__title text-body">
              영문 텍스트 클립보드에 복사하기
            </h3>
            <div className="calc-sample-grid">
              <div className="calc-sample-block flex-col">
                <div className="calc-sample-box bg-gray-soft flex-col">
                  <span className="calc-sample-label text-label text-gray">
                    공격측 샘플
                  </span>
                  <span className="calc-sample-text text-small">
                    {sampleTextMap.attacker}
                  </span>
                </div>
                <button
                  type="button"
                  className="calc-button calc-button--full bg-white text-small"
                  onClick={() => handleCopySample(sampleTextMap.attacker)}
                >
                  샘플 복사
                </button>
              </div>
              <div className="calc-sample-block flex-col">
                <div className="calc-sample-box bg-gray-soft flex-col">
                  <span className="calc-sample-label text-label text-gray">
                    수비측 샘플
                  </span>
                  <span className="calc-sample-text text-small">
                    {sampleTextMap.defender}
                  </span>
                </div>
                <button
                  type="button"
                  className="calc-button calc-button--full bg-white text-small"
                  onClick={() => handleCopySample(sampleTextMap.defender)}
                >
                  샘플 복사
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {copyNotice && (
        <div className="calc-toast text-small" role="status" aria-live="polite">
          {copyNotice}
        </div>
      )}
    </div>
  );
}

export default Calculator;
