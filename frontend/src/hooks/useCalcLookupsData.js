import { useEffect, useMemo } from "react";
import api from "../api";
import { useLookupsStore } from "../store/lookupsStore";

export function useCalcLookupsData() {
  const lookups = useLookupsStore((s) => s.lookups);
  const lookupsLoaded = useLookupsStore((s) => s.lookupsLoaded);
  const setLookupsLoaded = useLookupsStore((s) => s.setLookupsLoaded);
  const setLookups = useLookupsStore((s) => s.setLookups);

  useEffect(() => {
    const getLookups = async () => {
      try {
        if (lookupsLoaded) {
          return;
        }
        const res = await api.get(`/api/lookups/`);
        setLookups(res.data);
        setLookupsLoaded(true);
      } catch (err) {
        console.error("Failed to fetch lookups", err);
      }
    };

    getLookups();
  }, [lookupsLoaded, setLookups, setLookupsLoaded]);

  const pokemonOptions = useMemo(() => {
    if (!lookups?.pokemon) return [];
    return Object.values(lookups.pokemon).map((obj) => {
      const species = obj.pokemon_species_id?.name_ko;
      const form = obj.name_ko;
      const label = form ? `${species} (${form})` : species;

      const speciesSmogon = obj.pokemon_species_id?.name;
      const formSmogon = obj.name_smogon;
      const value = formSmogon ? `${speciesSmogon}-${formSmogon}` : speciesSmogon;

      return { label, value, object: obj };
    });
  }, [lookups?.pokemon]);

  const abilityOptions = useMemo(() => {
    if (!lookups?.ability) return [];
    return Object.values(lookups.ability).map((obj) => ({
      label: obj.name_ko,
      value: obj.name,
      object: obj,
    }));
  }, [lookups?.ability]);

  const itemOptions = useMemo(() => {
    if (!lookups?.item) return [];
    return Object.values(lookups.item)
      .map((obj) => {
        const label = obj.name_ko || "";
        const value = obj.name || "";
        if (!label.trim() || !value.trim()) return null;
        return { label, value, object: obj };
      })
      .filter(Boolean);
  }, [lookups?.item]);

  const natureOptions = useMemo(() => {
    if (!lookups?.nature) return [];
    return Object.values(lookups.nature).map((obj) => {
      const label = `${obj.name_ko} ( +${obj.raise_stat_id.name_ko}, -${obj.lower_stat_id.name_ko})`;
      return { label, value: obj.name, object: obj };
    });
  }, [lookups?.nature]);

  const typeOptions = useMemo(() => {
    if (!lookups?.type) return [];
    return Object.values(lookups.type).map((obj) => ({
      label: obj.name_ko,
      value: obj.name,
      object: obj,
    }));
  }, [lookups?.type]);

  const moveOptions = useMemo(() => {
    if (!lookups?.move) return [];
    return Object.values(lookups.move).map((obj) => ({
      label: obj.name_ko,
      value: obj.name,
      object: obj,
    }));
  }, [lookups?.move]);

  const moveByValue = useMemo(
    () => new Map(moveOptions.map((opt) => [opt.value, opt.object])),
    [moveOptions]
  );

  return {
    lookups,
    pokemonOptions,
    abilityOptions,
    itemOptions,
    natureOptions,
    typeOptions,
    moveOptions,
    moveByValue,
  };
}
