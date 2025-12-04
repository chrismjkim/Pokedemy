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
from .scripts import pokemonhome as pohome
import json

# 타입 힌팅
from typing import Dict, Type

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
        'waza': (Move, MoveSerializer), 
        'tokusei': (Ability, AbilitySerializer), 
        'seikaku': (Nature, NatureSerializer), 
        'motimono': (Item, ItemSerializer), 
        'terastal': (Type, TypeSerializer),
        'pokemon': (Pokemon, PokemonSerializer)
    }
    target_model, target_serializer = target_models[key_name]
    # Hinting
    target_model: models.Model
    target_serializer: Type[drf_serializers.Serializer]
    
    q = Q()
    
    # target_model이 Pokemon인 경우
    if target_model==Pokemon:
        for p in array:
            q |= Q(pokemon_species_id=p["id"], form=p["form"])
        cases = [
            When(pokemon_species_id=p["id"], form=p["form"], then=idx+1)
            for idx, p in enumerate(array)
        ]
        qs = (Pokemon.objects.filter(q)
            .select_related("pokemon_species_id") # N+1 참조 해결
            .annotate(rank_order=Case(*cases, output_field=IntegerField()))
            .order_by("rank_order"))
        return target_serializer(qs, many=True).data
    # target 모델이 Pokemon이 아닌 경우
    else:
        for object in array:
            q |= Q(id=object["id"])
        # rank_cases: 순위 
        rank_cases = [
            When(id=object["id"], then=idx+1) for idx, object in enumerate(array)
        ]
        # val_cases: 채용률
        val_cases = [
            When(id=object["id"], then=float(object['val'])) for object in array
        ]
        qs = (target_model.objects.filter(q)
            .annotate(rank_order=Case(*rank_cases, output_field=IntegerField()))
            .annotate(use_rate=Case(*val_cases, output_field=FloatField()))
            .order_by("rank_order"))
        return target_serializer(qs, many=True).data


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
    
    """


class PokemonDetailsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pokemon_id):
        # 1) 도메인 쿼리
        moves = Move.objects.filter(...)[:10]
        nature = Nature.objects.filter(...).first()
        tera_type = Type.objects.filter(...).first()
        item = Item.objects.filter(...).first()
        teammates = Pokemon.objects.filter(...).order_by('-freq')[:6]

        # 2) 각기 직렬화
        data = {
            "moves": MoveSerializer(moves, many=True).data,
            "nature": NatureSerializer(nature).data if nature else None,
            "tera_type": TypeSerializer(tera_type).data if tera_type else None,
            "item": ItemSerializer(item).data if item else None,
            "teammates": PokemonSerializer(teammates, many=True).data,
        }
        return Response(data)

    
    class PokemonDetailsPayload(serializers.Serializer):
    moves = MoveSerializer(many=True)
    nature = NatureSerializer(allow_null=True)
    tera_type = TypeSerializer(allow_null=True)
    item = ItemSerializer(allow_null=True)
    teammates = PokemonSerializer(many=True)

    """
