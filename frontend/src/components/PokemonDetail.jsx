import "../styles/PokemonDetail.css";
import { useStore } from "../store/Store";
import { useEffect, useState } from "react";
import PokemonStats from "./PokemonStats";

function PokemonDetail () {
  const selectedPokemon = useStore((s) => s.selectedPokemon);
  const selectedMatch = useStore((s) => s.selectedMatch);


  if (!selectedPokemon) {
    return (
      <div className="home__content">
        <p className="info-title">포켓몬 상세</p>
        <div className="info-box poke-detail">포켓몬을 선택하세요.</div>
      </div>
    )
  }

  return (
    <div className="home__content">
      <p className="info-title">포켓몬 상세</p>
      <div className="info-box poke-detail detail-wrapper">
        <div className="card-white">
          <p>{selectedPokemon.pokemon_species_id?.name_ko}</p>
          <p>HP: {selectedPokemon.hp}</p>
          <p>공격: {selectedPokemon.attack}</p>
          <p>방어: {selectedPokemon.defense}</p>
          <p>특수공격: {selectedPokemon.special_attack}</p>
          <p>특수방어: {selectedPokemon.special_defense}</p>
          <p>스피드: {selectedPokemon.speed}</p>
        </div>
        <PokemonStats key={`${selectedMatch?.cid}`} />
      </div>
    </div>
  )
}

export default PokemonDetail;
