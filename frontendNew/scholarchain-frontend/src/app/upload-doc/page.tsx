"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, CheckCircle, AlertCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { uploadDocuments } from "@/services/user.service";
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { toast } from 'sonner'; // Import toast and Toaster


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
      id: "undergrad_transcript",
      label: "Undergrad Transcript or Enrollment Letter",
      description:
        "Provide with the latest transcript or enrollment letter (incase of first semester)",
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
  const router = useRouter();
  const [uploadedDocuments, setUploadedDocuments] = useState<Record<string, File>>({});
  const [currentDocumentType, setCurrentDocumentType] = useState<string | null>(null);
  const uploadedCount = Object.keys(uploadedDocuments).length;
  const totalCount = REQUIRED_DOCUMENTS.length;
  const progressPercentage = Math.round((uploadedCount / totalCount) * 100);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!currentDocumentType || acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];

      setUploadedDocuments((prev) => {
        const newDocs = { ...prev, [currentDocumentType]: file };
        // --- Toast for File Added ---
        toast.success(`${file.name} added`); // Show success toast
        return newDocs;
      });

      setCurrentDocumentType(null);
    },
    [currentDocumentType]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
  });

  const removeDocument = (documentId: string) => {
    setUploadedDocuments((prev) => {
      const newDocs = { ...prev };
      const fileName = prev[documentId]?.name; // Get the filename before deleting
      delete newDocs[documentId];

      // --- Toast for File Removed ---
      if (fileName) {
        toast.error(`${fileName} removed`); // Show error toast (or info, as you prefer)
      }

      return newDocs;
    });
  };

  const [loading, setLoading] = useState(false);

  const handleSubmitDocuments = async () => {
    setLoading(true);
    try {
      const data = await uploadDocuments(uploadedDocuments);
      console.log("Upload successful:", data);
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Error uploading documents:", error);
        let errorMessage = "An unexpected error occurred.";
        if (error instanceof Error) {
            errorMessage = error.message
        }
        if(error.message.includes("422")){
            errorMessage = "No files added or invalid file type";
        }
        toast.error(errorMessage)
    } finally {
      setLoading(false);
    }
  };


  return (
    // Wrap the entire content in a div and position the Toaster
    <div>
    <div className="container mx-auto max-w-7xl px-4">
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
                    className={`transition-colors ${
                      isUploaded ? "bg-primary/5 border-primary/20" : ""
                    }`}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-base">{document.label}</CardTitle>
                          <CardDescription className="mt-1 text-xs">
                            {document.description}
                          </CardDescription>
                        </div>
                        {isUploaded ? (
                          <CheckCircle className="h-5 w-5 text-primary" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      {isUploaded ? (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 overflow-hidden">
                            <FileText className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate text-sm">{uploadedFile.name}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
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
                    className={`flex h-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-10 text-center transition-colors ${
                      isDragActive
                        ? "border-primary bg-primary/5"
                        : "border-muted-foreground/25 hover:border-primary/50"
                    }`}
                  >
                    <input {...getInputProps()} />
                    <Upload className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
                    <h3 className="mb-1 text-lg font-medium">
                      Upload {REQUIRED_DOCUMENTS.find((doc) => doc.id === currentDocumentType)?.label}
                    </h3>
                    <p className="mb-2 text-sm text-muted-foreground">
                      Drag & drop your file here, or click to select
                    </p>
                    <p className="text-xs text-muted-foreground">
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
                    <FileText className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
                    <h3 className="mb-1 text-lg font-medium">Select a document to upload</h3>
                    <p className="text-sm text-muted-foreground">
                      Choose from the document list on the left
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          <CardFooter className="justify-center">
            <div className="mt-8 flex justify-center">
              <Button
                onClick={handleSubmitDocuments}
                disabled={loading || uploadedCount < totalCount}
                className="flex cursor-pointer items-center gap-2 px-8"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Submit Documents"
                )}
              </Button>
            </div>
          </CardFooter>
        </div>
      </div>
    </div>
    </div>
  );
}