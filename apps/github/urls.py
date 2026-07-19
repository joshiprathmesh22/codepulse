from django.urls import path

from .views import (
    GitHubLoginView,
    GitHubCallbackView,
    SyncRepositoriesView,
    SyncCommitsView,
)

urlpatterns = [
    path("login/", GitHubLoginView.as_view()),
    path("callback/", GitHubCallbackView.as_view()),
    path("sync/",SyncRepositoriesView.as_view(),
         name="github-sync"),
    path(
    "repositories/<int:repository_id>/commits/",
    SyncCommitsView.as_view(),
    name="sync-commits",
),
]