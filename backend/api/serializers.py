from rest_framework import serializers
from .models import *
        
class PokemonSpeciesSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = PokemonSpecies
        fields = "__all__"
        depth = 1

class PokemonSerializer(serializers.ModelSerializer):
    rank_order = serializers.IntegerField(read_only=True)
    class Meta:
        model = Pokemon
        fields = "__all__"
        depth = 1

class MatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Match
        fields = "__all__"

class MoveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Move
        fields = "__all__"
        depth =1

class AbilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Ability
        fields = "__all__"
        depth =1
        
class NatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Nature
        fields = "__all__"
        depth =1

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = "__all__"
        depth =1
        
class TypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Type
        fields = "__all__"
        depth =1
        