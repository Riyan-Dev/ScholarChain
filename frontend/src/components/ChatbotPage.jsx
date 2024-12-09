import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Button, Form, Spinner } from "react-bootstrap";
import styled from "styled-components"; // Import styled-components

// Define your styled components
const ChatContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  height: 80vh;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const ChatHeader = styled.div`
  background-color: #0078d4;
  color: white;
  padding: 10px;
  text-align: center;
  border-radius: 8px 8px 0 0;
`;

const ChatBody = styled.div`
  flex-grow: 1;
  padding: 10px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const Message = styled.div`
  margin-bottom: 10px;
  max-width: 80%;
`;

const UserMessage = styled.div`
  align-self: flex-end;
  background-color: #0078d4;
  color: white;
  padding: 10px;
  border-radius: 15px;
  word-wrap: break-word;
  margin-left: auto;
`;

const BotMessage = styled.div`
  align-self: flex-start;
  background-color: #f1f1f1;
  color: #333;
  padding: 10px;
  border-radius: 15px;
  word-wrap: break-word;
`;

const ChatFooter = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ChatbotPage = () => {
  const [messages, setMessages] = useState([]); // Holds the conversation
  const [userInput, setUserInput] = useState(""); // User's input
  const [isLoading, setIsLoading] = useState(false); // Loading state for the bot's response
  const messageEndRef = useRef(null); // Reference to scroll to the bottom of the chat

  // Function to scroll to the bottom whenever messages are updated
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Function to handle user input and send the query
  const handleSendMessage = async () => {
    if (!userInput.trim()) return; // Prevent sending empty messages

    // Add user message to the chat
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "user", content: userInput },
    ]);

    setIsLoading(true);
    try {
      // Send the query as a URL parameter (not in the body)
      const response = await axios.post(
        `http://localhost:8000/rag/chat?query=${encodeURIComponent(userInput)}`, // Send query as URL parameter
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            accept: "application/json", // Ensure the backend accepts the response as JSON
          },
        },
      );

      // Log the full response for debugging purposes
      console.log("Response from server:", response);

      // Check if the response structure matches the expected format
      if (response.data && response.data.response) {
        // Add bot's response to the chat
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", content: response.data.response },
        ]);
      } else {
        console.error("Response structure is unexpected:", response);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            sender: "bot",
            content:
              "Sorry, something went wrong. The response is not in the expected format.",
          },
        ]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "bot",
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }

    // Clear user input field
    setUserInput("");
  };

  return (
    <ChatContainer>
      <ChatHeader>
        <h3>Chatbot</h3>
      </ChatHeader>

      <ChatBody>
        {messages.length === 0 && (
          <p className="text-center">Start the conversation!</p>
        )}
        {messages.map((msg, idx) => (
          <Message key={idx}>
            {msg.sender === "user" ? (
              <UserMessage>{msg.content}</UserMessage>
            ) : (
              <BotMessage>{msg.content}</BotMessage>
            )}
          </Message>
        ))}
        {isLoading && (
          <Message>
            <BotMessage>
              <Spinner animation="border" size="sm" /> Waiting for response...
            </BotMessage>
          </Message>
        )}
        <div ref={messageEndRef} /> {/* Scroll reference */}
      </ChatBody>

      <ChatFooter>
        <Form.Control
          type="text"
          placeholder="Type your message..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <Button
          variant="primary"
          onClick={handleSendMessage}
          disabled={isLoading || !userInput.trim()}
        >
          Send
        </Button>
      </ChatFooter>
    </ChatContainer>
  );
};

export default ChatbotPage;
