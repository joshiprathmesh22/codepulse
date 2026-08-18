import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import {
  getRepository,
  getRepositoryPullRequests,
} from "../../services/repositoryService";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import Sidebar from "../../components/dashboard/Sidebar";
import Topbar from "../../components/dashboard/Topbar";

import "../../css/Dashboard.css";
import "../../css/repopullrequests.css";

function RepositoryPullRequests() {

  const { id } = useParams();

  const [repository, setRepository] = useState(null);
  const [pullRequests, setPullRequests] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    const loadPullRequests = async () => {

      try {

        setLoading(true);
        setError("");

        const [
          repositoryData,
          pullRequestData,
        ] = await Promise.all([
          getRepository(id),
          getRepositoryPullRequests(id),
        ]);

        setRepository(repositoryData);

        setPullRequests(
          pullRequestData.pull_requests || []
        );

      } catch (err) {

        console.error(err);

        setError(
          err.response?.data?.detail ||
          "Failed to load pull requests."
        );

      } finally {

        setLoading(false);

      }

    };

    loadPullRequests();

  }, [id]);


  const formatDate = (date) => {

    if (!date) {
      return "";
    }

    return new Date(date).toLocaleDateString(
      "en-US",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );

  };


  return (

    <DashboardLayout
      sidebar={<Sidebar />}
      topbar={<Topbar />}
    >

      {loading && (
        <div className="dashboard-loading">
          Loading pull requests...
        </div>
      )}


      {error && (
        <div className="dashboard-error">
          {error}
        </div>
      )}


      {!loading && !error && repository && (

        <div className="repository-pull-requests-page">

          {/* Breadcrumb */}

          <div className="repository-breadcrumb">

            <Link to="/dashboard/repositories">
              Repositories
            </Link>

            <span>/</span>

            <Link
              to={`/dashboard/repositories/${id}`}
            >
              {repository.name}
            </Link>

            <span>/</span>

            <span>
              Pull Requests
            </span>

          </div>


          {/* Header */}

          <div className="repository-pull-requests-header">

            <div>

              <h1>
                {repository.name} Pull Requests
              </h1>

              <p>
                Review and track pull requests for this repository.
              </p>

            </div>


            <div className="repository-pull-requests-count">

              <strong>
                {pullRequests.length}
              </strong>

              <span>
                Pull Requests
              </span>

            </div>

          </div>


          {/* Pull Request Card */}

          <div className="repository-pull-requests-card">

            <div className="repository-pull-requests-card-header">

              <div>

                <h2>
                  Pull Requests
                </h2>

                <p>
                  Repository pull request activity
                </p>

              </div>

            </div>


            <div className="repository-pull-request-list">

              {pullRequests.length === 0 ? (

                <div className="repositories-empty">

                  No pull requests found for this repository.

                </div>

              ) : (

                pullRequests.map((pullRequest) => (

                  <div
                    className="repository-pull-request-row"
                    key={pullRequest.id}
                  >

                    {/* Status Icon */}

                    <div
                      className={
                        pullRequest.merged
                          ? "repository-pull-request-icon merged"
                          : pullRequest.state === "open"
                            ? "repository-pull-request-icon open"
                            : "repository-pull-request-icon closed"
                      }
                    >
                      {pullRequest.merged
                        ? "✓"
                        : pullRequest.state === "open"
                          ? "↗"
                          : "×"}
                    </div>


                    {/* Main Content */}

                    <div className="repository-pull-request-main">

                      <h3>
                        {pullRequest.title}
                      </h3>

                      <div className="repository-pull-request-meta">

                        <span>
                          #{pullRequest.github_id}
                        </span>

                        <span>•</span>

                        <span>
                          {pullRequest.author}
                        </span>

                        <span>•</span>

                        <span>
                          {formatDate(
                            pullRequest.created_at
                          )}
                        </span>

                      </div>

                    </div>


                    {/* State */}

                    <div
                      className={
                        pullRequest.merged
                          ? "repository-pull-request-state merged"
                          : pullRequest.state === "open"
                            ? "repository-pull-request-state open"
                            : "repository-pull-request-state closed"
                      }
                    >

                      {pullRequest.merged
                        ? "Merged"
                        : pullRequest.state === "open"
                          ? "Open"
                          : "Closed"}

                    </div>


                    {/* GitHub Link */}

                    {pullRequest.html_url && (

                      <a
                        href={pullRequest.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="repository-pull-request-link"
                        title="Open on GitHub"
                      >
                        ↗
                      </a>

                    )}

                  </div>

                ))

              )}

            </div>

          </div>

        </div>

      )}

    </DashboardLayout>

  );

}

export default RepositoryPullRequests;