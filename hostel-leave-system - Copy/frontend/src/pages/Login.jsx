import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LeaveContext } from "../LeaveContext";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const { loginUser } = useContext(LeaveContext);

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const result = await loginUser(identifier, password);

    if (!result.success) {
      alert(result.message);
      return;
    }

    const user = result.user;

    alert(`Welcome ${user.fullName}!`);

    if (user.role === "student") navigate("/student");
    else if (user.role === "parent") navigate("/parent");
    else if (user.role === "hod") navigate("/hod");
    else if (user.role === "rector") navigate("/rector");
    else navigate("/");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Login</h2>

        <form onSubmit={handleLogin}>
          <label>Mobile No</label>
          <input
          type="text"
          value={identifier}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*$/.test(value)) {
              setIdentifier(value);
            } else {
              alert("Not allowed! Enter numbers only");
            }
          }}
          placeholder="Enter mobile no"
          maxLength={10}
          required
        />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        <p className="register-text">
          Don’t have an account?{" "}
          <Link to="/" className="register-link">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}