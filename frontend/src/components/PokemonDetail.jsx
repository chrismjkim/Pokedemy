import "../styles/PokemonDetail.css";
import { useStore } from "../store/Store";
import { useEffect, useState } from "react";
import PokemonStats from "./PokemonStats";

function PokemonDetail () {
  const selectedPokemon = useStore((s) => s.selectedPokemon);
  const selectedMatch = useStore((s) => s.selectedMatch);
  const [activeAbilityIdx, setActiveAbilityIdx] = useState(0);

  if (!selectedPokemon) {
    return (
      <div className="home__content">
        <p className="info-title">포켓몬 상세</p>
        <div className="info-box poke-detail">포켓몬을 선택하세요.</div>
      </div>
    )
  }

  // 특성 리스트 (존재하는 것만)
  const abilities = [
    selectedPokemon.ability1_id,
    selectedPokemon.ability2_id,
    selectedPokemon.ability_hidden_id,
  ].filter(Boolean);
  const currentAbility = abilities[activeAbilityIdx] || abilities[0];
  const abilityDesc = currentAbility?.effect_entry_ko || currentAbility?.effect_entry || "설명이 없습니다.";
  const abilityUsage = currentAbility?.usage_rate ? `${currentAbility.usage_rate}%` : null;

  return (
    <div className="home__content">
      <p className="info-title">포켓몬 상세</p>
      <div className="info-box poke-detail detail-wrapper">
        <div className="card-white detail-grid">
          {/* 좌측 스프라이트 */}
          <div className="detail-sprite">
            {selectedPokemon.sprite_url && (
              <img
                src={`${import.meta.env.VITE_API_URL}${selectedPokemon.sprite_url}`}
                alt={selectedPokemon.pokemon_species_id?.name_ko || "pokemon"}
              />
            )}
          </div>

          {/* 중앙 정보/특성 */}
          <div className="detail-main">
            <div className="detail-header">
              <div className="detail-rank">#{selectedPokemon.rank_order}</div>
              <div>
                <div className="detail-name">{selectedPokemon.pokemon_species_id?.name_ko}</div>
                <div className="detail-sub">No. {String(selectedPokemon.pokemon_species_id?.id || "").padStart(4, "0")}</div>
                {selectedPokemon.name_ko && <div className="detail-sub">{selectedPokemon.name_ko}</div>}
              </div>
            </div>

            <div className="ability-box">
              <div className="ability-label">특성</div>
              <div className="ability-tabs">
                {abilities.map((ab, idx) => (
                  <button
                    key={ab.id}
                    type="button"
                    className={`ability-tab ${activeAbilityIdx === idx ? "active" : ""}`}
                    onClick={() => setActiveAbilityIdx(idx)}
                  >
                    {ab.name_ko || ab.name}
                    {ab.usage_rate ? ` (${ab.usage_rate}%)` : ""}
                  </button>
                ))}
              </div>
              <div className="ability-desc">
                <div className="ability-desc__title">
                  {currentAbility?.name_ko || currentAbility?.name}
                  {abilityUsage && <span className="ability-usage">사용률 {abilityUsage}</span>}
                </div>
                <div className="ability-desc__body">{abilityDesc}</div>
              </div>
            </div>
          </div>

          {/* 우측 스탯 패널 */}
          <div className="detail-stats">
            <div className="stats-title-panel">
              <span>종족값</span>
              <span className="stats-total">총합: {selectedPokemon.total}</span>
            </div>
            <table className="stat-table">
              <tbody>
                <tr>
                  <th scope="row">HP</th>
                  <td>
                    <div className="stat-bar-row">
                      <div className="stat-bar hp" style={{width: `${selectedPokemon.hp / 2.5}%`}} />
                      <div className="stat-num">{selectedPokemon.hp}</div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th scope="row">공격</th>
                  <td>
                    <div className="stat-bar-row">
                      <div className="stat-bar atk" style={{width: `${selectedPokemon.attack / 2.5}%`}} />
                      <div className="stat-num">{selectedPokemon.attack}</div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th scope="row">방어</th>
                  <td>
                    <div className="stat-bar-row">
                      <div className="stat-bar def" style={{width: `${selectedPokemon.defense / 2.5}%`}} />
                      <div className="stat-num">{selectedPokemon.defense}</div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th scope="row">특수공격</th>
                  <td>
                    <div className="stat-bar-row">
                      <div className="stat-bar spa" style={{width: `${selectedPokemon.special_attack / 2.5}%`}} />
                      <div className="stat-num">{selectedPokemon.special_attack}</div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th scope="row">특수방어</th>
                  <td>
                    <div className="stat-bar-row">
                      <div className="stat-bar spd" style={{width: `${selectedPokemon.special_defense / 2.5}%`}} />
                      <div className="stat-num">{selectedPokemon.special_defense}</div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th scope="row">스피드</th>
                  <td>
                    <div className="stat-bar-row">
                      <div className="stat-bar spe" style={{width: `${selectedPokemon.speed / 2.5}%`}} />
                      <div className="stat-num">{selectedPokemon.speed}</div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <PokemonStats key={`${selectedMatch?.cid || "nomatch"}`} />
      </div>
    </div>
  )
}

export default PokemonDetail;
