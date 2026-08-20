import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  getAllIssues,
} from "../../services/repositoryService";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import Sidebar from "../../components/dashboard/Sidebar";
import Topbar from "../../components/dashboard/Topbar";

import "../../css/Dashboard.css";
import "../../css/issues.css";


function Issues() {

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedRepository, setSelectedRepository] =
    useState("all");

  const [selectedStatus, setSelectedStatus] =
    useState("all");


  useEffect(() => {

    const loadIssues = async () => {

      try {

        setLoading(true);
        setError("");

        const data =
          await getAllIssues();

        setIssues(
          data.issues || []
        );

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

  }, []);


  // --------------------------------
  // Unique repositories
  // --------------------------------

  const repositories = useMemo(() => {

    const uniqueRepositories = [

      ...new Map(

        issues.map((issue) => [

          issue.repository.id,
          issue.repository,

        ])

      ).values(),

    ];

    return uniqueRepositories.sort(
      (a, b) =>
        a.name.localeCompare(b.name)
    );

  }, [issues]);


  // --------------------------------
  // Filter Issues
  // --------------------------------

  const filteredIssues = useMemo(() => {

    return issues.filter((issue) => {

      const repositoryMatch =
        selectedRepository === "all" ||
        String(issue.repository.id) ===
          selectedRepository;

      const statusMatch =
        selectedStatus === "all" ||
        issue.state === selectedStatus;

      return (
        repositoryMatch &&
        statusMatch
      );

    });

  }, [
    issues,
    selectedRepository,
    selectedStatus,
  ]);


  // --------------------------------
  // Statistics
  // --------------------------------

  const totalIssues =
    issues.length;

  const openIssues =
    issues.filter(
      (issue) =>
        issue.state === "open"
    ).length;

  const closedIssues =
    issues.filter(
      (issue) =>
        issue.state === "closed"
    ).length;


  // --------------------------------
  // Date Formatter
  // --------------------------------

  const formatDate = (date) => {

    if (!date) return "";

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


      {!loading && !error && (

        <div className="issues-page">


          {/* Breadcrumb */}

          <div className="issues-breadcrumb">

            <Link to="/dashboard">
              Overview
            </Link>

            <span>
              /
            </span>

            <span>
              Issues
            </span>

          </div>


          {/* Header */}

          <div className="issues-header">

            <div>

              <h1>
                Issues
              </h1>

              <p>
                Track and manage issues across all repositories.
              </p>

            </div>


            <div className="issues-count">

              <strong>
                {filteredIssues.length}
              </strong>

              <span>
                Showing Issues
              </span>

            </div>

          </div>


          {/* Statistics */}

          <div className="issues-stats">

            <div className="issue-stat-card">

              <span>
                Total Issues
              </span>

              <strong>
                {totalIssues}
              </strong>

            </div>


            <button
              className={
                selectedStatus === "open"
                  ? "issue-stat-card open active"
                  : "issue-stat-card open"
              }
              onClick={() =>
                setSelectedStatus(
                  selectedStatus === "open"
                    ? "all"
                    : "open"
                )
              }
            >

              <span>
                Open
              </span>

              <strong>
                {openIssues}
              </strong>

            </button>


            <button
              className={
                selectedStatus === "closed"
                  ? "issue-stat-card closed active"
                  : "issue-stat-card closed"
              }
              onClick={() =>
                setSelectedStatus(
                  selectedStatus === "closed"
                    ? "all"
                    : "closed"
                )
              }
            >

              <span>
                Closed
              </span>

              <strong>
                {closedIssues}
              </strong>

            </button>

          </div>


          {/* Filters */}

          <div className="issues-filters">

            {/* Repository Filter */}

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


            {/* Status Filter */}

            <select
              value={selectedStatus}
              onChange={(e) =>
                setSelectedStatus(
                  e.target.value
                )
              }
            >

              <option value="all">
                All Status
              </option>

              <option value="open">
                Open
              </option>

              <option value="closed">
                Closed
              </option>

            </select>

          </div>


          {/* Issues Card */}

          <div className="issues-card">


            <div className="issues-card-header">

              <div>

                <h2>
                  All Issues
                </h2>

                <p>
                  Issues across your organization
                </p>

              </div>

            </div>


            <div className="issue-list">


              {filteredIssues.length === 0 ? (

                <div className="repositories-empty">

                  No issues found.

                </div>

              ) : (

                filteredIssues.map(
                  (issue) => (

                    <div
                      className="issue-row"
                      key={issue.id}
                    >


                      {/* Issue Icon */}

                      <div
                        className={
                          issue.state === "open"
                            ? "issue-icon open"
                            : "issue-icon closed"
                        }
                      >

                        {issue.state === "open"
                          ? "!"
                          : "✓"}

                      </div>


                      {/* Main Content */}

                      <div className="issue-main">

                        <h3>
                          {issue.title}
                        </h3>


                        <div className="issue-meta">

                          <span>
                            {issue.author}
                          </span>

                          <span>
                            •
                          </span>

                          <span>
                            {formatDate(
                              issue.created_at
                            )}
                          </span>

                        </div>


                        {/* Repository */}

                        <div className="issue-repository">

                          <span>
                            Repository
                          </span>

                          <Link
                            to={`/dashboard/repositories/${issue.repository.id}`}
                          >

                            {issue.repository.name}

                          </Link>

                        </div>

                      </div>


                      {/* Status */}

                      <span
                        className={
                          issue.state === "open"
                            ? "issue-status open"
                            : "issue-status closed"
                        }
                      >

                        {issue.state}

                      </span>


                      {/* GitHub */}

                      {issue.html_url && (

                        <a
                          className="issue-github"
                          href={issue.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Open on GitHub"
                        >

                          ↗

                        </a>

                      )}

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


export default Issues;