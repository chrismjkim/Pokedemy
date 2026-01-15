import { useMemo } from "react";
import ListInput from "../ListInput";

function MoveForm({ sideKey, side, moveOptions, setMoveField, setMoves }) {
  const moveRows = ["기술 1", "기술 2", "기술 3", "기술 4"];

  const moveByValue = useMemo(
    () => new Map(moveOptions.map((opt) => [opt.value, opt.object])),
    [moveOptions]
  );

  return (
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
  );
}

export default MoveForm;
