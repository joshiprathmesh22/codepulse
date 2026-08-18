import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  getRepository,
  getRepositoryCommits,
} from "../../services/repositoryService";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import Sidebar from "../../components/dashboard/Sidebar";
import Topbar from "../../components/dashboard/Topbar";

import "../../css/Dashboard.css";
import "../../css/repocommit.css";


function RepositoryCommits() {
  const { id } = useParams();

  const [repository, setRepository] = useState(null);
  const [commits, setCommits] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCommits = async () => {
      try {
        setLoading(true);
        setError("");

        const [repositoryData, commitsData] =
          await Promise.all([
            getRepository(id),
            getRepositoryCommits(id),
          ]);

        setRepository(repositoryData);
        setCommits(commitsData.commits || []);

      } catch (err) {
        console.error(err);

        setError(
          err.response?.data?.detail ||
          "Failed to load commits."
        );
      } finally {
        setLoading(false);
      }
    };

    loadCommits();
  }, [id]);

  const formatDate = (date) => {
    return new Date(date).toLocaleString(
      "en-US",
      {
        dateStyle: "medium",
        timeStyle: "short",
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
          Loading commits...
        </div>
      )}

      {error && (
        <div className="dashboard-error">
          {error}
        </div>
      )}

      {!loading && !error && repository && (
        <div className="repository-commits-page">

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

            <span>Commits</span>

          </div>


          {/* Header */}

          <div className="repository-commits-header">

            <div>

              <h1>
                Commits
              </h1>

              <p>
                Commit history for{" "}
                <strong>
                  {repository.name}
                </strong>
              </p>

            </div>

            <div className="repository-commits-count">

              <strong>
                {commits.length}
              </strong>

              <span>
                Commits
              </span>

            </div>

          </div>


          {/* Commit List */}

          <div className="repository-commits-card">

            <div className="repository-commits-card-header">

              <div>
                <h2>
                  Commit History
                </h2>

                <p>
                  Latest commits first
                </p>
              </div>

            </div>


            <div className="repository-commit-list">

              {commits.length > 0 ? (

                commits.map((commit) => (

                  <div
                    className="repository-commit-row"
                    key={commit.id}
                  >

                    <div className="repository-commit-icon">
                      ✓
                    </div>


                    <div className="repository-commit-main">

                      <h3>
                        {commit.message}
                      </h3>

                      <div className="repository-commit-meta">

                        <span>
                          {commit.author_name}
                        </span>

                        <span>
                          •
                        </span>

                        <span>
                          {formatDate(
                            commit.committed_at
                          )}
                        </span>

                      </div>

                    </div>


                    <div className="repository-commit-sha">

                      <span>
                        {commit.sha.slice(0, 7)}
                      </span>

                      {commit.html_url && (
                        <a
                          href={commit.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) =>
                            e.stopPropagation()
                          }
                        >
                          ↗
                        </a>
                      )}

                    </div>

                  </div>

                ))

              ) : (

                <div className="repositories-empty">

                  No commits found for this repository.

                </div>

              )}

            </div>

          </div>

        </div>
      )}

    </DashboardLayout>
  );
}

export default RepositoryCommits;