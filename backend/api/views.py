from django.shortcuts import render
from django.contrib.auth.models import User
from django.db.models import Q

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny

from .serializers import *
from .models import *
from .scripts import pokemonhome as pohome
import json


# Create your views here.

class PokemonListCreate(generics.ListCreateAPIView):
    serializer_class = PokemonSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        cid = self.kwargs["cid"]
        # cid의 포켓몬들을 모두 받아옴
        match = Match.objects.get(pk = cid)
        ranked_pokemons = pohome.fetch_pokemons_rank(match.cid, match.rst, match.ts2)
        q = Q()
        for p in ranked_pokemons:
            q |= Q(pokemon_species_id=p["id"], form=p["form"])
        return Pokemon.objects.filter(q)

class MatchListCreate(generics.ListCreateAPIView):
    serializer_class = MatchSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        rule = self.kwargs["rule"]
        rule_id = 0 if rule=="single" else 1
        return Match.objects.filter(rule=rule_id)