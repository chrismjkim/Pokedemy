import "../../styles/PokemonDetail.css";
import { useStore } from "../../store/Store";
import { useEffect, useState } from "react";
import PokemonStats from "./PokemonStats";

function PokemonDetail () {
  const selectedPokemon = useStore((s) => s.selectedPokemon);
  const selectedMatch = useStore((s) => s.selectedMatch);
  const pdetails = useStore((s) => s.pokemonDetails);
  const [activeAbilityIdx, setActiveAbilityIdx] = useState(0);
  const [abilityManual, setAbilityManual] = useState(false);

  const speciesId =
    selectedPokemon?.pokemon_species_id?.id ??
    selectedPokemon?.pokemon_species_id ??
    null;
  const p_id = speciesId != null ? String(speciesId) : null;
  const p_form = selectedPokemon ? String(selectedPokemon.form ?? 0) : null;
  const speciesName =
    selectedPokemon?.pokemon_species_id?.name_ko ||
    selectedPokemon?.pokemon_species_id?.name ||
    selectedPokemon?.name_ko ||
    selectedPokemon?.name ||
    "이름 없음";
  const detail = p_id && p_form ? pdetails?.[p_id]?.[p_form] : null;

  const normalizeAbility = (ab) => {
    if (!ab) return null;
    if (typeof ab === "object") return ab;
    return { id: ab, name_ko: "", name: String(ab) };
  };

  // 특성 리스트 (존재하는 것만)
  const abilities = (selectedPokemon
    ? [
        selectedPokemon.ability1_id,
        selectedPokemon.ability2_id,
        selectedPokemon.ability_hidden_id,
      ]
    : [])
    .map(normalizeAbility)
    .filter(Boolean);
  // 현재 선택된 특성
  const abilityUsage = detail?.temoti?.tokusei ? Object.values(detail.temoti.tokusei) : [];
  const usageById = new Map(
    abilityUsage
      .filter(Boolean)
      .map((u) => [String(u.id), u.usage_rate ?? u.val ?? null])
  );
  const usages = abilities.map((ab) => usageById.get(String(ab.id)) ?? null);

  // 페이지 로딩 시 가장 사용률이 높은 특성 버튼이 선택되어 설명이 보여지도록 함
  const topUsageIdx = usages.length
    ? usages.reduce((bestIdx, val, idx) => {
        const bestVal = usages[bestIdx];
        const cur = val == null ? -1 : Number(val);
        const best = bestVal == null ? -1 : Number(bestVal);
        return cur > best ? idx : bestIdx;
      }, 0)
    : 0;
  useEffect(() => {
    if (!abilities.length) return;
    if (!abilityManual) {
      setActiveAbilityIdx(topUsageIdx);
    }
  }, [abilities.length, topUsageIdx, abilityManual]);

  useEffect(() => {
    setAbilityManual(false);
    if (abilities.length) {
      setActiveAbilityIdx(topUsageIdx);
    }
  }, [selectedPokemon, topUsageIdx, abilities.length]);
  
  const currentAbility = abilities[activeAbilityIdx] || abilities[topUsageIdx] || abilities[0];
  const abilityDesc = currentAbility?.effect_entry_ko || currentAbility?.effect_entry || "설명이 없습니다.";
  

  return (
    <div className="home__content">
      <p className="info-title">포켓몬 상세</p>
      {!selectedPokemon ? (
        <div className="info-box poke-detail">포켓몬을 선택하세요.</div>
      ) : (
        <div className="info-box poke-detail detail-wrapper">
          <div className="card-white detail-grid">
            {/* 좌측 스프라이트 */}
            <div className="detail-sprite">
              {selectedPokemon.sprite_url && (
                <img
                  src={`${import.meta.env.VITE_API_URL}${selectedPokemon.sprite_url}`}
                  alt={speciesName}
                />
              )}
            </div>

            {/* 중앙 정보/특성 */}
            <div className="detail-main fill-column">
              <div className="detail-header">
                <div className="detail-rank">#{selectedPokemon.rank_order}</div>
                <div>
                  <div className="detail-name">{speciesName}</div>
                  <div className="detail-sub">
                    No. {String(speciesId || "").padStart(4, "0")}
                  </div>
                  {selectedPokemon.name_ko ? (
                    <div className="detail-sub">{selectedPokemon.name_ko}</div>
                  ) : (
                    <div className="detail-sub">&nbsp;</div>
                  )}
                </div>
              </div>
              {/*특성 박스*/}
              <div className="ability-box fill-column">
                <div className="ability-label">특성</div>
                <div className="ability-tabs">
                  {abilities.map((ab, idx) => {
                    const abilityId = ab?.id ?? idx;
                    const abilityName = ab?.name_ko || ab?.name || `#${abilityId}`;
                    return (
                      <button
                        key={abilityId} 
                        type="button"
                        className={`ability-tab ${activeAbilityIdx === idx ? "active" : ""}`}
                        onClick={() => {
                          setAbilityManual(true);
                          setActiveAbilityIdx(idx);
                        }}
                      >
                        {abilityName}
                        {(idx === activeAbilityIdx) ? ` (${(usages[idx] !== null) ? usages[idx] : '0.0'}%)` : ""}
                      </button>
                    );
                  })}
                </div>
                <div className="ability-desc">
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
                        <div className="stat-num text-body">{selectedPokemon.hp}</div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">공격</th>
                    <td>
                      <div className="stat-bar-row">
                        <div className="stat-bar atk" style={{width: `${selectedPokemon.attack / 2.5}%`}} />
                        <div className="stat-num text-body">{selectedPokemon.attack}</div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">방어</th>
                    <td>
                      <div className="stat-bar-row">
                        <div className="stat-bar def" style={{width: `${selectedPokemon.defense / 2.5}%`}} />
                        <div className="stat-num text-body">{selectedPokemon.defense}</div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">특수공격</th>
                    <td>
                      <div className="stat-bar-row">
                        <div className="stat-bar spa" style={{width: `${selectedPokemon.special_attack / 2.5}%`}} />
                        <div className="stat-num text-body">{selectedPokemon.special_attack}</div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">특수방어</th>
                    <td>
                      <div className="stat-bar-row">
                        <div className="stat-bar spd" style={{width: `${selectedPokemon.special_defense / 2.5}%`}} />
                        <div className="stat-num text-body">{selectedPokemon.special_defense}</div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">스피드</th>
                    <td>
                      <div className="stat-bar-row">
                        <div className="stat-bar spe" style={{width: `${selectedPokemon.speed / 2.5}%`}} />
                        <div className="stat-num text-body">{selectedPokemon.speed}</div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <PokemonStats key={`${selectedMatch?.cid || "nomatch"}`} />
        </div>
      )}
    </div>
  )
}

export default PokemonDetail;
