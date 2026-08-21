import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getAnalytics } from "../../services/dashboardService";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import Sidebar from "../../components/dashboard/Sidebar";
import Topbar from "../../components/dashboard/Topbar";

import "../../css/Dashboard.css";
import "../../css/analytics.css";


function Analytics() {

  const [data, setData] = useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {

    const loadAnalytics = async () => {

      try {

        setLoading(true);
        setError("");

        const result =
          await getAnalytics();

        setData(result);

      } catch (err) {

        console.error(
          "Analytics error:",
          err
        );

        setError(
          err.response?.data?.detail ||
          "Failed to load analytics."
        );

      } finally {

        setLoading(false);

      }

    };

    loadAnalytics();

  }, []);


  return (

    <DashboardLayout
      sidebar={<Sidebar />}
      topbar={<Topbar />}
    >

      {loading && (

        <div className="dashboard-loading">
          Loading analytics...
        </div>

      )}


      {error && (

        <div className="dashboard-error">
          {error}
        </div>

      )}


      {!loading && !error && data && (

        <div className="analytics-page">

          {/* Breadcrumb */}

          <div className="analytics-breadcrumb">

            <Link to="/dashboard">
              Overview
            </Link>

            <span>/</span>

            <span>
              Analytics
            </span>

          </div>


          {/* Header */}

          <div className="analytics-header">

            <div>

              <h1>
                Analytics
              </h1>

              <p>
                Deep insights into your repositories,
                engineering activity, and team performance.
              </p>

            </div>

          </div>


          {/* Overview Stats */}

          <div className="analytics-stats-grid">

            <div className="analytics-stat-card">

              <span>
                Repositories
              </span>

              <strong>
                {data.overview.repositories}
              </strong>

            </div>


            <div className="analytics-stat-card">

              <span>
                Total Commits
              </span>

              <strong>
                {data.overview.commits}
              </strong>

            </div>


            <div className="analytics-stat-card">

              <span>
                Pull Requests
              </span>

              <strong>
                {data.overview.pull_requests}
              </strong>

            </div>


            <div className="analytics-stat-card">

              <span>
                Issues
              </span>

              <strong>
                {data.overview.issues}
              </strong>

            </div>

          </div>


          {/* Most Active Repository */}

          <div className="analytics-highlight-grid">

            <div className="analytics-card analytics-most-active">

              <div className="analytics-card-header">

                <div>

                  <h2>
                    Most Active Repository
                  </h2>

                  <p>
                    Repository with the highest
                    commit activity.
                  </p>

                </div>

              </div>


              {data.most_active_repository ? (

                <div className="most-active-content">

                  <div className="most-active-icon">

                    {data.most_active_repository.name
                      .charAt(0)
                      .toUpperCase()}

                  </div>


                  <div className="most-active-info">

                    <Link
                      to={`/dashboard/repositories/${data.most_active_repository.id}`}
                    >

                      {data.most_active_repository.name}

                    </Link>


                    <div className="most-active-metrics">

                      <span>

                        {data.most_active_repository.commits_count}
                        {" "} commits

                      </span>

                      <span>

                        {data.most_active_repository.pull_requests_count}
                        {" "} pull requests

                      </span>

                      <span>

                        {data.most_active_repository.issues_count}
                        {" "} issues

                      </span>

                    </div>

                  </div>

                </div>

              ) : (

                <div className="analytics-empty">

                  No repository activity found.

                </div>

              )}

            </div>


            {/* Pull Request Success */}

            <div className="analytics-card analytics-rate-card">

              <div className="analytics-card-header">

                <div>

                  <h2>
                    Pull Request Success
                  </h2>

                  <p>
                    Percentage of pull requests merged.
                  </p>

                </div>

              </div>


              <div className="analytics-rate">

                <strong>

                  {data.pull_request_analytics.success_rate}%

                </strong>


                <div className="analytics-progress">

                  <div
                    className="analytics-progress-fill pr-progress"
                    style={{
                      width: `${data.pull_request_analytics.success_rate}%`
                    }}
                  />

                </div>


                <div className="analytics-rate-meta">

                  <span>
                    {data.pull_request_analytics.merged}
                    {" "} merged
                  </span>

                  <span>
                    {data.pull_request_analytics.total}
                    {" "} total
                  </span>

                </div>

              </div>

            </div>


            {/* Issue Resolution */}

            <div className="analytics-card analytics-rate-card">

              <div className="analytics-card-header">

                <div>

                  <h2>
                    Issue Resolution
                  </h2>

                  <p>
                    Percentage of issues resolved.
                  </p>

                </div>

              </div>


              <div className="analytics-rate">

                <strong>

                  {data.issue_analytics.resolution_rate}%

                </strong>


                <div className="analytics-progress">

                  <div
                    className="analytics-progress-fill issue-progress"
                    style={{
                      width: `${data.issue_analytics.resolution_rate}%`
                    }}
                  />

                </div>


                <div className="analytics-rate-meta">

                  <span>
                    {data.issue_analytics.closed}
                    {" "} resolved
                  </span>

                  <span>
                    {data.issue_analytics.total}
                    {" "} total
                  </span>

                </div>

              </div>

            </div>

          </div>


          {/* Repository Performance */}

          <div className="analytics-card repository-performance-card">

            <div className="analytics-card-header">

              <div>

                <h2>
                  Repository Performance
                </h2>

                <p>
                  Compare activity across your repositories.
                </p>

              </div>

            </div>


            <div className="repository-performance-list">

              {data.repository_performance.length === 0 ? (

                <div className="analytics-empty">

                  No repositories found.

                </div>

              ) : (

                data.repository_performance.map(
                  (repository, index) => (

                    <div
                      className="repository-performance-row"
                      key={repository.id}
                    >

                      <div className="performance-rank">

                        #{index + 1}

                      </div>


                      <div className="performance-repository">

                        <div className="performance-repository-icon">

                          {repository.name
                            .charAt(0)
                            .toUpperCase()}

                        </div>


                        <Link
                          to={`/dashboard/repositories/${repository.id}`}
                        >

                          {repository.name}

                        </Link>

                      </div>


                      <div className="performance-metrics">

                        <div>

                          <span>
                            Commits
                          </span>

                          <strong>
                            {repository.commits_count}
                          </strong>

                        </div>


                        <div>

                          <span>
                            Pull Requests
                          </span>

                          <strong>
                            {repository.pull_requests_count}
                          </strong>

                        </div>


                        <div>

                          <span>
                            Issues
                          </span>

                          <strong>
                            {repository.issues_count}
                          </strong>

                        </div>

                      </div>

                    </div>

                  )
                )

              )}

            </div>

          </div>


          {/* Top Contributors */}

          <div className="analytics-card contributors-analytics-card">

            <div className="analytics-card-header">

              <div>

                <h2>
                  Top Contributors
                </h2>

                <p>
                  Contributors ranked by total commits.
                </p>

              </div>

            </div>


            <div className="analytics-contributors-list">

              {data.top_contributors.length === 0 ? (

                <div className="analytics-empty">

                  No contributor data available.

                </div>

              ) : (

                data.top_contributors.map(
                  (contributor, index) => (

                    <div
                      className="analytics-contributor-row"
                      key={`${contributor.author_email}-${index}`}
                    >

                      <div className="contributor-rank">

                        #{index + 1}

                      </div>


                      <div className="contributor-avatar">

                        {contributor.author_name
                          .charAt(0)
                          .toUpperCase()}

                      </div>


                      <div className="contributor-info">

                        <strong>
                          {contributor.author_name}
                        </strong>

                        <span>
                          {contributor.author_email}
                        </span>

                      </div>


                      <div className="contributor-commits">

                        <strong>
                          {contributor.commits_count}
                        </strong>

                        <span>
                          commits
                        </span>

                      </div>

                    </div>

                  )
                )

              )}

            </div>

          </div>

        </div>

      )}

    </DashboardLayout>

  );

}

export default Analytics;