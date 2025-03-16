"use client";

import { FilePlus, FileText, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApplicationCard } from "./ui/application-card";
import { CardFooterActions } from "./ui/card-footer-actions";
import { Button } from "../ui/button";
import { redirect } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface StartApplicationCardProps {
  onNext: () => void;
}

export function StartApplicationCard({ onNext }: StartApplicationCardProps) {
  const handleStartApplication = () => {
    onNext();
    redirect("/upload-doc");
  };
  
  
  return (
    <ApplicationCard
      title="Start Application"
      description="Begin your loan application process"
      icon={FileText}
      showFooter={false}
    >
      <div className="flex flex-grow items-center justify-center space-y-6">
        <Button
          type="button"
          variant="default"
          size="lg"
          onClick={handleStartApplication}
        >
          <FilePlus className="mr-2 h-8 w-8" />
          Start Application
        </Button>
      </div>
    </ApplicationCard>
  );
}
