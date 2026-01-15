import { create } from "zustand";

export const useLookupsStore = create((set) => ({
  lookups: null,
  lookupsLoaded: false,
  setLookups: (res) => set({ lookups: res }),
  setLookupsLoaded: (bool) => set({ lookupsLoaded: bool }),
}));
