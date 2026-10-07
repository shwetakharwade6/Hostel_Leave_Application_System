import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LeaveContext } from "../LeaveContext";
import "./HODDashboard.css";

export default function HODDashboard() {
  const { leaves, updateLeaveStatus, currentUser, logoutUser } =
    useContext(LeaveContext);

  const navigate = useNavigate();

  // ✅ Parent Approved + Same Department
  const hodLeaves = leaves
    ? leaves.filter((leave) => {
        const student = leave.studentId;

        return (
          leave.status === "Approved by Parent ✅" &&
          student?.dept === currentUser?.dept
        );
      })
    : [];

  const handleApprove = async (leaveId) => {
    const result = await updateLeaveStatus(leaveId, "approve");
    if (result?.success) {
      alert("Leave sent to Rector!");
    } else {
      alert("❌ Failed to approve leave.");
    }
  };

  const handleReject = async (leaveId) => {
    const result = await updateLeaveStatus(leaveId, "reject");
    if (result?.success) {
      alert("Leave rejected by HOD!");
    } else {
      alert("❌ Failed to reject leave.");
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  if (!currentUser) return null;

  return (
    <div className="hod-container">
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>

      <div className="hod-card">
        <h1 className="hod-title">🏫 HOD Dashboard</h1>
        <p className="hod-subtitle">
          Parent approved leave requests
        </p>

        {hodLeaves.length === 0 ? (
          <p className="no-requests">
            No parent-approved requests.
          </p>
        ) : (
          <table className="hod-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Class</th>
                <th>Room No</th>
                <th>From</th>
                <th>To</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {hodLeaves.map((leave) => {
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

                      <button
                        className="reject-btn"
                        onClick={() =>
                          handleReject(leave._id)
                        }
                      >
                        Reject ❌
                      </button>
                    </td>
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