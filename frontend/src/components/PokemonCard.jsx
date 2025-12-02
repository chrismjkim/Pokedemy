function PokemonCard({pokemon}) {
        
    return(
        <>
        <p># {pokemon.rank_order}</p>
        <p>
            {pokemon.pokemon_species_id?.name_ko}
            {pokemon.name_ko ? ` - (${pokemon.name_ko})` : ""}
        </p>
        </>
    );


}

export default PokemonCard