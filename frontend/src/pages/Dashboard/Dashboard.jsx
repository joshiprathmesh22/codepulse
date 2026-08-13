import { useEffect, useState } from "react";

import {
  getDashboardOverview,
} from "../../services/dashboardService";


import { syncRepositories } from "../../services/githubServices";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import Sidebar from "../../components/dashboard/Sidebar";
import Topbar from "../../components/dashboard/Topbar";
import StatCard from "../../components/dashboard/StatCard";
import CommitActivity from "../../components/dashboard/CommitActivity";
import RepositoryHealth from "../../components/dashboard/RepositoryHealth";
import PullRequestTrends from "../../components/dashboard/PullRequestTrends";

import "../../css/Dashboard.css";
import "../../css/commitactivity.css";
import "../../css/repositoryhealth.css";
import "../../css/recentactivity.css";
import "../../css/Pullrequest.css";


function Dashboard() {

  const [data, setData] = useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [syncing, setSyncing] =
    useState(false);

  const [syncMessage, setSyncMessage] =
    useState("");


  useEffect(() => {

    const loadDashboard = async () => {

      try {

        const result =
          await getDashboardOverview();

        setData(result);

      } catch (err) {

        console.error(err);

        setError(
          err.response?.data?.detail ||
          "Failed to load dashboard."
        );

      } finally {

        setLoading(false);

      }

    };

    loadDashboard();

  }, []);


  const handleSyncRepositories = async () => {

    try {

      setSyncing(true);
      setSyncMessage("");
      setError("");

      const result =
        await syncRepositories();

      console.log(
        "GitHub sync result:",
        result
      );

      setSyncMessage(
        `${result.count || 0} repositories synced successfully.`
      );

      // Reload dashboard data
      const updatedData =
        await getDashboardOverview();

      setData(updatedData);

    } catch (err) {

      console.error(
        "GitHub sync error:",
        err
      );

      setError(
        err.response?.data?.detail ||
        err.response?.data?.error ||
        "Failed to sync GitHub repositories."
      );

    } finally {

      setSyncing(false);

    }

  };


  return (

    <DashboardLayout
      sidebar={<Sidebar />}
      topbar={<Topbar />}
    >

      {loading && (
        <div className="dashboard-loading">
          Loading dashboard...
        </div>
      )}


      {error && (
        <div className="dashboard-error">
          {error}
        </div>
      )}


      {syncMessage && (
        <div className="dashboard-sync-message">
          ✓ {syncMessage}
        </div>
      )}


      {data && !loading && !error && (

        <>

          <div className="dashboard-heading">

            <div>

              <h1>
                Good morning 👋
              </h1>

              <p>
                Here's what's happening with your
                engineering teams today.
              </p>

            </div>


            {/* <button
              className="sync-github-btn"
              onClick={handleSyncRepositories}
              disabled={syncing}
            >

              {syncing
                ? "Syncing..."
                : "↻ Sync GitHub"
              }

            </button> */}

          </div>


          <div className="dashboard-stats">

            <StatCard
              title="Repositories"
              value={data.repositories}
              description={`${data.active_repositories} active repositories`}
            />

            <StatCard
              title="Commits"
              value={data.commits}
              description="Total commits"
            />

            <StatCard
              title="Pull Requests"
              value={data.pull_requests}
              description="Total pull requests"
            />

            <StatCard
              title="Issues"
              value={data.issues}
              description="Total issues"
            />

            <StatCard
              title="Branches"
              value={data.branches}
              description="Total branches"
            />

          </div>


          <CommitActivity
            activity={data.commit_activity}
          />
          
          <PullRequestTrends
            activity={data.pull_request_activity}
          />

          <div className="dashboard-bottom-grid">

            <RepositoryHealth />

            <div className="recent-activity-card">

              <h2>
                Recent Activity
              </h2>

              <p>
                Coming next...
              </p>

            </div>

          </div>

        </>

      )}

    </DashboardLayout>

  );

}

export default Dashboard;