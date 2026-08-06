import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/Dashboard/Dashboard";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Authentication */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

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