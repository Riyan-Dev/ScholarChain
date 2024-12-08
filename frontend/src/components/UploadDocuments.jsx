// src/components/UploadDocuments.jsx

import React, { useState } from "react";
import DropzoneField from "./DropzoneField"; // Ensure correct path
import axios from "axios";
import { Button, Alert, Spinner } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid"; // Import UUID for generating unique file IDs
import { useNavigate } from "react-router-dom";

const UploadDocuments = () => {
  const navigate = useNavigate();
  // Initialize state with all document types
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

  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("");

  // Configuration for each document type
  const dropzoneConfigs = {
    cnic: { label: "CNIC (Compulsory)", multiple: false },
    guardianCnic: {
      label: "Parent/Guardian's CNIC (Compulsory)",
      multiple: false,
    },
    electricityBills: {
      label: "Electricity Bills (Last 3 months) (Compulsory)",
      multiple: true,
    },
    gasBills: {
      label: "Gas Bills (Last 3 months) (Compulsory)",
      multiple: true,
    },
    intermediateResults: {
      label:
        "Intermediate Results/A Levels Grades/A Levels IBCC Equivalence (Compulsory)",
      multiple: false,
    },
    undergradTranscript: {
      label: "Current Undergrad Transcript (Optional)",
      multiple: false,
    },
    salarySlips: {
      label: "Salary Slips (Last 3 months) (Compulsory)",
      multiple: true,
    },
    bankStatements: {
      label: "Bank Statements (Last 6 months) (Compulsory)",
      multiple: true,
    },
    incomeTaxCertificate: {
      label: "Income Tax Certificate (Optional)",
      multiple: false,
    },
    referenceLetter: {
      label: "Reference Letter (Academic or Personal) (Compulsory)",
      multiple: false,
    },
  };

  // Handler for when files are dropped
  const handleFilesDropped = (documentType, acceptedFiles) => {
    console.log(`Files dropped for ${documentType}:`, acceptedFiles);
    setDocuments((prevDocuments) => ({
      ...prevDocuments,
      [documentType]: acceptedFiles.map((file) => ({
        file, // Store the actual File object
        id: uuidv4(), // Generate a unique ID for each file
      })),
    }));
  };

  // Handle document upload
  const handleUpload = async () => {
    const filesSelected = Object.values(documents).flat();

    // Uncomment the following if you want to enforce compulsory documents
    /*
    const compulsoryDocuments = [
      "cnic",
      "guardianCnic",
      "electricityBills",
      "gasBills",
      "intermediateResults",
      "salarySlips",
      "bankStatements",
      "referenceLetter",
    ];

    const missingDocuments = compulsoryDocuments.filter(
      (doc) => !documents[doc] || documents[doc].length === 0
    );

    if (missingDocuments.length > 0) {
      setAlertMessage(
        `Please upload the following compulsory documents: ${missingDocuments.join(
          ", "
        )}`
      );
      setAlertVariant("danger");
      return;
    }
    */

    if (filesSelected.length === 0) {
      setAlertMessage("No files selected for upload.");
      setAlertVariant("warning");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();

    // Append files to formData
    filesSelected.forEach((fileObj, index) => {
      if (fileObj.file instanceof File) {
        console.log(`Appending file ${index + 1}:`, fileObj.file);
        formData.append("files", fileObj.file);
      } else {
        console.warn(`fileObj.file is not a File instance:`, fileObj);
      }
    });

    // Append ids to formData
    filesSelected.forEach((fileObj, index) => {
      if (fileObj.id) {
        console.log(`Appending id ${index + 1}:`, fileObj.id);
        formData.append("ids", fileObj.id);
      } else {
        console.warn(`fileObj.id is missing:`, fileObj);
      }
    });

    console.log("FormData entries:");
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    try {
      // Send the POST request with files and ids in formData
      const response = await axios.post(
        "http://localhost:8000/user/upload-documents", // Ensure this URL is correct
        formData, // FormData containing the files and ids
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`, // Bearer token
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.status === 200) {
        setAlertMessage("Documents uploaded successfully!");
        setAlertVariant("success");
        // Reset document state
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

        navigate("/application-form");
      } else {
        setAlertMessage("Unexpected response from the server.");
        setAlertVariant("warning");
      }
    } catch (error) {
      console.error("Error Response:", error.response); // Log the error for debugging
      if (error.response && error.response.data && error.response.data.detail) {
        setAlertMessage(
          `Failed to upload documents: ${error.response.data.detail}`,
        );
      } else {
        setAlertMessage("Failed to upload documents. Please try again.");
      }
      setAlertVariant("danger");
    }

    setIsLoading(false);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Upload Documents</h2>

      {alertMessage && <Alert variant={alertVariant}>{alertMessage}</Alert>}

      <div className="row">
        {/* Document Upload Section */}
        {Object.keys(dropzoneConfigs).map((docType, index) => (
          <DropzoneField
            key={index}
            documentType={docType}
            label={dropzoneConfigs[docType].label}
            multiple={dropzoneConfigs[docType].multiple}
            onFilesDropped={handleFilesDropped}
          />
        ))}
      </div>

      {/* List of uploaded files */}
      <div className="row">
        {Object.keys(documents).map(
          (docType, index) =>
            documents[docType].length > 0 && (
              <div className="col-md-6 mb-4" key={index}>
                <h6>{dropzoneConfigs[docType].label} Uploaded:</h6>
                <ul>
                  {documents[docType].map((fileObj, idx) => (
                    <li key={idx}>
                      {fileObj.file ? fileObj.file.name : "Unnamed File"} (ID:{" "}
                      {fileObj.id})
                    </li>
                  ))}
                </ul>
              </div>
            ),
        )}
      </div>

      {/* Upload Button */}
      <div className="mt-3">
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
    </div>
  );
};

export default UploadDocuments;
