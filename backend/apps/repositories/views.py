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
            organization=request.user.organization,
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


class RepositoryCommitsView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, repository_id):

        repository = get_object_or_404(
            Repository,
            id=repository_id,
            organization=request.user.organization,
        )

        commits = Commit.objects.filter(
            repository=repository
        ).order_by("-committed_at")

        data = []

        for commit in commits:

            data.append({
                "id": commit.id,
                "sha": commit.github_sha,
                "message": commit.message,
                "author_name": commit.author_name,
                "author_email": commit.author_email,
                "committed_at": commit.committed_at,
                "html_url": commit.html_url,
            })

        return Response({
            "repository": repository.name,
            "count": len(data),
            "commits": data,
        })
class RepositoryBranchesView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, repository_id):

        repository = get_object_or_404(
            Repository,
            id=repository_id,
            organization=request.user.organization,
        )

        branches = Branch.objects.filter(
            repository=repository
        ).order_by(
            "-is_default",
            "name",
        )

        data = []

        for branch in branches:

            data.append(
                {
                    "id": branch.id,
                    "name": branch.name,
                    "is_default": branch.is_default,
                }
            )

        return Response(
            {
                "repository": repository.name,
                "count": len(data),
                "branches": data,
            }
        )

class RepositoryPullRequestsView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, repository_id):

        repository = get_object_or_404(
            Repository,
            id=repository_id,
            organization=request.user.organization,
        )

        pull_requests = PullRequest.objects.filter(
            repository=repository
        ).order_by("-created_at")

        data = []

        for pull_request in pull_requests:

            data.append(
                {
                    "id": pull_request.id,
                    "github_id": pull_request.github_id,
                    "title": pull_request.title,
                    "state": pull_request.state,
                    "author": pull_request.author,
                    "created_at": pull_request.created_at,
                    "merged": pull_request.merged,
                    "html_url": pull_request.html_url,
                }
            )

        return Response(
            {
                "repository": repository.name,
                "count": len(data),
                "pull_requests": data,
            }
        )
class RepositoryIssuesView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, repository_id):

        repository = get_object_or_404(
            Repository,
            id=repository_id,
            organization=request.user.organization,
        )

        issues = Issue.objects.filter(
            repository=repository
        ).order_by("-created_at")

        data = []

        for issue in issues:

            data.append(
                {
                    "id": issue.id,
                    "github_id": issue.github_id,
                    "title": issue.title,
                    "state": issue.state,
                    "author": issue.author,
                    "created_at": issue.created_at,
                    "html_url": issue.html_url,
                }
            )

        return Response(
            {
                "repository": repository.name,
                "count": len(data),
                "issues": data,
            }
        )

class AllCommitsView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        organization = request.user.organization

        commits = (
            Commit.objects
            .filter(repository__organization=organization)
            .select_related("repository")
            .order_by("-committed_at")
        )

        data = []

        for commit in commits:

            data.append({
                "id": commit.id,
                "sha": commit.github_sha,
                "message": commit.message,
                "author_name": commit.author_name,
                "author_email": commit.author_email,
                "committed_at": commit.committed_at,
                "html_url": commit.html_url,
                "repository": {
                    "id": commit.repository.id,
                    "name": commit.repository.name,
                    "full_name": commit.repository.full_name,
                },
            })

        return Response({
            "count": len(data),
            "commits": data,
        })

class AllPullRequestsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        organization = request.user.organization

        pull_requests = PullRequest.objects.filter(
            repository__organization=organization
        ).select_related(
            "repository"
        ).order_by(
            "-created_at"
        )

        data = []

        for pull_request in pull_requests:

            data.append({
                "id": pull_request.id,
                "github_id": pull_request.github_id,
                "title": pull_request.title,
                "state": pull_request.state,
                "author": pull_request.author,
                "created_at": pull_request.created_at,
                "merged": pull_request.merged,
                "html_url": pull_request.html_url,

                "repository": {
                    "id": pull_request.repository.id,
                    "name": pull_request.repository.name,
                    "full_name": pull_request.repository.full_name,
                },
            })

        return Response({
            "count": len(data),
            "pull_requests": data,
        })

class OrganizationIssuesView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        organization = request.user.organization

        issues = Issue.objects.filter(
            repository__organization=organization
        ).select_related(
            "repository"
        ).order_by(
            "-created_at"
        )

        data = []

        for issue in issues:

            data.append(
                {
                    "id": issue.id,

                    "title": issue.title,

                    "state": issue.state,

                    "author": issue.author,

                    "created_at": issue.created_at,

                    "html_url": issue.html_url,

                    "repository": {
                        "id": issue.repository.id,
                        "name": issue.repository.name,
                        "full_name": issue.repository.full_name,
                    },
                }
            )

        return Response(
            {
                "issues": data,
                "total": issues.count(),
            }
        )