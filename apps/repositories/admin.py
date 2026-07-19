from django.contrib import admin

from .models import Repository


@admin.register(Repository)
class RepositoryAdmin(admin.ModelAdmin):

    list_display = (
        "name",
        "organization",
        "visibility",
        "default_branch",
        "is_active",
    )

    search_fields = (
        "name",
        "full_name",
    )

    list_filter = (
        "visibility",
        "organization",
    )