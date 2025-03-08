"use client";

import { ClipboardCheck, User, Mail, Phone, DollarSign } from "lucide-react";
import { ApplicationCard } from "./ui/application-card";
import { CardFooterActions } from "./ui/card-footer-actions";
import { ProcessingIndicator } from "./ui/processing-indicator";

interface ReviewApplicationCardProps {
  isProcessing: boolean;
  progress: number;
  onNext: () => void;
  onPrevious: () => void;
}

export function ReviewApplicationCard({
  isProcessing,
  progress,
  onNext,
  onPrevious,
}: ReviewApplicationCardProps) {
  const getDescription = () => {
    if (isProcessing) return "Processing your application...";
    if (progress === 100) return "Application review complete";
    return "Review and confirm your application details";
  };

  return (
    <ApplicationCard
      title="Review Application"
      description={getDescription()}
      icon={ClipboardCheck}
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

      {!isProcessing && progress !== 100 && (
        <div className="space-y-4">
          <h3 className="font-medium">Application Summary</h3>

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InfoItem icon={User} label="Full Name" value="John Doe" />
              <InfoItem
                icon={Mail}
                label="Email Address"
                value="john.doe@example.com"
              />
              <InfoItem
                icon={Phone}
                label="Phone Number"
                value="(123) 456-7890"
              />
              <InfoItem icon={DollarSign} label="Loan Amount" value="$25,000" />
            </div>

            <div className="bg-muted/30 rounded-md p-3">
              <h4 className="mb-2 text-sm font-medium">Uploaded Documents</h4>
              <ul className="space-y-1 text-sm">
                <li>ID Document.pdf</li>
                <li>Proof of Income.pdf</li>
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
