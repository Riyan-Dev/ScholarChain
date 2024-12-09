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
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UploadDocuments = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState({
    cnic: [],
    guardianCnic: [],
    electricityBills: [],
    gasBills: [],
    intermediateResults: [],
    undergradTranscript: [],
    salarySlips: [],
    bankStatements: [],
    incomeTaxCertificate: [],
    referenceLetter: [],
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [currentDocType, setCurrentDocType] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("");

  const dropzoneConfigs = {
    cnic: { label: "CNIC", multiple: false, required: true },
    guardianCnic: { label: "Guardian's CNIC", multiple: false, required: true },
    electricityBills: {
      label: "Electricity Bills (Last 3 months)",
      multiple: true,
      required: true,
    },
    gasBills: {
      label: "Gas Bills (Last 3 months)",
      multiple: true,
      required: true,
    },
    intermediateResults: {
      label: "Intermediate Results",
      multiple: false,
      required: true,
    },
    undergradTranscript: {
      label: "Undergrad Transcript",
      multiple: false,
      required: false,
    },
    salarySlips: {
      label: "Salary Slips (Last 3 months)",
      multiple: true,
      required: true,
    },
    bankStatements: {
      label: "Bank Statements (Last 6 months)",
      multiple: true,
      required: true,
    },
    incomeTaxCertificate: {
      label: "Income Tax Certificate",
      multiple: false,
      required: false,
    },
    referenceLetter: {
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
    if (!Array.isArray(acceptedFiles)) {
      acceptedFiles = Array.from(acceptedFiles); // Convert to array if it's not
    }
    setDocuments((prevDocuments) => ({
      ...prevDocuments,
      [documentType]: acceptedFiles.map((file) => ({
        file,
        id: uuidv4(),
      })),
    }));
    handleCloseModal();
  };

  const handleUpload = async () => {
    navigate("/applicant-dashboard");
    const filesSelected = Object.values(documents).flat();

    const missingDocuments = compulsoryDocs.filter(
      (docType) => !documents[docType] || documents[docType].length === 0,
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

    const formData = new FormData();
    filesSelected.forEach(({ file, id }) => {
      formData.append("files", file);
      formData.append("ids", id);
    });

    try {
      const response = await axios.post(
        "http://localhost:8000/user/upload-documents",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.status === 200) {
        setAlertMessage("Documents uploaded successfully!");
        setAlertVariant("success");
        setDocuments({
          cnic: [],
          guardianCnic: [],
          electricityBills: [],
          gasBills: [],
          intermediateResults: [],
          undergradTranscript: [],
          salarySlips: [],
          bankStatements: [],
          incomeTaxCertificate: [],
          referenceLetter: [],
        });
        // navigate("/application-form");
      } else {
        setAlertMessage("Unexpected response from the server.");
        setAlertVariant("warning");
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
              <Badge bg={documents[docType].length > 0 ? "success" : "danger"}>
                {documents[docType].length > 0 ? "Uploaded" : "Missing"}
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
                <Button
                  variant={
                    documents[docType].length > 0 ? "success" : "secondary"
                  }
                  onClick={() => handleOpenModal(docType)}
                  className="w-100"
                >
                  {dropzoneConfigs[docType].label}
                </Button>
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
            />
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
