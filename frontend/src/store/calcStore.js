import { create } from "zustand";

export const useCalcStore = create((set) => ({
    gen: 9, // smogon/calc generation
    attacker: {
      species: "Talonflame",
      item: "Choice Band",
      ability: "Gale Wings",
      nature: "Adamant",
      teraType: "Flying",
      level: 50,
      ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
      evs: { hp: 4, atk: 252, def: 0, spa: 0, spd: 0, spe: 252 },
      boosts: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0 }, // rank
      moves: [
        { name: "Brave Bird", isZ: false, isCrit: false, desc: "" },
        { name: "Flare Blitz", isZ: false, isCrit: false, desc: "" },
        { name: "Swords Dance", isZ: false, isCrit: false, desc: "" },
        { name: "U-turn", isZ: false, isCrit: false, desc: "" },
      ],
    },
    defender: {
      species: "Ting-Lu",
      item: "Assault Vest",
      ability: "Vessel of Ruin",
      nature: "Impish",
      teraType: "Dark",
      level: 50,
      ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
      evs: { hp: 252, atk: 0, def: 252, spa: 0, spd: 4, spe: 0 },
      boosts: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
      moves: [
        { name: "Ruination", isZ: false, isCrit: false, desc: "" },
        { name: "Stealth Rock", isZ: false, isCrit: false, desc: "" },
        { name: "Earthquake", isZ: false, isCrit: false, desc: "" },
        { name: "Whirlwind", isZ: false, isCrit: false, desc: "" },
      ],
    },

    field: {
      // smogon Field에 그대로 대응
      gameType: "Singles",   // Singles, Doubles
      /* Electric/Grassy/Misty/Psychic or ""
        한국어로 각각 일렉트릭필드/그래스필드/미스트필드/사이코필드
      */
      terrain: "",   // 
      /* weather: Sun/Rain/Sand/Snow/Harsh Sunshine/Heavy Rain/Strong Winds 
        한국어로 각각 쾌청/비/모래바람/눈/강한 햇살/강한 비/난기류
      */
      weather: "",
      isMagicRoom: false,    // 매직룸
      isWonderRoom: false,   // 원더룸
      isGravity: false,      // 중력
      isAuraBreak: false,    // 오라브레이크
      isFairyAura: false,    // 페어리오라
      isDarkAura: false,     // 다크오라
      isBeadsOfRuin: false,  // 재앙의구슬
      isSwordsOfRuin: false, // 재앙의검
      isTabletsOfRuin: false,// 재앙의목간
      isVesselofRuin: false, // 재앙의그릇

      // side별 필드
      attackerSide: {
        spikes: 0,             // 반드시 0, 1, 2, 3 중 하나의 값을 가짐, 압정뿌리기
        steelsurge: false,     // 마름쇠
        vinelash: false,       // 거다이편달
        wildfire: false,       // 거다이옥염
        cannonade: false,      // 거다이포격
        volcalith: false,      // 거다이분석
        isSR: false,           // 스텔스록
        isReflect: false,      // 리플렉터
        isLightScreen: false,  // 빛의장막
        isProtected: false,    // 방어
        isSeeded: false,       // 씨뿌리기
        isForesight: false,    // 꿰뚫어보기를 당함
        isSaltCure: false,     // 소금절이
        isTailwind: false,     // 순풍
        isHelpingHand: false,  // 조수
        isFlowerGift: false,   // 플라워기프트
        isFriendGuard: false,  // 프렌드가드
        isAuroraVeil: false,   // 오로라베일
        isBattery: false,      // 배터리
        isPowerSpot: false,    // 파워스폿
        isSteelySpirit: false, // 강철정신
      },
      defenderSide: {
        spikes: 0,            // 반드시 0, 1, 2, 3 중 하나의 값을 가짐
        steelsurge: false,
        vinelash: false,
        wildfire: false,
        cannonade: false,
        volcalith: false,
        isSR: false,
        isReflect: false,
        isLightScreen: false,
        isProtected: false,
        isSeeded: false,
        isForesight: false,
        isSaltCure: false,
        isTailwind: false,
        isHelpingHand: false,
        isFlowerGift: false,
        isFriendGuard: false,
        isAuroraVeil: false,
        isBattery: false,
        isPowerSpot: false,
        isSteelySpirit: false,
      },
    },
    setPokemonField: (side, key, value) =>
      set((state) => ({
        [side]: {
          ...state[side],
          [key]: value,
        },
      })),
    /*
    side: "attacker", "defender" 중 하나
    group: "ivs", "evs", "boosts" 등
    statKey: "hp", "atk", "def", "spa", "spd", "spe"
    */
    setStat: (side, group, statKey, value) =>
      set((state) => ({
        [side]: {
          ...state[side],
          [group]: {
            ...state[side][group],
            [statKey]: value,
          },
        },
      })),
    setMoveField: (side, index, key, value) =>
      set((state) => {
        const nextMoves = [...state[side].moves];
        nextMoves[index] = { ...nextMoves[index], [key]: value };
        return {
          [side]: {
            ...state[side],
            moves: nextMoves,
          },
        };
      }),
    setField: (key, value) =>
      set((state) => ({
        field: {
          ...state.field,
          [key]: value,
        },
      })),
    setSideField: (sideKey, key, value) =>
      set((state) => ({
        field: {
          ...state.field,
          [sideKey]: {
            ...state.field[sideKey],
            [key]: value,
          },
        },
      })),
}));
