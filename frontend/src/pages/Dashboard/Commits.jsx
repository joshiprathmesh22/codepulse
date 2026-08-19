import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  getAllCommits,
} from "../../services/repositoryService";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import Sidebar from "../../components/dashboard/Sidebar";
import Topbar from "../../components/dashboard/Topbar";

import "../../css/Dashboard.css";
import "../../css/commits.css";


function Commits() {

  const [commits, setCommits] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [selectedRepository, setSelectedRepository] =
    useState("all");


  /* =========================================
     LOAD COMMITS
  ========================================= */

  useEffect(() => {

    const loadCommits = async () => {

      try {

        setLoading(true);
        setError("");

        const data =
          await getAllCommits();

        setCommits(
          data.commits || []
        );

      } catch (err) {

        console.error(
          "Failed to load commits:",
          err
        );

        setError(
          err.response?.data?.detail ||
          err.response?.data?.error ||
          "Failed to load commits."
        );

      } finally {

        setLoading(false);

      }

    };

    loadCommits();

  }, []);


  /* =========================================
     GET UNIQUE REPOSITORIES
  ========================================= */

  const repositories = useMemo(() => {

    const uniqueRepositories = [
      ...new Map(
        commits
          .filter(
            (commit) =>
              commit.repository
          )
          .map((commit) => [
            commit.repository.id,
            commit.repository,
          ])
      ).values(),
    ];


    return uniqueRepositories.sort(
      (a, b) =>
        a.name.localeCompare(
          b.name
        )
    );

  }, [commits]);


  /* =========================================
     FILTER COMMITS
  ========================================= */

  const filteredCommits = useMemo(() => {

    if (
      selectedRepository === "all"
    ) {

      return commits;

    }


    return commits.filter(
      (commit) =>
        commit.repository &&
        String(
          commit.repository.id
        ) === selectedRepository
    );

  }, [
    commits,
    selectedRepository,
  ]);


  /* =========================================
     FORMAT DATE
  ========================================= */

  const formatDate = (date) => {

    if (!date) {
      return "";
    }


    return new Date(
      date
    ).toLocaleString(
      "en-US",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }
    );

  };


  /* =========================================
     PAGE
  ========================================= */

  return (

    <DashboardLayout
      sidebar={<Sidebar />}
      topbar={<Topbar />}
    >


      {/* =====================================
          LOADING
      ===================================== */}

      {loading && (

        <div className="dashboard-loading">

          Loading commits...

        </div>

      )}


      {/* =====================================
          ERROR
      ===================================== */}

      {error && (

        <div className="dashboard-error">

          {error}

        </div>

      )}


      {/* =====================================
          CONTENT
      ===================================== */}

      {!loading &&
        !error && (

          <div className="commits-page">


            {/* =================================
                BREADCRUMB
            ================================= */}

            <div className="commits-breadcrumb">

              <Link to="/dashboard">

                Overview

              </Link>


              <span>
                /
              </span>


              <span>

                Commits

              </span>

            </div>


            {/* =================================
                HEADER
            ================================= */}

            <div className="commits-header">


              {/* TITLE */}

              <div>

                <h1>
                  Commits
                </h1>


                <p>
                  Track commit activity
                  across all repositories.
                </p>

              </div>


              {/* HEADER ACTIONS */}

              <div className="commits-header-actions">


                {/* REPOSITORY FILTER */}

                <select
                  className="commits-sort-select"
                  value={
                    selectedRepository
                  }
                  onChange={(event) =>
                    setSelectedRepository(
                      event.target.value
                    )
                  }
                >

                  <option value="all">
                    All Repositories
                  </option>


                  {repositories.map(
                    (repository) => (

                      <option
                        key={
                          repository.id
                        }
                        value={
                          repository.id
                        }
                      >

                        {repository.name}

                      </option>

                    )
                  )}

                </select>


                {/* COUNT */}

                <div className="commits-count">

                  <strong>
                    {
                      filteredCommits.length
                    }
                  </strong>


                  <span>

                    {selectedRepository ===
                    "all"
                      ? "Total Commits"
                      : "Repository Commits"}

                  </span>

                </div>

              </div>

            </div>


            {/* =================================
                MAIN CARD
            ================================= */}

            <div className="commits-card">


              {/* CARD HEADER */}

              <div className="commits-card-header">

                <div>

                  <h2>
                    Recent Commits
                  </h2>


                  <p>

                    {selectedRepository ===
                    "all"

                      ? "Latest commits across your organization"

                      : `Commits from ${
                          repositories.find(
                            (repository) =>
                              String(
                                repository.id
                              ) ===
                              selectedRepository
                          )?.name ||
                          "selected repository"
                        }`
                    }

                  </p>

                </div>

              </div>


              {/* =================================
                  COMMIT LIST
              ================================= */}

              <div className="commit-list">


                {/* EMPTY STATE */}

                {filteredCommits.length ===
                0 ? (

                  <div className="repositories-empty">

                    {selectedRepository ===
                    "all"

                      ? "No commits found."

                      : "No commits found for this repository."

                    }

                  </div>

                ) : (


                  /* =================================
                     COMMITS
                  ================================= */

                  filteredCommits.map(
                    (commit) => (

                      <div
                        className="commit-row"
                        key={commit.id}
                      >


                        {/* COMMIT ICON */}

                        <div className="commit-icon">

                          ✓

                        </div>


                        {/* MAIN CONTENT */}

                        <div className="commit-main">


                          {/* MESSAGE */}

                          <h3>

                            {commit.message ||
                              "No commit message"}

                          </h3>


                          {/* META */}

                          <div className="commit-meta">

                            <span>

                              {commit.author_name ||
                                "Unknown author"}

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


                          {/* REPOSITORY */}

                          {commit.repository && (

                            <div className="commit-repository">

                              <span>
                                Repository
                              </span>


                              <Link
                                to={`/dashboard/repositories/${commit.repository.id}`}
                              >

                                {
                                  commit.repository.name
                                }

                              </Link>

                            </div>

                          )}

                        </div>


                        {/* =================================
                            SHA + GITHUB
                        ================================= */}

                        <div className="commit-sha">


                          {/* SHA */}

                          <span>

                            {(
                              commit.github_sha ||
                              commit.sha ||
                              ""
                            ).substring(0, 7)}

                          </span>


                          {/* GITHUB LINK */}

                          {commit.html_url && (

                            <a
                              href={
                                commit.html_url
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Open on GitHub"
                            >

                              ↗

                            </a>

                          )}

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


export default Commits;