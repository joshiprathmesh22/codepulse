import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import {
  getRepository,
  getRepositoryDashboard,
} from "../../services/repositoryService";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import Sidebar from "../../components/dashboard/Sidebar";
import Topbar from "../../components/dashboard/Topbar";

import "../../css/Dashboard.css";
import "../../css/repodetail.css";

function RepositoryDetail() {
  const { id } = useParams();

  const [repository, setRepository] = useState(null);
  const [dashboard, setDashboard] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadRepository = async () => {
      try {
        setLoading(true);
        setError("");

        const [repositoryData, dashboardData] =
          await Promise.all([
            getRepository(id),
            getRepositoryDashboard(id),
          ]);

        setRepository(repositoryData);
        setDashboard(dashboardData);

      } catch (err) {
        console.error(err);

        setError(
          err.response?.data?.detail ||
          "Failed to load repository."
        );

      } finally {
        setLoading(false);
      }
    };

    loadRepository();
  }, [id]);

  return (
    <DashboardLayout
      sidebar={<Sidebar />}
      topbar={<Topbar />}
    >

      {loading && (
        <div className="dashboard-loading">
          Loading repository...
        </div>
      )}

      {error && (
        <div className="dashboard-error">
          {error}
        </div>
      )}

      {!loading && !error && repository && dashboard && (

        <div className="repository-detail-page">

          {/* Breadcrumb */}

          <div className="repository-breadcrumb">

            <Link to="/dashboard/repositories">
              Repositories
            </Link>

            <span>
              /
            </span>

            <span>
              {repository.name}
            </span>

          </div>


          {/* Repository Header */}

          <div className="repository-detail-header">

            <div className="repository-detail-title">

              <div className="repository-detail-icon">
                {repository.name
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div>

                <div className="repository-name-line">

                  <h1>
                    {repository.name}
                  </h1>

                  <span
                    className={
                      repository.visibility === "private"
                        ? "repository-visibility private"
                        : "repository-visibility public"
                    }
                  >
                    {repository.visibility}
                  </span>

                </div>

                <p>
                  {repository.full_name}
                </p>

              </div>

            </div>

            <div
              className={
                repository.is_active
                  ? "repository-detail-status active"
                  : "repository-detail-status inactive"
              }
            >
              <i />

              {repository.is_active
                ? "Active"
                : "Inactive"}
            </div>

          </div>


          {/* Description */}

          {repository.description && (

            <div className="repository-detail-description">

              {repository.description}

            </div>

          )}


          {/* Repository Information */}

          <div className="repository-info-grid">

            <div className="repository-info-card">

              <span>
                Default Branch
              </span>

              <strong>
                ⎇ {repository.default_branch}
              </strong>

            </div>

            <div className="repository-info-card">

              <span>
                Commits
              </span>

              <strong>
                {dashboard.total_commits}
              </strong>

            </div>

            <div className="repository-info-card">

              <span>
                Branches
              </span>

              <strong>
                {dashboard.total_branches}
              </strong>

            </div>

            <div className="repository-info-card">

              <span>
                Members
              </span>

              <strong>
                {dashboard.total_members}
              </strong>

            </div>

          </div>


          {/* Pull Requests / Issues */}

          <div className="repository-detail-grid">

            <div className="repository-detail-card">

              <div className="repository-detail-card-header">

                <div>
                  <h2>
                    Pull Requests
                  </h2>

                  <p>
                    Repository pull request activity
                  </p>
                </div>

              </div>

              <div className="repository-metrics">

                <div>
                  <span>Total</span>
                  <strong>
                    {dashboard.total_pull_requests}
                  </strong>
                </div>

                <div>
                  <span>Open</span>
                  <strong>
                    {dashboard.open_pull_requests}
                  </strong>
                </div>

                <div>
                  <span>Merged</span>
                  <strong>
                    {dashboard.merged_pull_requests}
                  </strong>
                </div>

              </div>

            </div>


            <div className="repository-detail-card">

              <div className="repository-detail-card-header">

                <div>
                  <h2>
                    Issues
                  </h2>

                  <p>
                    Repository issue activity
                  </p>
                </div>

              </div>

              <div className="repository-metrics">

                <div>
                  <span>Total</span>
                  <strong>
                    {dashboard.total_issues}
                  </strong>
                </div>

                <div>
                  <span>Open</span>
                  <strong>
                    {dashboard.open_issues}
                  </strong>
                </div>

                <div>
                  <span>Closed</span>
                  <strong>
                    {dashboard.closed_issues}
                  </strong>
                </div>

              </div>

            </div>

          </div>


          {/* Quick Navigation */}

          <div className="repository-detail-card repository-navigation-card">

            <h2>
              Repository Data
            </h2>

            <div className="repository-navigation">

              <Link to={`/dashboard/repositories/${id}/commits`}>
              Commits
              </Link>

              <Link to={`/dashboard/repositories/${id}/branches`}>
              Branches
              </Link>

              <Link to={`/dashboard/repositories/${id}/pull-requests`}>
              Pull Requests
              </Link>
 <Link to={`/dashboard/repositories/${id}/issues`}>
              Issues
              </Link>
            </div>

          </div>

        </div>

      )}

    </DashboardLayout>
  );
}

export default RepositoryDetail;