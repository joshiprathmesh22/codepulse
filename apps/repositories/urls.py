from django.urls import path

from .views import RepositoryListCreateView,RepositoryDetailView

urlpatterns = [
    path(
        "",
        RepositoryListCreateView.as_view(),
        name="repository-list",
    ),
    path(
        "<int:pk>/",
        RepositoryDetailView.as_view(),
        name="repositary-detail",
    )
]