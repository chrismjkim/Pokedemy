import "../styles/PokemonDetail.css";
import { usePokemonStore } from "../store/pokemonStore";
import { useEffect, useState } from "react";

function PokemonDetail () {
    
    const selectedPokemon = usePokemonStore((s) => s.selectedPokemon);

    return (
        <div className="home__content">
            <p className="info-title">포켓몬 상세</p>
            <div className="info-box">
            <p>{selectedPokemon.pokemon_species_id?.name_ko}</p>
            <p>HP: {selectedPokemon.hp}</p>
            <p>공격: {selectedPokemon.attack}</p>
            <p>방어: {selectedPokemon.defense}</p>
            <p>특수공격: {selectedPokemon.special_attack}</p>
            <p>특수방어: {selectedPokemon.special_defense}</p>
            <p>스피드: {selectedPokemon.speed}</p>
            <h1>Here</h1>
            <h1>Here</h1>
            <h1>Here</h1>
            <h1>Here</h1>
            <h1>Here</h1>
            <h1>Here</h1>
            <h1>Here</h1>
            <h1>Here</h1>
            <h1>Here</h1>
            <h1>Here</h1>
            <h1>Here</h1>
            </div>

        </div>
    )
}

export default PokemonDetail;