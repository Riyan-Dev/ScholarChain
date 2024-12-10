import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Tabs,
  Tab,
  Spinner,
  Card,
  Table,
  Alert,
  Button,
} from "react-bootstrap";

const ApplicationDetails = ({ applicationId }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch(
          `http://127.0.0.1:8000/admin/fetch-application-details?application_id=${applicationId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          },
        );
        if (response.ok) {
          const data = await response.json();
          setDetails(data);
        } else {
          console.error("Failed to fetch application details");
        }
      } catch (error) {
        console.error("Error fetching application details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [applicationId]);

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
        <span className="ms-2">Loading application details...</span>
      </div>
    );

  if (!details)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <p>No application details available.</p>
      </div>
    );

  return (
    <Container>
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <h4 className="text-primary mb-3">Summary</h4>
          <p>
            <strong>Status:</strong>{" "}
            <span className="text-success">{details.Status || "N/A"}</span>
          </p>
          <p>
            <strong>Total Risk Score:</strong>{" "}
            <span className="fw-bold text-warning">
              {details.total_score || 0}
            </span>
          </p>
        </Card.Body>
      </Card>

      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <h4 className="text-primary mb-3">Risk Assessment</h4>
          <Table striped bordered hover>
            <thead className="table-dark">
              <tr>
                <th>Risk Type</th>
                <th>Risk Score</th>
                <th>Calculations</th>
              </tr>
            </thead>
            <tbody>
              {details.risk_assessment
                ? Object.entries(details.risk_assessment).map(([key, value]) =>
                    value && typeof value === "object" ? (
                      <tr key={key}>
                        <td className="text-capitalize">
                          {key.replace("_", " ")}
                        </td>
                        <td className="fw-bold text-center">
                          {value.risk_score}
                        </td>
                        <td>{value.calculations}</td>
                      </tr>
                    ) : null,
                  )
                : null}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Card className="shadow-sm">
        <Card.Body>
          <h4 className="text-primary mb-3">Repayment Plan</h4>
          <Table bordered hover>
            <tbody>
              {details.plan ? (
                <>
                  <tr>
                    <th>Total Loan Amount</th>
                    <td>{details.plan.total_loan_amount || "N/A"}</td>
                  </tr>
                  <tr>
                    <th>Start Date</th>
                    <td>{details.plan.Start_date || "N/A"}</td>
                  </tr>
                  <tr>
                    <th>End Date</th>
                    <td>{details.plan.end_date || "N/A"}</td>
                  </tr>
                  <tr>
                    <th>Repayment Frequency</th>
                    <td>{details.plan.repayment_frequency || "N/A"}</td>
                  </tr>
                  <tr>
                    <th>Installment Amount</th>
                    <td>{details.plan.installment_amount || "N/A"}</td>
                  </tr>
                  <tr>
                    <th>Reasoning</th>
                    <td>{details.plan.reasoning || "N/A"}</td>
                  </tr>
                </>
              ) : (
                <tr>
                  <td colSpan="2">No repayment plan details available.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

const ApplicationResponses = ({ applicationId }) => {
  const [responses, setResponses] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch(
          `http://127.0.0.1:8000/application/get-by-id/?application_id=${applicationId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          },
        );
        if (response.ok) {
          const data = await response.json();
          setResponses(data);
        } else {
          console.error("Failed to fetch application responses");
        }
      } catch (error) {
        console.error("Error fetching application responses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, [applicationId]);

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
        <span className="ms-2">Loading application responses...</span>
      </div>
    );

  if (!responses)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
        <span className="ms-2">Loading application responses...</span>
      </div>
    );

  return (
    <Container>
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <h4 className="text-primary mb-3">Personal Information</h4>
          <p>
            <strong>Full Name:</strong>{" "}
            {responses.personal_info.full_name || "N/A"}
          </p>
          <p>
            <strong>Email Address:</strong>{" "}
            {responses.personal_info.email_address || "N/A"}
          </p>
          <p>
            <strong>Gender:</strong> {responses.personal_info.gender || "N/A"}
          </p>
          <p>
            <strong>Nationality:</strong>{" "}
            {responses.personal_info.nationality || "N/A"}
          </p>
          <p>
            <strong>Marital Status:</strong>{" "}
            {responses.personal_info.marital_status || "N/A"}
          </p>
          <p>
            <strong>Phone Number:</strong>{" "}
            {responses.personal_info.phone_number || "N/A"}
          </p>
          <p>
            <strong>Email Address:</strong>{" "}
            {responses.personal_info.email_address || "N/A"}
          </p>
          <p>
            <strong>Residential Address:</strong>{" "}
            {responses.personal_info.residential_address || "N/A"}
          </p>
          <p>
            <strong>Permanent Address:</strong>{" "}
            {responses.personal_info.permanent_address || "N/A"}
          </p>
        </Card.Body>
      </Card>
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <h4 className="text-primary mb-3">Financial Information</h4>
          <p>
            <strong>Total Family Income:</strong>{" "}
            {responses.financial_info.total_family_income || "N/A"}
          </p>
          <p>
            <strong>Other Income Sources:</strong>{" "}
            {responses.financial_info.other_income_sources || "N/A"}
          </p>
          <p>
            <strong>Outstanding Loans or Debts:</strong>{" "}
            {responses.financial_info.outstanding_loans_or_debts || "N/A"}
          </p>
        </Card.Body>
      </Card>
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <h4 className="text-primary mb-3">Academic Information</h4>
          <p>
            <strong>Current Education Level:</strong>{" "}
            {responses.academic_info.current_or_university || "N/A"}
          </p>
          <p>
            <strong>College or University:</strong>{" "}
            {responses.academic_info.college_or_university || "N/A"}
          </p>
          <p>
            <strong>Student ID:</strong>{" "}
            {responses.academic_info.student_id || "N/A"}
          </p>
          <p>
            <strong>Program Name / Degree:</strong>{" "}
            {responses.academic_info.program_name_degree || "N/A"}
          </p>
          <p>
            <strong>Duration of Course:</strong>{" "}
            {responses.academic_info.duration_of_course || "N/A"}
          </p>
          <p>
            <strong>Year / Semester:</strong>{" "}
            {responses.academic_info.year_or_semester || "N/A"}
          </p>
          <p>
            <strong>GPA:</strong> {responses.academic_info.gpa || "N/A"}
          </p>
          <p>
            <strong>Achievements & Awards:</strong>{" "}
            {responses.academic_info.achievements_or_awards || "N/A"}
          </p>
        </Card.Body>
      </Card>
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <h4 className="text-primary mb-3">Loan Details</h4>
          <p>
            <strong>Loan Amount Requested:</strong>{" "}
            {responses.loan_details.loan_amount_requested || "N/A"}
          </p>
          <p>
            <strong>Purpose of Loan:</strong>{" "}
            {responses.loan_details.purpose_of_loan || "N/A"}
          </p>
          <p>
            <strong>Proposed Repayment Period:</strong>{" "}
            {responses.loan_details.proposed_repayment_period || "N/A"}
          </p>
          <p>
            <strong>Preferred Repayment Frequency:</strong>{" "}
            {responses.loan_details.preferred_repayment_frequency || "N/A"}
          </p>
        </Card.Body>
      </Card>
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <h4 className="text-primary mb-3">References</h4>
          {responses.references.map((reference, index) => (
            <div key={index} className="mb-3">
              <p>
                <strong>Name:</strong> {reference.name}
              </p>
              <p>
                <strong>Designation:</strong> {reference.designation}
              </p>
              <p>
                <strong>Contact Details:</strong> {reference.contact_details}
              </p>
              <p>
                <strong>Comments:</strong> {reference.comments}
              </p>
              {index < responses.references.length - 1 && <hr />}
            </div>
          ))}
        </Card.Body>
      </Card>
    </Container>
  );
};

