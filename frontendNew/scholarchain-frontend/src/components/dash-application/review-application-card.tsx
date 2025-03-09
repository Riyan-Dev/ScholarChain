"use client";

import { ClipboardCheck, User, Mail, Phone, Calendar } from "lucide-react";
import { ApplicationCard } from "./ui/application-card";
import { CardFooterActions } from "./ui/card-footer-actions";
import { ProcessingIndicator } from "./ui/processing-indicator";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { applicationOverview } from "@/services/user.service";
import { Skeleton } from "../ui/skeleton";
import { useRouter } from "next/navigation";

interface ReviewApplicationCardProps {
  isProcessing: boolean;
  progress: number;
  onNext: () => void;
  onPrevious: () => void;
}

export function ReviewApplicationCard({ onNext }: ReviewApplicationCardProps) {
  const router = useRouter();

  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const [pollingEnabled, setPollingEnabled] = useState(true);

  const { data, error, isLoading } = useQuery({
    queryKey: ["application_overview"], // Corrected: Query key is an array
    queryFn: applicationOverview, // Make sure this function is defined
    refetchInterval: pollingEnabled ? 5000 : false,
    refetchOnWindowFocus: false,
    enabled: pollingEnabled,
    retry: true,
  });

  useEffect(() => {
    if (data && data.status === "submitted") {
      setPollingEnabled(true);
      setIsProcessing(true); // Set card to inactive
      setProgress(50);
    } else if (data && data.status === "verified") {
      setPollingEnabled(false);
      setIsProcessing(false);
      setProgress(100);
    } else if (data && data.status === "pending") {
      setPollingEnabled(false);
    }
  }, [data]);
  const getDescription = () => {
    if (isProcessing) return "Processing your application...";
    if (progress === 100) return "Application review complete";
    return "Review and confirm your application details";
  };

  if (isLoading) {
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
      title="Review Application"
      description={getDescription()}
      icon={ClipboardCheck}
      isProcessing={isProcessing}
      progress={progress}
      footer={
        data && data.status === "pending" ? (
          <CardFooterActions
            onNext={() => {
              router.push(`/application-form?id=${data._id}`);
            }}
            nextLabel="Review Application Form"
            isProcessing={isProcessing}
          />
        ) : (
          <CardFooterActions
            onNext={onNext}
            isProcessing={isProcessing}
            isNextDisabled={progress < 100}
          />
        )
      }
    >
      <ProcessingIndicator
        isProcessing={isProcessing}
        progress={progress}
        processingTitle="Application Processing"
        processingItems={[
          "Validating application data...",
          "Performing credit check...",
          "Calculating loan eligibility...",
        ]}
        completeTitle="Review Complete"
        completeItems={[
          "Application data verified",
          "Credit check passed",
          "Loan pre-approved",
        ]}
      />

      {data && data.status === "pending" && (
        <div className="space-y-4">
          <h3 className="font-medium">Application Summary</h3>

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InfoItem icon={User} label="Full Name" value={data.name} />
              <InfoItem icon={Mail} label="Email Address" value={data.email} />
              <InfoItem
                icon={Phone}
                label="Phone Number"
                value={data.phoneNo}
              />
              <InfoItem
                icon={Calendar}
                label="Start Date"
                value={data.created_at}
              />
            </div>

            <div className="bg-muted/30 rounded-md p-3">
              <h4 className="mb-2 text-sm font-medium">Uploaded Documents</h4>
              <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <li>CNIC.pdf</li>
                <li>Gaurdian CNIC.pdf</li>
                <li>Intermediate Result.pdf</li>
                <li>Bank Statements.pdf</li>
                <li>Salary Slips.pdf</li>
                <li>Gas Bills.pdf</li>
                <li>Electricity Bills.pdf</li>
                <li>Reference Letter.pdf</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </ApplicationCard>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-muted/30 rounded-md p-3">
      <div className="text-muted-foreground mb-1 flex items-center gap-2 text-sm">
        <Icon className="h-3.5 w-3.5" />
        <span>{label}</span>
      </div>
      <p className="font-medium">{value}</p>
    </div>
  );
}
