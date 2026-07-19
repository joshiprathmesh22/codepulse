from django.db import transaction
from django.utils.text import slugify
from rest_framework import serializers

from .models import User, Organization


class RegisterSerializer(serializers.ModelSerializer):
    organization_name = serializers.CharField(write_only=True)
    password = serializers.CharField(
        write_only=True,
        min_length=8,
        style={"input_type": "password"},
    )

    class Meta:
        model = User
        fields = (
            "organization_name",
            "full_name",
            "email",
            "password",
        )

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "A user with this email already exists."
            )
        return value

    @transaction.atomic
    def create(self, validated_data):
        organization_name = validated_data.pop("organization_name")

        slug = slugify(organization_name)

        # Make slug unique
        original_slug = slug
        counter = 1

        while Organization.objects.filter(slug=slug).exists():
            slug = f"{original_slug}-{counter}"
            counter += 1

        organization = Organization.objects.create(
            name=organization_name,
            slug=slug,
        )

        user = User.objects.create_user(
            organization=organization,
            role="owner",
            **validated_data
        )

        return user
from django.contrib.auth import authenticate
from rest_framework import serializers


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        user = authenticate(
            username=email,
            password=password,
        )

        if not user:
            raise serializers.ValidationError(
                "Invalid email or password."
            )

        if not user.is_active:
            raise serializers.ValidationError(
                "User account is disabled."
            )

        attrs["user"] = user
        return attrs