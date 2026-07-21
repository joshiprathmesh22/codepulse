from django.db import models

from apps.accounts.models import User
from apps.repositories.models import Repository


class RepositoryMember(models.Model):

    ROLE_CHOICES = (
        ("owner", "Owner"),
        ("admin", "Admin"),
        ("developer", "Developer"),
        ("viewer", "Viewer"),
    )

    repository = models.ForeignKey(
        Repository,
        on_delete=models.CASCADE,
        related_name="members",
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="repository_memberships",
    )

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default="developer",
    )

    joined_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:
        unique_together = (
            "repository",
            "user",
        )

    def __str__(self):
        return f"{self.user.email} -> {self.repository.name}"
    
class Commit(models.Model):

    repository=models.ForeignKey(
        Repository,
        on_delete=models.CASCADE,
        related_name="commits",
    )

    github_sha=models.CharField(max_length=255,unique=True)

    message=models.TextField()

    author_name=models.CharField(max_length=255,)

    author_email=models.EmailField()

    committed_at  =models.DateTimeField()
    html_url = models.URLField()

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    def __str__(self):
        return self.github_sha[:7]

class Branch(models.Model):

        repository = models.ForeignKey(
        Repository,
        on_delete=models.CASCADE,
        related_name="branches",
    )

        name = models.CharField(max_length=255,)

        is_default = models.BooleanField(default=False,)

        def __str__(self):
            return self.name
        
class PullRequest(models.Model):

    repository = models.ForeignKey(
        Repository,
        on_delete=models.CASCADE,
        related_name="pull_requests",
    )

    github_id = models.BigIntegerField(
        unique=True,
    )

    title = models.CharField(
        max_length=500,
    )

    state = models.CharField(
        max_length=20,
    )

    author = models.CharField(
        max_length=255,
    )

    created_at = models.DateTimeField()

    merged = models.BooleanField(
        default=False,
    )

    html_url = models.URLField()

    def __str__(self):
        return self.title
    
class Issue(models.Model):

    repository = models.ForeignKey(
        Repository,
        on_delete=models.CASCADE,
        related_name="issues",
    )

    github_id = models.BigIntegerField(
        unique=True,
    )

    title = models.CharField(
        max_length=500,
    )

    state = models.CharField(
        max_length=20,
    )

    author = models.CharField(
        max_length=255,
    )

    created_at = models.DateTimeField()

    html_url = models.URLField()

    def __str__(self):
        return self.title