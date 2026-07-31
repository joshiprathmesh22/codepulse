from django.urls import path

from .views import RepositoryMemberListCreateView,SyncCommitsView
from .views import (
    RepositoryMemberListCreateView,
    SyncCommitsView,
    SyncBranchesView,
    SyncPullRequestsView,
    SyncIssuesView,
    DeveloperAnalyticsView,
    RepositoryHealthView,
)
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
    path(
    "repositories/<int:repository_id>/branches/",
    SyncBranchesView.as_view(),
    name="sync-branches",
    ),
    path(
    "repositories/<int:repository_id>/pull-requests/",
    SyncPullRequestsView.as_view(),
    name="sync-pull-requests",
    ),
    path(
    "repositories/<int:repository_id>/issues/",
    SyncIssuesView.as_view(),
    name="sync-issues",
    ),
    path(
    "repositories/<int:repository_id>/analytics/",
    DeveloperAnalyticsView.as_view(),
    name="developer-analytics",
    ),
    path(
    "repositories/<int:repository_id>/health/",
    RepositoryHealthView.as_view(),
    name="repository-health",
),
]