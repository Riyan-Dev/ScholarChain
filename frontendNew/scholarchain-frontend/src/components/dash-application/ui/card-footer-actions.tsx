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
  nextLabel = "Continue",
  isProcessing = false,
  isNextDisabled = false,
}: CardFooterActionsProps) {
  return (
    <>
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
