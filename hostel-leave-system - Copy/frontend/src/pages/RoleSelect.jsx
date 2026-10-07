import React from "react";
import { useNavigate } from "react-router-dom";
import "./RoleSelect.css";

export default function RoleSelect() {
  const navigate = useNavigate();

  const handleSelect = (role) => {
    navigate(`/register/${role}`);
  };

  const roles = [
    { key: "student", label: "👨‍🎓 Student" },
    { key: "parent", label: "👨‍👩‍👧 Parent" },
    { key: "hod", label: "🏫 HOD" },
    { key: "rector", label: "🏠 Rector" },
  ];

  return (
    <div className="role-container">
      <div className="role-card">
        <h2 className="role-title">Register As</h2>

        {roles.map((r) => (
          <button
            key={r.key}
            className="role-btn"
            onClick={() => handleSelect(r.key)}
          >
            {r.label}
          </button>
        ))}

        <p className="role-login">
          Already Registered?{" "}
          <span onClick={() => navigate("/login")}>Login</span>
        </p>
      </div>
    </div>
  );
}
