import { useStore } from "../store/Store";

export function usePokemonDetailData() {
  const selectedPokemon = useStore((s) => s.selectedPokemon);
  const selectedMatch = useStore((s) => s.selectedMatch);
  const pokemonDetailsByMatch = useStore((s) => s.pokemonDetailsByMatch);
  const pdetails = selectedMatch?.cid
    ? pokemonDetailsByMatch?.[selectedMatch.cid]
    : null;

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

  const abilities = (selectedPokemon
    ? [
        selectedPokemon.ability1_id,
        selectedPokemon.ability2_id,
        selectedPokemon.ability_hidden_id,
      ]
    : [])
    .map(normalizeAbility)
    .filter(Boolean);

  const abilityUsage = detail?.temoti?.tokusei
    ? Object.values(detail.temoti.tokusei)
    : [];
  const usageById = new Map(
    abilityUsage
      .filter(Boolean)
      .map((u) => [String(u.id), u.usage_rate ?? u.val ?? null])
  );
  const usages = abilities.map((ab) => usageById.get(String(ab.id)) ?? null);

  const topUsageIdx = usages.length
    ? usages.reduce((bestIdx, val, idx) => {
        const bestVal = usages[bestIdx];
        const cur = val == null ? -1 : Number(val);
        const best = bestVal == null ? -1 : Number(bestVal);
        return cur > best ? idx : bestIdx;
      }, 0)
    : 0;

  return {
    selectedPokemon,
    selectedMatch,
    speciesId,
    speciesName,
    detail,
    abilities,
    usages,
    topUsageIdx,
  };
}
