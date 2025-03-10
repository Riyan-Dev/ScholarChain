import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface InstallmentSummaryProps {
  label: string;
  count: number;
  icon: ReactNode;
  variant: "default" | "success" | "destructive";
}

export function InstallmentSummary({
  label,
  count,
  icon,
  variant = "default",
}: InstallmentSummaryProps) {
  return (
    <div className="flex-1 rounded-md border p-2 text-center">
      <div
        className={cn(
          "flex items-center justify-center gap-1 text-xs font-medium",
          variant === "success" && "text-green-600",
          variant === "destructive" && "text-destructive"
        )}
      >
        {icon}
        {label}
      </div>
      <div
        className={cn(
          "mt-1 text-xl font-bold",
          variant === "success" && "text-green-600",
          variant === "destructive" && "text-destructive"
        )}
      >
        {count}
      </div>
    </div>
  );
}
