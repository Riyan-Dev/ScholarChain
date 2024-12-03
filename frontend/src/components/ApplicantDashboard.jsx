import React, { useEffect, useState } from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Corrected import

const ApplicantDashboard = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Retrieve the token from localStorage
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        // Decode the token to extract the username
        const decodedToken = jwtDecode(token);
        setUsername(decodedToken.sub); // Assuming the token has a 'sub' field for username
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    } else {
      navigate("/login"); // Redirect to login if there's no token
    }
  }, [navigate]);

  const handleFillForm = () => {
    navigate("/fill-form"); // Navigate to the form page
  };

  const handleUploadDocuments = () => {
    navigate("/upload-documents"); // Navigate to Upload Documents page
  };

  // Logout function
  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem("access_token");

    // Redirect to the login page
    navigate("/login");
  };

  return (
    <div>
      {/* Top Navigation Bar */}
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home">Applicant Dashboard</Navbar.Brand>
          <Nav className="ml-auto">
            {/* Logout Button */}
            <Nav.Link onClick={handleLogout} style={{ cursor: "pointer" }}>
              Logout
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <Container className="mt-5">
        <h2>Welcome, {username ? username : "Loading..."}</h2>
        <p>Here you can manage your tasks, fill out forms, and more.</p>

        {/* Button to navigate to form */}
        <Button
          variant="primary"
          onClick={handleUploadDocuments}
          className="me-3"
        >
          Upload Documents
        </Button>
        <Button variant="primary" onClick={handleFillForm}>
          Fill Form
        </Button>
      </Container>
    </div>
  );
};

export default ApplicantDashboard;
