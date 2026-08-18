from django.urls import path

from .views import ( RepositoryListCreateView,
RepositoryDetailView,
RepositoryDashboardView,
RepositoryCommitsView,
RepositoryBranchesView,
RepositoryPullRequestsView,
RepositoryIssuesView,
)
urlpatterns = [
    path(
        "",
        RepositoryListCreateView.as_view(),
        name="repository-list",
    ),

    path(
        "<int:pk>/",
        RepositoryDetailView.as_view(),
        name="repository-detail",
    ),

    path(
        "<int:repository_id>/dashboard/",
        RepositoryDashboardView.as_view(),
        name="repository-dashboard",
    ),
    path(
    "<int:repository_id>/commits/",
    RepositoryCommitsView.as_view(),
    name="repository-commits",
),
path(
    "<int:repository_id>/branches/",
    RepositoryBranchesView.as_view(),
    name="repository-branches",
),
path(
    "<int:repository_id>/pull-requests/",
    RepositoryPullRequestsView.as_view(),
    name="repository-pull-requests",
),
path(
    "<int:repository_id>/issues/",
    RepositoryIssuesView.as_view(),
    name="repository-issues",
),
]