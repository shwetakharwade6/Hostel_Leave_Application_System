import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LeaveContext } from "../LeaveContext";
import "./ParentDashboard.css";

export default function ParentDashboard() {
  const { leaves, users, updateLeaveStatus, currentUser, logoutUser } =
    useContext(LeaveContext);

  const navigate = useNavigate();

  //leaves array मधून parent related leaves filter करणार
 // filter() → leaves madhun specific leaves select करतो.leave → leave object.
  const parentLeaves = leaves
    ? leaves.filter((leave) => {
        const student = users?.find(
          (u) =>
            u._id?.toString() === leave.studentId?.toString()
        );
        return student?.parentNo === currentUser?.mobile;
      })
    : [];
        //Backend API call करून leave approve करतो
  const handleApprove = async (leaveId) => {
    await updateLeaveStatus(leaveId, "approve");   
  };

  const handleReject = async (leaveId) => {
    await updateLeaveStatus(leaveId, "reject");    
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  return (
    <div className="parent-container">
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>

      <div className="parent-card">
        <h1>👨‍👩‍👧 Parent Dashboard</h1>

        {parentLeaves.length === 0 ? (
          <p>No leave requests from your child.</p>
        ) : (
          <table className="parent-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {parentLeaves.map((leave) => {
                const student = users?.find(
                  (u) =>
                    u._id?.toString() === leave.studentId?.toString()
                );

                return (
                  <tr key={leave._id}>
                    <td>{leave.studentId?.fullName || student?.fullName || "Unknown"}</td>
                    <td>{leave.start_date}</td>
                    <td>{leave.end_date}</td>
                    <td>{leave.reason}</td>
                    <td>{leave.status}</td>

                    <td>
                      {leave.status === "Pending ⏳" && (
                        <>
                          <button
                            className="approve-btn"
                            onClick={() => handleApprove(leave._id)}
                          >
                            Approve
                          </button>

                          <button
                            className="reject-btn"
                            onClick={() => handleReject(leave._id)}
                          >
                            Reject
                          </button>
                        </>
                      )}
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
