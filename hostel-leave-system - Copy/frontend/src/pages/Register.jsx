import React, { useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LeaveContext } from "../LeaveContext";
import "./Register.css";

export default function Register() {
  const { role } = useParams();
  const navigate = useNavigate();

  const { registerUser } = useContext(LeaveContext);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    hostel: "",
    className: "",
    dept: "",
    roomNo: "",
    parentNo: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Full name: only letters and spaces
    if (name === "fullName") {
      if (/^[A-Za-z\s]*$/.test(value)) {
        setFormData({ ...formData, [name]: value });
      } else {
        alert("Numbers are not allowed in Full Name");
      }
      return;
    }

    // Mobile and Parent Mobile: only numbers
    if (name === "mobile" || name === "parentNo") {
      if (/^\d*$/.test(value)) {
        setFormData({ ...formData, [name]: value });
      } else {
        alert("Only numbers are allowed");
      }
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      role,
      fullName: formData.fullName,
      email: formData.email,
      mobile: formData.mobile,
      hostel: formData.hostel,
      className: formData.className,
      dept: formData.dept,
      roomNo: formData.roomNo,
      parentNo: formData.parentNo,
      password: formData.password,
    };

    const result = await registerUser(userData);

    if (result?.success) {
      alert(`✅ ${role.toUpperCase()} Registered Successfully!`);
      navigate("/login");
    } else {
      alert(`❌ ${result?.message || "Registration Failed"}`);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">
          {role === "student"
            ? "🎓 Student Registration"
            : role === "parent"
            ? "👨‍👧 Parent Registration"
            : role === "hod"
            ? "🧑 HOD Registration"
            : role === "rector"
            ? "🏠 Rector Registration"
            : `Register as ${role?.toUpperCase()}`}
        </h2>

        <form onSubmit={handleSubmit}>
          {role === "student" && (
            <>
              <input
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                type="tel"
                name="mobile"
                placeholder="Mobile"
                value={formData.mobile}
                onChange={handleChange}
                maxLength={10}
                required
              />
              <input
                name="hostel"
                placeholder="Hostel"
                value={formData.hostel}
                onChange={handleChange}
                required
              />
              <input
                name="className"
                placeholder="Class"
                value={formData.className}
                onChange={handleChange}
                required
              />
              <input
                name="dept"
                placeholder="Department"
                value={formData.dept}
                onChange={handleChange}
                required
              />
              <input
                name="roomNo"
                placeholder="Room No"
                value={formData.roomNo}
                onChange={handleChange}
                required
              />
              <input
                type="tel"
                name="parentNo"
                placeholder="Parent Mobile"
                value={formData.parentNo}
                onChange={handleChange}
                maxLength={10}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </>
          )}

          {role === "parent" && (
            <>
              <input
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
              <input
                type="tel"
                name="mobile"
                placeholder="Mobile"
                value={formData.mobile}
                onChange={handleChange}
                maxLength={10}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </>
          )}

          {role === "hod" && (
            <>
              <input
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                type="tel"
                name="mobile"
                placeholder="Mobile"
                value={formData.mobile}
                onChange={handleChange}
                maxLength={10}
                required
              />
              <input
                name="dept"
                placeholder="Department"
                value={formData.dept}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </>
          )}

          {role === "rector" && (
            <>
              <input
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                type="tel"
                name="mobile"
                placeholder="Mobile"
                value={formData.mobile}
                onChange={handleChange}
                maxLength={10}
                required
              />
              <input
                name="hostel"
                placeholder="Hostel Name"
                value={formData.hostel}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </>
          )}

          <button type="submit" className="register-btn">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}