"use client";

import { useState } from "react";
import { Upload, File, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApplicationCard } from "./ui/application-card";
import { CardFooterActions } from "./ui/card-footer-actions";
import { ProcessingIndicator } from "./ui/processing-indicator";

interface DocumentUploadCardProps {
  isProcessing: boolean;
  progress: number;
  onNext: () => void;
  onPrevious: () => void;
}

export function DocumentUploadCard({
  isProcessing,
  progress,
  onNext,
  onPrevious,
}: DocumentUploadCardProps) {
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([
    "ID Document.pdf",
    "Proof of Income.pdf",
  ]);

  const removeFile = (fileName: string) => {
    setUploadedFiles(uploadedFiles.filter((file) => file !== fileName));
  };

  const getDescription = () => {
    if (isProcessing) return "AI is analyzing your documents...";
    if (progress === 100) return "Document analysis complete";
    return "Upload required documents for verification";
  };

  return (
    <ApplicationCard
      title="Upload Documents"
      description={getDescription()}
      icon={Upload}
      isProcessing={isProcessing}
      progress={progress}
      footer={
        <CardFooterActions
          onNext={onNext}
          onPrevious={onPrevious}
          isProcessing={isProcessing}
          isNextDisabled={progress < 100}
        />
      }
    >
      <ProcessingIndicator
        isProcessing={isProcessing}
        progress={progress}
        processingTitle="AI Verification Status"
        processingItems={[
          "Verifying document authenticity...",
          "Extracting personal information...",
          "Validating income details...",
        ]}
        completeTitle="Verification Complete"
        completeItems={[
          "Documents verified successfully",
          "Identity confirmed",
          "Income verification passed",
        ]}
      />

      {!isProcessing && progress !== 100 && (
        <>
          <div className="rounded-lg border-2 border-dashed p-6 text-center">
            <div className="flex flex-col items-center gap-2">
              <File className="text-muted-foreground h-8 w-8" />
              <h3 className="font-medium">Upload Documents</h3>
              <p className="text-muted-foreground text-sm">
                Drag and drop your files here or click to browse
              </p>
              <Button variant="outline" size="sm" className="mt-2">
                Browse Files
              </Button>
            </div>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="mt-6 space-y-3">
              <h4 className="text-sm font-medium">Uploaded Files</h4>
              <div className="space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="bg-muted/30 flex items-center justify-between rounded-md p-2"
                  >
                    <div className="flex items-center gap-2">
                      <File className="text-primary h-4 w-4" />
                      <span className="text-sm">{file}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => removeFile(file)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </ApplicationCard>
  );
}
