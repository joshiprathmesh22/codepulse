import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import PulseIcon from "../icons/PulseIcon";
import { syncRepositories } from "../../services/githubServices";

const Sidebar = () => {
  const location = useLocation();

  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState("");

  const menu = [
    {
      label: "Overview",
      path: "/dashboard",
    },
    {
      label: "Repositories",
      path: "/dashboard/repositories",
    },
    {
      label: "Commits",
      path: "/dashboard/commits",
    },
    {
      label: "Pull Requests",
      path: "/dashboard/pull-requests",
    },
    {
      label: "Issues",
      path: "/dashboard/issues",
    },
    {
      label: "Branches",
      path: "/dashboard/branches",
    },
    {
      label: "Contributors",
      path: "/dashboard/contributors",
    },
    {
      label: "Analytics",
      path: "/dashboard/analytics",
    },
    {
      label: "Reports",
      path: "/dashboard/reports",
    },
    {
      label: "Alerts",
      path: "/dashboard/alerts",
    },
    {
      label: "Organization",
      path: "/dashboard/organization",
    },
    {
      label: "Settings",
      path: "/dashboard/settings",
    },
  ];

const handleSync = async () => {
  try {
    setSyncing(true);
    setSyncMessage("");

    const result = await syncRepositories();

    console.log("Sync result:", result);

    setSyncMessage(
      `${result.repositories_synced || 0} repositories synced`
    );
  } catch (error) {
    console.error("GitHub sync error:", error);
    console.error("Response:", error.response?.data);
    setSyncMessage(
      JSON.stringify(
      error.response?.data?.detail ||
      error.response?.data?.error ||
      "Sync failed"
      )
    );
  } finally {
    setSyncing(false);
  }
};

  return (
    <aside className="dashboard-sidebar">

      <div className="dashboard-logo">
        <PulseIcon />

        <span className="dashboard-logo-text">
          CodePulse
        </span>
      </div>

      <nav className="dashboard-nav">
        {menu.map((item) => {
          const active =
            location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={
                active
                  ? "dashboard-nav-item active"
                  : "dashboard-nav-item"
              }
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="dashboard-sidebar-bottom">

        <button
          className="sync-github-btn"
          onClick={handleSync}
          disabled={syncing}
        >
          <span className="sync-github-icon">
            ↻
          </span>

          <span>
            {syncing
              ? "Syncing..."
              : "Sync GitHub"}
          </span>
        </button>

        {syncMessage && (
          <div className="sync-message">
            {syncMessage}
          </div>
        )}

        <div className="sync-status">
          <span className="sync-dot" />

          <div>
            <strong>
              Sync Status
            </strong>

            <span>
              All repositories synced
            </span>
          </div>
        </div>

      </div>

    </aside>
  );
};

export default Sidebar;