from django.contrib import admin
from django.urls import path, include

from . import views

urlpatterns = [
    path("pokemons/<str:cid>/", views.PokemonListCreate.as_view(), name="pokemon-list"),
    path("matches/<str:rule>/", views.MatchListCreate.as_view(), name="match-list"),
    path("pdetails/<str:cid>/", views.PokemonDetailListCreate.as_view(), name="pdetail-list")
    # path("moves/<str:id>/", views.MoveListCreate.as_view(), name="move-list"),
    # path("items/<str:id>/", views.ItemListCreate.as_view(), name="item-list"),
    # path("natures/<str:id>/", views.NatureListCreate.as_view(), name="nature-list"),
    # path("types/<str:id>/", views.TypeListCreate.as_view(), name="type-list"),
]
