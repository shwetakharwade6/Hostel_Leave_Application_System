import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// Set axios base URL outside component
axios.defaults.baseURL = 'http://localhost:5000';

// Create Context
export const LeaveContext = createContext();

export const LeaveProvider = ({ children }) => {
  // Currently logged-in user
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);

  // All leave applications
  const [leaves, setLeaves] = useState([]);

  // Check for token on load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Wrap async functions inside useEffect
      const initialize = async () => {
        await fetchCurrentUser();
        await fetchLeaves();
      };
      initialize();
    }
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const res = await axios.get('/api/users/me');
      setCurrentUser(res.data);
    } catch (error) {
      console.error('Error fetching user:', error);
      localStorage.removeItem('token');
    }
  };

  const fetchLeaves = async () => {
    try {
      const res = await axios.get('/api/leaves');
      setLeaves(res.data);
    } catch (error) {
      console.error('Error fetching leaves:', error);
    }
  };

  // Register new user
  const registerUser = async (userData) => {
    try {
      const res = await axios.post('/api/auth/register', userData);
      return { success: true, message: res.data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  };

  // Login user
  const loginUser = async (identifier, password) => {
    try {
      const res = await axios.post('/api/auth/login', { identifier, password });
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setCurrentUser(user);
      await fetchLeaves();
      return { success: true, user };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  // Logout
  const logoutUser = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setCurrentUser(null);
    setLeaves([]);
  };

  // Apply leave
  const applyLeave = async (leaveData) => {
    try {
      const res = await axios.post('/api/leaves', leaveData);
      setLeaves((prev) => [...prev, res.data]);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to apply leave' };
    }
  };

  // Update leave status
  const updateLeaveStatus = async (leaveId, action) => {
    try {
      const res = await axios.put(`/api/leaves/${leaveId}/status`, { status: action });

      // Instant UI update
      setLeaves(prev =>
        prev.map(leave =>
          leave._id === leaveId ? { ...leave, status: res.data.status } : leave
        )
      );

      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to update status' };
    }
  };

  return (
    <LeaveContext.Provider
      value={{
        users,
        setUsers,
        registerUser,
        loginUser,
        currentUser,
        setCurrentUser,
        leaves,
        setLeaves,
        applyLeave,
        updateLeaveStatus,
        logoutUser,
      }}
    >
      {children}
    </LeaveContext.Provider>
  );
};