const ApplicationPage = () => {
  const { id: applicationId } = useParams();
  const [activeTab, setActiveTab] = useState("details");
  const [verificationMessage, setVerificationMessage] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async () => {
    setIsVerifying(true);
    setVerificationMessage(null);

    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        `http://127.0.0.1:8000/admin/verify/?application_id=${applicationId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setVerificationMessage({
          type: "success",
          text: data.message || "Application successfully verified.",
        });
      } else {
        setVerificationMessage({
          type: "danger",
          text: "Failed to verify application. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error verifying application:", error);
      setVerificationMessage({
        type: "danger",
        text: "An error occurred while verifying the application.",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Container className="py-4">
      <h1 className="text-center mb-4">Application Overview</h1>
      <Tabs
        id="application-tabs"
        activeKey={activeTab}
        onSelect={(key) => setActiveTab(key)}
        className="mb-3"
      >
        <Tab eventKey="details" title="Application Details">
          <ApplicationDetails applicationId={applicationId} />
        </Tab>
        <Tab eventKey="responses" title="Application Responses">
          <ApplicationResponses applicationId={applicationId} />
        </Tab>
      </Tabs>

      {verificationMessage && (
        <Alert variant={verificationMessage.type} className="mt-3">
          {verificationMessage.text}
        </Alert>
      )}

      <div className="text-center mt-4">
        <Button variant="primary" onClick={handleVerify} disabled={isVerifying}>
          {isVerifying ? "Verifying..." : "Verify Application"}
        </Button>
      </div>
    </Container>
  );
};

export default ApplicationPage;
