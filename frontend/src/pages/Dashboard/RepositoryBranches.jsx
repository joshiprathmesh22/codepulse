import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import {
  getRepository,
  getRepositoryBranches,
} from "../../services/repositoryService";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import Sidebar from "../../components/dashboard/Sidebar";
import Topbar from "../../components/dashboard/Topbar";

import "../../css/Dashboard.css";
import "../../css/repobranches.css";

function RepositoryBranches() {

  const { id } = useParams();

  const [repository, setRepository] = useState(null);
  const [branches, setBranches] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    const loadBranches = async () => {

      try {

        setLoading(true);
        setError("");

        const [
          repositoryData,
          branchesData,
        ] = await Promise.all([
          getRepository(id),
          getRepositoryBranches(id),
        ]);

        setRepository(repositoryData);
        setBranches(branchesData.branches || []);

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

  }, [id]);


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

      {!loading && !error && repository && (

        <div className="repository-branches-page">

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

            <span>Branches</span>

          </div>


          {/* Header */}

          <div className="branches-header">

            <div>

              <h1>
                {repository.name} Branches
              </h1>

              <p>
                All branches available in this repository.
              </p>

            </div>

            <div className="branches-count">
              {branches.length} branches
            </div>

          </div>


          {/* Branch List */}

          <div className="branches-list">

            {branches.length === 0 ? (

              <div className="branches-empty">

                <div className="branches-empty-icon">
                  ⎇
                </div>

                <h2>
                  No branches found
                </h2>

                <p>
                  This repository doesn't have any
                  branches synced yet.
                </p>

              </div>

            ) : (

              branches.map((branch) => (

                <div
                  className="branch-card"
                  key={branch.id}
                >

                  <div className="branch-icon">
                    ⎇
                  </div>

                  <div className="branch-info">

                    <div className="branch-name-row">

                      <strong>
                        {branch.name}
                      </strong>

                      {branch.is_default && (
                        <span className="branch-default">
                          DEFAULT
                        </span>
                      )}

                    </div>

                    <span className="branch-description">
                      {branch.is_default
                        ? "Default branch"
                        : "Repository branch"}
                    </span>

                  </div>

                  <div className="branch-status">

                    {branch.is_default
                      ? "Main development branch"
                      : "Active branch"}

                  </div>

                </div>

              ))

            )}

          </div>

        </div>

      )}

    </DashboardLayout>
  );
}

export default RepositoryBranches;