import "../styles/PokemonCard.css";

function PokemonCard({ pokemon }) {
  const apiBase = import.meta.env.VITE_API_URL;

  const spriteSrc = pokemon?.sprite_url ? `${apiBase}${pokemon.sprite_url}` : "";
  const type1Src =`${apiBase}${pokemon.type1_id.icon_url}`;
  const type2Src = pokemon?.type2_id?.icon_url
    ? `${apiBase}${pokemon.type2_id.icon_url}` : "";

  return (
    <div className="poke-card">
      <div className="poke-profile">
        <div className="rank">#{pokemon.rank_order}</div>
        <div className="poke-sprite-wrap" aria-hidden={!spriteSrc}>
          <div className="poke-sprite-backdrop" />
          {spriteSrc && <img src={spriteSrc} alt={pokemon.pokemon_species_id?.name_ko || "pokemon"} className="poke-sprite" />}
        </div>
        <div className="poke-name">
          {pokemon.pokemon_species_id?.name_ko || pokemon.pokemon_species_id?.name || "이름 없음"}
          {pokemon.name_ko ? ` (${pokemon.name_ko})` : ""}
        </div>
      </div>
      <div className="poke-types">
        {type1Src && (
          <img
            src={type1Src}
            alt={pokemon.type1_id?.name_ko || "type1"}
            className="type-icon"
          />
        )}
        {type2Src && (
          <img
            src={type2Src}
            alt={pokemon.type2_id?.name_ko || "type2"}
            className="type-icon"
          />
        )}
      </div>
    </div>
  );
}

export default PokemonCard;
