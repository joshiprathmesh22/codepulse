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

class RepositoryDashboardSerializer(serializers.Serializer):

    repository = serializers.CharField()

    default_branch = serializers.CharField()

    total_commits = serializers.IntegerField()

    total_branches = serializers.IntegerField()

    total_pull_requests = serializers.IntegerField()

    merged_pull_requests = serializers.IntegerField()

    open_pull_requests = serializers.IntegerField()

    total_issues = serializers.IntegerField()

    open_issues = serializers.IntegerField()

    closed_issues = serializers.IntegerField()

    total_members = serializers.IntegerField()

    latest_commit = serializers.CharField(
        allow_null=True,
    )