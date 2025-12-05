# backend/api/lookups.py
from threading import Lock

from .serializers import *
from .models import Pokemon, Move, Item, Ability, Nature, Type

LOOKUPS = {}
_LOOKUPS_WARMED = False
_LOOKUPS_LOCK = Lock()


def _build_lookup_tables():
    """
    실제로 DB에서 다 긁어와서 LOOKUPS 딕셔너리를 채우는 함수
    (이 함수 안에서만 DB 쿼리 실행)
    """
    # select_related(): FK JOIN으로 N+1 방지
    moves = MoveSerializer(Move.objects.all().select_related(), many=True).data
    pokemons = PokemonSerializer(Pokemon.objects.all().select_related(), many=True).data
    items = ItemSerializer(Item.objects.all().select_related(), many=True).data
    abilities = AbilitySerializer(Ability.objects.all().select_related(), many=True).data
    natures = NatureSerializer(Nature.objects.all().select_related(), many=True).data
    types = TypeSerializer(Type.objects.all().select_related(), many=True).data

    LOOKUPS["pokemon"] = {
        p["pokemon_species_id"]["id"] * 1000 + p["form"]: p
        for p in pokemons
    }
    LOOKUPS["move"] = {str(m["id"]): m for m in moves}
    LOOKUPS["item"] = {str(m["id"]): m for m in items}
    LOOKUPS["ability"] = {str(m["id"]): m for m in abilities}
    LOOKUPS["nature"] = {str(m["id"]): m for m in natures}
    LOOKUPS["type"] = {str(m["id"]): m for m in types}


def warm_lookup_tables(force=False):
    """
    - 앱 초기화 시점에는 호출하지 말고,
    - 실제로 필요할 때 (뷰/서비스 함수에서) 호출하도록 만든 진입점.
    """
    global _LOOKUPS_WARMED

    if _LOOKUPS_WARMED and not force:
        return LOOKUPS

    # 멀티 스레드 환경 대비
    with _LOOKUPS_LOCK:
        if _LOOKUPS_WARMED and not force:
            return LOOKUPS

        _build_lookup_tables()
        _LOOKUPS_WARMED = True
        return LOOKUPS


def get_lookup(kind):
    """
    외부에서 LOOKUPS를 쓸 때는 이 함수로 접근하게 하면 안전.
    사용 예: pokemon = get_lookup("pokemon")[(species_id, form)]
    """
    warm_lookup_tables()  # 필요하면 이 안에서 한 번만 로딩
    return LOOKUPS[kind]
