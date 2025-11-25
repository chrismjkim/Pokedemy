from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import PokemonSerializer
# from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import *

import json
from .scripts import pokemonhome

# Create your views here.

class PokemonListCreate(generics.ListCreateAPIView):
    serializer_class = PokemonSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        return Pokemon.objects.filter(pokemon_species_id = 3)