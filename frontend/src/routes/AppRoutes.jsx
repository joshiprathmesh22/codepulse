import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/Dashboard/Dashboard";
import Repositories from "../pages/Dashboard/Repositories";
import RepositoryDetail from "../pages/Dashboard/RepositoryDetail";
import RepositoryCommits from "../pages/Dashboard/RepositoryCommits";
import RepositoryBranches from "../pages/Dashboard/RepositoryBranches";
import RepositoryPullRequests from "../pages/Dashboard/RepositoryPullRequests";
import RepositoryIssues from "../pages/Dashboard/RepositoryIssues";
import Commits from "../pages/Dashboard/Commits";
import PullRequests from "../pages/Dashboard/PullRequests";
import Issues from "../pages/Dashboard/Issues";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Authentication */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard/repositories" element={<Repositories />} />
        <Route path="/dashboard/repositories/:id" element={<RepositoryDetail />} />
        <Route path="/dashboard/repositories/:id/commits" element={<RepositoryCommits />} />
        <Route path="/dashboard/repositories/:id/branches" element={<RepositoryBranches />} />
        <Route path="/dashboard/repositories/:id/pull-requests" element={<RepositoryPullRequests />} />
        <Route path="/dashboard/repositories/:id/issues" element={<RepositoryIssues />}/> 
        <Route path="/dashboard/commits" element={<Commits />}/>
        <Route path="/dashboard/pull-requests" element={<PullRequests />} />
        <Route path="/dashboard/issues" element={<Issues />}/>
        {/* Protected Routes */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* 404 Page (Optional) */}
        <Route
          path="*"
          element={
            <h1 style={{ textAlign: "center", marginTop: "100px" }}>
              404 - Page Not Found
            </h1>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;