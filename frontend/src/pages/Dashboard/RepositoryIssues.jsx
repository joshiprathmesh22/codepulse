import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import {
  getRepository,
  getRepositoryIssues,
} from "../../services/repositoryService";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import Sidebar from "../../components/dashboard/Sidebar";
import Topbar from "../../components/dashboard/Topbar";

import "../../css/Dashboard.css";
import "../../css/repoissues.css";

function RepositoryIssues() {
  const { id } = useParams();

  const [repository, setRepository] = useState(null);
  const [issues, setIssues] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadIssues = async () => {
      try {
        setLoading(true);
        setError("");

        const [repositoryData, issueData] =
          await Promise.all([
            getRepository(id),
            getRepositoryIssues(id),
          ]);

        setRepository(repositoryData);

        setIssues(issueData.issues || []);

      } catch (err) {
        console.error(err);

        setError(
          err.response?.data?.detail ||
          "Failed to load issues."
        );
      } finally {
        setLoading(false);
      }
    };

    loadIssues();
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
          Loading issues...
        </div>
      )}


      {error && (
        <div className="dashboard-error">
          {error}
        </div>
      )}


      {!loading && !error && repository && (

        <div className="repository-issues-page">

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
              Issues
            </span>

          </div>


          {/* Header */}

          <div className="repository-issues-header">

            <div>

              <h1>
                {repository.name} Issues
              </h1>

              <p>
                Track and manage issues for this repository.
              </p>

            </div>


            <div className="repository-issues-count">

              <strong>
                {issues.length}
              </strong>

              <span>
                Issues
              </span>

            </div>

          </div>


          {/* Issues Card */}

          <div className="repository-issues-card">

            <div className="repository-issues-card-header">

              <div>

                <h2>
                  Issues
                </h2>

                <p>
                  Repository issue activity
                </p>

              </div>

            </div>


            <div className="repository-issue-list">

              {issues.length === 0 ? (

                <div className="repositories-empty">
                  No issues found for this repository.
                </div>

              ) : (

                issues.map((issue) => (

                  <div
                    className="repository-issue-row"
                    key={issue.id}
                  >

                    {/* Status Icon */}

                    <div
                      className={
                        issue.state === "open"
                          ? "repository-issue-icon open"
                          : "repository-issue-icon closed"
                      }
                    >

                      {issue.state === "open"
                        ? "!"
                        : "✓"}

                    </div>


                    {/* Main Content */}

                    <div className="repository-issue-main">

                      <h3>
                        {issue.title}
                      </h3>

                      <div className="repository-issue-meta">

                        <span>
                          #{issue.github_id}
                        </span>

                        <span>•</span>

                        <span>
                          {issue.author}
                        </span>

                        <span>•</span>

                        <span>
                          {formatDate(
                            issue.created_at
                          )}
                        </span>

                      </div>

                    </div>


                    {/* State */}

                    <div
                      className={
                        issue.state === "open"
                          ? "repository-issue-state open"
                          : "repository-issue-state closed"
                      }
                    >

                      {issue.state === "open"
                        ? "Open"
                        : "Closed"}

                    </div>


                    {/* GitHub Link */}

                    {issue.html_url && (

                      <a
                        href={issue.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="repository-issue-link"
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

export default RepositoryIssues;