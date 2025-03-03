<<<<<<< HEAD
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
    navigate("/application-form"); // Navigate to the form page
  };

  const navigateToChatApp = () => {
    navigate("/chat-app"); // This will navigate to the ChatbotPage (ChatApp page)
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
        <Button variant="primary" onClick={handleFillForm} className="me-3">
          Fill Form
        </Button>
        <Button variant="primary" onClick={navigateToChatApp} className="me-3">
          Go to ChatApp
        </Button>{" "}
        {/* New button to navigate to ChatbotPage */}
      </Container>
    </div>
  );
};

export default ApplicantDashboard;
=======
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Layout from "./Layout";
import ChatbotPage from "./ChatbotPage"; // Import the Chatbot component
import styled from "styled-components";

// Define modernized styles for the chatbot container
const ChatbotWrapper = styled.div`
  position: fixed;
  bottom: 90px; /* Adjusted to position above the button */
  right: 20px;
  width: 350px;
  height: 500px;
  background: linear-gradient(135deg, #ffffff, #f1f1f1);
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  display: ${({ isOpen }) => (isOpen ? "flex" : "none")};
  flex-direction: column;
  overflow: hidden;
  z-index: 1000;
`;

const ChatbotHeader = styled.div`
  background-color: #0078d4;
  color: #fff;
  padding: 10px;
  text-align: center;
  font-weight: bold;
  font-size: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ChatbotToggle = styled(Button)`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1001;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #0078d4;
  border: none;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
`;

const ChatbotCloseButton = styled(Button)`
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
`;

const ApplicantDashboard = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [isChatbotOpen, setChatbotOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUsername(decodedToken.sub);
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

      {/* Floating Toggle Button */}
      <ChatbotToggle
        variant="primary"
        onClick={() => setChatbotOpen((prev) => !prev)}
      >
        💬
      </ChatbotToggle>

      {/* Modernized Chatbot Window */}
      <ChatbotWrapper isOpen={isChatbotOpen}>
        <ChatbotHeader>
          Chat Support
          <ChatbotCloseButton onClick={() => setChatbotOpen(false)}>
            &times;
          </ChatbotCloseButton>
        </ChatbotHeader>
        <ChatbotPage />
      </ChatbotWrapper>
    </Layout>
  );
};

export default ApplicantDashboard;
>>>>>>> c7a6312bb464bb44bd815201ad5e4f1b140e37ef
