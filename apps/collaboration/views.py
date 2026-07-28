from rest_framework import generics
from django.shortcuts import get_object_or_404

from .models import RepositoryMember
from .serializers import RepositoryMemberSerializer, DeveloperAnalyticsSerializer
from .permissions import IsRepositoryAdmin
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from apps.github.services import GitHubOAuthService
from apps.repositories.models import Repository
from .models import Commit, Branch , PullRequest ,Issue



from apps.repositories.models import Repository
from apps.github.services import GitHubOAuthService

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

class SyncBranchesView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, repository_id):

        repository = get_object_or_404(
            Repository,
            id=repository_id,
        )

        github_account = request.user.github_account

        branches = GitHubOAuthService.get_branches(
            github_account.access_token,
            repository.full_name,
        )

        for branch in branches:

            Branch.objects.update_or_create(
                repository=repository,
                name=branch["name"],
                defaults={
                    "is_default": (
                        branch["name"] == repository.default_branch
                    ),
                },
            )

        return Response(
            {
                "message": "Branches synced successfully",
                "count": len(branches),
            }
        )

class SyncPullRequestsView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, repository_id):

        repository = get_object_or_404(
            Repository,
            id=repository_id,
        )

        github_account = request.user.github_account

        pull_requests = GitHubOAuthService.get_pull_requests(
            github_account.access_token,
            repository.full_name,
        )

        for pr in pull_requests:

            PullRequest.objects.update_or_create(
                github_id=pr["id"],
                defaults={
                    "repository": repository,
                    "title": pr["title"],
                    "state": pr["state"],
                    "author": pr["user"]["login"],
                    "created_at": pr["created_at"],
                    "merged": pr["merged_at"] is not None,
                    "html_url": pr["html_url"],
                },
            )

        return Response(
            {
                "message": "Pull requests synced successfully",
                "count": len(pull_requests),
            }
        )
class SyncIssuesView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, repository_id):

        repository = get_object_or_404(
            Repository,
            id=repository_id,
        )

        github_account = request.user.github_account

        issues = GitHubOAuthService.get_issues(
            github_account.access_token,
            repository.full_name,
        )

        count = 0

        for issue in issues:

            # Skip Pull Requests
            if "pull_request" in issue:
                continue

            Issue.objects.update_or_create(
                github_id=issue["id"],
                defaults={
                    "repository": repository,
                    "title": issue["title"],
                    "state": issue["state"],
                    "author": issue["user"]["login"],
                    "created_at": issue["created_at"],
                    "html_url": issue["html_url"],
                },
            )

            count += 1

        return Response(
            {
                "message": "Issues synced successfully",
                "count": count,
            }
        )

class DeveloperAnalyticsView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, repository_id):

        repository = get_object_or_404(
            Repository,
            id=repository_id,
        )

        members = RepositoryMember.objects.filter(
            repository=repository
        )

        data = []

        for member in members:

            commits = Commit.objects.filter(
                repository=repository,
                author_email=member.user.email,
            ).count()

            pull_requests = PullRequest.objects.filter(
                repository=repository,
                author=member.user.full_name,
            ).count()

            issues = Issue.objects.filter(
                repository=repository,
                author=member.user.full_name,
            ).count()

            score = (
                commits * 5
                + pull_requests * 10
                + issues * 3
            )

            data.append(
                {
                    "developer": member.user.full_name,
                    "email": member.user.email,
                    "role": member.role,
                    "commits": commits,
                    "pull_requests": pull_requests,
                    "issues": issues,
                    "score": score,
                }
            )

        serializer = DeveloperAnalyticsSerializer(
            data,
            many=True,
        )

        return Response(serializer.data)