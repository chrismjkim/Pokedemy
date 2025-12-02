from django.shortcuts import render
from django.contrib.auth.models import User
from django.db.models import Q, Case, When, IntegerField

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
        match = Match.objects.get(pk=cid) # cid의 포켓몬들을 모두 받아옴
        # ranked_pokemons: Dict 배열
        ranked_pokemons = pohome.fetch_pokemons_rank(match.cid, match.rst, match.ts2)
        
        q = Q()
        for p in ranked_pokemons:
            q |= Q(pokemon_species_id=p["id"], form=p["form"])
            
        # cases: annotate로 생성할 동적 필드
        cases = [
            When(pokemon_species_id=p["id"], form=p["form"], then=idx+1)
            # then: When의 query 조건을 만족할 때 annotate에 넣을 값
            for idx, p in enumerate(ranked_pokemons)
        ]
        return (Pokemon.objects.filter(q)
            .select_related("pokemon_species_id") # N+1 참조 해결
            .annotate(rank_order=Case(*cases, output_field=IntegerField()))
            .order_by("rank_order")
            
        )

class MatchListCreate(generics.ListCreateAPIView):
    serializer_class = MatchSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        rule = self.kwargs["rule"]
        rule_id = 0 if rule=="single" else 1
        return Match.objects.filter(rule=rule_id)