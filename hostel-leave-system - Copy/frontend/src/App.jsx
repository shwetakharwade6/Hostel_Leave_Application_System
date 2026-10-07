import React from "react";
import { Routes, Route } from "react-router-dom";
import RoleSelect from "./pages/RoleSelect";
import Register from "./pages/Register";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import ParentDashboard from "./pages/ParentDashboard";
import HODDashboard from "./pages/HODDashboard";
import RectorDashboard from "./pages/RectorDashboard";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RoleSelect />} />
      <Route path="/register/:role" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/student" element={<StudentDashboard />} />
      <Route path="/parent" element={<ParentDashboard />} />
      <Route path="/hod" element={<HODDashboard />} />
      <Route path="/rector" element={<RectorDashboard />} />
    </Routes>
  );
}
