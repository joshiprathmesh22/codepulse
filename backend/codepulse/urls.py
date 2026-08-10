from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),

    path("api/auth/", include("apps.accounts.urls")),

    path("api/repositories/", include("apps.repositories.urls")),

    path("api/github/", include("apps.github.urls")),

    path("api/", include("apps.collaboration.urls")),
    path("api/dashboard/", include("apps.dashboard.urls")),

]