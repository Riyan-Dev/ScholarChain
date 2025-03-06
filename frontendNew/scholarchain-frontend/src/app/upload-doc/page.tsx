"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, CheckCircle, AlertCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";

// List of required documents
const REQUIRED_DOCUMENTS = [
  { id: "CNIC", label: "CNIC", description: "National Identity Card" },
  {
    id: "gaurdian_CNIC",
    label: "Guardian CNIC",
    description: "Guardian's National Identity Card",
  },
  {
    id: "intermediate_result",
    label: "Intermediate Result",
    description: "Intermediate education certificate",
  },
  {
    id: "bank_statements",
    label: "Bank Statements",
    description: "Last 3 months bank statements",
  },
  {
    id: "salary_slips",
    label: "Salary Slips",
    description: "Last 3 months salary slips",
  },
  {
    id: "gas_bills",
    label: "Gas Bills",
    description: "Recent gas utility bills",
  },
  {
    id: "electricity_bills",
    label: "Electricity Bills",
    description: "Recent electricity utility bills",
  },
  {
    id: "reference_letter",
    label: "Reference Letter",
    description: "Letter of recommendation",
  },
];

export default function DocumentUploadPage() {
  const [uploadedDocuments, setUploadedDocuments] = useState<Record<string, File>>(
    {}
  );
  const [currentDocumentType, setCurrentDocumentType] = useState<string | null>(
    null
  );

  // Calculate progress
  const uploadedCount = Object.keys(uploadedDocuments).length;
  const totalCount = REQUIRED_DOCUMENTS.length;
  const progressPercentage = Math.round((uploadedCount / totalCount) * 100);

  // Handle file drop
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!currentDocumentType || acceptedFiles.length === 0) return;

      // Take only the first file if multiple are dropped
      const file = acceptedFiles[0];

      setUploadedDocuments((prev) => ({
        ...prev,
        [currentDocumentType]: file,
      }));

      // Reset current document type after upload
      setCurrentDocumentType(null);
    },
    [currentDocumentType]
  );

  // Configure dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
    maxFiles: 1,
  });

  // Remove a document
  const removeDocument = (documentId: string) => {
    setUploadedDocuments((prev) => {
      const newDocs = { ...prev };
      delete newDocs[documentId];
      return newDocs;
    });
  };

  return (
    <div className="container mx-auto h- max-w-7xl px-4">
      <div className="flex h-[calc(50vh-5rem)] gap-6">
        {/* Left side - Scrollable document cards */}
        <div className="w-2/3">
          <Card className="mb-5">
            <CardHeader>
              <CardTitle className="text-2xl">Document Upload</CardTitle>
              <CardDescription>
                Please upload all required documents to complete your application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium">Upload Progress</span>
                  <span className="text-sm font-medium">
                    {uploadedCount}/{totalCount} Documents
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <ScrollArea className="h-[calc(88vh-15rem)] rounded-lg border">
            <div className="space-y-4 p-4">
              {REQUIRED_DOCUMENTS.map((document) => {
                const isUploaded = document.id in uploadedDocuments;
                const uploadedFile = uploadedDocuments[document.id];

                return (
                  <Card
                    key={document.id}
                    className={`transition-colors ${isUploaded ? "bg-primary/5 border-primary/20" : ""
                      }`}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-base">
                            {document.label}
                          </CardTitle>
                          <CardDescription className="mt-1 text-xs">
                            {document.description}
                          </CardDescription>
                        </div>
                        {isUploaded ? (
                          <CheckCircle className="text-primary h-5 w-5" />
                        ) : (
                          <AlertCircle className="text-muted-foreground h-5 w-5" />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      {isUploaded ? (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 overflow-hidden">
                            <FileText className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate text-sm">
                              {uploadedFile.name}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive h-8 w-8"
                            onClick={() => removeDocument(document.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => setCurrentDocumentType(document.id)}
                        >
                          Upload Document
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Right side - Sticky dropzone */}
        <div className="w-1/3">
          <div className="sticky top-10">
            <Card className="h-[calc(90vh-8rem)]">
              <CardContent className="h-full p-6">
                {currentDocumentType ? (
                  <div
                    {...getRootProps()}
                    className={`flex h-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-10 text-center transition-colors ${isDragActive
                      ? "border-primary bg-primary/5"
                      : "border-muted-foreground/25 hover:border-primary/50"
                      }`}
                  >
                    <input {...getInputProps()} />
                    <Upload className="text-muted-foreground mx-auto mb-4 h-10 w-10" />
                    <h3 className="mb-1 text-lg font-medium">
                      Upload{" "}
                      {
                        REQUIRED_DOCUMENTS.find(
                          (doc) => doc.id === currentDocumentType
                        )?.label
                      }
                    </h3>
                    <p className="text-muted-foreground mb-2 text-sm">
                      Drag & drop your file here, or click to select
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Supported formats: PDF, JPG, PNG (Max size: 10MB)
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentDocumentType(null);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center rounded-lg bg-muted/50 p-6 text-center">
                    <FileText className="text-muted-foreground mx-auto mb-4 h-10 w-10" />
                    <h3 className="mb-1 text-lg font-medium">
                      Select a document to upload
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Choose from the document list on the left
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
            <CardFooter className="justify-center">
              <div className="mt-8 flex justify-center">
                <Button disabled={uploadedCount < totalCount} className="px-8">
                  Submit Documents
                </Button>
              </div>
            </CardFooter>
        </div>
      </div>
    </div>
  );
}
