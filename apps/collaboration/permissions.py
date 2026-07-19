from rest_framework.permissions import BasePermission

from .models import RepositoryMember

class IsRepositoryAdmin(BasePermission):
    """
    Allow access only to repository owners and admins
    """

    def has_permission(self, request, view):
        repository_id=view.kwargs.get("repository_id")

        if not repository_id:
            return False
        
        return RepositoryMember.objects.filter(
    repository_id=repository_id,
    user=request.user,
    role__in=["owner", "admin"],
).exists()