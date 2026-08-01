from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import User, Organization


@admin.register(User)
class CustomUserAdmin(UserAdmin):

    ordering = ("email",)

    list_display = (
        "email",
        "full_name",
        "organization",
        "role",
        "is_staff",
        "is_active",
    )

    search_fields = (
        "email",
        "full_name",
    )

    readonly_fields = (
        "last_login",
        "date_joined",
    )

    fieldsets = (
        (None, {
            "fields": (
                "email",
                "password",
            )
        }),
        ("Personal Information", {
            "fields": (
                "full_name",
                "organization",
                "role",
            )
        }),
        ("Permissions", {
            "fields": (
                "is_active",
                "is_staff",
                "is_superuser",
                "groups",
                "user_permissions",
            )
        }),
        ("Important Dates", {
            "fields": (
                "last_login",
                "date_joined",
            )
        }),
    )

    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "email",
                    "full_name",
                    "organization",
                    "role",
                    "password1",
                    "password2",
                ),
            },
        ),
    )


@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):

    list_display = (
        "name",
        "slug",
        "plan",
        "created_at",
    )

    search_fields = (
        "name",
        "slug",
    )

    list_filter = (
        "plan",
    )