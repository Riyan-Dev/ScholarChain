import React, { useEffect, useState } from "react";
import { Navbar, Nav, Container, Row, Col, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const DonationDetails = () => {
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (token) {
      try {
        // Mock decoding token (replace with jwtDecode if needed)
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        setUsername(decodedToken.sub);
        fetchDonations(token);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const fetchDonations = async (token) => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/admin/get-all-donations/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setDonations(data);
      } else {
        console.error("Failed to fetch donations.");
      }
    } catch (error) {
      console.error("Error fetching donations:", error);
    } finally {
      setLoading(false);
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
            <h2>Welcome, {username || "Loading..."}</h2>

            {/* Donations Table */}
            <div className="mt-4">
              <h4>Donations</h4>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <Table striped bordered hover responsive className="mt-3">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Account ID</th>
                      <th>Donation Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donations.length > 0 ? (
                      donations.map((donation, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{donation.account_id}</td>
                          <td>{donation.donation_amount}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center">
                          No donations found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DonationDetails;
