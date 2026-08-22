from django.urls import path

from .views import (
    DashboardOverviewView,
    AnalyticsView,
    AlertsView,
    OrganizationView,
)

urlpatterns = [
    path(
        "overview/",
        DashboardOverviewView.as_view(),
        name="dashboard-overview",
    ),

    path(
        "analytics/",
        AnalyticsView.as_view(),
        name="analytics",
    ),
    path(
    "alerts/",
    AlertsView.as_view(),
    name="alerts",
    ),
    
    path(
    "organization/",
    OrganizationView.as_view(),
    name="organization",
    ),
]