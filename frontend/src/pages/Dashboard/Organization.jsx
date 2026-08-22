import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getOrganization } from "../../services/dashboardService";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import Sidebar from "../../components/dashboard/Sidebar";
import Topbar from "../../components/dashboard/Topbar";

import "../../css/Dashboard.css";
import "../../css/organization.css";


function Organization() {

  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  useEffect(() => {

    const loadOrganization = async () => {

      try {

        setLoading(true);
        setError("");

        const result =
          await getOrganization();

        setData(result);

      } catch (err) {

        console.error(err);

        setError(
          err.response?.data?.detail ||
          "Failed to load organization."
        );

      } finally {

        setLoading(false);

      }

    };

    loadOrganization();

  }, []);


  const formatDate = (date) => {

    if (!date) return "";

    return new Date(date).toLocaleDateString(
      "en-US",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );

  };


  const getInitial = (name) => {

    if (!name) return "O";

    return name.charAt(0).toUpperCase();

  };


  return (

    <DashboardLayout
      sidebar={<Sidebar />}
      topbar={<Topbar />}
    >

      {loading && (

        <div className="dashboard-loading">
          Loading organization...
        </div>

      )}


      {error && (

        <div className="dashboard-error">
          {error}
        </div>

      )}


      {!loading && !error && data && (

        <div className="organization-page">


          {/* =====================================
              BREADCRUMB
          ====================================== */}

          <div className="organization-breadcrumb">

            <Link to="/dashboard">
              Overview
            </Link>

            <span>/</span>

            <span>
              Organization
            </span>

          </div>


          {/* =====================================
              ORGANIZATION HEADER
          ====================================== */}

          <div className="organization-header">

            <div className="organization-profile">

              <div className="organization-avatar">

                {data.organization.avatar ? (

                  <img
                    src={data.organization.avatar}
                    alt={data.organization.name}
                  />

                ) : (

                  getInitial(
                    data.organization.name
                  )

                )}

              </div>


              <div className="organization-title">

                <div className="organization-name-row">

                  <h1>
                    {data.organization.name}
                  </h1>

                  <span className="organization-plan">
                    {data.organization.plan}
                  </span>

                </div>


                <p>
                  @{data.organization.slug}
                </p>


                <span className="organization-created">

                  Created{" "}

                  {formatDate(
                    data.organization.created_at
                  )}

                </span>

              </div>

            </div>

          </div>


          {/* =====================================
              STATISTICS
          ====================================== */}

          <div className="organization-stats-grid">


            <div className="organization-stat-card">

              <span>
                Members
              </span>

              <strong>
                {data.statistics.members}
              </strong>

            </div>


            <div className="organization-stat-card">

              <span>
                Repositories
              </span>

              <strong>
                {data.statistics.repositories}
              </strong>

              <small>
                {data.statistics.active_repositories}
                {" "} active
              </small>

            </div>


            <div className="organization-stat-card">

              <span>
                Commits
              </span>

              <strong>
                {data.statistics.commits}
              </strong>

            </div>


            <div className="organization-stat-card">

              <span>
                Pull Requests
              </span>

              <strong>
                {data.statistics.pull_requests}
              </strong>

            </div>


            <div className="organization-stat-card">

              <span>
                Issues
              </span>

              <strong>
                {data.statistics.issues}
              </strong>

            </div>


          </div>


          {/* =====================================
              MEMBERS
          ====================================== */}

          <div className="organization-members-card">


            <div className="organization-members-header">

              <div>

                <h2>
                  Organization Members
                </h2>

                <p>
                  People who have access to this organization.
                </p>

              </div>


              <span className="organization-member-count">

                {data.members.length}

                {" "}

                {data.members.length === 1
                  ? "Member"
                  : "Members"}

              </span>

            </div>


            <div className="organization-members-list">

              {data.members.length === 0 ? (

                <div className="organization-empty">

                  No members found.

                </div>

              ) : (

                data.members.map((member) => (

                  <div
                    className="organization-member-row"
                    key={member.id}
                  >


                    <div className="member-avatar">

                      {getInitial(
                        member.full_name
                      )}

                    </div>


                    <div className="member-information">

                      <h3>
                        {member.full_name}
                      </h3>

                      <span>
                        {member.email}
                      </span>

                    </div>


                    <div className="member-role">

                      <span
                        className={`role-badge ${member.role}`}
                      >
                        {member.role}
                      </span>

                    </div>


                    <div className="member-joined">

                      Joined{" "}

                      {formatDate(
                        member.date_joined
                      )}

                    </div>


                  </div>

                ))

              )}

            </div>

          </div>


        </div>

      )}

    </DashboardLayout>

  );

}


export default Organization;