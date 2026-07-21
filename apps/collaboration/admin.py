from django.contrib import admin

from .models import RepositoryMember,Commit


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