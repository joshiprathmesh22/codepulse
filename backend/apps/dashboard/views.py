from datetime import timedelta

from django.utils import timezone
from django.db.models import Count
from django.db.models.functions import TruncDate

from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.repositories.models import Repository
from apps.collaboration.models import (
    Commit,
    Branch,
    PullRequest,
    Issue,
)


class DashboardOverviewView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        organization = request.user.organization

        repositories = Repository.objects.filter(
            organization=organization
        )

        commits = Commit.objects.filter(
            repository__organization=organization
        )

        branches = Branch.objects.filter(
            repository__organization=organization
        )

        pull_requests = PullRequest.objects.filter(
            repository__organization=organization
        )

        issues = Issue.objects.filter(
            repository__organization=organization
        )

        # -----------------------------
        # Dates - last 7 days
        # -----------------------------

        today = timezone.localdate()
        start_date = today - timedelta(days=6)

        # -----------------------------
        # Commit Activity - last 7 days
        # -----------------------------

        commit_activity = (
            commits
            .filter(
                committed_at__date__gte=start_date,
                committed_at__date__lte=today,
            )
            .annotate(
                date=TruncDate("committed_at")
            )
            .values("date")
            .annotate(
                count=Count("id")
            )
            .order_by("date")
        )

        activity_map = {
            item["date"].isoformat(): item["count"]
            for item in commit_activity
        }

        commit_activity_data = []

        for i in range(7):

            date = start_date + timedelta(days=i)

            commit_activity_data.append(
                {
                    "date": date.isoformat(),
                    "count": activity_map.get(
                        date.isoformat(),
                        0,
                    ),
                }
            )

        # -----------------------------
        # Pull Request Trends
        # -----------------------------

        pull_request_activity = (
            pull_requests
            .filter(
                created_at__date__gte=start_date,
                created_at__date__lte=today,
            )
            .annotate(
                date=TruncDate("created_at")
            )
            .values("date")
            .annotate(
                total=Count("id"),
                merged=Count(
                    "id",
                    filter=__import__(
                        "django.db.models",
                        fromlist=["Q"]
                    ).Q(merged=True),
                ),
                closed=Count(
                    "id",
                    filter=__import__(
                        "django.db.models",
                        fromlist=["Q"]
                    ).Q(state="closed"),
                ),
            )
            .order_by("date")
        )

        pull_request_map = {
            item["date"].isoformat(): {
                "opened": item["total"],
                "merged": item["merged"],
                "closed": item["closed"],
            }
            for item in pull_request_activity
        }

        pull_request_activity_data = []

        for i in range(7):

            date = start_date + timedelta(days=i)

            data = pull_request_map.get(
                date.isoformat(),
                {
                    "opened": 0,
                    "merged": 0,
                    "closed": 0,
                },
            )

            pull_request_activity_data.append(
                {
                    "date": date.isoformat(),
                    "opened": data["opened"],
                    "merged": data["merged"],
                    "closed": data["closed"],
                }
            )

        # -----------------------------
        # Dashboard Response
        # -----------------------------

        return Response(
            {
                "repositories": repositories.count(),

                "active_repositories": repositories.filter(
                    is_active=True
                ).count(),

                "commits": commits.count(),

                "branches": branches.count(),

                "pull_requests": pull_requests.count(),

                "issues": issues.count(),

                "commit_activity": commit_activity_data,

                "pull_request_activity": pull_request_activity_data,
            }
        )