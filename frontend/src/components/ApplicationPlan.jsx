import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";
import axios from "axios";

const ApplicationPlan = () => {
  const [planData, setPlanData] = useState(null);
  const [riskScore, setRiskScore] = useState(null);
  const [isLoadingPlan, setIsLoadingPlan] = useState(false);
  const [isLoadingRisk, setIsLoadingRisk] = useState(false);
  const [planError, setPlanError] = useState("");
  const [riskError, setRiskError] = useState("");

  const fetchPersonalizedPlan = async () => {
    setIsLoadingPlan(true);
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(
        "http://localhost:8000/application/personalised-plan/",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setPlanData(response.data);
    } catch (err) {
      setPlanError("Failed to fetch personalized plan.");
    } finally {
      setIsLoadingPlan(false);
    }
  };

  const fetchRiskScore = async () => {
    setIsLoadingRisk(true);
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(
        "http://localhost:8000/application/risk-score/",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setRiskScore(response.data);
    } catch (err) {
      setRiskError("Failed to fetch risk score.");
    } finally {
      setIsLoadingRisk(false);
    }
  };

  useEffect(() => {
    fetchPersonalizedPlan();
    fetchRiskScore();
  }, []);

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh", background: "#f5f5f5" }}
    >
      <Row className="w-100 justify-content-center">
        {/* Personalized Plan Section */}
        <Col sm={12} md={6} className="mb-4">
          <Card className="shadow-lg">
            <Card.Body>
              <h3 className="text-primary mb-3">Personalized Plan</h3>
              {isLoadingPlan ? (
                <Spinner animation="border" variant="primary" />
              ) : planError ? (
                <Alert variant="danger">{planError}</Alert>
              ) : planData ? (
                <div>
                  <p>
                    <strong>Total Loan Amount:</strong> PKR{" "}
                    {planData.total_loan_amount}
                  </p>
                  <p>
                    <strong>Start Date:</strong> {planData.Start_date}
                  </p>
                  <p>
                    <strong>End Date:</strong> {planData.end_date}
                  </p>
                  <p>
                    <strong>Repayment Frequency:</strong>{" "}
                    {planData.repayment_frequency}
                  </p>
                  <p>
                    <strong>Installment Amount:</strong> PKR{" "}
                    {planData.installment_amount}
                  </p>
                  <p>
                    <strong>Reasoning:</strong> {planData.reasoning}
                  </p>
                </div>
              ) : (
                <Alert variant="info">No plan data available.</Alert>
              )}
              <Button
                variant="primary"
                className="mt-3 w-100"
                onClick={fetchPersonalizedPlan}
                disabled={isLoadingPlan}
              >
                {isLoadingPlan ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  "Refresh Plan"
                )}
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Risk Score Section */}
        <Col sm={12} md={6} className="mb-4">
          <Card className="shadow-lg">
            <Card.Body>
              <h3 className="text-warning mb-3">Risk Assessment</h3>
              {isLoadingRisk ? (
                <Spinner animation="border" variant="warning" />
              ) : riskError ? (
                <Alert variant="danger">{riskError}</Alert>
              ) : riskScore ? (
                <div>
                  <p>
                    <strong>Total Risk Score:</strong> {riskScore}
                  </p>
                  <p>
                    A lower score indicates better financial, academic, and
                    personal risk assessment.
                  </p>
                </div>
              ) : (
                <Alert variant="info">No risk score available.</Alert>
              )}
              <Button
                variant="warning"
                className="mt-3 w-100"
                onClick={fetchRiskScore}
                disabled={isLoadingRisk}
              >
                {isLoadingRisk ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  "Refresh Risk Score"
                )}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ApplicationPlan;
