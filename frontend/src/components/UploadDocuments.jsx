import React, { useState } from "react";
import DropzoneField from "./DropzoneField";
import {
  Button,
  Spinner,
  Alert,
  Modal,
  OverlayTrigger,
  Tooltip,
  Badge,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UploadDocuments = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState({
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
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [currentDocType, setCurrentDocType] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("");

  const dropzoneConfigs = {
    CNIC: { label: "CNIC", multiple: false, required: true },
    gaurdian_CNIC: {
      label: "Guardian's CNIC",
      multiple: false,
      required: true,
    },
    electricity_bills: {
      label: "Electricity Bills (Last 3 months)",
      multiple: true,
      required: true,
    },
    gas_bills: {
      label: "Gas Bills (Last 3 months)",
      multiple: true,
      required: true,
    },
    intermediate_result: {
      label: "Intermediate Results",
      multiple: false,
      required: true,
    },
    undergrad_transacript: {
      label: "Undergrad Transcript",
      multiple: false,
      required: false,
    },
    salary_slips: {
      label: "Salary Slips (Last 3 months)",
      multiple: true,
      required: true,
    },
    bank_statements: {
      label: "Bank Statements (Last 6 months)",
      multiple: true,
      required: true,
    },
    income_tax_certificate: {
      label: "Income Tax Certificate",
      multiple: false,
      required: false,
    },
    reference_letter: {
      label: "Reference Letter",
      multiple: false,
      required: true,
    },
  };

  const compulsoryDocs = Object.keys(dropzoneConfigs).filter(
    (key) => dropzoneConfigs[key].required,
  );

  const handleOpenModal = (docType) => {
    setCurrentDocType(docType);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentDocType(null);
  };

  const handleFilesDropped = (documentType, acceptedFiles) => {
    setDocuments((prevDocuments) => ({
      ...prevDocuments,
      [documentType]: acceptedFiles[0], // Store only the first file
    }));
    handleCloseModal();
  };

  const handleUpload = async () => {
    const filesSelected = [];
    Object.keys(documents).forEach((docType) => {
      if (documents[docType]) {
        filesSelected.push({ file: documents[docType], docType });
      }
    });

    const missingDocuments = compulsoryDocs.filter(
      (docType) => !documents[docType],
    );

    if (missingDocuments.length > 0) {
      setAlertMessage(
        `Missing required documents: ${missingDocuments
          .map((docType) => dropzoneConfigs[docType].label)
          .join(", ")}.`,
      );
      setAlertVariant("danger");
      return;
    }

    if (filesSelected.length === 0) {
      setAlertMessage("No files selected for upload.");
      setAlertVariant("warning");
      return;
    }

    setIsLoading(true);
    setAlertMessage("");
    setAlertVariant("");

    const formData = new FormData();
    filesSelected.forEach(({ file, docType }) => {
      formData.append("files", file);
      formData.append("ids", docType);
    });

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/user/upload-documents",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        },
      );

      if (response.status === 200) {
        navigate("/applicant-dashboard");
        //     const message =
        //       response.data.Message || "Documents uploaded successfully!";
        //     setAlertMessage(message);
        //     setAlertVariant("success");
        //     setDocuments({
        //       cnic: null,
        //       guardian_cnic: null,
        //       electricity_bills: null,
        //       gas_bills: null,
        //       intermediate_result: null,
        //       undergrad_transcript: null,
        //       salary_slips: null,
        //       bank_statements: null,
        //       income_tax_certificate: null,
        //       reference_letter: null,
        //     });
        //     // navigate("/application-form");
        //   } else {
        //     setAlertMessage("Unexpected response from the server.");
        //     setAlertVariant("warning");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail || "Failed to upload documents.";
      setAlertMessage(errorMessage);
      setAlertVariant("danger");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Upload Documents</h2>
      {alertMessage && <Alert variant={alertVariant}>{alertMessage}</Alert>}

      {/* Document Status Summary */}
      <div className="mb-4">
        <h4>Document Summary</h4>
        <ul className="list-group">
          {Object.keys(dropzoneConfigs).map((docType) => (
            <li
              className="list-group-item d-flex justify-content-between align-items-center"
              key={docType}
            >
              {dropzoneConfigs[docType].label}
              <Badge
                bg={
                  documents[docType].length > 0
                    ? "success"
                    : dropzoneConfigs[docType].required
                      ? "danger"
                      : "secondary"
                }
              >
                {documents[docType].length > 0
                  ? "Uploaded"
                  : dropzoneConfigs[docType].required
                    ? "Missing"
                    : "Not Uploaded"}
              </Badge>
            </li>
          ))}
        </ul>
      </div>

      {/* Compulsory Documents */}
      <div className="mb-4">
        <h4>Compulsory Documents</h4>
        <div className="row">
          {compulsoryDocs.map((docType, index) => (
            <div className="col-md-6 mb-3" key={index}>
              <OverlayTrigger
                placement="right"
                overlay={
                  <Tooltip>
                    Click to upload {dropzoneConfigs[docType].label}
                  </Tooltip>
                }
              >
                <Button
                  variant={documents[docType].length > 0 ? "success" : "danger"}
                  onClick={() => handleOpenModal(docType)}
                  className="w-100"
                >
                  {dropzoneConfigs[docType].label}{" "}
                  {dropzoneConfigs[docType].required && (
                    <span className="text-danger">*</span>
                  )}
                </Button>
              </OverlayTrigger>
            </div>
          ))}
        </div>
      </div>

      {/* Optional Documents */}
      <div className="mb-4">
        <h4>Optional Documents</h4>
        <div className="row">
          {Object.keys(dropzoneConfigs)
            .filter((docType) => !dropzoneConfigs[docType].required)
            .map((docType, index) => (
              <div className="col-md-6 mb-3" key={index}>
                <OverlayTrigger
                  placement="right"
                  overlay={
                    <Tooltip>
                      Click to upload {dropzoneConfigs[docType].label}
                    </Tooltip>
                  }
                >
                  <Button
                    variant={
                      documents[docType].length > 0 ? "success" : "secondary"
                    }
                    onClick={() => handleOpenModal(docType)}
                    className="w-100"
                  >
                    {dropzoneConfigs[docType].label}
                  </Button>
                </OverlayTrigger>
              </div>
            ))}
        </div>
      </div>

      {/* Upload Button */}
      <div className="text-center">
        <Button variant="primary" onClick={handleUpload} disabled={isLoading}>
          {isLoading ? (
            <>
              <Spinner animation="border" size="sm" /> Uploading...
            </>
          ) : (
            "Upload Documents"
          )}
        </Button>
      </div>

      {/* Modal for Dropzones */}
      {currentDocType && (
        <Modal show={modalOpen} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>
              Upload {dropzoneConfigs[currentDocType].label}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <DropzoneField
              documentType={currentDocType}
              label={dropzoneConfigs[currentDocType].label}
              multiple={dropzoneConfigs[currentDocType].multiple}
              onFilesDropped={(files) =>
                handleFilesDropped(currentDocType, files)
              }
              existingFiles={documents[currentDocType]}
            />
            {dropzoneConfigs[currentDocType].multiple &&
              documents[currentDocType].length > 0 && (
                <div className="mt-3">
                  <h5>Selected Files:</h5>
                  <ul>
                    {documents[currentDocType].map((file, idx) => (
                      <li key={idx}>{file.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            {!dropzoneConfigs[currentDocType].multiple &&
              documents[currentDocType].length > 0 && (
                <div className="mt-3">
                  <h5>Selected File:</h5>
                  <p>{documents[currentDocType][0].name}</p>
                </div>
              )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default UploadDocuments;
