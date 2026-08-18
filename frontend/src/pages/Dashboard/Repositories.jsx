import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getRepositories,
} from "../../services/repositoryService";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import Sidebar from "../../components/dashboard/Sidebar";
import Topbar from "../../components/dashboard/Topbar";

import "../../css/Dashboard.css";
import "../../css/repositorypage.css";

function Repositories() {

  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {

    const loadRepositories = async () => {

      try {

        const result = await getRepositories();

        setRepositories(result);

      } catch (err) {

        console.error(err);

        setError(
          err.response?.data?.detail ||
          "Failed to load repositories."
        );

      } finally {

        setLoading(false);

      }

    };

    loadRepositories();

  }, []);

  const filteredRepositories =
    repositories.filter((repository) => {

      const query = search.toLowerCase();

      return (
        repository.name
          .toLowerCase()
          .includes(query) ||
        repository.full_name
          .toLowerCase()
          .includes(query) ||
        (repository.description || "")
          .toLowerCase()
          .includes(query)
      );

    });

  return (
    <DashboardLayout
      sidebar={<Sidebar />}
      topbar={<Topbar />}
    >

      <div className="repositories-page">

        {/* Page Header */}

        <div className="repositories-page-header">

          <div>

            <h1>
              Repositories
            </h1>

            <p>
              Manage and monitor your organization repositories.
            </p>

          </div>

          <div className="repositories-total">

            <strong>
              {repositories.length}
            </strong>

            <span>
              Total
            </span>

          </div>

        </div>


        {/* Repository Toolbar */}

        {!loading && !error && (

          <div className="repositories-toolbar">

            <div className="repository-search">

              <span>
                ⌕
              </span>

              <input
                type="text"
                placeholder="Search repositories..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>

            <div className="repository-filter">

              <span>
                All repositories
              </span>

              <span>
                ▾
              </span>

            </div>

          </div>

        )}


        {/* Loading */}

        {loading && (
          <div className="dashboard-loading">
            Loading repositories...
          </div>
        )}


        {/* Error */}

        {error && (
          <div className="dashboard-error">
            {error}
          </div>
        )}


        {/* Repository List */}

        {!loading &&
          !error && (

            <div className="repositories-card">

              <div className="repositories-card-header">

                <div>
                  <h2>
                    All Repositories
                  </h2>

                  <p>
                    {filteredRepositories.length} repositories
                  </p>
                </div>

              </div>


              <div className="repositories-list">

                {filteredRepositories.length > 0 ? (

                  filteredRepositories.map(
                    (repository) => (

                      <Link
                        key={repository.id}
                        to={`/dashboard/repositories/${repository.id}`}
                        className="repository-row"
                      >

                        <div className="repository-main">

                          <div className="repository-icon">
                            {repository.name
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div className="repository-info">

                            <div className="repository-title">

                              <h3>
                                {repository.name}
                              </h3>

                              <span
                                className={
                                  repository.visibility ===
                                  "private"
                                    ? "repository-visibility private"
                                    : "repository-visibility public"
                                }
                              >
                                {repository.visibility}
                              </span>

                            </div>

                            <p className="repository-full-name">
                              {repository.full_name}
                            </p>

                            {repository.description && (

                              <p className="repository-description">
                                {repository.description}
                              </p>

                            )}

                          </div>

                        </div>


                        <div className="repository-details">

                          <span className="repository-branch">
                            ⎇ {repository.default_branch}
                          </span>

                          <span
                            className={
                              repository.is_active
                                ? "repository-status active"
                                : "repository-status inactive"
                            }
                          >
                            <i />
                            {repository.is_active
                              ? "Active"
                              : "Inactive"}
                          </span>

                          <span className="repository-arrow">
                            →
                          </span>

                        </div>

                      </Link>

                    )
                  )

                ) : (

                  <div className="repositories-empty">

                    <div>
                      No repositories found.
                    </div>

                    {search && (
                      <p>
                        Try a different search term.
                      </p>
                    )}

                  </div>

                )}

              </div>

            </div>

          )}

      </div>

    </DashboardLayout>
  );
}

export default Repositories;