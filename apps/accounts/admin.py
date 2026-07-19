from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import User,Organization


@admin.register(User)
class CustomUserAdmin(UserAdmin):

    ordering = ("email",)

    list_display = (
        "email",
        "full_name",
        "is_staff",
        "is_active",
        "organization",
        "role",
    )

    fieldsets = (

        (None, {
            "fields": (
                "email",
                "password",
            )
        }),
        ("Personal Info", {
            "fields": (
                "full_name",
                "avatar",
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
                "updated_at",
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
                    "password1",
                    "password2",
                ),
            },
        ),
    )

    search_fields = (
        "email",
        "full_name",
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