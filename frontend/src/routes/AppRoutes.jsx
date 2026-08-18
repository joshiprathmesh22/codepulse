import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/Dashboard/Dashboard";
import Repositories from "../pages/Dashboard/Repositories";
import RepositoryDetail from "../pages/Dashboard/RepositoryDetail";
import RepositoryCommits from "../pages/Dashboard/RepositoryCommits";

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