import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import AdminDashboard from "./components/AdminDashboard.jsx";
import ApplicantDashboard from "./components/ApplicantDashboard.jsx";
import DonatorDashboard from "./components/DonatorDashboard.jsx";
import FillForm from "./components/FillForm.jsx";
import UploadDocuments from "./components/UploadDocuments.jsx";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Login />} /> {/* Default route to Login */}
          {/* Role-Based Dashboards */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/applicant-dashboard" element={<ApplicantDashboard />} />
          <Route path="/donator-dashboard" element={<DonatorDashboard />} />
          {/* Other Routes */}
          <Route path="/fill-form" element={<FillForm />} />
          <Route path="/upload-documents" element={<UploadDocuments />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
