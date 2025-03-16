"use client";

import {
  ClipboardCheck,
  User,
  GraduationCap,
  University,
  Calendar,
} from "lucide-react";
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
    } else if (
      data &&
      (data.status === "verified" || data.status === "rejected")
    ) {
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
        ) : data.status !== "rejected" ? (
          <CardFooterActions
            onNext={onNext}
            isProcessing={isProcessing}
            isNextDisabled={progress < 100}
          />
        ) : null
      }
    >
      {data.status !== "rejected" && (
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
      )}
      {data && data.status === "rejected" && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-900/20">
          <h4 className="mb-2 font-medium text-red-800 dark:text-red-300">
            Application Review Complete
          </h4>
          <ul className="space-y-2 text-sm text-red-700 dark:text-red-300">
            {[
              "Feasibility report did not pass the criteria",
              "Contact our customer service to be eligible for applying again",
              "Or, Try Again in 6 months",
            ].map((item, index) => (
              <li key={index} className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-red-500"></div>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {data && data.status === "pending" && (
        <div className="space-y-4">
          <h3 className="font-medium">Application Summary</h3>

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InfoItem icon={User} label="Full Name" value={data.name} />
              <InfoItem
                icon={GraduationCap}
                label="Current Education Level"
                value={data.current_education}
              />
              <InfoItem
                icon={University}
                label="Institute"
                value={data.institute}
              />
              <InfoItem
                icon={Calendar}
                label="Application Date"
                value={data.application_date}
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
