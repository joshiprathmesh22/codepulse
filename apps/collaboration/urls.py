from django.urls import path

from .views import RepositoryMemberListCreateView

urlpatterns = [
    path(
        "repositories/<int:repository_id>/members/",
        RepositoryMemberListCreateView.as_view(),
        name="repository-members",
    ),
]