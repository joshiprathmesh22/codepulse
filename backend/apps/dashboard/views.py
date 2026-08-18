from datetime import timedelta

from django.utils import timezone
from django.db.models import Count, Q
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

        # =========================================
        # ORGANIZATION DATA
        # =========================================

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

        # =========================================
        # REPOSITORY HEALTH
        # =========================================

        health_data = []

        for repository in repositories:

            total_commits = Commit.objects.filter(
                repository=repository
            ).count()

            total_branches = Branch.objects.filter(
                repository=repository
            ).count()

            total_pull_requests = PullRequest.objects.filter(
                repository=repository
            ).count()

            open_issues = Issue.objects.filter(
                repository=repository,
                state="open",
            ).count()

            closed_issues = Issue.objects.filter(
                repository=repository,
                state="closed",
            ).count()

            # -----------------------------------------
            # Repository Status
            # -----------------------------------------

            if not repository.is_active:

                repository_status = "inactive"

            elif total_commits > 0:

                repository_status = "healthy"

            else:

                repository_status = "attention"

            # -----------------------------------------
            # Code Quality
            # -----------------------------------------
            #
            # Currently activity based.
            # Later we can replace this with
            # real static code analysis.
            #

            if total_commits >= 20:

                code_quality = 90

            elif total_commits >= 10:

                code_quality = 80

            elif total_commits >= 5:

                code_quality = 70

            elif total_commits > 0:

                code_quality = 60

            else:

                code_quality = 40

            # -----------------------------------------
            # Security
            # -----------------------------------------
            #
            # Currently based on open issues.
            # Later this can become a real
            # security scanning system.
            #

            if open_issues == 0:

                security = 90

            elif open_issues <= 2:

                security = 75

            elif open_issues <= 5:

                security = 60

            else:

                security = 40

            # -----------------------------------------
            # Maintainability
            # -----------------------------------------

            maintainability = 80

            if total_commits == 0:

                maintainability -= 25

            if total_branches == 0:

                maintainability -= 10

            if open_issues >= 5:

                maintainability -= 15

            if total_pull_requests > 0:

                maintainability += 5

            # Keep score between 0 and 100

            maintainability = max(
                0,
                min(
                    100,
                    maintainability
                )
            )

            # -----------------------------------------
            # Repository Health Score
            # -----------------------------------------

            repository_score = round(
                (
                    code_quality
                    + security
                    + maintainability
                ) / 3
            )

            health_data.append(
                {
                    "id": repository.id,

                    "name": repository.name,

                    "status": repository_status,

                    "total_commits": total_commits,

                    "total_branches": total_branches,

                    "total_pull_requests": total_pull_requests,

                    "open_issues": open_issues,

                    "closed_issues": closed_issues,

                    "code_quality": code_quality,

                    "security": security,

                    "maintainability": maintainability,

                    "health_score": repository_score,
                }
            )

        # =========================================
        # ORGANIZATION HEALTH SUMMARY
        # =========================================

        total_repositories = len(
            health_data
        )

        healthy_repositories = sum(
            1
            for repository in health_data
            if repository["status"] == "healthy"
        )

        attention_repositories = sum(
            1
            for repository in health_data
            if repository["status"] == "attention"
        )

        inactive_repositories = sum(
            1
            for repository in health_data
            if repository["status"] == "inactive"
        )

        # -----------------------------------------
        # Overall Health Score
        # -----------------------------------------

        health_score = (
            round(
                sum(
                    repository["health_score"]
                    for repository in health_data
                )
                / total_repositories
            )
            if total_repositories > 0
            else 0
        )

        # -----------------------------------------
        # Overall Health Status
        # -----------------------------------------

        if health_score >= 80:

            health_status = "Good Health"

        elif health_score >= 60:

            health_status = "Needs Attention"

        else:

            health_status = "Poor Health"

        # =========================================
        # DATE RANGE - LAST 7 DAYS
        # =========================================

        today = timezone.localdate()

        start_date = today - timedelta(
            days=6
        )

        # =========================================
        # COMMIT ACTIVITY
        # =========================================

        commit_activity = (
            commits
            .filter(
                committed_at__date__gte=start_date,
                committed_at__date__lte=today,
            )
            .annotate(
                date=TruncDate(
                    "committed_at"
                )
            )
            .values(
                "date"
            )
            .annotate(
                count=Count("id")
            )
            .order_by(
                "date"
            )
        )

        activity_map = {
            item["date"].isoformat(): item["count"]
            for item in commit_activity
        }

        commit_activity_data = []

        for i in range(7):

            date = start_date + timedelta(
                days=i
            )

            commit_activity_data.append(
                {
                    "date": date.isoformat(),

                    "count": activity_map.get(
                        date.isoformat(),
                        0,
                    ),
                }
            )

        # =========================================
        # PULL REQUEST TRENDS
        # =========================================

        pull_request_activity = (
            pull_requests
            .filter(
                created_at__date__gte=start_date,
                created_at__date__lte=today,
            )
            .annotate(
                date=TruncDate(
                    "created_at"
                )
            )
            .values(
                "date"
            )
            .annotate(
                total=Count("id"),

                merged=Count(
                    "id",
                    filter=Q(
                        merged=True
                    ),
                ),

                closed=Count(
                    "id",
                    filter=Q(
                        state="closed"
                    ),
                ),
            )
            .order_by(
                "date"
            )
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

            date = start_date + timedelta(
                days=i
            )

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

        # =========================================
        # DASHBOARD RESPONSE
        # =========================================

        return Response(
            {
                # ---------------------------------
                # Summary
                # ---------------------------------

                "repositories": repositories.count(),

                "active_repositories": repositories.filter(
                    is_active=True
                ).count(),

                "commits": commits.count(),

                "branches": branches.count(),

                "pull_requests": pull_requests.count(),

                "issues": issues.count(),

                # ---------------------------------
                # Commit Activity
                # ---------------------------------

                "commit_activity": commit_activity_data,

                # ---------------------------------
                # Pull Request Activity
                # ---------------------------------

                "pull_request_activity": (
                    pull_request_activity_data
                ),

                # ---------------------------------
                # Repository Health
                # ---------------------------------

                "repository_health": {

                    "score": health_score,

                    "status": health_status,

                    "healthy": healthy_repositories,

                    "attention": attention_repositories,

                    "inactive": inactive_repositories,

                    "repositories": health_data,
                },
            }
        )