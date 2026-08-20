import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  getAllPullRequests,
} from "../../services/repositoryService";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import Sidebar from "../../components/dashboard/Sidebar";
import Topbar from "../../components/dashboard/Topbar";

import "../../css/Dashboard.css";
import "../../css/pullrequests.css";


function PullRequests() {

  const [pullRequests, setPullRequests] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [selectedRepository, setSelectedRepository] =
    useState("all");

  const [selectedStatus, setSelectedStatus] =
    useState("all");


  /* =========================================
     LOAD PULL REQUESTS
  ========================================= */

  useEffect(() => {

    const loadPullRequests = async () => {

      try {

        setLoading(true);
        setError("");

        const data =
          await getAllPullRequests();

        setPullRequests(
          data.pull_requests || []
        );

      } catch (err) {

        console.error(
          "Failed to load pull requests:",
          err
        );

        setError(
          err.response?.data?.detail ||
          err.response?.data?.error ||
          "Failed to load pull requests."
        );

      } finally {

        setLoading(false);

      }

    };

    loadPullRequests();

  }, []);


  /* =========================================
     UNIQUE REPOSITORIES
  ========================================= */

  const repositories = useMemo(() => {

    const uniqueRepositories = [
      ...new Map(
        pullRequests
          .filter(
            (pullRequest) =>
              pullRequest.repository
          )
          .map((pullRequest) => [
            pullRequest.repository.id,
            pullRequest.repository,
          ])
      ).values(),
    ];

    return uniqueRepositories.sort(
      (a, b) =>
        a.name.localeCompare(b.name)
    );

  }, [pullRequests]);


  /* =========================================
     FILTER PULL REQUESTS
  ========================================= */

  const filteredPullRequests = useMemo(() => {

    return pullRequests.filter(
      (pullRequest) => {

        const matchesRepository =
          selectedRepository === "all" ||
          (
            pullRequest.repository &&
            String(
              pullRequest.repository.id
            ) === selectedRepository
          );


        let matchesStatus = true;


        if (selectedStatus === "open") {

          matchesStatus =
            pullRequest.state === "open" &&
            !pullRequest.merged;

        }


        if (selectedStatus === "merged") {

          matchesStatus =
            pullRequest.merged === true;

        }


        if (selectedStatus === "closed") {

          matchesStatus =
            pullRequest.state === "closed" &&
            !pullRequest.merged;

        }


        return (
          matchesRepository &&
          matchesStatus
        );

      }
    );

  }, [
    pullRequests,
    selectedRepository,
    selectedStatus,
  ]);


  /* =========================================
     COUNTS
  ========================================= */

  const totalPullRequests =
    pullRequests.length;

  const openPullRequests =
    pullRequests.filter(
      (pullRequest) =>
        pullRequest.state === "open" &&
        !pullRequest.merged
    ).length;

  const mergedPullRequests =
    pullRequests.filter(
      (pullRequest) =>
        pullRequest.merged
    ).length;

  const closedPullRequests =
    pullRequests.filter(
      (pullRequest) =>
        pullRequest.state === "closed" &&
        !pullRequest.merged
    ).length;


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
      }
    );

  };


  /* =========================================
     GET STATUS
  ========================================= */

  const getStatus = (
    pullRequest
  ) => {

    if (pullRequest.merged) {
      return "merged";
    }

    if (
      pullRequest.state === "closed"
    ) {
      return "closed";
    }

    return "open";

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


      {!loading &&
        !error && (

          <div className="pull-requests-page">


            {/* BREADCRUMB */}

            <div className="pull-requests-breadcrumb">

              <Link to="/dashboard">
                Overview
              </Link>

              <span>
                /
              </span>

              <span>
                Pull Requests
              </span>

            </div>


            {/* HEADER */}

            <div className="pull-requests-header">

              <div>

                <h1>
                  Pull Requests
                </h1>

                <p>
                  Track pull requests across all repositories.
                </p>

              </div>


              <div className="pull-requests-count">

                <strong>
                  {filteredPullRequests.length}
                </strong>

                <span>
                  Showing
                </span>

              </div>

            </div>


            {/* STATS */}

            <div className="pull-request-stats">

              <button
                className={
                  selectedStatus === "all"
                    ? "pr-stat-card active"
                    : "pr-stat-card"
                }
                onClick={() =>
                  setSelectedStatus("all")
                }
              >

                <span>
                  Total
                </span>

                <strong>
                  {totalPullRequests}
                </strong>

              </button>


              <button
                className={
                  selectedStatus === "open"
                    ? "pr-stat-card active open"
                    : "pr-stat-card open"
                }
                onClick={() =>
                  setSelectedStatus("open")
                }
              >

                <span>
                  Open
                </span>

                <strong>
                  {openPullRequests}
                </strong>

              </button>


              <button
                className={
                  selectedStatus === "merged"
                    ? "pr-stat-card active merged"
                    : "pr-stat-card merged"
                }
                onClick={() =>
                  setSelectedStatus("merged")
                }
              >

                <span>
                  Merged
                </span>

                <strong>
                  {mergedPullRequests}
                </strong>

              </button>


              <button
                className={
                  selectedStatus === "closed"
                    ? "pr-stat-card active closed"
                    : "pr-stat-card closed"
                }
                onClick={() =>
                  setSelectedStatus("closed")
                }
              >

                <span>
                  Closed
                </span>

                <strong>
                  {closedPullRequests}
                </strong>

              </button>

            </div>


            {/* FILTERS */}

            <div className="pull-requests-filters">

              <select
                value={selectedRepository}
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
                      key={repository.id}
                      value={repository.id}
                    >

                      {repository.name}

                    </option>

                  )
                )}

              </select>


              <select
                value={selectedStatus}
                onChange={(event) =>
                  setSelectedStatus(
                    event.target.value
                  )
                }
              >

                <option value="all">
                  All Status
                </option>

                <option value="open">
                  Open
                </option>

                <option value="merged">
                  Merged
                </option>

                <option value="closed">
                  Closed
                </option>

              </select>

            </div>


            {/* MAIN CARD */}

            <div className="pull-requests-card">


              <div className="pull-requests-card-header">

                <div>

                  <h2>
                    Pull Requests
                  </h2>

                  <p>
                    Latest pull request activity
                  </p>

                </div>

              </div>


              <div className="pull-request-list">


                {filteredPullRequests.length ===
                0 ? (

                  <div className="repositories-empty">

                    No pull requests found.

                  </div>

                ) : (

                  filteredPullRequests.map(
                    (pullRequest) => {

                      const status =
                        getStatus(
                          pullRequest
                        );

                      return (

                        <div
                          className="pull-request-row"
                          key={pullRequest.id}
                        >


                          {/* STATUS ICON */}

                          <div
                            className={`pull-request-icon ${status}`}
                          >

                            {status === "merged"
                              ? "⑂"
                              : status === "closed"
                              ? "×"
                              : "●"}

                          </div>


                          {/* MAIN */}

                          <div className="pull-request-main">


                            <h3>

                              {pullRequest.title}

                            </h3>


                            <div className="pull-request-meta">

                              <span>
                                #{pullRequest.github_id}
                              </span>

                              <span>
                                •
                              </span>

                              <span>
                                {pullRequest.author}
                              </span>

                              <span>
                                •
                              </span>

                              <span>
                                {formatDate(
                                  pullRequest.created_at
                                )}
                              </span>

                            </div>


                            {pullRequest.repository && (

                              <div className="pull-request-repository">

                                <span>
                                  Repository
                                </span>

                                <Link
                                  to={`/dashboard/repositories/${pullRequest.repository.id}`}
                                >

                                  {
                                    pullRequest.repository.name
                                  }

                                </Link>

                              </div>

                            )}

                          </div>


                          {/* STATUS */}

                          <div
                            className={`pull-request-status ${status}`}
                          >

                            {status}

                          </div>


                          {/* GITHUB */}

                          {pullRequest.html_url && (

                            <a
                              className="pull-request-github"
                              href={
                                pullRequest.html_url
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Open on GitHub"
                            >

                              ↗

                            </a>

                          )}

                        </div>

                      );

                    }
                  )

                )}

              </div>

            </div>

          </div>

        )}

    </DashboardLayout>

  );

}

export default PullRequests;