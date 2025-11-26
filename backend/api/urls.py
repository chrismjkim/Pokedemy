from django.contrib import admin
from django.urls import path, include

from . import views

urlpatterns = [
    path("pokemons/", views.PokemonListCreate.as_view(), name="pokemon-list"),
    path("matches/", views.MatchListCreate.as_view(), name="pokemon-list"),

]
