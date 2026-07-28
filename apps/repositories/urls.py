from django.urls import path

from .views import RepositoryListCreateView,RepositoryDetailView,RepositoryDashboardView

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
]