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

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("applicant"); // Default role
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/user/register",
        {
          username,
          email,
          hashed_password: password, // Send plain password; it will be hashed on the backend
          role, // Send the selected role (should be "admin", "applicant", or "donator")
          documents: {
            CNIC: [],
            gaurdian_CNIC: [],
            electricity_bills: [],
            gas_bills: [],
            intermediate_result: [],
            undergrad_transacript: [],
            salary_slips: [],
            bank_statements: [],
            income_tax_certificate: [],
            reference_letter: [],
          }, // Empty array for documents (or you can send documents if needed)
        },
        {
          headers: { "Content-Type": "application/json" },
        },
      );

      if (response.status === 201) {
        setAlertMessage("Registration successful!");
        setAlertVariant("success");
      }
    } catch (error) {
      setAlertMessage("Failed to register. Please try again.");
      setAlertVariant("danger");
    }
    setIsLoading(false);
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <Row className="w-100">
        <Col sm={12} md={6} lg={4} className="mx-auto">
          <Card className="shadow-lg p-4">
            <Card.Body>
              <h2 className="text-center mb-4">Register</h2>
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
                  />
                </Form.Group>

                <Form.Group controlId="formEmail" className="mt-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="formPassword" className="mt-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="formRole" className="mt-3">
                  <Form.Label>Role</Form.Label>
                  <Form.Control
                    as="select"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="applicant">Applicant</option>
                    <option value="donator">Donator</option>
                  </Form.Control>
                </Form.Group>

                <Button
                  variant="primary"
                  className="mt-3 w-100"
                  onClick={handleRegister}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    "Register"
                  )}
                </Button>
              </Form>

              <div className="text-center mt-3">
                <p>
                  Already have an account? <a href="/login">Login</a>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
