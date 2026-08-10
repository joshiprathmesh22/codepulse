import { useEffect, useState } from "react";
import { getRepositories } from "../../services/dashboardService";

const RepositoryHealth = () => {
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRepositories = async () => {
      try {
        const data = await getRepositories();

        setRepositories(
          Array.isArray(data)
            ? data
            : data.results || []
        );
      } catch (error) {
        console.error(
          "Failed to load repositories:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadRepositories();
  }, []);

  return (
    <div className="repository-health-card">

      <div className="repository-health-header">
        <div>
          <h2>Repository Health</h2>

          <p>
            Overview of your repositories
          </p>
        </div>

        <span className="repository-count">
          {repositories.length} repositories
        </span>
      </div>

      {loading ? (
        <div className="repository-health-loading">
          Loading repositories...
        </div>
      ) : repositories.length === 0 ? (
        <div className="repository-health-empty">
          No repositories found.
        </div>
      ) : (
        <div className="repository-list">

          {repositories
            .slice(0, 5)
            .map((repository) => (

              <div
                className="repository-row"
                key={repository.id}
              >

                <div className="repository-info">

                  <div className="repository-status-dot" />

                  <div>
                    <strong>
                      {repository.name}
                    </strong>

                    <span>
                      {repository.full_name}
                    </span>
                  </div>

                </div>

                <div className="repository-meta">

                  <span
                    className={
                      repository.is_active
                        ? "repository-active"
                        : "repository-inactive"
                    }
                  >
                    {repository.is_active
                      ? "Active"
                      : "Inactive"}
                  </span>

                  <span className="repository-visibility">
                    {repository.visibility}
                  </span>

                </div>

              </div>

            ))}

        </div>
      )}

      {!loading &&
        repositories.length > 5 && (
          <button className="repository-view-all">
            View all repositories →
          </button>
        )}

    </div>
  );
};

export default RepositoryHealth;