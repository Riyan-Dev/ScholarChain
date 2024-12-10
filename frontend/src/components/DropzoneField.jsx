// src/components/DropzoneField.jsx

import React from "react";
import { useDropzone } from "react-dropzone";
import PropTypes from "prop-types";

const DropzoneField = ({ documentType, label, multiple, onFilesDropped }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => onFilesDropped(documentType, acceptedFiles),
    accept: ".jpg,.jpeg,.png,.pdf",
    multiple: multiple,
  });

  return (
    <div className="col-md-15 mb-10">
      <h5>{label}</h5>
      <div
        {...getRootProps()}
        className={`dropzone p-3 border text-center border-dashed rounded shadow-sm ${
          isDragActive ? "bg-light" : ""
        }`}
        style={{ cursor: "pointer" }}
      >
        <input {...getInputProps()} />
        <p>
          {isDragActive
            ? "Drop the files here ..."
            : `Click or drag to upload your ${label}`}
          {label.includes("(Compulsory)") && " (Required)"}
        </p>
      </div>
    </div>
  );
};

DropzoneField.propTypes = {
  documentType: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  multiple: PropTypes.bool.isRequired,
  onFilesDropped: PropTypes.func.isRequired,
};

export default DropzoneField;
