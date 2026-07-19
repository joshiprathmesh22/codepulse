from django.shortcuts import render

# Create your views here.
from rest_framework import generics
from django.shortcuts import get_object_or_404

from .models import Repository
from .serializers import RepositorySerializer


class RepositoryListCreateView(generics.ListCreateAPIView):
    serializer_class = RepositorySerializer

    def get_queryset(self):
        return Repository.objects.filter(
            organization=self.request.user.organization,
            is_active=True,
        )

from apps.collaboration.models import RepositoryMember


def perform_create(self, serializer):

    repository = serializer.save(
        organization=self.request.user.organization,
    )

    RepositoryMember.objects.create(
        repository=repository,
        user=self.request.user,
        role="owner",
    )
class RepositoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class=RepositorySerializer
    
    def get_queryset(self):
        return Repository.objects.filter(
            organization=self.request.user.organization
            )
       