from django.db import models

from apps.accounts.models import User
from apps.repositories.models import Repository

import uuid

class GitHubAccount(models.Model):

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="github_account",
    )

    github_id = models.BigIntegerField(unique=True)

    username = models.CharField(max_length=255)

    avatar_url = models.URLField(blank=True)

    access_token = models.TextField()

    connected_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.username


class RepositorySync(models.Model):

    STATUS_CHOICES = (
        ("pending", "Pending"),
        ("syncing", "Syncing"),
        ("completed", "Completed"),
        ("failed", "Failed"),
    )

    repository = models.OneToOneField(
        Repository,
        on_delete=models.CASCADE,
        related_name="sync",
    )

    last_synced_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending",
    )

    total_commits = models.IntegerField(default=0)

    total_pull_requests = models.IntegerField(default=0)

    def __str__(self):
        return self.repository.name
    
class OAuthState(models.Model):
    
    state=models.UUIDField(
        default=uuid.uuid4,
        unique=True,
        editable=False,
    )

    user=models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="oauth_states",
    )

    created_at=models.DateTimeField(
        auto_now_add=True,
    )

    is_used=models.BooleanField(
        default=False,
    )

    def __str__(self):
        return str(self.state)
    
