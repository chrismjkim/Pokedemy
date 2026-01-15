import * as calc from "../../calculation";

function StatForm({ sideKey, side, baseStats, finStats, setStat }) {
  const clearStats = () => {
    ["hp", "atk", "def", "spa", "spd", "spe"].forEach((key) => {
      setStat(sideKey, "ivs", key, 31);
      setStat(sideKey, "evs", key, 0);
      setStat(sideKey, "boosts", key, 0);
    });
  };

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

  const leftEVs = 510 - calc.sumEVs({ statRows });

  return (
    <>
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
    </>
  );
}

export default StatForm;
