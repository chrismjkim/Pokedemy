import { React, useMemo, useState, useEffect } from "react";
import ListInput from "../ListInput";
import { useCalcStore } from "../../store/calcStore";
import StatForm from "./StatForm";
import MoveForm from "./MoveForm";

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

  const pokemonByValue = useMemo(
    () => new Map(pokemonOptions.map((opt) => [opt.value, opt.object])),
    [pokemonOptions]
  );

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

        <StatForm
          sideKey={sideKey}
          side={side}
          baseStats={baseStats}
          finStats={finStats}
          setStat={setStat}
        />

        <MoveForm
          sideKey={sideKey}
          side={side}
          moveOptions={moveOptions}
          setMoveField={setMoveField}
          setMoves={setMoves}
        />
      </form>
    </div>
  );
}

export default PokemonForm;
