import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { Button, Alert, Spinner } from "react-bootstrap";

const UploadDocuments = () => {
  const [files, setFiles] = useState([]); // To store files selected or dragged
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("");

  // Handle file selection through the browse button or drag-and-drop
  const onDrop = (acceptedFiles) => {
    setFiles(acceptedFiles);
  };

  // React Dropzone hooks
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: ".pdf,.jpg,.jpeg,.png", // Only allow PDF and image files
    multiple: true, // Allow multiple files
  });

  // Handle document upload
  const handleUpload = async () => {
    if (files.length === 0) {
      setAlertMessage("Please select at least one file to upload.");
      setAlertVariant("danger");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();

    // Append each selected file to FormData
    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await axios.post(
        "http://localhost:8000/user/upload-documents",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`, // Include the token
          },
        },
      );

      if (response.status === 200) {
        setAlertMessage("Documents uploaded successfully!");
        setAlertVariant("success");
        setFiles([]); // Clear selected files after successful upload
      }
    } catch (error) {
      setAlertMessage("Failed to upload documents. Please try again.");
      setAlertVariant("danger");
    }

    setIsLoading(false);
  };

  return (
    <div className="container mt-5">
      <h2>Upload Documents</h2>

      {alertMessage && <Alert variant={alertVariant}>{alertMessage}</Alert>}

      {/* Drag and Drop or Browse Area */}
      <div
        {...getRootProps()}
        className="dropzone p-5 border text-center border-dashed rounded"
      >
        <input {...getInputProps()} />
        <h4>Drag & Drop files here, or click to select files</h4>
        <p>Allowed file types: PDF, JPG, JPEG, PNG</p>
      </div>

      {/* List of files selected for upload */}
      <div className="mt-3">
        {files.length > 0 && (
          <div>
            <h5>Selected Files:</h5>
            <ul>
              {files.map((file, index) => (
                <li key={index}>
                  {file.name} ({(file.size / 1024).toFixed(2)} KB)
                </li>
              ))}
            </ul>
          </div>
        )}
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
