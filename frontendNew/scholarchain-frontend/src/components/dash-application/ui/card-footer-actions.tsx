"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CardFooterActionsProps {
  onNext: () => void;
  onPrevious?: () => void;
  nextLabel?: string;
  previousLabel?: string;
  isProcessing?: boolean;
  isNextDisabled?: boolean;
}

export function CardFooterActions({
  onNext,
  onPrevious,
  nextLabel = "Continue",
  previousLabel = "Back",
  isProcessing = false,
  isNextDisabled = false,
}: CardFooterActionsProps) {
  return (
    <>
      {onPrevious && (
        <Button
          variant="outline"
          onClick={onPrevious}
          className={cn(
            "gap-1",
            isProcessing &&
              "border-white/20 bg-white/10 text-white hover:bg-white/20"
          )}
        >
          <ArrowLeft className="h-4 w-4" />
          {previousLabel}
        </Button>
      )}
      <Button
        onClick={onNext}
        disabled={isNextDisabled}
        className={cn(
          "gap-1",
          isProcessing && "text-primary bg-white hover:bg-white/90"
        )}
      >
        {nextLabel}
        <ArrowRight className="h-4 w-4" />
      </Button>
    </>
  );
}
