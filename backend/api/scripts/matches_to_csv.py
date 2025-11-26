import pokemonhome as phome
import json

all_seasons = phome.fetch_seasons()
all_seasons = json.loads(all_seasons)

