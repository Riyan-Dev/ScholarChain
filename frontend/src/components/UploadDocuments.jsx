import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { Button, Alert, Spinner } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid"; // Import UUID for generating unique file IDs

const UploadDocuments = () => {
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

  // Helper function to update document list in state
  const onDrop = (documentType) => (acceptedFiles) => {
    setDocuments((prevDocuments) => ({
      ...prevDocuments,
      [documentType]: acceptedFiles.map((file) => ({
        ...file,
        id: uuidv4(), // Generate a unique ID for each file
      })),
    }));
  };

  // React Dropzone hooks for each document type
  const { getRootProps: getCNICRootProps, getInputProps: getCNICInputProps } =
    useDropzone({
      onDrop: onDrop("cnic"),
      accept: ".jpg,.jpeg,.png,.pdf",
      multiple: false,
    });

  const {
    getRootProps: getGuardianCNICRootProps,
    getInputProps: getGuardianCNICInputProps,
  } = useDropzone({
    onDrop: onDrop("guardianCnic"),
    accept: ".jpg,.jpeg,.png,.pdf",
    multiple: false,
  });

  const {
    getRootProps: getElectricityBillsRootProps,
    getInputProps: getElectricityBillsInputProps,
  } = useDropzone({
    onDrop: onDrop("electricityBills"),
    accept: ".jpg,.jpeg,.png,.pdf",
    multiple: true,
  });

  const {
    getRootProps: getGasBillsRootProps,
    getInputProps: getGasBillsInputProps,
  } = useDropzone({
    onDrop: onDrop("gasBills"),
    accept: ".jpg,.jpeg,.png,.pdf",
    multiple: true,
  });

  const {
    getRootProps: getIntermediateResultsRootProps,
    getInputProps: getIntermediateResultsInputProps,
  } = useDropzone({
    onDrop: onDrop("intermediateResults"),
    accept: ".jpg,.jpeg,.png,.pdf",
    multiple: false,
  });

  const {
    getRootProps: getUndergradTranscriptRootProps,
    getInputProps: getUndergradTranscriptInputProps,
  } = useDropzone({
    onDrop: onDrop("undergradTranscript"),
    accept: ".jpg,.jpeg,.png,.pdf",
    multiple: false,
  });

  const {
    getRootProps: getSalarySlipsRootProps,
    getInputProps: getSalarySlipsInputProps,
  } = useDropzone({
    onDrop: onDrop("salarySlips"),
    accept: ".jpg,.jpeg,.png,.pdf",
    multiple: true,
  });

  const {
    getRootProps: getBankStatementsRootProps,
    getInputProps: getBankStatementsInputProps,
  } = useDropzone({
    onDrop: onDrop("bankStatements"),
    accept: ".jpg,.jpeg,.png,.pdf",
    multiple: true,
  });

  const {
    getRootProps: getIncomeTaxCertificateRootProps,
    getInputProps: getIncomeTaxCertificateInputProps,
  } = useDropzone({
    onDrop: onDrop("incomeTaxCertificate"),
    accept: ".jpg,.jpeg,.png,.pdf",
    multiple: false,
  });

  const {
    getRootProps: getReferenceLetterRootProps,
    getInputProps: getReferenceLetterInputProps,
  } = useDropzone({
    onDrop: onDrop("referenceLetter"),
    accept: ".jpg,.jpeg,.png,.pdf",
    multiple: false,
  });

  // Handle document upload
  // need to add functionality to make some documents compulsory
  const handleUpload = async () => {
    const filesSelected = Object.values(documents).flat(); // Flatten the file arrays
    setIsLoading(true);
    const formData = new FormData();

    // Check if files are being appended correctly
    filesSelected.forEach((file) => {
      console.log("Appending file:", file); // Debug log to confirm it's a File object
      formData.append("files", file); // Append the file correctly
    });

    // Generate ids from files
    const ids = filesSelected.map((file) => file.id);

    // If only one file, send ids as a simple value
    const idsParam = ids.length === 1 ? ids[0] : ids;

    console.log("Sending ids:", idsParam); // Debug log for ids

    try {
      const response = await axios.post(
        "http://localhost:8000/user/upload-documents",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`, // Include the token
          },
          params: { ids: idsParam }, // Pass ids as a query param
        },
      );

      if (response.status === 200) {
        setAlertMessage("Documents uploaded successfully!");
        setAlertVariant("success");
        // Reset documents state
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
      }
    } catch (error) {
      console.error("Error Response:", error.response); // Log the error response for debugging
      setAlertMessage("Failed to upload documents. Please try again.");
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
        {[
          { name: "cnic", label: "CNIC (Compulsory)" },
          {
            name: "guardianCnic",
            label: "Parent/Guardian's CNIC (Compulsory)",
          },
          {
            name: "electricityBills",
            label: "Electricity Bills (Last 3 months) (Compulsory)",
            multiple: true,
          },
          {
            name: "gasBills",
            label: "Gas Bills (Last 3 months) (Compulsory)",
            multiple: true,
          },
          {
            name: "intermediateResults",
            label:
              "Intermediate Results/A Levels Grades/A Levels IBCC Equivalence (Compulsory)",
          },
          {
            name: "undergradTranscript",
            label: "Current Undergrad Transcript (Optional)",
          },
          {
            name: "salarySlips",
            label: "Salary Slips (Last 3 months) (Compulsory)",
            multiple: true,
          },
          {
            name: "bankStatements",
            label: "Bank Statements (Last 6 months) (Compulsory)",
            multiple: true,
          },
          {
            name: "incomeTaxCertificate",
            label: "Income Tax Certificate (Optional)",
          },
          {
            name: "referenceLetter",
            label: "Reference Letter (Academic or Personal) (Compulsory)",
          },
        ].map((document, index) => (
          <div className="col-md-6 mb-4" key={index}>
            <h5>{document.label}</h5>
            <div
              {...(document.name === "cnic"
                ? getCNICRootProps()
                : document.name === "guardianCnic"
                  ? getGuardianCNICRootProps()
                  : document.name === "electricityBills"
                    ? getElectricityBillsRootProps()
                    : document.name === "gasBills"
                      ? getGasBillsRootProps()
                      : document.name === "intermediateResults"
                        ? getIntermediateResultsRootProps()
                        : document.name === "undergradTranscript"
                          ? getUndergradTranscriptRootProps()
                          : document.name === "salarySlips"
                            ? getSalarySlipsRootProps()
                            : document.name === "bankStatements"
                              ? getBankStatementsRootProps()
                              : document.name === "incomeTaxCertificate"
                                ? getIncomeTaxCertificateRootProps()
                                : getReferenceLetterRootProps())}
              className="dropzone p-3 border text-center border-dashed rounded shadow-sm"
            >
              <input
                {...(document.name === "cnic"
                  ? getCNICInputProps()
                  : document.name === "guardianCnic"
                    ? getGuardianCNICInputProps()
                    : document.name === "electricityBills"
                      ? getElectricityBillsInputProps()
                      : document.name === "gasBills"
                        ? getGasBillsInputProps()
                        : document.name === "intermediateResults"
                          ? getIntermediateResultsInputProps()
                          : document.name === "undergradTranscript"
                            ? getUndergradTranscriptInputProps()
                            : document.name === "salarySlips"
                              ? getSalarySlipsInputProps()
                              : document.name === "bankStatements"
                                ? getBankStatementsInputProps()
                                : document.name === "incomeTaxCertificate"
                                  ? getIncomeTaxCertificateInputProps()
                                  : getReferenceLetterInputProps())}
              />
              <p>Click or Drag to upload your {document.label} (Required)</p>
            </div>
            <ul>
              {documents[document.name]?.map((file, idx) => (
                <li key={idx}>
                  {file.name} (ID: {file.id})
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Upload Button */}
      <div className="mt-3">
        <Button variant="primary" onClick={handleUpload} disabled={isLoading}>
          {isLoading ? (
            <Spinner animation="border" size="sm" />
          ) : (
            "Upload Documents"
          )}
        </Button>
      </div>
    </div>
  );
};

export default UploadDocuments;
