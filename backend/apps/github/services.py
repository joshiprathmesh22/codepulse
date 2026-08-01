import requests

from django.conf import settings
from .models import GitHubAccount, OAuthState

class GitHubOAuthService:

    @staticmethod
    def get_authorization_url(user):

        oauth_state=OAuthState.objects.create(
            user=user
        )
        authorization_url = (
            "https://github.com/login/oauth/authorize"
            f"?client_id={settings.GITHUB_CLIENT_ID}"
            f"&redirect_uri={settings.GITHUB_REDIRECT_URI}"
            f"&state={oauth_state.state}"
            "&scope=repo read:user user:email"
        )
        return authorization_url

    @staticmethod
    def exchange_code_for_token(code):

        response = requests.post(
            "https://github.com/login/oauth/access_token",
            headers={
                "Accept": "application/json",
            },
            data={
                "client_id": settings.GITHUB_CLIENT_ID,
                "client_secret": settings.GITHUB_CLIENT_SECRET,
                "code": code,
                "redirect_uri": settings.GITHUB_REDIRECT_URI,
            },
        )

        return response.json()

    @staticmethod
    def get_user(access_token):

        response = requests.get(
            "https://api.github.com/user",
            headers={
                "Authorization": f"Bearer {access_token}",
                "Accept": "application/vnd.github+json",
            },
        )

        return response.json()
    
    @staticmethod
    def save_github_account(user, github_user, access_token):

        github_account, created=GitHubAccount.objects.update_or_create(
            user=user,
            defaults={
                "github_id": github_user["id"],
                "username":github_user["login"],
                "avatar_url": github_user.get("avatar_url",""),
                "access_token": access_token,
            }
        )

        return github_account
    @staticmethod
    def get_repositories(access_token):

        response = requests.get(
        "https://api.github.com/user/repos",
        headers={
            "Authorization": f"Bearer {access_token}",
            "Accept": "application/vnd.github+json",
        },
    )

        response.raise_for_status()

        return response.json()

    @staticmethod
    def get_commits(access_token, full_name):

        response = requests.get(
        f"https://api.github.com/repos/{full_name}/commits",
        headers={
            "Authorization": f"Bearer {access_token}",
            "Accept": "application/vnd.github+json",
        },
    )

        response.raise_for_status()

        return response.json()

    @staticmethod
    def get_branches(access_token, full_name):
        response = requests.get(
        f"https://api.github.com/repos/{full_name}/branches",
        headers={
            "Authorization": f"Bearer {access_token}",
            "Accept": "application/vnd.github+json",
        },
    )

        response.raise_for_status()

        return response.json()
    @staticmethod
    def get_pull_requests(access_token, full_name):

        response = requests.get(
        f"https://api.github.com/repos/{full_name}/pulls?state=all",
        headers={
            "Authorization": f"Bearer {access_token}",
            "Accept": "application/vnd.github+json",
        },
    )

        response.raise_for_status()

        return response.json()
    @staticmethod
    def get_issues(access_token, full_name):

        response = requests.get(
        f"https://api.github.com/repos/{full_name}/issues?state=all",
        headers={
            "Authorization": f"Bearer {access_token}",
            "Accept": "application/vnd.github+json",
        },
    )

        response.raise_for_status()

        return response.json()
class GitHubSyncService:

    @staticmethod
    def get_commits(access_token, full_name):

        response = requests.get(
            f"https://api.github.com/repos/{full_name}/commits",
            headers={
                "Authorization": f"Bearer {access_token}",
                "Accept": "application/vnd.github+json",
            },
        )

        response.raise_for_status()

        return response.json()        