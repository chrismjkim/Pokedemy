import { create } from "zustand";

export const useStore = create((set) => ({
  selectedPokemon: null,
  setSelectedPokemon: (pokemon) => set({ selectedPokemon: pokemon }),
  resetSelectedPokemon: () => set({ selectedPokemon: null }),

  selectedMatch: "",
  setSelectedMatch: (match) => set({ selectedMatch: match}),
}));
