from rest_framework import serializers

from .models import RepositoryMember


class RepositoryMemberSerializer(serializers.ModelSerializer):

    user_email = serializers.ReadOnlyField(source="user.email")

    class Meta:
        model = RepositoryMember
        fields = (
            "id",
            "user",
            "user_email",
            "role",
            "joined_at",
        )

        read_only_fields = (
            "id",
            "joined_at",
        )

class DeveloperAnalyticsSerializer(serializers.Serializer):
    rank = serializers.IntegerField()

    developer = serializers.CharField()

    email = serializers.EmailField()

    role = serializers.CharField()

    commits = serializers.IntegerField()

    pull_requests = serializers.IntegerField()

    issues = serializers.IntegerField()

    score = serializers.IntegerField()
 
class RepositoryHealthSerializer(serializers.Serializer):

    repository=serializers.CharField()

    health_score=serializers.IntegerField()

    commits=serializers.IntegerField()

    branches=serializers.IntegerField()

    pull_requests=serializers.IntegerField()

    status=serializers.CharField()

class CommitActivitySerializer(serializers.Serializer):

    date = serializers.DateField()

    commits = serializers.IntegerField()

