import { React, useMemo, useState, useEffect } from "react";
import ListInput from "../ListInput";
import { useCalcStore } from "../../store/calcStore";
import * as calc from "../../calculation";

function PokemonForm({
  sideKey,
  pokemonOptions = [],
  abilityOptions = [],
  itemOptions = [],
  natureOptions = [],
  typeOptions = [],
  moveOptions = [],
  result = {},
  setMoves,
}) {
  const apiBase = import.meta.env.VITE_API_URL;
  const [spriteSrc, setSpriteSrc] = useState("");

  const moveRows = ["기술 1", "기술 2", "기술 3", "기술 4"];
  const side = useCalcStore((s) => s[sideKey]);
  const sideLabel = sideKey === "attacker" ? "공격측" : "수비측";

  const setPokemonField = useCalcStore((s) => s.setPokemonField);
  const setStat = useCalcStore((s) => s.setStat);
  const setMoveField = useCalcStore((s) => s.setMoveField);

  const s = sideKey === "attacker" ? result?.attacker : result?.defender;
  const baseStats = s?.species?.baseStats ?? {
    hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0,
  };
  const finStats = s?.stats ?? {
    hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0,
  };
  
  const clearStats = () => {
    ["hp", "atk", "def", "spa", "spd", "spe"].forEach((key) => {
      setStat(sideKey, "ivs", key, 31);
      setStat(sideKey, "evs", key, 0);
      setStat(sideKey, "boosts", key, 0);
    });
  }

  // 스탯 테이블 정의
  const statRows = [
    {
      label: "HP",
      key: "hp",
      base: baseStats.hp,
      iv: side.ivs.hp,
      ev: side.evs.hp,
      stage: 0,
      final: finStats.hp,
    },
    {
      label: "공격",
      key: "atk",
      base: baseStats.atk,
      iv: side.ivs.atk,
      ev: side.evs.atk,
      stage: side.boosts.atk,
      final: finStats.atk,
    },
    {
      label: "방어",
      key: "def",
      base: baseStats.def,
      iv: side.ivs.def,
      ev: side.evs.def,
      stage: side.boosts.def,
      final: finStats.def,
    },
    {
      label: "특수공격",
      key: "spa",
      base: baseStats.spa,
      iv: side.ivs.spa,
      ev: side.evs.spa,
      stage: side.boosts.spa,
      final: finStats.spa,
    },
    {
      label: "특수방어",
      key: "spd",
      base: baseStats.spd,
      iv: side.ivs.spd,
      ev: side.evs.spd,
      stage: side.boosts.spd,
      final: finStats.spd,
    },
    {
      label: "스피드",
      key: "spe",
      base: baseStats.spe,
      iv: side.ivs.spe,
      ev: side.evs.spe,
      stage: side.boosts.spe,
      final: finStats.spe,
    },
  ];

  const pokemonByValue = useMemo(
    () => new Map(pokemonOptions.map((opt) => [opt.value, opt.object])),
    [pokemonOptions]
  );

  const moveByValue = useMemo(
    () => new Map(moveOptions.map((opt) => [opt.value, opt.object])),
    [moveOptions]
  );

  const leftEVs = 510 - calc.sumEVs({statRows});
  const resolveMoveLabel = (value) => {
    const found = moveOptions.find((opt) => {
      if (opt == null) return false;
      if (typeof opt === "string" || typeof opt === "number") {
        return String(opt) === String(value);
      }
      const optValue = opt.value ?? opt.name ?? opt.label ?? "";
      return String(optValue) === String(value);
    });
    if (!found) return value ?? "";
    if (typeof found === "string" || typeof found === "number") {
      return String(found);
    }
    return String(found.label ?? found.name ?? found.value ?? value ?? "");
  };

  useEffect(() => {
    const obj = pokemonByValue.get(side.species);
    const sprite = obj?.sprite_url;
    setSpriteSrc(sprite ? `${apiBase}${sprite}` : "");
  }, [side.species, pokemonByValue, apiBase]);

  return (
    <div className="calc-panel bg-white flex-col">
      <h3 className="calc-panel__title text-body">{sideLabel}</h3>
      <form className="calc-side-form flex-col">
        <div className="calc-side-header bg-gray-soft">
          <div
            className="calc-sprite sprite-m bg-gray flex-row-center text-body"
            aria-hidden="true"
          >
            {spriteSrc && (
              <img
                src={spriteSrc}
                alt={result.attacker.name || "pokemon"}
                className="poke-sprite"
              />
            )}
          </div>
          <ListInput
            options={pokemonOptions}
            value={side.species || ""}
            inputClassName="calc-input calc-input--title text-body"
            ariaLabel={`${sideLabel} 포켓몬 이름`}
            onValueChange={(v) => {
              setPokemonField(sideKey, "species", v);
              const obj = pokemonByValue.get(v);
              const sprite = obj?.sprite_url;
              setSpriteSrc(sprite ? `${apiBase}${sprite}` : "");
              console.log(spriteSrc);
            }}
          />
        </div>
        <div className="calc-info-grid">
          <div className="calc-info-row">
            <span className="calc-info-label text-small">특성</span>
            <ListInput
              options={abilityOptions}
              inputClassName="calc-input text-small"
              ariaLabel="특성"
              value={side.ability || ""}
              onValueChange={(v) => setPokemonField(sideKey, "ability", v)}
            />
          </div>
          <div className="calc-info-row">
            <span className="calc-info-label text-small">지닌물건</span>
            <ListInput
              options={itemOptions}
              inputClassName="calc-input text-small"
              ariaLabel="지닌물건"
              value={side.item || ""}
              onValueChange={(v) => setPokemonField(sideKey, "item", v)}
            />
          </div>
          <div className="calc-info-row">
            <span className="calc-info-label text-small">성격</span>
            <ListInput
              options={natureOptions}
              inputClassName="calc-input text-small"
              ariaLabel="성격"
              value={side.nature || ""}
              onValueChange={(v) => setPokemonField(sideKey, "nature", v)}
            />
          </div>
          <div className="calc-info-row">
            <span className="calc-info-label text-small">테라스탈</span>
            <ListInput
              options={typeOptions}
              inputClassName="calc-input text-small"
              ariaLabel="테라스탈"
              value={side.teraType || ""}
              onValueChange={(v) => setPokemonField(sideKey, "teraType", v)}
            />
          </div>
        </div>

        <div className="calc-stat-actions">
          {/*
          <button
            type="button"
            className="calc-button calc-button--mini bg-white text-label"
          >
            내구 최적화
          </button>
          */}
          <button
            type="button"
            className="calc-button calc-button--mini bg-white text-label"
            onClick={clearStats}
          >
            초기화
          </button>
        </div>

        <table className="calc-stat-table bg-white text-small">
          <thead>
            <tr>
              <th></th>
              <th>종족값</th>
              <th>개체값</th>
              <th>노력치</th>
              <th>랭크</th>
              <th>실능치</th>
            </tr>
          </thead>
          <tbody>
            {statRows.map((row) => (
              <tr key={row.label}>
                <th scope="row">{row.label}</th>
                <td>{row.base}</td>
                <td>
                  <input
                    className="calc-input text-small"
                    type="number"
                    min="0"
                    max="31"
                    step="1"
                    value={row.iv}
                    onChange={(event) =>
                      setStat(
                        sideKey,
                        "ivs",
                        row.key,
                        Number(event.target.value)
                      )
                    }
                    aria-label={`${row.label} 개체값`}
                  />
                </td>
                <td>
                  <input
                    className="calc-input text-small"
                    type="number"
                    min="0"
                    max="252"
                    step="4"
                    value={row.ev}
                    onChange={(event) =>
                      setStat(
                        sideKey,
                        "evs",
                        row.key,
                        Number(event.target.value)
                      )
                    }
                    aria-label={`${row.label} 노력치`}
                  />
                </td>
                <td>
                  {row.label !== "HP" ? (
                    <input
                      className="calc-input text-small"
                      type="number"
                      min="-6"
                      max="6"
                      step="1"
                      value={row.stage}
                      onChange={(event) =>
                        setStat(
                          sideKey,
                          "boosts",
                          row.key,
                          Number(event.target.value)
                        )
                      }
                      aria-label={`${row.label} 랭크`}
                    />
                  ) : null}
                </td>
                <td>{row.final}</td>
              </tr>
            ))}
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td>{leftEVs}</td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>

        <div className="calc-move-block flex-col">
          {moveRows.map((label, index) => (
            <div className="calc-move-row" key={`atk-${label}`}>
              <span className="calc-move-label text-small">{label}</span>
              <ListInput
                options={moveOptions}
                inputClassName="calc-input text-small"
                ariaLabel={`${label} 이름`}
                value={side.moves?.[index]?.name || ""}
                onValueChange={(v) => {
                  setMoveField(sideKey, index, "name", v);
                  if (typeof setMoves === "function") {
                    setMoves((prev) => {
                      const next = [...prev]; // ...: prev를 얕은 복사
                      next[index] = moveByValue.get(v); // 복사된 배열인 next 사용
                      return next;
                    });
                  }
                }}
                onInputChange={(v) => setMoveField(sideKey, index, "name", v)}
              />
              <label className="calc-check text-label">
                <input
                  type="checkbox"
                  checked={Boolean(side.moves?.[index]?.isZ)}
                  onChange={(e) =>
                    setMoveField(sideKey, index, "isZ", e.target.checked)
                  }
                />{" "}
                Z기술
              </label>
              <label className="calc-check text-label">
                <input
                  type="checkbox"
                  checked={Boolean(side.moves?.[index]?.isCrit)}
                  onChange={(e) =>
                    setMoveField(sideKey, index, "isCrit", e.target.checked)
                  }
                />{" "}
                급소
              </label>
            </div>
          ))}
        </div>
      </form>
    </div>
  );
}

export default PokemonForm;
