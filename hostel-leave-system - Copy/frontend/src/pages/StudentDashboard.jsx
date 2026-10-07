import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LeaveContext } from "../LeaveContext";
import "./StudentDashboard.css";

export default function StudentDashboard() {

  const { leaves, setLeaves, currentUser, logoutUser } =
    useContext(LeaveContext);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    start_date: "",
    end_date: "",
    reason: "",
  });

  
  const today = new Date().toISOString().split("T")[0];

  //  leave fetch krnya sathi
  useEffect(() => {

    if (!currentUser) return;

    const fetchLeaves = async () => {
      try {
        //Login madhe save kelela data JWT token localStorage madhun gheto.

        const token = localStorage.getItem("token");
          // Authorization header मध्ये token send करतो.
        const res = await fetch("http://localhost:5000/api/leaves", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        //server response json format madhe convert krto
        const data = await res.json();


        if (res.ok) {
          setLeaves(data);
        }

      } catch (error) {
        console.log("Error fetching leaves");
      }
    };

    fetchLeaves();

  }, [currentUser, setLeaves]);

  //Form input change झाल्यावर run होणारा function
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  //  Submit leave   leave fetch kranyasathi async use krto
  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!currentUser) {
      alert("User not logged in");
      return;
    }

    try {
          
      const token = localStorage.getItem("token");
       //Backend ला POST request.New leave create.
      const res = await fetch("http://localhost:5000/api/leaves", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        //Server ला form data send करतो.
        body: JSON.stringify({
          start_date: formData.start_date,
          end_date: formData.end_date,
          reason: formData.reason,
        }),
      });
        //data gheto
      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Leave submit failed");
        return;
      }

      //new leave table madhe add krto
      setLeaves((prev) => [...prev, data]);
      //form reset
      setFormData({
        start_date: "",
        end_date: "",
        reason: "",
      });

      alert("✅ Leave submitted successfully");

    } catch (error) {
      console.log(error);
      alert("Server error");
    }
  };


  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };


  if (!currentUser) {
    return <h2>Please login first</h2>;
  }


  return (
    <div className="student-dashboard-page">

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>

      <div className="student-card">

        <h1>🎓 Student Dashboard</h1>

        <h2>Leave Application</h2>

        <form onSubmit={handleSubmit}>

          <label>Start Date</label>
          <input
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            min={today}
            required
          />

          <label>End Date</label>
          <input
            type="date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
            min={formData.start_date || today}
            required
          />

          <label>Reason</label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            required
          />

          <button type="submit">
            Submit Leave
          </button>

        </form>


        <h2>My Leaves</h2>

        <table>

          <thead>
            <tr>
              <th>Room No</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Reason</th>
              <th>Status</th>
            </tr>
          </thead>
    
          <tbody>
            {leaves
              ?.filter(
                (leave) =>
                  leave.studentId?._id?.toString() ===
                  currentUser?.id?.toString()
              )//student chya leave filter krto
              
              //Each leave साठी table row create
              .map((leave) => (

                <tr key={leave._id}>
                  <td>{leave.roomNo || "N/A"}</td>
                  <td>{leave.start_date}</td>
                  <td>{leave.end_date}</td>
                  <td>{leave.reason}</td>
                  <td>{leave.status}</td>
                </tr>

              ))}

          </tbody>

        </table>

      </div>
    </div>
  );
}