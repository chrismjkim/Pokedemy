import React, { useState } from "react";
import Navbar from "../components/Navbar";
import PokemonForm from "../components/calculator/PokemonForm";
import FieldForm from "../components/calculator/FieldForm";
import "../styles/Calculator.css";

const resultItems = [
  {
    icon: "👻",
    tone: "ghost",
    name: "아스트랄비트",
    damage: "39060",
    detail: "확정 1타 (104.85% ~ 122.25%)",
  },
  {
    icon: "🎯",
    tone: "psychic",
    name: "사이코키네시스",
    damage: "29295",
    detail: "87.5% 난수 1타 (87.33% ~ 104.85%)",
  },
  {
    icon: "✨",
    tone: "fairy",
    name: "드레인키스",
    damage: "10850",
    detail: "87.5% 난수 1타 (47.50% ~ 54.50%)",
  },
  {
    icon: "⭐",
    tone: "normal",
    name: "사이코쇼크",
    damage: "26050",
    detail: "14.2% 난수 2타 (32.50% ~ 50.50%)",
  },
];

const compareRows = [
  { label: "스피드", left: "201", right: "160" },
  { label: "물리내구", left: "48000", right: "87000" },
  { label: "특수내구", left: "39600", right: "55520" },
];

const pokemonNameOptions = ["버드렉스 (흑마 탄 모습)", "무쇠바퀴", "코라이돈"];
const abilityOptions = ["스펙터럴라이더", "리베로", "재생력"];
const itemOptions = ["생명의구슬", "구애스카프", "기합의띠"];
const natureOptions = ["고집", "겁쟁이", "조심"];
const typeOptions = ["고스트", "에스퍼", "드래곤"];
const moveOptions = ["아스트랄비트", "사이코키네시스", "드레인키스"];

function Calculator() {

  return (
    <div className="calculator bg-gray-soft">
      <Navbar />
      <div className="calculator__body flex-col">
        <datalist id="pokemon-name-options">
          {pokemonNameOptions.map((name) => (
            <option key={name} value={name} />
          ))}
        </datalist>
        <datalist id="ability-options">
          {abilityOptions.map((name) => (
            <option key={name} value={name} />
          ))}
        </datalist>
        <datalist id="item-options">
          {itemOptions.map((name) => (
            <option key={name} value={name} />
          ))}
        </datalist>
        <datalist id="nature-options">
          {natureOptions.map((name) => (
            <option key={name} value={name} />
          ))}
        </datalist>
        <datalist id="type-options">
          {typeOptions.map((name) => (
            <option key={name} value={name} />
          ))}
        </datalist>
        <datalist id="move-options">
          {moveOptions.map((name) => (
            <option key={name} value={name} />
          ))}
        </datalist>
        <section className="calculator__top-grid">
          <div className="calc-panel bg-white flex-col">
            <h3 className="calc-panel__title text-body">공격측 계산 결과</h3>
            <ul className="calc-result-list flex-col">
              {resultItems.map((item) => (
                <li className="calc-result-item bg-gray-soft" key={`${item.name}-${item.damage}`}>
                  <span className={`calc-result-icon sprite-xs text-body calc-result-icon--${item.tone}`}>
                    {item.icon}
                  </span>
                  <div className="calc-result-text flex-col text-body">
                    <div className="calc-result-line">
                      <span className="calc-result-name text-body">{item.name}</span>
                      <span className="calc-result-damage text-body">{item.damage}</span>
                    </div>
                    <div className="calc-result-sub text-body">{item.detail}</div>
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
          </div>

          <div className="calc-panel bg-white flex-col">
            <h3 className="calc-panel__title text-body">수비측 계산 결과</h3>
            <ul className="calc-result-list flex-col">
              {resultItems.map((item) => (
                <li className="calc-result-item bg-gray-soft" key={`def-${item.name}-${item.damage}`}>
                  <span className={`calc-result-icon sprite-xs text-body calc-result-icon--${item.tone}`}>
                    {item.icon}
                  </span>
                  <div className="calc-result-text flex-col text-body">
                    <div className="calc-result-line">
                      <span className="calc-result-name text-body">{item.name}</span>
                      <span className="calc-result-damage text-body">{item.damage}</span>
                    </div>
                    <div className="calc-result-sub text-body">{item.detail}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="calculator__bottom-grid">
          <PokemonForm side={ "공격측" }/>
          <FieldForm />
          <PokemonForm side={ "수비측" }/>
        </section>
      </div>
    </div>
  );
}

export default Calculator;
