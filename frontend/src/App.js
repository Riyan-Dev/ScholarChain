import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import AdminDashboard from "./components/AdminDashboard.jsx";
import ApplicantDashboard from "./components/ApplicantDashboard.jsx";
import DonatorDashboard from "./components/DonatorDashboard.jsx";
import FillForm from "./components/ApplicationPlan.jsx";
import UploadDocuments from "./components/UploadDocuments.jsx";
import ChatbotPage from "./components/ChatbotPage.jsx"; // Import ChatbotPage
import ApplicationForm from "./components/ApplicationForm.jsx";
import ApplicationDetails from "./components/ApplicationDetails.jsx";
import DonationDetails from "./components/DonationDetails.jsx";
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
          <Route path="/application-plan" element={<FillForm />} />
          <Route path="/upload-documents" element={<UploadDocuments />} />
          <Route path="/application-form" element={<ApplicationForm />} />
          <Route path="/chat-app" element={<ChatbotPage />} />{" "}
          <Route
            path="/application-details/:id"
            element={<ApplicationDetails />}
          />
          <Route path="/donation-details/" element={<DonationDetails />} />
          {/* New route for Chatbot */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
