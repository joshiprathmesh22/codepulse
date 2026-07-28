from django.contrib import admin

from .models import RepositoryMember,Commit, Branch, PullRequest, Issue


@admin.register(RepositoryMember)
class RepositoryMemberAdmin(admin.ModelAdmin):

    list_display = (
        "repository",
        "user",
        "role",
        "joined_at",
    )

    search_fields = (
        "user__email",
        "repository__name",
    )

    list_filter = (
        "role",
    )
@admin.register(Commit)
class CommitAdmin(admin.ModelAdmin):

    list_display = (
        "github_sha",
        "repository",
        "author_name",
        "committed_at",   # or "commited_at" if you didn't rename the field
    )

    search_fields = (
        "github_sha",
        "author_name",
        "author_email",
        "repository__name",
    )

    list_filter = (
        "repository",
    )

    ordering = (
        "-committed_at",   # or "-commited_at"
    )

@admin.register(Branch)
class BranchAdmin(admin.ModelAdmin):

    list_display = (
        "name",
        "repository",
        "is_default",
    )

    search_fields = (
        "name",
        "repository__name",
    )

    list_filter = (
        "is_default",
    )

@admin.register(PullRequest)
class PullRequestAdmin(admin.ModelAdmin):

    list_display = (
        "title",
        "repository",
        "author",
        "state",
        "merged",
        "created_at",
    )

    search_fields = (
        "title",
        "author",
        "repository__name",
    )

    list_filter = (
        "state",
        "merged",
    )

    ordering = (
        "-created_at",
    )
@admin.register(Issue)
class IssueAdmin(admin.ModelAdmin):

    list_display = (
        "title",
        "repository",
        "author",
        "state",
        "created_at",
    )

    search_fields = (
        "title",
        "author",
        "repository__name",
    )

    list_filter = (
        "state",
    )

    ordering = (
        "-created_at",
    )