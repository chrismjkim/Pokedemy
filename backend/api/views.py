from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
# from .serializers import SeasonSerializer
# from rest_framework.permissions import IsAuthenticated, AllowAny
# from .models import Season, Match

# Create your views here.

class SeasonListCreate(generics.ListCreateAPIView):
    # serializer_class = SeasonSerializer
    
    def get_queryset(self):
        return 1