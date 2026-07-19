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