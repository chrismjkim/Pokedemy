import { create } from "zustand";

export const useStore = create((set) => ({
  selectedPokemon: null, // Pokemon 객체
  setSelectedPokemon: (pokemon) => set({ selectedPokemon: pokemon }),
  resetSelectedPokemon: () => set({ selectedPokemon: null }),

  selectedMatch: "", // match의 cId 문자열
  setSelectedMatch: (match_cid) => set({ selectedMatch: match_cid}),

  pokemonDetails: null, // json
  setPokemonDetails: (json) => set({ pokemonDetails: json}),
}));
