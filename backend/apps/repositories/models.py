from django.db import models

from apps.accounts.models import Organization


class Repository(models.Model):
    VISIBILITY_CHOICES=(
        ("public", "Public"),
        ("private", "Private"),
    )

    organization=models.ForeignKey(
        Organization,on_delete=models.CASCADE,related_name="repositories",
    )

    name=models.CharField(max_length=255)

    full_name=models.TextField(max_length=255,unique=True)

    description=models.TextField(blank=True)
    
    github_id=models.BigIntegerField(unique=True)

    default_branch=models.CharField(max_length=100,default="main")
    
    visibility=models.CharField(max_length=20,choices=VISIBILITY_CHOICES,default="private",)

    is_active=models.BooleanField(default=True,)

    created_at=models.DateTimeField(auto_now_add=True)

    updated_at=models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.full_name