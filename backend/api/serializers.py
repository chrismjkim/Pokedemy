from rest_framework import serializers
from .models import *
        
class PokemonSpeciesSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = PokemonSpecies
        fields = "__all__"
        depth = 1

class PokemonSerializer(serializers.ModelSerializer):
    pokemon_species = PokemonSpeciesSerializer(source="pokemon_species_id", read_only=True)
    rank_order = serializers.IntegerField(read_only=True)
    class Meta:
        model = Pokemon
        fields = "__all__"
        depth = 1

class MatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Match
        fields = "__all__"
