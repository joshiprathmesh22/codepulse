import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  getAllBranches,
} from "../../services/repositoryService";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import Sidebar from "../../components/dashboard/Sidebar";
import Topbar from "../../components/dashboard/Topbar";

import "../../css/Dashboard.css";
import "../../css/branches.css";


function Branches() {

  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedRepository, setSelectedRepository] =
    useState("all");


  useEffect(() => {

    const loadBranches = async () => {

      try {

        setLoading(true);
        setError("");

        const data =
          await getAllBranches();

        setBranches(
          data.branches || []
        );

      } catch (err) {

        console.error(err);

        setError(
          err.response?.data?.detail ||
          "Failed to load branches."
        );

      } finally {

        setLoading(false);

      }

    };

    loadBranches();

  }, []);


  // --------------------------------
  // Unique Repositories
  // --------------------------------

  const repositories = useMemo(() => {

    const uniqueRepositories = [
      ...new Map(
        branches.map((branch) => [
          branch.repository.id,
          branch.repository,
        ])
      ).values(),
    ];

    return uniqueRepositories.sort(
      (a, b) =>
        a.name.localeCompare(b.name)
    );

  }, [branches]);


  // --------------------------------
  // Filter Branches
  // --------------------------------

  const filteredBranches = useMemo(() => {

    if (selectedRepository === "all") {
      return branches;
    }

    return branches.filter(
      (branch) =>
        String(branch.repository.id) ===
        selectedRepository
    );

  }, [
    branches,
    selectedRepository,
  ]);


  // --------------------------------
  // Statistics
  // --------------------------------

  const totalBranches = branches.length;

  const defaultBranches = branches.filter(
    (branch) => branch.is_default
  ).length;

  const otherBranches = branches.filter(
    (branch) => !branch.is_default
  ).length;


  return (

    <DashboardLayout
      sidebar={<Sidebar />}
      topbar={<Topbar />}
    >

      {loading && (

        <div className="dashboard-loading">
          Loading branches...
        </div>

      )}


      {error && (

        <div className="dashboard-error">
          {error}
        </div>

      )}


      {!loading && !error && (

        <div className="branches-page">


          {/* Breadcrumb */}

          <div className="branches-breadcrumb">

            <Link to="/dashboard">
              Overview
            </Link>

            <span>
              /
            </span>

            <span>
              Branches
            </span>

          </div>


          {/* Header */}

          <div className="branches-header">

            <div>

              <h1>
                Branches
              </h1>

              <p>
                Manage and track branches across all repositories.
              </p>

            </div>


            <div className="branches-count">

              <strong>
                {filteredBranches.length}
              </strong>

              <span>
                Showing Branches
              </span>

            </div>

          </div>


          {/* Statistics */}

          <div className="branches-stats">

            <div className="branch-stat-card">

              <span>
                Total Branches
              </span>

              <strong>
                {totalBranches}
              </strong>

            </div>


            <div className="branch-stat-card default">

              <span>
                Default Branches
              </span>

              <strong>
                {defaultBranches}
              </strong>

            </div>


            <div className="branch-stat-card other">

              <span>
                Other Branches
              </span>

              <strong>
                {otherBranches}
              </strong>

            </div>

          </div>


          {/* Repository Filter */}

          <div className="branches-filters">

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


          {/* Branches Card */}

          <div className="branches-card">

            <div className="branches-card-header">

              <div>

                <h2>
                  All Branches
                </h2>

                <p>
                  Branches across your organization
                </p>

              </div>

            </div>


            <div className="branch-list">

              {filteredBranches.length === 0 ? (

                <div className="repositories-empty">

                  No branches found.

                </div>

              ) : (

                filteredBranches.map(
                  (branch) => (

                    <div
                      className="branch-row"
                      key={branch.id}
                    >


                      {/* Branch Icon */}

                      <div className="branch-icon">
                        ⎇
                      </div>


                      {/* Main Content */}

                      <div className="branch-main">

                        <h3>
                          {branch.name}
                        </h3>


                        <div className="branch-repository">

                          <span>
                            Repository
                          </span>

                          <Link
                            to={`/dashboard/repositories/${branch.repository.id}`}
                          >

                            {branch.repository.name}

                          </Link>

                        </div>

                      </div>


                      {/* Default Badge */}

                      {branch.is_default ? (

                        <span className="branch-default">
                          Default
                        </span>

                      ) : (

                        <span className="branch-secondary">
                          Branch
                        </span>

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


export default Branches;