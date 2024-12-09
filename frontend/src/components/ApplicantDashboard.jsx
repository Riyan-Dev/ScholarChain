import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Corrected import
import Layout from "./Layout";

const ApplicantDashboard = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUsername(decodedToken.sub); // Assuming the token has a 'sub' field for username
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <Layout>
      <h2>Welcome, {username ? username : "Loading..."}</h2>
      <p>Here you can manage your tasks, fill out forms, and more.</p>
      <Button
        variant="primary"
        onClick={() => navigate("/upload-documents")}
        className="me-3"
      >
        Upload Documents
      </Button>
      <Button
        variant="primary"
        onClick={() => navigate("/application-form")}
        className="me-3"
      >
        Fill Form
      </Button>
      <Button
        variant="primary"
        onClick={() => navigate("/chat-app")}
        className="me-3"
      >
        Go to ChatApp
      </Button>
    </Layout>
  );
};

export default ApplicantDashboard;
