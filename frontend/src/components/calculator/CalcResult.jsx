import "../../styles/CalcResult.css"

function CalcResult( { moves, result, sideKey }) {

  const apiBase = import.meta.env.VITE_API_URL;

  const sideLabel = sideKey==="attacker" ? "공격측" : "수비측"

  const moveResult = (moves ?? []).map((move, idx) => ({
    move, result: result?.[idx], idx,
  }));
  /*
    const pokemonByValue = useMemo(
      () => new Map(pokemonOptions.map((opt) => [opt.value, opt.object])),
      [pokemonOptions]
    );
  */
  return (
    <div className="calc-panel bg-white flex-col">
      <h3 className="calc-panel__title text-body">{ sideLabel } 계산 결과</h3>
      <ul className="calc-result-list flex-col">
        {moveResult.map(({move, result, idx}) => {
          if (!move) return null;
          const damageIsList = Array.isArray(result?.damage);
          const damageList = damageIsList ? result.damage : [];
          const minDmg = damageList[0] ?? 0;
          const maxDmg = damageList[15] ?? 0;
          const isImmune = damageIsList && maxDmg === 0;
          const isStatusMove = result?.move?.category !== "Status";
          const totalDamages = damageList.length;
          const defHP = result?.defender?.stats?.hp ?? 0;
          const dmgText = damageIsList
            ? `${((minDmg / defHP) * 100).toFixed(2)}% - ${(
                (maxDmg / defHP) *
                100
              ).toFixed(2)}%`
            : String(result.damage);

          const formatDamageLine = (values, offset) =>
            values
              .map((val, index) =>
                `${val}${offset + index === totalDamages - 1 ? "" : ", "}`
              )
              .join("");
          const possibleDamageLines =
            isStatusMove && !isImmune && totalDamages > 0
              ? [
                  formatDamageLine(damageList.slice(0, 8), 0),
                  formatDamageLine(damageList.slice(8, 16), 8),
                ].filter(Boolean)
              : [];

          return (
            <li
              className="calc-result-item bg-gray-soft"
              key={move.id ?? move.name ?? idx}
            >
              <div
                className="calc-sprite sprite-m flex-row-center"
                aria-hidden="true"
              >
                {move.type_id.icon_url && (
                  <img
                    src={`${apiBase}${move.type_id.icon_url}`}
                    alt={move.type_id.name_ko || "type"}
                    className="sprite-s"
                  />
                )}
              </div>
              <div className="calc-result-text flex-col text-body">
                <div className="calc-result-line flex-col">
                  <div className="calc-result-name text-body">
                    {move.name_ko}
                  </div>
                  <div className="calc-result-damage text-body">
                    {result?.move?.category === "Status" || (!damageIsList && dmgText==="0") ? "-" : dmgText}
                  </div>
                  {possibleDamageLines.length > 0 && (
                    <div className="calc-result-damage text-label text-gray">
                      {possibleDamageLines.map((line, lineIdx) => (
                        <div key={`dmgline-${idx}-${lineIdx}`}>{line}</div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="calc-result-sub text-body"></div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default CalcResult;
