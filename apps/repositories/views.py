from django.shortcuts import render

from rest_framework import generics
from django.shortcuts import get_object_or_404

from .models import Repository
from .serializers import RepositorySerializer,RepositoryDashboardSerializer

from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from apps.collaboration.models import (
    Commit,
    Branch,
    PullRequest,
    Issue,
    RepositoryMember,
)
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

class RepositoryDashboardView(APIView):

    permission_classes=[IsAuthenticated]

    def get(self, request, repository_id):

        repository=get_object_or_404(
            Repository,
            id=repository_id,
        )

        data = {
            "repository": repository.name,
            "default_branch": repository.default_branch,
            "total_commits": Commit.objects.filter(
                repository=repository
            ).count(),

            "total_branches": Branch.objects.filter(
                repository=repository
            ).count(),

            "total_pull_requests": PullRequest.objects.filter(
                repository=repository
            ).count(),

            "merged_pull_requests": PullRequest.objects.filter(
            repository=repository,
            merged=True,
            ).count(),

            "open_pull_requests": PullRequest.objects.filter(
            repository=repository,
            state="open",
            ).count(),

            "total_issues": Issue.objects.filter(
                repository=repository
            ).count(),

            "open_issues": Issue.objects.filter(
            repository=repository,
            state="open",
            ).count(),

            "closed_issues": Issue.objects.filter(
            repository=repository,
            state="closed",
            ).count(),

            "total_members": RepositoryMember.objects.filter(
                repository=repository
            ).count(),

            "open_issues": Issue.objects.filter(
            repository=repository,
            state="open",
            ).count(),

            "closed_issues": Issue.objects.filter(
            repository=repository,
            state="closed",
            ).count(),
            
        }

        serializer = RepositoryDashboardSerializer(data)

        return Response(serializer.data)