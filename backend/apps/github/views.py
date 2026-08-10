from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import OAuthState 
from .services import GitHubOAuthService, GitHubSyncService
from apps.repositories.models import Repository
from apps.collaboration.models import RepositoryMember
class GitHubLoginView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        url = GitHubOAuthService.get_authorization_url(request.user)

        return Response({
            "authorization_url": url
        })


class GitHubCallbackView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):

        code = request.GET.get("code")
        state = request.GET.get("state")

        if not code or not state:
            return Response(
                {
                    "error": "Authorization code or state not found."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            oauth_state = OAuthState.objects.get(
                state=state,
                is_used=False,
            )
        except OAuthState.DoesNotExist:
            return Response(
                {
                    "error": "Invalid or expired OAuth state."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        token_data = GitHubOAuthService.exchange_code_for_token(code)

        access_token = token_data.get("access_token")

        if not access_token:
            return Response(
                {
                    "error": "Failed to obtain access token.",
                    "github_response": token_data,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        github_user = GitHubOAuthService.get_user(access_token)

        GitHubOAuthService.save_github_account(
            oauth_state.user,
            github_user,
            access_token,
        )

        synced_repositories = GitHubSyncService.sync_repositories(
            oauth_state.user,
            access_token,
        )

        sync_results=[]

        for repository in synced_repositories:
            result = GitHubSyncService.sync_repository_data(
                repository,
                access_token,
            )

        sync_results.append({
            "repository": repository.name,
            **result,
        })
        # oauth_state.is_used = True
        # oauth_state.save()

        return Response(
            {
                "message": "GitHub account connected successfully.",
                "github_username": github_user["login"],
                "repositories_synced": len(synced_repositories),
                "repositories": [
                    repository.name
                    for repository in synced_repositories
                ],
                "data_sync": sync_results,
            },
            status=status.HTTP_200_OK,
        )  
     
class SyncRepositoriesView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        github_account = request.user.github_account

        repositories = GitHubOAuthService.get_repositories(
            github_account.access_token
        )

        synced = []

        for repo in repositories:

            repository, created = Repository.objects.update_or_create(
                github_id=repo["id"],
                defaults={
                    "organization": request.user.organization,
                    "name": repo["name"],
                    "full_name": repo["full_name"],
                    "description": repo["description"] or "",
                    "visibility": "private" if repo["private"] else "public",
                    "default_branch": repo["default_branch"],
                    "is_active": not repo["archived"],
                },
            )
            RepositoryMember.objects.get_or_create( 
                repository=repository, 
                user=request.user, 
                defaults={ "role": "owner",
                }, 
            )
            synced.append(repository.name)

        return Response(
            {
                "message": "Repositories synced successfully.",
                "count": len(synced),
                "repositories": synced,
            }
        )
    
class SyncCommitsView(APIView):

    permsission_classes=[IsAuthenticated]

    def post(self, request, repository_id):

        github_account=request.user.github_account

        repository=Repository.objects.get(
            id=repository_id
        )
        commits=GitHubSyncService.get_commits(
            github_account.access_token,
            repository.full_name,
        )
        return Response(
            {
                "counts": len(commits),
                "commits": commits,
            }
        )