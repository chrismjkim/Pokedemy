import { create } from "zustand";

export const useStore = create((set) => ({
  selectedRule: "single",
  setSelectedRule: (rule) => set({ selectedRule: rule }),

  selectedPokemon: null, // Pokemon 객체
  setSelectedPokemon: (pokemon) => set({ selectedPokemon: pokemon }),
  resetSelectedPokemon: () => set({ selectedPokemon: null }),

  selectedMatch: null, // Match 객체
  setSelectedMatch: (match) => set({ selectedMatch: match}),

  matchesByRule: { single: [], double: [] },
  setMatchesByRule: (rule, matches) =>
    set((state) => ({
      matchesByRule: { ...state.matchesByRule, [rule]: matches },
    })),

  pokemonsByMatch: {},
  setPokemonsForMatch: (cid, pokemons) =>
    set((state) => ({
      pokemonsByMatch: { ...state.pokemonsByMatch, [cid]: pokemons },
    })),

  pokemonDetailsByMatch: {},
  setPokemonDetailsForMatch: (cid, details) =>
    set((state) => ({
      pokemonDetailsByMatch: { ...state.pokemonDetailsByMatch, [cid]: details },
    })),

  pokemonDetails: null, // json
  setPokemonDetails: (json) => set({ pokemonDetails: json}),
  
  isLoadingPDetails: false,
  setIsLoadingPDetails: (bool) => set({ isLoadingPDetails: bool })
}));
