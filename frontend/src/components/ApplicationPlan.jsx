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
  const [riskAssessment, setRiskAssessment] = useState(null);
  const [isLoadingPlan, setIsLoadingPlan] = useState(false);
  const [isLoadingRisk, setIsLoadingRisk] = useState(false);
  const [isLoadingAssessment, setIsLoadingAssessment] = useState(false);
  const [planError, setPlanError] = useState("");
  const [riskError, setRiskError] = useState("");
  const [assessmentError, setAssessmentError] = useState("");

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
      // Handle both cases: plain value or object with `risk_score`
      const score =
        typeof response.data === "number"
          ? response.data
          : response.data?.risk_score;
      setRiskScore(score || "Not available");
    } catch (err) {
      setRiskError("Failed to fetch risk score.");
    } finally {
      setIsLoadingRisk(false);
    }
  };

  const fetchRiskAssessment = async () => {
    if (!planData?.application_id) {
      setAssessmentError("Application ID is missing.");
      return;
    }

    setIsLoadingAssessment(true);
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(
        `http://localhost:8000/application/risk-assessment/?application_id=${planData.application_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setRiskAssessment(response.data);
    } catch (err) {
      setAssessmentError("Failed to fetch risk assessment.");
    } finally {
      setIsLoadingAssessment(false);
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
                    <strong>Application ID:</strong> {planData.application_id}
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
              <h3 className="text-warning mb-3">Risk Score</h3>
              {isLoadingRisk ? (
                <Spinner animation="border" variant="warning" />
              ) : riskError ? (
                <Alert variant="danger">{riskError}</Alert>
              ) : riskScore !== null ? (
                <div>
                  <strong>Risk Score:</strong>{" "}
                  {typeof riskScore === "number"
                    ? riskScore
                    : riskScore?.risk_score}
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

        {/* Risk Assessment Section */}
        <Col sm={12} md={6} className="mb-4">
          <Card className="shadow-lg">
            <Card.Body>
              <h3 className="text-danger mb-3">Risk Assessment Details</h3>
              {isLoadingAssessment ? (
                <Spinner animation="border" variant="danger" />
              ) : assessmentError ? (
                <Alert variant="danger">{assessmentError}</Alert>
              ) : riskAssessment ? (
                <div>
                  {/* Display application ID */}
                  <div className="mb-3">
                    <p>
                      <strong>Application ID:</strong>{" "}
                      {riskAssessment.application_id || "Not provided"}
                    </p>
                  </div>

                  {/* Display ID */}
                  <div className="mb-3">
                    <p>
                      <strong>ID:</strong>{" "}
                      {riskAssessment._id || "Not provided"}
                    </p>
                  </div>

                  {/* Iterate over the risk categories */}
                  {Object.entries(riskAssessment).map(([key, value]) => {
                    if (["application_id", "_id", "created_at"].includes(key)) {
                      return null; // Skip rendering these fields here
                    }
                    return (
                      <div key={key} className="mb-3">
                        <p>
                          <strong>
                            {key.replace(/_/g, " ").toUpperCase()}:
                          </strong>{" "}
                          {value?.risk_score || "Not provided"}
                        </p>
                        <p>
                          <strong>Calculations:</strong>{" "}
                          {value?.calculations || "Not provided"}
                        </p>
                      </div>
                    );
                  })}

                  {/* Display Created At */}
                  <div className="mb-3">
                    <p>
                      <strong>Created At:</strong>{" "}
                      {riskAssessment.created_at
                        ? new Date(riskAssessment.created_at).toLocaleString()
                        : "Not provided"}
                    </p>
                  </div>
                </div>
              ) : (
                <Alert variant="info">No risk assessment available.</Alert>
              )}
              <Button
                variant="danger"
                className="mt-3 w-100"
                onClick={fetchRiskAssessment}
                disabled={isLoadingAssessment}
              >
                {isLoadingAssessment ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  "Fetch Risk Assessment"
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
