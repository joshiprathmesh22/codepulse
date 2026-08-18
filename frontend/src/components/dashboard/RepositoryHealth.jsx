import { useEffect, useState } from "react";
import { getRepositories } from "../../services/dashboardService";

const RepositoryHealth = ({ health }) => {

  if (!health) {
    return null;
  }

  const score = health.score || 0;

  const getStatusClass = () => {
    if (score >= 80) {
      return "health-good";
    }

    if (score >= 60) {
      return "health-warning";
    }

    return "health-danger";
  };

  const getStatusText = () => {
    if (score >= 80) {
      return "Good Health";
    }

    if (score >= 60) {
      return "Needs Attention";
    }

    return "Poor Health";
  };

  const getScoreColorClass = () => {
    if (score >= 80) {
      return "score-good";
    }

    if (score >= 60) {
      return "score-warning";
    }

    return "score-danger";
  };

  return (
    <div className="repository-health-card">

      {/* Header */}

      <div className="repository-health-header">

        <div>
          <h2>
            Repository Health
          </h2>

          <p>
            Overall health of your repositories
          </p>
        </div>

        <button className="repository-health-view">
          View all
        </button>

      </div>


      {/* Score Section */}

      <div className="repository-health-score-section">

        <div
          className={`repository-health-score-circle ${getScoreColorClass()}`}
        >

          <div className="repository-health-score">
            {score}
          </div>

          <div className="repository-health-score-label">
            /100
          </div>

        </div>


        <div className="repository-health-status">

          <span
            className={`repository-health-status-badge ${getStatusClass()}`}
          >
            <span className="repository-health-status-dot" />

            {getStatusText()}
          </span>

          <p>
            {health.healthy || 0} of{" "}
            {health.repositories?.length || 0}{" "}
            repositories are healthy
          </p>

        </div>

      </div>


      {/* Health Metrics */}

      <div className="repository-health-metrics">

        <div className="health-metric">

          <div className="health-metric-top">

            <span>
              Code Quality
            </span>

            <strong>
              {health.repositories?.length
                ? Math.round(
                    health.repositories.reduce(
                      (sum, repo) =>
                        sum + (repo.code_quality || 0),
                      0
                    ) /
                    health.repositories.length
                  )
                : 0}
              /100
            </strong>

          </div>

          <div className="health-progress">
            <div
              className="health-progress-fill"
              style={{
                width: `${
                  health.repositories?.length
                    ? Math.round(
                        health.repositories.reduce(
                          (sum, repo) =>
                            sum +
                            (repo.code_quality || 0),
                          0
                        ) /
                        health.repositories.length
                      )
                    : 0
                }%`,
              }}
            />
          </div>

        </div>


        <div className="health-metric">

          <div className="health-metric-top">

            <span>
              Security
            </span>

            <strong>
              {health.repositories?.length
                ? Math.round(
                    health.repositories.reduce(
                      (sum, repo) =>
                        sum + (repo.security || 0),
                      0
                    ) /
                    health.repositories.length
                  )
                : 0}
              /100
            </strong>

          </div>

          <div className="health-progress">
            <div
              className="health-progress-fill"
              style={{
                width: `${
                  health.repositories?.length
                    ? Math.round(
                        health.repositories.reduce(
                          (sum, repo) =>
                            sum +
                            (repo.security || 0),
                          0
                        ) /
                        health.repositories.length
                      )
                    : 0
                }%`,
              }}
            />
          </div>

        </div>


        <div className="health-metric">

          <div className="health-metric-top">

            <span>
              Maintainability
            </span>

            <strong>
              {health.repositories?.length
                ? Math.round(
                    health.repositories.reduce(
                      (sum, repo) =>
                        sum +
                        (repo.maintainability || 0),
                      0
                    ) /
                    health.repositories.length
                  )
                : 0}
              /100
            </strong>

          </div>

          <div className="health-progress">
            <div
              className="health-progress-fill"
              style={{
                width: `${
                  health.repositories?.length
                    ? Math.round(
                        health.repositories.reduce(
                          (sum, repo) =>
                            sum +
                            (repo.maintainability || 0),
                          0
                        ) /
                        health.repositories.length
                      )
                    : 0
                }%`,
              }}
            />
          </div>

        </div>

      </div>


      {/* Repository Summary */}

      <div className="repository-health-summary">

        <div className="health-summary-item">

          <span className="health-summary-dot healthy" />

          <span>
            Healthy
          </span>

          <strong>
            {health.healthy || 0}
          </strong>

        </div>


        <div className="health-summary-item">

          <span className="health-summary-dot attention" />

          <span>
            Attention
          </span>

          <strong>
            {health.attention || 0}
          </strong>

        </div>


        <div className="health-summary-item">

          <span className="health-summary-dot inactive" />

          <span>
            Inactive
          </span>

          <strong>
            {health.inactive || 0}
          </strong>

        </div>

      </div>

    </div>
  );
};

export default RepositoryHealth;