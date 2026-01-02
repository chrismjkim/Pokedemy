import { React, useState } from "react";
import * as calc from "../../calculation";
function PokemonForm( {side} ) {

  const statRows = [
    { label: "HP", base: 120, iv: 31, ev: 0, stage: 0, final: 181 },
    { label: "공격", base: 90, iv: 31, ev: 0, stage: 0, final: 94 },
    { label: "방어", base: 80, iv: 31, ev: 0, stage: 0, final: 88 },
    { label: "특수공격", base: 135, iv: 31, ev: 0, stage: 0, final: 201 },
    { label: "특수방어", base: 90, iv: 31, ev: 0, stage: 0, final: 94 },
    { label: "스피드", base: 110, iv: 31, ev: 0, stage: 0, final: 201 },
  ];
  const moveRows = ["기술 1", "기술 2", "기술 3", "기술 4"];
  const leftEVs = 510 - calc.sumEVs({statRows});
  return (
    <div className="calc-panel bg-white flex-col">
      <h3 className="calc-panel__title text-body">{side}</h3>
      <form className="calc-side-form flex-col">
        <div className="calc-side-header bg-gray-soft">
          <div
            className="calc-sprite sprite-m bg-gray flex-row-center text-body"
            aria-hidden="true"
          >
            🐉
          </div>
          <input
            className="calc-input calc-input--title text-body"
            list="pokemon-name-options"
            aria-label="공격측 포켓몬 이름"
          />
        </div>
        <div className="calc-info-grid">
          <div className="calc-info-row">
            <span className="calc-info-label text-small">특성</span>
            <input
              className="calc-input text-small"
              list="ability-options"
              aria-label="특성"
            />
          </div>
          <div className="calc-info-row">
            <span className="calc-info-label text-small">지닌물건</span>
            <input
              className="calc-input text-small"
              list="item-options"
              aria-label="지닌물건"
            />
          </div>
          <div className="calc-info-row">
            <span className="calc-info-label text-small">성격</span>
            <input
              className="calc-input text-small"
              list="nature-options"
              aria-label="성격"
            />
          </div>
          <div className="calc-info-row">
            <span className="calc-info-label text-small">테라스탈</span>
            <input
              className="calc-input text-small"
              list="type-options"
              aria-label="테라스탈"
            />
          </div>
        </div>

        <div className="calc-stat-actions">
          <button
            type="button"
            className="calc-button calc-button--mini bg-white text-label"
          >
            내구 최적화
          </button>
          <button
            type="button"
            className="calc-button calc-button--mini bg-white text-label"
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
                    defaultValue={row.iv}
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
                    defaultValue={row.ev}
                    aria-label={`${row.label} 노력치`}
                  />
                </td>
                <td>
                  <input
                    className="calc-input text-small"
                    type="number"
                    min="-6"
                    max="6"
                    step="1"
                    defaultValue={row.stage}
                    aria-label={`${row.label} 랭크`}
                  />
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
          {moveRows.map((label) => (
            <div className="calc-move-row" key={`atk-${label}`}>
              <span className="calc-move-label text-small">{label}</span>
              <input
                className="calc-input text-small"
                list="move-options"
                aria-label={`${label} 이름`}
              />
              <label className="calc-check text-label">
                <input type="checkbox" /> Z기술
              </label>
              <label className="calc-check text-label">
                <input type="checkbox" /> 급소
              </label>
            </div>
          ))}
        </div>
      </form>
    </div>
  );
}

export default PokemonForm;
