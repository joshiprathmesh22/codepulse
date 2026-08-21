import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { getAlerts } from "../../services/dashboardService";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import Sidebar from "../../components/dashboard/Sidebar";
import Topbar from "../../components/dashboard/Topbar";

import "../../css/Dashboard.css";
import "../../css/alerts.css";


function Alerts() {

  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [selectedType, setSelectedType] =
    useState("all");


  // =========================================
  // LOAD ALERTS
  // =========================================

  useEffect(() => {

    const loadAlerts = async () => {

      try {

        setLoading(true);
        setError("");

        const result = await getAlerts();

        setData(result);

      } catch (err) {

        console.error("Failed to load alerts:", err);

        setError(
          err.response?.data?.detail ||
          "Failed to load alerts."
        );

      } finally {

        setLoading(false);

      }

    };

    loadAlerts();

  }, []);


  // =========================================
  // FILTER ALERTS
  // =========================================

  const filteredAlerts = useMemo(() => {

    if (!data?.alerts) {
      return [];
    }

    if (selectedType === "all") {
      return data.alerts;
    }

    return data.alerts.filter(
      (alert) =>
        alert.type === selectedType
    );

  }, [data, selectedType]);


  // =========================================
  // ALERT CONFIGURATION
  // =========================================

  const getAlertIcon = (type) => {

    if (type === "critical") {
      return "!";
    }

    if (type === "warning") {
      return "⚠";
    }

    return "i";

  };


  return (

    <DashboardLayout
      sidebar={<Sidebar />}
      topbar={<Topbar />}
    >

      {loading && (

        <div className="dashboard-loading">
          Loading alerts...
        </div>

      )}


      {error && (

        <div className="dashboard-error">
          {error}
        </div>

      )}


      {!loading && !error && data && (

        <div className="alerts-page">


          {/* =====================================
              BREADCRUMB
          ===================================== */}

          <div className="alerts-breadcrumb">

            <Link to="/dashboard">
              Overview
            </Link>

            <span>/</span>

            <span>
              Alerts
            </span>

          </div>


          {/* =====================================
              HEADER
          ===================================== */}

          <div className="alerts-header">

            <div>

              <h1>
                Alerts
              </h1>

              <p>
                Monitor important repository activity
                and engineering issues.
              </p>

            </div>


            <div className="alerts-total">

              <strong>
                {data.summary?.total || 0}
              </strong>

              <span>
                Total Alerts
              </span>

            </div>

          </div>


          {/* =====================================
              SUMMARY CARDS
          ===================================== */}

          <div className="alerts-summary-grid">

            <button
              className={
                selectedType === "all"
                  ? "alert-summary-card active"
                  : "alert-summary-card"
              }
              onClick={() =>
                setSelectedType("all")
              }
            >

              <span className="alert-summary-label">
                All Alerts
              </span>

              <strong>
                {data.summary?.total || 0}
              </strong>

            </button>


            <button
              className={
                selectedType === "critical"
                  ? "alert-summary-card critical active"
                  : "alert-summary-card critical"
              }
              onClick={() =>
                setSelectedType("critical")
              }
            >

              <span className="alert-summary-label">
                Critical
              </span>

              <strong>
                {data.summary?.critical || 0}
              </strong>

            </button>


            <button
              className={
                selectedType === "warning"
                  ? "alert-summary-card warning active"
                  : "alert-summary-card warning"
              }
              onClick={() =>
                setSelectedType("warning")
              }
            >

              <span className="alert-summary-label">
                Warnings
              </span>

              <strong>
                {data.summary?.warning || 0}
              </strong>

            </button>


            <button
              className={
                selectedType === "info"
                  ? "alert-summary-card info active"
                  : "alert-summary-card info"
              }
              onClick={() =>
                setSelectedType("info")
              }
            >

              <span className="alert-summary-label">
                Information
              </span>

              <strong>
                {data.summary?.info || 0}
              </strong>

            </button>

          </div>


          {/* =====================================
              ALERTS CARD
          ===================================== */}

          <div className="alerts-card">


            <div className="alerts-card-header">

              <div>

                <h2>
                  {selectedType === "all"
                    ? "All Alerts"
                    : `${selectedType.charAt(0).toUpperCase()}${selectedType.slice(1)} Alerts`
                  }
                </h2>

                <p>
                  {filteredAlerts.length} alert
                  {filteredAlerts.length !== 1
                    ? "s"
                    : ""
                  } found
                </p>

              </div>


              <select
                className="alerts-filter-select"
                value={selectedType}
                onChange={(e) =>
                  setSelectedType(
                    e.target.value
                  )
                }
              >

                <option value="all">
                  All Alerts
                </option>

                <option value="critical">
                  Critical
                </option>

                <option value="warning">
                  Warnings
                </option>

                <option value="info">
                  Information
                </option>

              </select>

            </div>


            {/* =====================================
                ALERT LIST
            ===================================== */}

            <div className="alerts-list">

              {filteredAlerts.length === 0 ? (

                <div className="alerts-empty">

                  <div className="alerts-empty-icon">
                    ✓
                  </div>

                  <h3>
                    No alerts found
                  </h3>

                  <p>
                    There are no alerts in this category.
                  </p>

                </div>

              ) : (

                filteredAlerts.map((alert) => (

                  <div
                    className={`alert-row ${alert.type}`}
                    key={alert.id}
                  >


                    {/* Alert Icon */}

                    <div
                      className={`alert-icon ${alert.type}`}
                    >
                      {getAlertIcon(
                        alert.type
                      )}
                    </div>


                    {/* Alert Content */}

                    <div className="alert-content">

                      <div className="alert-title-row">

                        <h3>
                          {alert.title}
                        </h3>

                        <span
                          className={`alert-badge ${alert.type}`}
                        >
                          {alert.type}
                        </span>

                      </div>


                      <p>
                        {alert.message}
                      </p>


                      {alert.repository && (

                        <div className="alert-repository">

                          <span>
                            Repository
                          </span>

                          <Link
                            to={`/dashboard/repositories/${alert.repository.id}`}
                          >
                            {alert.repository.name}
                          </Link>

                        </div>

                      )}

                    </div>


                    {/* Repository Link */}

                    {alert.repository && (

                      <Link
                        className="alert-view-btn"
                        to={`/dashboard/repositories/${alert.repository.id}`}
                      >
                        View →
                      </Link>

                    )}

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


export default Alerts;