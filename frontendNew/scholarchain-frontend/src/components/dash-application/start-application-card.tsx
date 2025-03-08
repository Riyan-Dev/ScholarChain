"use client";

import { FilePlus, FileText, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApplicationCard } from "./ui/application-card";
import { CardFooterActions } from "./ui/card-footer-actions";
import { Button } from "../ui/button";

interface StartApplicationCardProps {
  onNext: () => void;
}

export function StartApplicationCard({ onNext }: StartApplicationCardProps) {
  const formFields = [
    {
      id: "fullName",
      label: "Full Name",
      type: "text",
      placeholder: "Enter your full name",
    },
    {
      id: "email",
      label: "Email Address",
      type: "email",
      placeholder: "Enter your email address",
    },
    {
      id: "phone",
      label: "Phone Number",
      type: "text",
      placeholder: "Enter your phone number",
    },
    {
      id: "loanAmount",
      label: "Loan Amount",
      type: "text",
      placeholder: "Enter desired loan amount",
    },
  ];

  return (
    <ApplicationCard
      title="Start Application"
      description="Begin your loan application process"
      icon={FileText}
      showFooter={false}
    >
      <div className="flex flex-grow items-center justify-center space-y-6">
        <Button type="button" variant="default" size="lg">
          <FilePlus className="mr-2 h-8 w-8" />
          Start Application
        </Button>
      </div>
    </ApplicationCard>
  );
}
