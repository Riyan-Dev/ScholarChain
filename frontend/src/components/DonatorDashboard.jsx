import React, { useEffect, useState } from "react";
import {
  Navbar,
  Nav,
  Container,
  Row,
  Col,
  Button,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const DonatorDashboard = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [wallet, setWallet] = useState(null);

  useEffect(() => {
    // Check token and decode username
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUsername(decodedToken.sub);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
      fetchWalletInfo(token);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const fetchWalletInfo = async (token) => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/donator/get-wallet/",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );
      const data = await response.json();
      if (response.ok) {
        setWallet(data);
      } else {
        setError(data.message || "Failed to fetch wallet info.");
      }
    } catch (error) {
      setError("Error fetching wallet info.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  const buyTokens = async (amount) => {
    const token = localStorage.getItem("access_token");
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/donator/buy-tokens/?amount=${amount}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );
      const data = await response.json();
      if (response.ok) {
        setMessage("Tokens Minted Successfully");
        setError(""); // Clear any previous errors
      } else {
        setError(data.message || "Failed to mint tokens.");
        setMessage(""); // Clear any previous success messages
      }
    } catch (error) {
      setError("Error buying tokens.");
      setMessage(""); // Clear any previous success messages
    }
  };

  const makeDonation = async (amount) => {
    const token = localStorage.getItem("access_token");
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/donator/donate/?amount=${amount}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );
      const data = await response.json();
      if (response.ok) {
        setMessage("Transaction Successful");
        setError(""); // Clear any previous errors
      } else {
        setError(data.message || "Failed to make donation.");
        setMessage(""); // Clear any previous success messages
      }
    } catch (error) {
      setError("Error making donation.");
      setMessage(""); // Clear any previous success messages
    }
  };

  return (
    <div>
      {/* Top Navigation Bar */}
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-3">
        <Container>
          <Navbar.Brand href="/">Donor Dashboard</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link onClick={handleLogout} style={{ cursor: "pointer" }}>
                Logout
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container fluid>
        <Row>
          {/* Sidebar */}
          <Col md={2} className="bg-light vh-100 p-3">
            <Nav className="flex-column">
              <Nav.Link onClick={() => navigate("/donor-dashboard")}>
                Dashboard
              </Nav.Link>
            </Nav>
          </Col>

          {/* Main Content */}
          <Col md={10} className="p-3">
            <h2>Welcome, {username ? username : "Loading..."}</h2>

            {/* Wallet Info */}
            {wallet ? (
              <div className="mt-4">
                <h4>Wallet Balance: {wallet.balance} Tokens</h4>
                <h5>Recent Transactions</h5>
                <ul>
                  {wallet.transactions.map((transaction, index) => (
                    <li key={index}>
                      <strong>{transaction.action.toUpperCase()}</strong>:{" "}
                      {transaction.amount} Tokens
                      {transaction.username &&
                        ` to ${transaction.username}`} on{" "}
                      {transaction.timestamp}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p>Loading wallet info...</p>
            )}

            {/* Actions */}
            <div className="mt-4">
              <h4>Buy Tokens</h4>
              <Button
                variant="primary"
                onClick={() => buyTokens(1000)}
                className="mt-3"
              >
                Buy 1000 Tokens
              </Button>
            </div>

            <div className="mt-4">
              <h4>Make a Donation</h4>
              <Button
                variant="success"
                onClick={() => makeDonation(150)}
                className="mt-3"
              >
                Donate 150
              </Button>
            </div>

            {/* Message Display */}
            {message && (
              <Alert variant="success" className="mt-3">
                {message}
              </Alert>
            )}
            {error && (
              <Alert variant="danger" className="mt-3">
                {error}
              </Alert>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DonatorDashboard;
