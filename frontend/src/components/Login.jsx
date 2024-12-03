import React, { useState } from "react";
import {
  Button,
  Form,
  Alert,
  Spinner,
  Container,
  Row,
  Col,
  Card,
} from "react-bootstrap";
import axios from "axios";
import qs from "qs"; // To serialize form data
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate(); // Initialize useNavigate hook for redirection

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/user/login",
        qs.stringify({ username, password }), // Serialize data into form-urlencoded format
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
      );

      if (response.data.access_token) {
        const token = response.data.access_token;
        localStorage.setItem("access_token", token);

        // Decode the JWT to extract the role
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        const userRole = decodedToken.role;

        // Navigate based on user role
        if (userRole === "admin") {
          navigate("/admin-dashboard");
        } else if (userRole === "applicant") {
          navigate("/applicant-dashboard");
        } else if (userRole === "donator") {
          navigate("/donator-dashboard");
        }

        setAlertMessage("Login successful!");
        setAlertVariant("success");
      }
    } catch (error) {
      setAlertMessage("Invalid credentials. Please try again.");
      setAlertVariant("danger");
    }
    setIsLoading(false);
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh", background: "#f5f5f5" }}
    >
      <Row className="w-100 justify-content-center">
        <Col sm={12} md={6} lg={4} className="mx-auto">
          <Card className="shadow-lg p-4">
            <Card.Body>
              <h2 className="text-center mb-4 text-primary">Login</h2>
              {alertMessage && (
                <Alert variant={alertVariant}>{alertMessage}</Alert>
              )}
              <Form>
                <Form.Group controlId="formUsername">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    isInvalid={alertVariant === "danger" && !username}
                    className="mb-3"
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid username.
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    isInvalid={alertVariant === "danger" && !password}
                    className="mb-3"
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid password.
                  </Form.Control.Feedback>
                </Form.Group>

                <Button
                  variant="primary"
                  className="mt-3 w-100"
                  onClick={handleLogin}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    "Login"
                  )}
                </Button>
              </Form>

              <div className="text-center mt-3">
                <p>
                  Don't have an account? <a href="/register">Sign Up</a>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
