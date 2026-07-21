from django.urls import path

from .views import RepositoryMemberListCreateView,SyncCommitsView

urlpatterns = [
    path(
        "repositories/<int:repository_id>/members/",
        RepositoryMemberListCreateView.as_view(),
        name="repository-members",
    ),
        path(
        "repositories/<int:repository_id>/commits/",
        SyncCommitsView.as_view(),
        name="sync-commits",
    ),
    
]