import React, { useEffect, useState } from "react";
import { Navbar, Nav, Container, Row, Col, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    // Check token and decode username
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUsername(decodedToken.sub);

        // Fetch applications data
        fetchApplications(token);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const fetchApplications = async (token) => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/admin/get-all-applications/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );
      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      } else {
        console.error("Failed to fetch applications");
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  return (
    <div>
      {/* Top Navigation Bar */}
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-3">
        <Container>
          <Navbar.Brand href="/">Admin Dashboard</Navbar.Brand>
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
              <Nav.Link onClick={() => navigate("/admin-dashboard")}>
                Dashboard
              </Nav.Link>
              <Nav.Link onClick={() => navigate("/donation-details")}>
                Donations
              </Nav.Link>
            </Nav>
          </Col>

          {/* Main Content */}
          <Col md={10} className="p-3">
            <h2>Welcome, {username ? username : "Loading..."}</h2>

            {/* Applications Table */}
            <div className="mt-4">
              <h4>Applications</h4>
              <Table striped bordered hover responsive className="mt-3">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Username</th>
                    <th>Status</th>
                    <th>Application Date</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.length > 0 ? (
                    applications.map((app, index) => (
                      <tr
                        key={app.id}
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          navigate(`/application-details/${app.id}`)
                        }
                      >
                        <td>{index + 1}</td>
                        <td>{app.username}</td>
                        <td>{app.status || "N/A"}</td>
                        <td>
                          {new Date(app.application_date).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">
                        No applications found
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminDashboard;
