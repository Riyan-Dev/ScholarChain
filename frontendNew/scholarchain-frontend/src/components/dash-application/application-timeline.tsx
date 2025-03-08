import { CheckCircle, Clock, CreditCard, FileText, Upload } from "lucide-react";
import type { ApplicationStage } from "./loan-application-flow";

interface ApplicationTimelineProps {
  currentStage: ApplicationStage;
}

export function ApplicationTimeline({
  currentStage,
}: ApplicationTimelineProps) {
  const stages = [
    { id: "start", label: "Start Application", icon: FileText },
    { id: "upload", label: "Upload Documents", icon: Upload },
    { id: "review", label: "Review Application", icon: Clock },
    { id: "repayment", label: "Repayment Plan", icon: CreditCard },
  ];

  const getStageStatus = (stageId: string) => {
    const stageIndex = stages.findIndex((s) => s.id === stageId);
    const currentIndex = stages.findIndex((s) => s.id === currentStage);

    if (currentStage === "complete") {
      return "complete";
    }

    if (stageIndex < currentIndex) {
      return "complete";
    } else if (stageIndex === currentIndex) {
      return "current";
    } else {
      return "upcoming";
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {stages.map((stage, index) => (
          <div key={stage.id} className="relative flex flex-col items-center">
            {/* Connector line */}
            {index < stages.length - 1 && (
              <div className="absolute top-4 left-[50%] z-0 h-0.5 w-[calc(100%-2rem)] -translate-y-1/2">
                <div
                  className={`h-full ${getStageStatus(stage.id) === "complete" ? "bg-primary" : "bg-muted"}`}
                />
              </div>
            )}

            {/* Stage indicator */}
            <div
              className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full ${
                getStageStatus(stage.id) === "complete"
                  ? "bg-primary text-primary-foreground"
                  : getStageStatus(stage.id) === "current"
                    ? "bg-primary text-primary-foreground ring-primary/20 ring-4"
                    : "bg-muted text-muted-foreground"
              } `}
            >
              {getStageStatus(stage.id) === "complete" ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <stage.icon className="h-4 w-4" />
              )}
            </div>

            {/* Stage label */}
            <span
              className={`mt-2 text-xs font-medium ${
                getStageStatus(stage.id) === "complete" ||
                getStageStatus(stage.id) === "current"
                  ? "text-foreground"
                  : "text-muted-foreground"
              } `}
            >
              {stage.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
