import { React } from "react";
import { useCalcStore } from "../../store/calcStore";

function FieldForm() {
  const field = useCalcStore((s) => s.field);
  const setField = useCalcStore((s) => s.setField);
  const setSideField = useCalcStore((s) => s.setSideField);

  const fieldChecks = [
    { label: "스텔스록", key: "isSR", type: "checkbox" },
    { label: "압정뿌리기", key: "spikes", type: "number" },
    { label: "마름쇠", key: "steelsurge", type: "checkbox" },
    { label: "거다이편달", key: "vinelash", type: "checkbox" },
    { label: "거다이옥염", key: "wildfire", type: "checkbox" },
    { label: "거다이포격", key: "cannonade", type: "checkbox" },
    { label: "거다이분석", key: "volcalith", type: "checkbox" },
    { label: "방어", key: "isProtected", type: "checkbox" },
    { label: "씨뿌리기", key: "isSeeded", type: "checkbox" },
    { label: "소금절이", key: "isSaltCure", type: "checkbox" },
    { label: "리플렉터", key: "isReflect", type: "checkbox" },
    { label: "빛의장막", key: "isLightScreen", type: "checkbox" },
    { label: "오로라베일", key: "isAuroraVeil", type: "checkbox" },
    { label: "꿰뚫어보기를 당함", key: "isForesight", type: "checkbox" },
    { label: "순풍", key: "isTailwind", type: "checkbox" },
    { label: "조수", key: "isHelpingHand", type: "checkbox" },
    { label: "파워스폿", key: "isPowerSpot", type: "checkbox" },
    { label: "플라워기프트", key: "isFlowerGift", type: "checkbox" },
    { label: "강철정신", key: "isSteelySpirit", type: "checkbox" },
    { label: "프렌드가드", key: "isFriendGuard", type: "checkbox" },
    { label: "배터리", key: "isBattery", type: "checkbox" },
  ];

  const fieldToggleGroups = [
    {
      type: "radio",
      name: "battle",
      options: [
        { label: "싱글배틀", value: "Singles" },
        { label: "더블배틀", value: "Doubles" },
      ],
      selected: field.gameType,
      onChange: (value) => setField("gameType", value),
      allowDeselect: false,
    },
    {
      type: "radio",
      name: "terrain",
      options: [
        { label: "일렉트릭필드", value: "Electric" },
        { label: "그래스필드", value: "Grassy" },
        { label: "미스트필드", value: "Misty" },
        { label: "사이코필드", value: "Psychic" },
      ],
      selected: field.terrain,
      onChange: (value) => setField("terrain", value),
      allowDeselect: true,

    },
    {
      type: "radio",
      name: "weather",
      rows: [
        [
          { label: "쾌청", value: "Sun" },
          { label: "비", value: "Rain" },
          { label: "모래바람", value: "Sand" },
          { label: "설경", value: "Snow" },
        ],
        [
          { label: "강한 햇살", value: "Harsh Sunshine" },
          { label: "강한 비", value: "Heavy Rain" },
          { label: "난기류", value: "Strong Winds" },
        ],
      ],
      selected: field.weather,
      onChange: (value) => setField("weather", value),
      allowDeselect: true,
    },
    {
      type: "checkbox",
      name: "room",
      options: [
        { label: "매직룸", key: "isMagicRoom" },
        { label: "원더룸", key: "isWonderRoom" },
        { label: "중력", key: "isGravity" },
      ],
    },
    {
      type: "checkbox",
      name: "ruin",
      options: [
        { label: "재앙의구슬", key: "isBeadsOfRuin" },
        { label: "재앙의검", key: "isSwordsOfRuin" },
        { label: "재앙의목간", key: "isTabletsOfRuin" },
        { label: "재앙의그릇", key: "isVesselofRuin" },
      ],
    },
    {
      type: "checkbox",
      name: "aura",
      options: [
        { label: "페어리오라", key: "isFairyAura" },
        { label: "오라브레이크", key: "isAuraBreak" },
        { label: "다크오라", key: "isDarkAura" },
      ],
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
              {row.map((option) => {
                const isChecked =
                  group.type === "radio" && group.selected === option.value;
                const checkboxChecked =
                  group.type === "checkbox" && option.key
                    ? Boolean(field[option.key])
                    : false;
                return (
                  <label
                    className="calc-toggle"
                    key={`${group.name}-${option.label}`}
                  >
                    <input
                      className="calc-toggle-input"
                      type={group.type}
                      name={group.name}
                      checked={
                        group.type === "radio" ? isChecked : checkboxChecked
                      }
                      onChange={(event) => {
                        if (group.type === "radio" && group.onChange) {
                          group.onChange(option.value);
                        }
                        if (group.type === "checkbox") {
                          setField(option.key, event.target.checked);
                        }
                      }}
                      onClick={() => {
                        if (
                          group.type === "radio" &&
                          group.allowDeselect &&
                          isChecked
                        ) {
                          group.onChange("");
                        }
                      }}
                    />
                    <span className="calc-toggle-label text-small">
                      {option.label}
                    </span>
                  </label>
                );
              })}
            </div>
          ));
        })}
      </div>

      <div className="calc-field-checks flex-col">
        {fieldChecks.map((item) => (
          <div className="calc-field-row text-label" key={item.label}>
            {item.type === "number" ? (
              <input
                type="number"
                className="calc-field-box calc-field-box--left"
                min="0"
                max="3"
                step="0"
                value={field.attackerSide[item.key]}
                onChange={(event) =>
                  setSideField(
                    "attackerSide",
                    item.key,
                    Number(event.target.value)
                  )
                }
                aria-label={`${item.label} 공격측`}
              />
            ) : (
              <input
                type="checkbox"
                className="calc-field-box calc-field-box--left"
                checked={Boolean(field.attackerSide[item.key])}
                onChange={(event) =>
                  setSideField(
                    "attackerSide",
                    item.key,
                    event.target.checked
                  )
                }
                aria-label={`${item.label} 공격측`}
              />
            )}
            <span className="calc-field-label text-small">{item.label}</span>
            {item.type === "number" ? (
              <input
                type="number"
                className="calc-field-box calc-field-box--right"
                min="0"
                max="3"
                step="0"
                value={field.defenderSide[item.key]}
                onChange={(event) =>
                  setSideField(
                    "defenderSide",
                    item.key,
                    Number(event.target.value)
                  )
                }
                aria-label={`${item.label} 수비측`}
              />
            ) : (
              <input
                type="checkbox"
                className="calc-field-box calc-field-box--right"
                checked={Boolean(field.defenderSide[item.key])}
                onChange={(event) =>
                  setSideField(
                    "defenderSide",
                    item.key,
                    event.target.checked
                  )
                }
                aria-label={`${item.label} 수비측`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );

}

export default FieldForm;
