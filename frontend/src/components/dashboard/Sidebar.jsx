import { Link, useLocation } from "react-router-dom";
import PulseIcon from "../icons/PulseIcon";

const Sidebar = () => {
  const location = useLocation();

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