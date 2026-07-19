from django.contrib import admin

from .models import RepositoryMember


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