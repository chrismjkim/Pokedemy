import { create } from "zustand";

export const useStore = create((set) => ({
  selectedPokemon: null, // Pokemon 객체
  setSelectedPokemon: (pokemon) => set({ selectedPokemon: pokemon }),
  resetSelectedPokemon: () => set({ selectedPokemon: null }),

  selectedMatch: null, // Match 객체
  setSelectedMatch: (match) => set({ selectedMatch: match}),

  pokemonDetails: null, // json
  setPokemonDetails: (json) => set({ pokemonDetails: json}),
  
  isLoadingPDetails: false,
  setIsLoadingPDetails: (bool) => set({ isLoadingPDetails: bool })
}));
