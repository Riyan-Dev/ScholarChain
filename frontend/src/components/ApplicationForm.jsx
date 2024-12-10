import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Form,
  Container,
  Row,
  Col,
  Alert,
  Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ApplicationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch autofilled data when the component mounts
  useEffect(() => {
    const fetchAutoFilledData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/application/auto-fill-fields/",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          },
        );
        setFormData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.detail || "Failed to fetch form data");
        setLoading(false);
      }
    };

    fetchAutoFilledData();
  }, []);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    const keys = name.split(".");
    setFormData((prevData) => {
      // Create a deep copy of the previous data
      const updatedData = JSON.parse(JSON.stringify(prevData));
      let temp = updatedData;

      // Traverse to the correct nesting
      for (let i = 0; i < keys.length - 1; i++) {
        temp = temp[keys[i]];
      }

      // Update the final key
      const keyOrIndex = keys[keys.length - 1];
      if (Array.isArray(temp)) {
        temp[parseInt(keyOrIndex)] = value; // Update specific index in the array
      } else {
        temp[keyOrIndex] = value;
      }

      return updatedData;
    });
  };

  const handleAddReference = () => {
    setFormData((prevData) => ({
      ...prevData,
      references: [
        ...prevData.references,
        { name: "", designation: "", contact_details: "", comments: "" }, // New empty reference
      ],
    }));
  };

  const handleRemoveReference = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      references: prevData.references.filter((_, i) => i !== index),
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put("http://localhost:8000/application/update/", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          accept: "application/json",
        },
      });
      alert("Application updated successfully!");
      navigate("/application-plan");
    } catch (err) {
      alert(
        `Failed to submit form: ${err.response?.data?.detail || err.message}`,
      );
    }
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p>Loading form data...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">Error: {error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h1 className="mb-4">Application Form</h1>
      <Form onSubmit={handleSubmit}>
        <fieldset>
          <legend>Personal Information</legend>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="fullName">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  name="personal_info.full_name"
                  value={formData.personal_info.full_name || ""}
                  onChange={handleChange}
                  placeholder="Full Name"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="dob">
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control
                  type="date"
                  name="personal_info.dob"
                  value={formData.personal_info.dob || ""}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="gender">
                <Form.Label>Gender</Form.Label>
                <Form.Control
                  type="text"
                  name="personal_info.gender"
                  value={formData.personal_info.gender || ""}
                  onChange={handleChange}
                  placeholder="Gender"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="nationality">
                <Form.Label>Nationality</Form.Label>
                <Form.Control
                  type="text"
                  name="personal_info.nationality"
                  value={formData.personal_info.nationality || ""}
                  onChange={handleChange}
                  placeholder="Nationality"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="maritalStatus">
                <Form.Label>Marital Status</Form.Label>
                <Form.Control
                  type="text"
                  name="personal_info.maritalStatus"
                  value={formData.personal_info.marital_status || ""}
                  onChange={handleChange}
                  placeholder="Marital Status"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="phoneNumber">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="text"
                  name="personal_info.phoneNumber"
                  value={formData.personal_info.phone_number || ""}
                  onChange={handleChange}
                  placeholder="Phone Number"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="emailAddress">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="text"
                  name="personal_info.emailAddress"
                  value={formData.personal_info.email_address || ""}
                  onChange={handleChange}
                  placeholder="Email Address"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="residentialAddress">
                <Form.Label>Residential Address</Form.Label>
                <Form.Control
                  type="text"
                  name="personal_info.residentialNumber"
                  value={formData.personal_info.residential_address || ""}
                  onChange={handleChange}
                  placeholder="Residential Address"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="permanentAddress">
                <Form.Label>parmenent Address</Form.Label>
                <Form.Control
                  type="text"
                  name="personal_info.permanentAddress"
                  value={formData.personal_info.permanent_address || ""}
                  onChange={handleChange}
                  placeholder="permanent Address"
                />
              </Form.Group>
            </Col>
          </Row>
          <legend>Financial Information</legend>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="totalFamilyIncome">
                <Form.Label>Total Family Income</Form.Label>
                <Form.Control
                  type="text"
                  name="financial_info.totalFamilyIncome"
                  value={formData.financial_info.total_family_income || ""}
                  onChange={handleChange}
                  placeholder="Total Family Income"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="otherIncomeSources">
                <Form.Label>Other Income Sources</Form.Label>
                <Form.Control
                  type="text"
                  name="financial_info.otherIncomeResources"
                  value={formData.financial_info.other_income_sources || ""}
                  onChange={handleChange}
                  placeholder="Other Income Sources"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="outstandingLoansOrDebts">
                <Form.Label>Outstanding Loans or Debts</Form.Label>
                <Form.Control
                  type="text"
                  name="financial_info.outstandingLoansOrDebts"
                  value={
                    formData.financial_info.outstanding_loans_or_debts || ""
                  }
                  onChange={handleChange}
                  placeholder="OutStanding Loans or Debts"
                />
              </Form.Group>
            </Col>
          </Row>
          <legend>Academic Information</legend>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="currentEducationLevel">
                <Form.Label>Current Education Level</Form.Label>
                <Form.Control
                  type="text"
                  name="academic_info.currentEducationLevel"
                  value={formData.academic_info.current_education_level || ""}
                  onChange={handleChange}
                  placeholder="Current Education Level"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="collegeOrUniversity">
                <Form.Label>College or University</Form.Label>
                <Form.Control
                  type="text"
                  name="academic_info.collegeOrUniversity"
                  value={formData.academic_info.college_or_university || ""}
                  onChange={handleChange}
                  placeholder="College or University"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="StudentId">
                <Form.Label>Student ID</Form.Label>
                <Form.Control
                  type="text"
                  name="academic_info.StudentId"
                  value={formData.academic_info.student_id || ""}
                  onChange={handleChange}
                  placeholder="Student ID"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="programNameDegree">
                <Form.Label>Program Name/Degree</Form.Label>
                <Form.Control
                  type="text"
                  name="academic_info.programNameDegree"
                  value={formData.academic_info.program_name_degree || ""}
                  onChange={handleChange}
                  placeholder="Program Name/Degree"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="durationOfCourse">
                <Form.Label>Duration Of Course</Form.Label>
                <Form.Control
                  type="text"
                  name="academic_info.durationOfCourse"
                  value={formData.academic_info.duration_of_course || ""}
                  onChange={handleChange}
                  placeholder="Duration Of Course"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="yearOrSemester">
                <Form.Label>Year & Semester</Form.Label>
                <Form.Control
                  type="text"
                  name="academic_info.yearOrSemester"
                  value={formData.academic_info.year_or_semester || ""}
                  onChange={handleChange}
                  placeholder="Year Or Semester"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="gpa">
                <Form.Label>GPA</Form.Label>
                <Form.Control
                  type="text"
                  name="academic_info.gpa"
                  value={formData.academic_info.gpa || ""}
                  onChange={handleChange}
                  placeholder="GPA"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="achievementsOrAwards">
                <Form.Label>Achievements or Awards</Form.Label>
                <Form.Control
                  type="text"
                  name="academic_info.achievementsOrAwards"
                  value={formData.academic_info.achievements_or_awards || ""}
                  onChange={handleChange}
                  placeholder="Achievements or Awards"
                />
              </Form.Group>
            </Col>
          </Row>
          <legend>Loan Details</legend>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="loanAmountRequested">
                <Form.Label>Loan Amount Requested</Form.Label>
                <Form.Control
                  type="text"
                  name="loan_details.loanAmountRequested"
                  value={formData.loan_details.loan_amount_requested || ""}
                  onChange={handleChange}
                  placeholder="Loan Amount Requested"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="purposeOfLoan">
                <Form.Label>Purpose Of Loan</Form.Label>
                <Form.Control
                  type="text"
                  name="loan_details.purposeOfLoan"
                  value={formData.loan_details.purpose_of_loan || ""}
                  onChange={handleChange}
                  placeholder="Purpose Of Loan"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="proposedRepaymentPeriod">
                <Form.Label>Proposed Repayment Period</Form.Label>
                <Form.Control
                  type="text"
                  name="loan_details.proposedRepaymentPeriod"
                  value={formData.loan_details.proposed_repayment_period || ""}
                  onChange={handleChange}
                  placeholder="Proposed Repayment Period"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="preferredRepaymentFrequency">
                <Form.Label>Preferred Repayment Frequency</Form.Label>
                <Form.Control
                  type="text"
                  name="loan_details.preferredRepaymentFrequency"
                  value={
                    formData.loan_details.preferred_repayment_frequency || ""
                  }
                  onChange={handleChange}
                  placeholder="Preferred Repayment Frequency"
                />
              </Form.Group>
            </Col>
          </Row>
          <legend>References</legend>
          {formData.references.map((reference, index) => (
            <div key={index} className="mb-3">
              <Row>
                <Col md={6}>
                  <Form.Group controlId={`referenceName-${index}`}>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      name={`references.${index}.name`}
                      value={reference.name}
                      onChange={handleChange}
                      placeholder="Name"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId={`referenceDesignation-${index}`}>
                    <Form.Label>Designation</Form.Label>
                    <Form.Control
                      type="text"
                      name={`references.${index}.designation`}
                      value={reference.designation}
                      onChange={handleChange}
                      placeholder="Designation"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mt-2">
                <Col md={6}>
                  <Form.Group controlId={`referenceContact-${index}`}>
                    <Form.Label>Contact Details</Form.Label>
                    <Form.Control
                      type="text"
                      name={`references.${index}.contact_details`}
                      value={reference.contact_details}
                      onChange={handleChange}
                      placeholder="Contact Details"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId={`referenceComments-${index}`}>
                    <Form.Label>Comments</Form.Label>
                    <Form.Control
                      as="textarea"
                      name={`references.${index}.comments`}
                      value={reference.comments}
                      onChange={handleChange}
                      placeholder="Comments"
                      rows={3}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Button
                variant="danger"
                size="sm"
                className="mt-2"
                onClick={() => handleRemoveReference(index)}
              >
                Remove Reference
              </Button>
              <hr />
            </div>
          ))}
          <Button variant="primary" size="sm" onClick={handleAddReference}>
            Add Reference
          </Button>
        </fieldset>

        <Button variant="primary" type="submit" className="mt-3">
          Submit
        </Button>
      </Form>
    </Container>
  );
};

export default ApplicationForm;
