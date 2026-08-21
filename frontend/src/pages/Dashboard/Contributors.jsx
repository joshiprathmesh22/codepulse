import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  getAllContributors,
} from "../../services/repositoryService";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import Sidebar from "../../components/dashboard/Sidebar";
import Topbar from "../../components/dashboard/Topbar";

import "../../css/Dashboard.css";
import "../../css/contributors.css";


function Contributors() {

  const [contributors, setContributors] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [selectedRepository, setSelectedRepository] =
    useState("all");


  useEffect(() => {

    const loadContributors = async () => {

      try {

        setLoading(true);
        setError("");

        const data =
          await getAllContributors();

        setContributors(
          data.contributors || []
        );

      } catch (err) {

        console.error(err);

        setError(
          err.response?.data?.detail ||
          "Failed to load contributors."
        );

      } finally {

        setLoading(false);

      }

    };

    loadContributors();

  }, []);


  // --------------------------------
  // Get Unique Repositories
  // --------------------------------

  const repositories = useMemo(() => {

    const repositoryMap = new Map();

    contributors.forEach((contributor) => {

      contributor.repositories.forEach(
        (repository) => {

          repositoryMap.set(
            repository.id,
            repository
          );

        }
      );

    });

    return Array.from(
      repositoryMap.values()
    ).sort(
      (a, b) =>
        a.name.localeCompare(b.name)
    );

  }, [contributors]);


  // --------------------------------
  // Filter Contributors
  // --------------------------------

  const filteredContributors = useMemo(() => {

    if (selectedRepository === "all") {
      return contributors;
    }

    return contributors
      .filter((contributor) =>
        contributor.repositories.some(
          (repository) =>
            String(repository.id) ===
            selectedRepository
        )
      )
      .map((contributor) => {

        const repository =
          contributor.repositories.find(
            (repo) =>
              String(repo.id) ===
              selectedRepository
          );

        return {
          ...contributor,

          filteredCommits:
            repository?.commits || 0,
        };

      })
      .sort(
        (a, b) =>
          b.filteredCommits -
          a.filteredCommits
      );

  }, [
    contributors,
    selectedRepository,
  ]);


  // --------------------------------
  // Statistics
  // --------------------------------

  const totalContributors =
    contributors.length;

  const totalCommits =
    contributors.reduce(
      (total, contributor) =>
        total +
        contributor.total_commits,
      0
    );

  const topContributor =
    contributors.length > 0
      ? contributors[0]
      : null;


  return (

    <DashboardLayout
      sidebar={<Sidebar />}
      topbar={<Topbar />}
    >

      {loading && (

        <div className="dashboard-loading">
          Loading contributors...
        </div>

      )}


      {error && (

        <div className="dashboard-error">
          {error}
        </div>

      )}


      {!loading && !error && (

        <div className="contributors-page">


          {/* Breadcrumb */}

          <div className="contributors-breadcrumb">

            <Link to="/dashboard">
              Overview
            </Link>

            <span>/</span>

            <span>
              Contributors
            </span>

          </div>


          {/* Header */}

          <div className="contributors-header">

            <div>

              <h1>
                Contributors
              </h1>

              <p>
                Track contribution activity across your organization.
              </p>

            </div>


            <div className="contributors-count">

              <strong>
                {filteredContributors.length}
              </strong>

              <span>
                Contributors
              </span>

            </div>

          </div>


          {/* Statistics */}

          <div className="contributors-stats">


            <div className="contributor-stat-card">

              <span>
                Total Contributors
              </span>

              <strong>
                {totalContributors}
              </strong>

            </div>


            <div className="contributor-stat-card">

              <span>
                Total Commits
              </span>

              <strong>
                {totalCommits}
              </strong>

            </div>


            <div className="contributor-stat-card top">

              <span>
                Top Contributor
              </span>

              <strong className="top-contributor-name">
                {topContributor
                  ? topContributor.name
                  : "—"}
              </strong>

              {topContributor && (

                <small>
                  {topContributor.total_commits} commits
                </small>

              )}

            </div>


          </div>


          {/* Filter */}

          <div className="contributors-filters">

            <select
              value={selectedRepository}
              onChange={(e) =>
                setSelectedRepository(
                  e.target.value
                )
              }
            >

              <option value="all">
                All Repositories
              </option>


              {repositories.map(
                (repository) => (

                  <option
                    key={repository.id}
                    value={repository.id}
                  >

                    {repository.name}

                  </option>

                )
              )}

            </select>

          </div>


          {/* Contributors Card */}

          <div className="contributors-card">

            <div className="contributors-card-header">

              <div>

                <h2>
                  All Contributors
                </h2>

                <p>
                  Ranked by contribution activity
                </p>

              </div>

            </div>


            <div className="contributors-list">

              {filteredContributors.length === 0 ? (

                <div className="repositories-empty">
                  No contributors found.
                </div>

              ) : (

                filteredContributors.map(
                  (contributor, index) => (

                    <div
                      className="contributor-row"
                      key={contributor.email}
                    >


                      {/* Rank */}

                      <div className="contributor-rank">

                        {index + 1}

                      </div>


                      {/* Avatar */}

                      <div className="contributor-avatar">

                        {contributor.name
                          ?.charAt(0)
                          .toUpperCase()}

                      </div>


                      {/* Contributor Info */}

                      <div className="contributor-main">

                        <h3>
                          {contributor.name}
                        </h3>

                        <span>
                          {contributor.email}
                        </span>


                        <div className="contributor-repositories">

                          {contributor.repositories.map(
                            (repository) => (

                              <Link
                                key={repository.id}
                                to={`/dashboard/repositories/${repository.id}`}
                              >

                                {repository.name}

                              </Link>

                            )
                          )}

                        </div>

                      </div>


                      {/* Repository Count */}

                      <div className="contributor-repository-count">

                        <strong>
                          {contributor.repositories_count}
                        </strong>

                        <span>
                          Repositories
                        </span>

                      </div>


                      {/* Commit Count */}

                      <div className="contributor-commit-count">

                        <strong>

                          {selectedRepository === "all"
                            ? contributor.total_commits
                            : contributor.filteredCommits}

                        </strong>

                        <span>
                          Commits
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


export default Contributors;