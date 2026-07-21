from rest_framework import generics

from .models import RepositoryMember
from .serializers import RepositoryMemberSerializer
from .permissions import IsRepositoryAdmin
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.github.services import GitHubOAuthService
from apps.repositories.models import Repository
from .models import Commit

class RepositoryMemberListCreateView(generics.ListCreateAPIView):

    serializer_class = RepositoryMemberSerializer
    permission_classes = [IsRepositoryAdmin]

    def get_queryset(self):
        repository_id = self.kwargs["repository_id"]

        return RepositoryMember.objects.filter(
            repository_id=repository_id
        )
class SyncCommitsView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, repository_id):

        github_account = request.user.github_account

        repository = Repository.objects.get(id=repository_id)

        commits = GitHubOAuthService.get_commits(
            github_account.access_token,
            repository.full_name,
        )

        for commit in commits:

            Commit.objects.update_or_create(
                github_sha=commit["sha"],
                defaults={
                    "repository": repository,
                    "message": commit["commit"]["message"],
                    "author_name": commit["commit"]["author"]["name"],
                    "author_email": commit["commit"]["author"]["email"],
                    "committed_at": commit["commit"]["author"]["date"],
                    "html_url": commit["html_url"],
                },
            )

        return Response({
            "message": "Commits synced successfully",
            "count": len(commits),
        })