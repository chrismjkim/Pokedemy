import { useStore } from "../store/Store";

export function usePokemonStatsData() {
  const selected = useStore((s) => s.selectedPokemon);
  const selectedMatch = useStore((s) => s.selectedMatch);
  const pokemonDetailsByMatch = useStore((s) => s.pokemonDetailsByMatch);
  const isLoadingPDetails = useStore((s) => s.isLoadingPDetails);
  const pdetails = selectedMatch?.cid
    ? pokemonDetailsByMatch?.[selectedMatch.cid]
    : null;

  const speciesId =
    selected?.pokemon_species_id?.id ??
    selected?.pokemon_species_id ??
    null;
  const p_id = speciesId != null ? String(speciesId) : null;
  const p_form = selected ? String(selected.form ?? 0) : null;
  const detail = p_id && p_form ? pdetails?.[p_id]?.[p_form] : null;

  const moves = detail?.temoti?.waza ? Object.values(detail.temoti.waza) : [];
  const items = detail?.temoti?.motimono
    ? Object.values(detail.temoti.motimono)
    : [];
  const natures = detail?.temoti?.seikaku
    ? Object.values(detail.temoti.seikaku)
    : [];
  const teraTypes = detail?.temoti?.terastal
    ? Object.values(detail.temoti.terastal)
    : [];

  const winPokemons = detail?.win?.pokemon
    ? Object.values(detail.win.pokemon)
    : [];
  const losePokemons = detail?.lose?.pokemon
    ? Object.values(detail.lose.pokemon)
    : [];
  const winMoves = detail?.win?.waza ? Object.values(detail.win.waza) : [];
  const loseMoves = detail?.lose?.waza ? Object.values(detail.lose.waza) : [];

  return {
    detail,
    isLoadingPDetails,
    moves,
    items,
    natures,
    teraTypes,
    winPokemons,
    losePokemons,
    winMoves,
    loseMoves,
  };
}
