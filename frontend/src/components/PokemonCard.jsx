function PokemonCard({ pokemon }) {
  const apiBase = import.meta.env.VITE_API_URL;

  return (
    <>
      <p># {pokemon.rank_order}</p>
      <p>
        {pokemon.pokemon_species_id?.name_ko}
        {pokemon.name_ko ? ` - (${pokemon.name_ko})` : ""}
      </p>

      <img src={`${apiBase}/${pokemon.type1_id?.default_img_url}`}/>
      {pokemon.type2_id ? 
      <img src={`${apiBase}${pokemon.type2_id.default_img_url}`} />
      : null}

    </>
  );
}

export default PokemonCard
