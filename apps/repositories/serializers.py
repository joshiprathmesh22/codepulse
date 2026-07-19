from rest_framework import serializers

from .models import Repository


class RepositorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Repository
        fields = (
            "id",
            "name",
            "full_name",
            "description",
            "github_id",
            "visibility",
            "default_branch",
            "is_active",
            "created_at",
        )

        read_only_fields = (
            "id",
            "created_at",
        )