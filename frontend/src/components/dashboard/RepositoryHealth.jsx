import { useEffect, useState } from "react";
import { getRepositories } from "../../services/dashboardService";

const RepositoryHealth = ({ health }) => {

  if (!health) {
    return null;
  }

  const score = health.score || 0;

  const getHealthStatus = () => {
    if (score >= 80) {
      return "Good Health";
    }

    if (score >= 50) {
      return "Needs Attention";
    }

    return "Poor Health";
  };

  const getHealthMessage = () => {
    if (score >= 80) {
      return "Your repositories are healthy";
    }

    if (score >= 50) {
      return "Some repositories need attention";
    }

    return "Several repositories need attention";
  };

  return (
    <div className="repository-health-card">

      <div className="repository-health-header">

        <h2>Repository Health</h2>

        <button className="repository-health-view">
          View all
        </button>

      </div>

      <div className="repository-health-main">

        <div
          className="health-circle"
          style={{
            "--health-progress": `${score}%`,
          }}
        >
          <div className="health-circle-inner">

            <strong>
              {score}
            </strong>

            <span>
              /100
            </span>

          </div>
        </div>

        <div className="health-overview">

          <h3>
            {getHealthStatus()}
          </h3>

          <p>
            {getHealthMessage()}.
          </p>

          <p>
            Keep up the good work!
          </p>

        </div>

      </div>

      <div className="health-metrics">

        <div className="health-metric">

          <span>
            Healthy
          </span>

          <strong>
            {health.healthy}/{health.repositories.length}
          </strong>

          <div className="health-progress">
            <div
              style={{
                width: `${score}%`,
              }}
            />
          </div>

        </div>

        <div className="health-metric">

          <span>
            Needs Attention
          </span>

          <strong>
            {health.attention}/{health.repositories.length}
          </strong>

          <div className="health-progress">
            <div
              className="attention-progress"
              style={{
                width: `${
                  health.repositories.length
                    ? (
                        health.attention /
                        health.repositories.length
                      ) * 100
                    : 0
                }%`,
              }}
            />
          </div>

        </div>

        <div className="health-metric">

          <span>
            Inactive
          </span>

          <strong>
            {health.inactive}/{health.repositories.length}
          </strong>

          <div className="health-progress">
            <div
              className="inactive-progress"
              style={{
                width: `${
                  health.repositories.length
                    ? (
                        health.inactive /
                        health.repositories.length
                      ) * 100
                    : 0
                }%`,
              }}
            />
          </div>

        </div>

      </div>

    </div>
  );
};

export default RepositoryHealth;