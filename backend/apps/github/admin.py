from django.contrib import admin

from .models import GitHubAccount, RepositorySync, OAuthState


@admin.register(GitHubAccount)
class GitHubAccountAdmin(admin.ModelAdmin):

    list_display = (
        "user",
        "username",
        "github_id",
        "connected_at",
    )


@admin.register(RepositorySync)
class RepositorySyncAdmin(admin.ModelAdmin):

    list_display = (
        "repository",
        "status",
        "last_synced_at",
    )


@admin.register(OAuthState)
class OAuthStateAdmin(admin.ModelAdmin):

    list_display = (
        "user",
        "state",
        "is_used",
        "created_at",
    )