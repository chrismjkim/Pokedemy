import { React , useState} from "react";

function FieldForm() {
  const [battleType, setBattleType] = useState("싱글배틀");
  const [terrain, setTerrain] = useState(null);
  const [weather, setWeather] = useState(null);

  const fieldChecks = [
    "방어",
    "스텔스록",
    "압정뿌리기",
    "거다이마름쇠",
    "불바다",
    "무지개",
    "습지초원",
    "씨뿌리기",
    "소금절이",
    "리플렉터",
    "빛의장막",
    "오로라베일",
    "꿰뚫어보기를 당함",
    "순풍",
    "조수",
    "파워스폿",
    "플라워기프트",
    "강철정신",
    "프렌드가드",
    "배터리",
  ];

  const fieldToggleGroups = [
    {
      type: "radio",
      name: "battle",
      options: ["싱글배틀", "더블배틀"],
      selected: battleType,
      onChange: setBattleType,
      allowDeselect: false,
    },
    {
      type: "radio",
      name: "terrain",
      options: ["일렉트릭필드", "그래스필드", "미스트필드", "사이코필드"],
      selected: terrain,
      onChange: setTerrain,
      allowDeselect: true,
    },
    {
      type: "radio",
      name: "weather",
      rows: [
        ["강한 햇살", "비", "모래바람", "설경"],
        ["끝의대지", "시작의바다", "델타스트림"],
      ],
      selected: weather,
      onChange: setWeather,
      allowDeselect: true,
    },
    {
      type: "checkbox",
      name: "room",
      options: ["매직룸", "원더룸", "중력"],
    },
    {
      type: "checkbox",
      name: "ruin",
      options: ["재앙의구슬", "재앙의검", "재앙의그릇", "재앙의목간"],
    },
    {
      type: "checkbox",
      name: "aura",
      options: ["페어리오라", "오라브레이크", "다크오라"],
    },
  ];

  return (
    <div className="calc-panel calc-panel--field bg-white flex-col">
      <h3 className="calc-panel__title text-body">필드</h3>
      <div className="calc-field-groups flex-col">
        {fieldToggleGroups.map((group) => {
          const rows = group.rows ?? [group.options];
          return rows.map((row, rowIndex) => (
            <div
              className="calc-toggle-group"
              key={`${group.type}-${group.name}-${rowIndex}`}
            >
              {row.map((label) => {
                const isChecked =
                  group.type === "radio" && group.selected === label;
                return (
                  <label
                    className="calc-toggle"
                    key={`${group.name}-${label}`}
                  >
                    <input
                      className="calc-toggle-input"
                      type={group.type}
                      name={group.name}
                      checked={group.type === "radio" ? isChecked : undefined}
                      onChange={() => {
                        if (group.type === "radio" && group.onChange) {
                          group.onChange(label);
                        }
                      }}
                      onClick={() => {
                        if (
                          group.type === "radio" &&
                          group.allowDeselect &&
                          isChecked
                        ) {
                          group.onChange(null);
                        }
                      }}
                    />
                    <span className="calc-toggle-label text-small">
                      {label}
                    </span>
                  </label>
                );
              })}
            </div>
          ));
        })}
      </div>

      <div className="calc-field-checks flex-col">
        {fieldChecks.map((label) => (
          <div className="calc-field-row text-label" key={label}>
            <input
              type="checkbox"
              className="calc-field-box calc-field-box--left"
              aria-label={`${label} 공격측`}
            />
            <span className="calc-field-label text-small">{label}</span>
            <input
              type="checkbox"
              className="calc-field-box calc-field-box--right"
              aria-label={`${label} 수비측`}
            />
          </div>
        ))}
      </div>
    </div>
  );

}

export default FieldForm;