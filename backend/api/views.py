import json
import copy

from django.shortcuts import render
from django.contrib.auth.models import User
from django.db.models import Q, Case, When, IntegerField, FloatField

from rest_framework import generics
from rest_framework import serializers as drf_serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny

from .serializers import *
from .models import *
from .models import Type as PokemonType # 이름 충돌 방지
from .scripts import pokemonhome as pohome
from .lookups import get_lookup # lookups.py

# 타입 힌팅
from typing import Dict, Type, List, Tuple

# Create your views here.

def annotate_ranking_list(pokemons):
    q = Q()
    for p in pokemons:
        q |= Q(pokemon_species_id=p["id"], form=p["form"])
    # cases: annotate로 생성할 동적 필드
    cases = [
        When(pokemon_species_id=p["id"], form=p["form"], then=idx+1)
        # then: When의 query 조건을 만족할 때 annotate에 넣을 값
        for idx, p in enumerate(pokemons)
    ]

    return (Pokemon.objects.filter(q)
        .select_related("pokemon_species_id") # N+1 참조 해결
        .annotate(rank_order=Case(*cases, output_field=IntegerField()))
        .order_by("rank_order"))

def annotate_detail_list(array, key_name):
    target_models = {
        'pokemon': "pokemon",
        'waza': "move", 
        'motimono': "item", 
        'tokusei': "ability", 
        'seikaku': "nature", 
        'terastal': "type"
    }
    array_to_dict = {}
    key = target_models[key_name]
    lookup = get_lookup(key)
    
    # key_name이 pokemon인 경우
    if key=="pokemon": 
        for rank, p in enumerate(array):
            lu_key = p["id"] * 1000 + p["form"]
            array_to_dict[lu_key] = copy.deepcopy(lookup[lu_key])
            array_to_dict[lu_key]['rank_order'] = rank+1
    # key_name이 pokemon이 아닌 경우
    else: 
        for rank, object in enumerate(array):
            obj_id = str(object['id'])
            try:
                array_to_dict[obj_id] = copy.deepcopy(lookup[obj_id])
            except:
                array_to_dict[obj_id] = copy.deepcopy(lookup[int(obj_id)])
            array_to_dict[obj_id]['rank_order'] = rank+1
            array_to_dict[obj_id]['usage_rate'] = object['val']
            
    return array_to_dict
    

class PokemonListCreate(generics.ListCreateAPIView):
    serializer_class = PokemonSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        cid = self.kwargs["cid"]
        match = Match.objects.get(pk=cid) # cid의 포켓몬들을 모두 받아옴
        # ranked_pokemons: Dict 배열
        ranked_pokemons = pohome.fetch_pokemons_rank(match.cid, match.rst, match.ts2)
        return annotate_ranking_list(ranked_pokemons)


class MatchListCreate(generics.ListCreateAPIView):
    serializer_class = MatchSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        rule = self.kwargs["rule"]
        rule_id = 0 if rule=="single" else 1
        return Match.objects.filter(rule=rule_id)


# 여러 모델에 대한 custom payload는 APIView 사용
class PokemonDetailListCreate(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, cid):
        
        match = Match.objects.get(pk=cid)
        all_details = pohome.fetch_pokemon_details(match.cid, match.rst, match.ts2)
        def fill_tlw(tlw: Dict) -> Dict:
            # temoti, lose, win을 입력받고, json을 채워서 돌려줌
            for key_name, array in tlw.items():
                tlw[key_name] = annotate_detail_list(array, key_name)
            return tlw
        
        # Hinting
        forms_details: Dict[str, Dict]
        details: Dict[str, Dict]
        # json 가공, 각 포켓몬 (id, form)에 대해 처리
        for forms_details in all_details.values():
            for details in forms_details.values():
                for key in ("temoti", "lose", "win"):
                # temoti, lose, win으로 전체 json 분할
                    details[key] = fill_tlw(details[key])
        # 가공된 json을 return한다
        return Response(all_details)
    