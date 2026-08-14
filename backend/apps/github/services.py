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
    @staticmethod
    def get_repositories(access_token):

        all_repositories = []

        page = 1

        while True:

            response = requests.get(
                "https://api.github.com/user/repos",
                headers={
                "Authorization": f"Bearer {access_token}",
                "Accept": "application/vnd.github+json",
                },
                params={
                "per_page": 100,
                "page": page,
                "sort": "updated",
                },
            )

            response.raise_for_status()

            repositories = response.json()

            if not repositories:
                break

            all_repositories.extend(repositories)

            if len(repositories) < 100:
                break

            page += 1

        return all_repositories

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

        url = f"https://api.github.com/repos/{full_name}/pulls"

        response = requests.get(
        url,
        headers={
            "Authorization": f"Bearer {access_token}",
            "Accept": "application/vnd.github+json",
        },
        params={
            "state": "all",
            "per_page": 100,
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
    def sync_repositories(user, access_token):

        from apps.repositories.models import Repository
        from apps.collaboration.models import RepositoryMember

        repositories = GitHubOAuthService.get_repositories(
            access_token
        )

        synced = []

        for repo in repositories:

            repository, created = Repository.objects.update_or_create(
                github_id=repo["id"],
                defaults={
                    "organization": user.organization,
                    "name": repo["name"],
                    "full_name": repo["full_name"],
                    "description": repo.get("description") or "",
                    "visibility": (
                        "private"
                        if repo["private"]
                        else "public"
                    ),
                    "default_branch": (
                        repo.get("default_branch")
                        or "main"
                    ),
                    "is_active": not repo.get(
                        "archived",
                        False
                    ),
                },
            )

            RepositoryMember.objects.get_or_create(
                repository=repository,
                user=user,
                defaults={
                    "role": "owner",
                },
            )

            sync_result=(
                GitHubSyncService.sync_repository_data(
                    repository,
                    access_token,
                )         
            )

            total_commits += sync_result["commits"]
            total_branches += sync_result["branches"]
            total_pull_requests += sync_result["pull_requests"]
            total_issues += sync_result["issues"]

            synced.append(repository)
            
        return {
            "repositories": len(synced),
            "commits": total_commits,
            "branches": total_branches,
            "pull_requests": total_pull_requests,
            "issues": total_issues,
        }

    @staticmethod
    def sync_repository_data(
        repository,
        access_token,
    ):

        from apps.collaboration.models import (
            Commit,
            Branch,
            PullRequest,
            Issue,
        )

        full_name = repository.full_name

        # -------------------------
        # COMMITS
        # -------------------------

        commits = GitHubOAuthService.get_commits(
            access_token,
            full_name,
        )

        for commit_data in commits:

            commit_info = commit_data.get(
                "commit",
                {}
            )

            author = commit_info.get(
                "author"
            ) or {}

            Commit.objects.update_or_create(
                github_sha=commit_data["sha"],
                defaults={
                    "repository": repository,
                    "message": commit_info.get(
                        "message",
                        ""
                    ),
                    "author_name": author.get(
                        "name",
                        "Unknown"
                    ),
                    "author_email": author.get(
                        "email",
                        "unknown@example.com"
                    ),
                    "committed_at": author.get(
                        "date"
                    ),
                    "html_url": commit_data.get(
                        "html_url",
                        ""
                    ),
                },
            )

        # -------------------------
        # BRANCHES
        # -------------------------

        branches = GitHubOAuthService.get_branches(
            access_token,
            full_name,
        )

        from apps.collaboration.models import Branch
        for branch_data in branches:

            Branch.objects.update_or_create(
                repository=repository,
                name=branch_data["name"],
                defaults={
                    "is_default": (
                        branch_data["name"]
                        == repository.default_branch
                    ),
                },
            )

        # -------------------------
        # PULL REQUESTS
        # -------------------------

        pull_requests = (
            GitHubOAuthService.get_pull_requests(
                access_token,
                full_name,
            )
        )
        print(f"{full_name} -> {len(pull_requests)} PRs")
        
        for pr_data in pull_requests:

            PullRequest.objects.update_or_create(
                github_id=pr_data["id"],
                defaults={
                    "repository": repository,
                    "title": pr_data["title"],
                    "state": pr_data["state"],
                    "author": (
                        pr_data.get("user", {})
                        .get(
                            "login",
                            "Unknown"
                        )
                    ),
                    "created_at": pr_data["created_at"],
                    "merged": (
                        pr_data.get(
                            "merged_at"
                        )
                        is not None
                    ),
                    "html_url": pr_data[
                        "html_url"
                    ],
                },
            )

        # -------------------------
        # ISSUES
        # -------------------------

        issues = GitHubOAuthService.get_issues(
            access_token,
            full_name,
        )

        for issue_data in issues:

            # GitHub returns pull requests
            # inside the Issues API.
            if "pull_request" in issue_data:
                continue

            Issue.objects.update_or_create(
                github_id=issue_data["id"],
                defaults={
                    "repository": repository,
                    "title": issue_data["title"],
                    "state": issue_data["state"],
                    "author": (
                        issue_data.get("user", {})
                        .get(
                            "login",
                            "Unknown"
                        )
                    ),
                    "created_at": issue_data[
                        "created_at"
                    ],
                    "html_url": issue_data[
                        "html_url"
                    ],
                },
            )

        return {
            "commits": len(commits),
            "branches": len(branches),
            "pull_requests": len(
                pull_requests
            ),
            "issues": len(
                [
                    issue
                    for issue in issues
                    if "pull_request"
                    not in issue
                ]
            ),
        }