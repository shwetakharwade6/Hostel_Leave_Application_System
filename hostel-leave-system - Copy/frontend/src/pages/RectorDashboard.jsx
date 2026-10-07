import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LeaveContext } from "../LeaveContext";
import "./RectorDashboard.css";

export default function RectorDashboard() {

  const { leaves, updateLeaveStatus, currentUser, logoutUser } =
    useContext(LeaveContext);

  const navigate = useNavigate();

  // 🔹 Pending leaves (from HOD)
  const pendingLeaves = leaves?.filter(
    (leave) => leave.status === "Sent to Rector 📤"
  );

  // Already Rector ने approve केलेले leaves history साठी filter करतो.
  const approvedLeaves = leaves?.filter(
    (leave) => leave.status === "Approved by Rector ✅"
  );

  // 🔹 Approve leave
  const handleApprove = async (leaveId) => {
    //Backend API call करून leave approve करतो
    const result = await updateLeaveStatus(leaveId, "approve");

    if (result?.success) {
      alert("Leave approved by Rector!");
    } else {
      alert("❌ Failed to approve leave");
    }

  };

  // 🔹 Logout
  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  if (!currentUser) return null;

  return (
    <div className="rector-container">

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>

      <div className="rector-card">

        <h1 className="rector-title">🏠 Rector Dashboard</h1>


        {/* ================= Pending Leaves ================= */}

        <h2>📤 Pending Leaves</h2>

        {pendingLeaves?.length === 0 ? (

          <p>No pending leaves from HOD.</p>

        ) : (

          <table className="rector-table">

            <thead>
              <tr>
                <th>Student Name</th>
                <th>Class</th>
                <th>Room No</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {pendingLeaves.map((leave) => {

                const student = leave.studentId;

                return (
                  <tr key={leave._id}>

                    <td>{student?.fullName || "N/A"}</td>

                    <td>{student?.className || "N/A"}</td>

                    <td>{student?.roomNo || "N/A"}</td>

                    <td>{leave.start_date}</td>

                    <td>{leave.end_date}</td>

                    <td>{leave.reason}</td>

                    <td>{leave.status}</td>

                    <td>
                      <button
                        className="approve-btn"
                        onClick={() =>
                          handleApprove(leave._id)
                        }
                      >
                        Approve ✅
                      </button>
                    </td>

                  </tr>
                );

              })}

            </tbody>

          </table>

        )}


        {/* ================= History ================= */}

        <h2>📜 Approved Leave History</h2>

        {approvedLeaves?.length === 0 ? (

          <p>No approved leaves yet.</p>

        ) : (

          <table className="rector-history-table">

            <thead>
              <tr>
                <th>Student Name</th>
                <th>Class</th>
                <th>Room No</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>

              {approvedLeaves.map((leave) => {

                const student = leave.studentId;

                return (

                  <tr key={leave._id}>

                    <td>{student?.fullName || "N/A"}</td>

                    <td>{student?.className || "N/A"}</td>

                    <td>{student?.roomNo || "N/A"}</td>

                    <td>{leave.start_date}</td>

                    <td>{leave.end_date}</td>

                    <td>{leave.reason}</td>

                    <td>{leave.status}</td>

                  </tr>

                );

              })}

            </tbody>

          </table>

        )}

      </div>

    </div>
  );
}