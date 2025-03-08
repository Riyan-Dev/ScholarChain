"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentUploadCard } from "./document-upload-card";
import { ApplicationTimeline } from "./application-timeline";
import { ReviewApplicationCard } from "./review-application-card";
import { RepaymentPlanCard } from "./repayment-plan-card";
import { StartApplicationCard } from "./start-application-card";

export type ApplicationStage =
  | "start"
  | "upload"
  | "review"
  | "repayment"
  | "complete";

interface ApplicationFlowProps {
  stage: ApplicationStage;
}

export function LoanApplicationFlow({ stage }: ApplicationFlowProps) {
  const [currentStage, setCurrentStage] = useState<ApplicationStage>(stage);
  const [previousStage, setPreviousStage] = useState<ApplicationStage | null>(
    null
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [reviewProgress, setReviewProgress] = useState(0);

  // Demo controls to simulate the flow
  const simulateStage = (stage: ApplicationStage) => {
    setPreviousStage(currentStage);
    setCurrentStage(stage);

    if (stage === "upload") {
      setUploadProgress(0);
      setIsAnalyzing(true);
      simulateDocumentAnalysis();
    } else if (stage === "review") {
      setReviewProgress(0);
      setIsReviewing(true);
      simulateApplicationReview();
    }
  };

  // Simulate document analysis with polling
  const simulateDocumentAnalysis = () => {
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        const newProgress = prev + Math.floor(Math.random() * 10) + 1;
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
          return 100;
        }
        return newProgress;
      });
    }, 500);

    return () => clearInterval(interval);
  };

  // Simulate application review with polling
  const simulateApplicationReview = () => {
    const interval = setInterval(() => {
      setReviewProgress((prev) => {
        const newProgress = prev + Math.floor(Math.random() * 8) + 1;
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsReviewing(false);
          return 100;
        }
        return newProgress;
      });
    }, 600);

    return () => clearInterval(interval);
  };

  // Handle next stage navigation
  const handleNextStage = () => {
    setPreviousStage(currentStage);

    if (currentStage === "start") {
      setCurrentStage("upload");
      setUploadProgress(0);
      setIsAnalyzing(true);
      simulateDocumentAnalysis();
    } else if (currentStage === "upload" && uploadProgress === 100) {
      setCurrentStage("review");
      setReviewProgress(0);
      setIsReviewing(true);
      simulateApplicationReview();
    } else if (currentStage === "review" && reviewProgress === 100) {
      setCurrentStage("repayment");
    } else if (currentStage === "repayment") {
      setCurrentStage("complete");
    }
  };

  // Handle previous stage navigation
  const handlePreviousStage = () => {
    if (!previousStage) return;

    setPreviousStage(null);
    setCurrentStage(previousStage);
  };

  // Reset the entire flow
  const resetFlow = () => {
    setCurrentStage("start");
    setPreviousStage(null);
    setIsAnalyzing(false);
    setIsReviewing(false);
    setUploadProgress(0);
    setReviewProgress(0);
  };

  return (
    <Card className="w-full flex-grow p-6">
      <div className="space-y-8">
        {/* Demo Controls */}
        <Card className="border border-dashed p-4">
          <h3 className="mb-3 text-sm font-medium">Demo Controls</h3>
          <Tabs
            defaultValue={currentStage}
            onValueChange={(value) => simulateStage(value as ApplicationStage)}
          >
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="start">Start</TabsTrigger>
              <TabsTrigger value="upload">Upload</TabsTrigger>
              <TabsTrigger value="review">Review</TabsTrigger>
              <TabsTrigger value="repayment">Repayment</TabsTrigger>
              <TabsTrigger value="complete">Complete</TabsTrigger>
            </TabsList>
          </Tabs>
        </Card>

        {/* Application Timeline */}
        <ApplicationTimeline currentStage={currentStage} />
        {/* Application Cards */}
        <div className="grid grid-cols-1 gap-6">
          {currentStage === "start" && (
            <StartApplicationCard onNext={handleNextStage} />
          )}

          {currentStage === "upload" && (
            <DocumentUploadCard
              isProcessing={isAnalyzing}
              progress={uploadProgress}
              onNext={handleNextStage}
              onPrevious={handlePreviousStage}
            />
          )}

          {currentStage === "review" && (
            <ReviewApplicationCard
              isProcessing={isReviewing}
              progress={reviewProgress}
              onNext={handleNextStage}
              onPrevious={handlePreviousStage}
            />
          )}

          {currentStage === "repayment" && (
            <RepaymentPlanCard
              onNext={handleNextStage}
              onPrevious={handlePreviousStage}
            />
          )}

          {currentStage === "complete" && (
            <Card className="border-green-200 bg-green-50 p-8 text-center dark:border-green-900 dark:bg-green-950/20">
              <div className="flex flex-col items-center gap-4">
                <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
                  <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-2xl font-bold">Application Complete!</h2>
                <p className="text-muted-foreground max-w-md">
                  Your loan application has been successfully submitted. You
                  will receive a confirmation email shortly.
                </p>
                <Button onClick={resetFlow} className="mt-4">
                  Start New Application
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </Card>
  );
}
