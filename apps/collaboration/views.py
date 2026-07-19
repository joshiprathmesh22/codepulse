from rest_framework import generics

from .models import RepositoryMember
from .serializers import RepositoryMemberSerializer
from .permissions import IsRepositoryAdmin

class RepositoryMemberListCreateView(generics.ListCreateAPIView):

    serializer_class = RepositoryMemberSerializer
    permission_classes = [IsRepositoryAdmin]

    def get_queryset(self):
        repository_id = self.kwargs["repository_id"]

        return RepositoryMember.objects.filter(
            repository_id=repository_id
        )