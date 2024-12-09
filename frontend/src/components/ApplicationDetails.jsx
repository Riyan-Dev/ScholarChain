import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Tabs, Tab, Spinner, Card, Table } from "react-bootstrap";

const ApplicationDetails = ({ applicationId }) => {
  const [details, setDetails] = useState(null);

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
      }
    };

    fetchDetails();
  }, [applicationId]);

  if (!details)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
        <span className="ms-2">Loading application details...</span>
      </div>
    );

  return (
    <Container>
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <h4 className="text-primary mb-3">Summary</h4>
          <p>
            <strong>Status:</strong>{" "}
            <span className="text-success">{details.Status}</span>
          </p>
          <p>
            <strong>Total Risk Score:</strong>{" "}
            <span className="fw-bold text-warning">{details.total_score}</span>
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
              {Object.entries(details.risk_assessment).map(([key, value]) =>
                typeof value === "object" ? (
                  <tr key={key}>
                    <td className="text-capitalize">{key.replace("_", " ")}</td>
                    <td className="fw-bold text-center">{value.risk_score}</td>
                    <td>{value.calculations}</td>
                  </tr>
                ) : null,
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Card className="shadow-sm">
        <Card.Body>
          <h4 className="text-primary mb-3">Repayment Plan</h4>
          <Table bordered hover>
            <tbody>
              <tr>
                <th>Total Loan Amount</th>
                <td>{details.plan.total_loan_amount}</td>
              </tr>
              <tr>
                <th>Start Date</th>
                <td>{details.plan.Start_date}</td>
              </tr>
              <tr>
                <th>End Date</th>
                <td>{details.plan.end_date}</td>
              </tr>
              <tr>
                <th>Repayment Frequency</th>
                <td>{details.plan.repayment_frequency}</td>
              </tr>
              <tr>
                <th>Installment Amount</th>
                <td>{details.plan.installment_amount}</td>
              </tr>
              <tr>
                <th>Reasoning</th>
                <td>{details.plan.reasoning}</td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

const ApplicationResponses = ({ applicationId }) => {
  const [responses, setResponses] = useState(null);

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
      }
    };

    fetchResponses();
  }, [applicationId]);

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
            <strong>Full Name:</strong> {responses.personal_info.full_name}
          </p>
          <p>
            <strong>Email Address:</strong>{" "}
            {responses.personal_info.email_address}
          </p>
          <p>
            <strong>Gender:</strong> {responses.personal_info.gender}
          </p>
          <p>
            <strong>Nationality:</strong> {responses.personal_info.nationality}
          </p>
          <p>
            <strong>Marital Status:</strong>{" "}
            {responses.personal_info.marital_status}
          </p>
          <p>
            <strong>Phone Number:</strong>{" "}
            {responses.personal_info.phone_number}
          </p>
          <p>
            <strong>Email Address:</strong>{" "}
            {responses.personal_info.email_address}
          </p>
          <p>
            <strong>Residential Address:</strong>{" "}
            {responses.personal_info.residential_address}
          </p>
          <p>
            <strong>Permanent Address:</strong>{" "}
            {responses.personal_info.permanent_address}
          </p>
        </Card.Body>
      </Card>
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <h4 className="text-primary mb-3">Financial Information</h4>
          <p>
            <strong>Total Family Income:</strong>{" "}
            {responses.financial_info.total_family_income}
          </p>
          <p>
            <strong>Other Income Sources:</strong>{" "}
            {responses.financial_info.other_income_sources}
          </p>
          <p>
            <strong>Outstanding Loans or Debts:</strong>{" "}
            {responses.financial_info.outstanding_loans_or_debts}
          </p>
        </Card.Body>
      </Card>
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <h4 className="text-primary mb-3">Academic Information</h4>
          <p>
            <strong>Current Education Level:</strong>{" "}
            {responses.academic_info.current_or_university}
          </p>
          <p>
            <strong>College or University:</strong>{" "}
            {responses.academic_info.college_or_university}
          </p>
          <p>
            <strong>Student ID:</strong> {responses.academic_info.student_id}
          </p>
          <p>
            <strong>Program Name / Degree:</strong>{" "}
            {responses.academic_info.program_name_degree}
          </p>
          <p>
            <strong>Duration of Course:</strong>{" "}
            {responses.academic_info.duration_of_course}
          </p>
          <p>
            <strong>Year / Semester:</strong>{" "}
            {responses.academic_info.year_or_semester}
          </p>
          <p>
            <strong>GPA:</strong> {responses.academic_info.gpa}
          </p>
          <p>
            <strong>Achievements & Awards:</strong>{" "}
            {responses.academic_info.achievements_or_awards}
          </p>
        </Card.Body>
      </Card>
      {/* Add sections for financial_info, academic_info, loan_details, and references */}
    </Container>
  );
};

const ApplicationPage = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("details");

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
          <ApplicationDetails applicationId={id} />
        </Tab>
        <Tab eventKey="responses" title="Application Responses">
          <ApplicationResponses applicationId={id} />
        </Tab>
      </Tabs>
    </Container>
  );
};

export default ApplicationPage;
