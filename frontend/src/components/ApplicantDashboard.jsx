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
