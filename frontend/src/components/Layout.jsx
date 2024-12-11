import React from "react";
import { Navbar, Nav, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Layout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  return (
    <div>
      {/* Top Navigation Bar */}
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-3">
        <Container>
          <Navbar.Brand href="/">Applicant Dashboard</Navbar.Brand>
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
              <Nav.Link onClick={() => navigate("/applicant-dashboard")}>
                Dashboard
              </Nav.Link>
              <Nav.Link onClick={() => navigate("/upload-documents")}>
                Upload Documents
              </Nav.Link>
              {/* <Nav.Link onClick={() => navigate("/application-form")}>
                Fill Form
              </Nav.Link> */}
              <Nav.Link onClick={() => navigate("/chat-app")}>
                Chat App
              </Nav.Link>
              <Nav.Link onClick={() => navigate("/application-plan")}>
                View Application Plan
              </Nav.Link>
            </Nav>
          </Col>

          {/* Main Content */}
          <Col md={9} className="p-4">
            {children}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Layout;
