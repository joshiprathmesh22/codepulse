from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.db import models


class CustomUserManager(BaseUserManager):
    def create_user(self, email, full_name, password=None, **extra_fields):
        if not email:
            raise ValueError("Email address is required")

        email = self.normalize_email(email)

        user = self.model(
            email=email,
            full_name=full_name,
            **extra_fields
        )

        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, full_name, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        return self.create_user(
            email=email,
            full_name=full_name,
            password=password,
            **extra_fields
        )
class Organization(models.Model):
    PLAN_CHOICES = (
        ("free", "Free"),
        ("pro", "Pro"),
        ("enterprise", "Enterprise"),
    )

    name = models.CharField(max_length=150)

    slug = models.SlugField(
        unique=True
    )

    avatar = models.URLField(
        blank=True
    )

    plan = models.CharField(
        max_length=20,
        choices=PLAN_CHOICES,
        default="free",
    )

    github_installation_id = models.BigIntegerField(
        null=True,
        blank=True,
        unique=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    def __str__(self):
        return self.name
class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)

    full_name = models.CharField(
        max_length=255
    )

    is_active = models.BooleanField(
        default=True
    )

    is_staff = models.BooleanField(
        default=False
    )

    date_joined = models.DateTimeField(
        auto_now_add=True
    )

    objects = CustomUserManager()

    USERNAME_FIELD = "email"

    REQUIRED_FIELDS = ["full_name"]
    organization = models.ForeignKey(
    Organization,
    on_delete=models.CASCADE,
    related_name="users",
    null=True,
    blank=True,
)
    ROLE_CHOICES = (
    ("owner", "Owner"),
    ("admin", "Admin"),
    ("developer", "Developer"),
    ("viewer", "Viewer"),
)

    role = models.CharField(
    max_length=20,
    choices=ROLE_CHOICES,
    default="developer",
)
    def __str__(self):
        return self.email

