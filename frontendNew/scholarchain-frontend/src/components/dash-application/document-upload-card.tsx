"use client";

import { useEffect, useState } from "react";
import { Upload, File, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ApplicationCard } from "./ui/application-card";
import { CardFooterActions } from "./ui/card-footer-actions";
import { ProcessingIndicator } from "./ui/processing-indicator";
import useIsDisabled from "@/cutom-hooks/isContinueDisabled";
import { fetchDocumentStatus } from "@/services/user.service";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "../ui/skeleton";

interface DocumentUploadCardProps {
  isUploaded: boolean;
  onNext: () => void;
}

export function DocumentUploadCard({
  isUploaded,
  onNext,
}: DocumentUploadCardProps) {
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(isUploaded);

  const [pollingEnabled, setPollingEnabled] = useState(true);

  const { data, error, isLoading } = useQuery({
    queryKey: ["documentStatus"], // Corrected: Query key is an array
    queryFn: fetchDocumentStatus, // Make sure this function is defined
    refetchInterval: pollingEnabled ? 5000 : false,
    refetchOnWindowFocus: false,
    enabled: isUploaded && pollingEnabled,
    retry: true,
  });

  useEffect(() => {
    if (data && data.status === true) {
      setPollingEnabled(false);
      setIsProcessing(false); // Set card to inactive
      setProgress(data.progress);
    } else if (data && data.status === false) {
      console.log(data);
      setProgress(data.progress);
    }
  }, [data]);

  const getDescription = () => {
    if (isProcessing) return "AI is analyzing your documents...";
    if (progress === 100) return "Document analysis complete";
    return "Upload required documents for verification";
  };

  if (isLoading && !isUploaded) {
    return (
      <div className="space-y-4 p-4">
        <div className="w-full">
          <Skeleton className="h-48 w-full" />{" "}
        </div>
      </div>
    );
  }

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

      {!isUploaded && !isProcessing && (
        <Link href="/upload-doc">
          <div className="rounded-lg border-2 border-dashed p-6 text-center">
            <div className="flex flex-col items-center gap-2">
              <File className="text-muted-foreground h-8 w-8" />
              <h3 className="font-medium">Upload Documents</h3>
            </div>
          </div>
        </Link>
      )}
    </ApplicationCard>
  );
}
