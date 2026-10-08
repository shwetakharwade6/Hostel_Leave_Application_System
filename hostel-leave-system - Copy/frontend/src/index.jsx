import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { LeaveProvider } from "./LeaveContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LeaveProvider>
      <BrowserRouter basename="/Hostel_Leave_Application_System">
        <App />
      </BrowserRouter>
    </LeaveProvider>
  </React.StrictMode>
);
