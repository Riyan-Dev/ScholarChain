import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import styled from "styled-components";

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background: linear-gradient(135deg, #ffffff, #f9f9f9);
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  height: 100%;
`;

const ChatHeader = styled.div`
  background-color: #0078d4;
  color: #fff;
  padding: 15px;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
`;

const ChatBody = styled.div`
  flex-grow: 1;
  padding: 10px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  background-color: #f9f9f9;
`;

const ChatInputContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: #fff;
  padding: 10px;
  border-top: 1px solid #ddd;
`;

const ChatInput = styled.input`
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 20px;
  outline: none;
  margin-right: 10px;
  font-size: 14px;
`;

const SendButton = styled.button`
  background-color: #0078d4;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;

  &:disabled {
    background-color: #ccc;
  }
`;

const Message = styled.div`
  display: flex;
  margin-bottom: 10px;
  max-width: 80%;
`;

const UserMessage = styled.div`
  align-self: flex-end;
  background-color: #0078d4;
  color: white;
  padding: 10px;
  border-radius: 15px 15px 0 15px;
  word-wrap: break-word;
  margin-left: auto;
  text-align: right;
`;

const BotMessage = styled.div`
  align-self: flex-start;
  background-color: #f1f1f1;
  color: #333;
  padding: 10px;
  border-radius: 15px 15px 15px 0;
  word-wrap: break-word;
  text-align: left;
`;

const ChatbotPage = () => {
  const [messages, setMessages] = useState([]); // Holds the conversation
  const [userInput, setUserInput] = useState(""); // User's input
  const [isLoading, setIsLoading] = useState(false); // Loading state for the bot's response
  const messageEndRef = useRef(null); // Reference to scroll to the bottom of the chat

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "user", content: userInput },
    ]);

    setIsLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:8000/rag/chat?query=${encodeURIComponent(userInput)}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            accept: "application/json",
          },
        },
      );

      if (response.data && response.data.response) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", content: response.data.response },
        ]);
      } else {
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

    setUserInput("");
  };

  return (
    <ChatContainer>
      {/* <ChatHeader>Chatbot</ChatHeader> */}

      <ChatBody>
        {messages.length === 0 && (
          <p className="text-center">Start the conversation!</p>
        )}
        {messages.map((msg, idx) => (
          <Message
            key={idx}
            style={{
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
            }}
          >
            {msg.sender === "user" ? (
              <UserMessage>{msg.content}</UserMessage>
            ) : (
              <BotMessage>{msg.content}</BotMessage>
            )}
          </Message>
        ))}
        <div ref={messageEndRef} />
      </ChatBody>

      <ChatInputContainer>
        <ChatInput
          type="text"
          placeholder="Type your message..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <SendButton
          onClick={handleSendMessage}
          disabled={isLoading || !userInput.trim()}
        >
          Send
        </SendButton>
      </ChatInputContainer>
    </ChatContainer>
  );
};

export default ChatbotPage;
