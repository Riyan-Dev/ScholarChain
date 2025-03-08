"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ApplicationCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  showFooter?: boolean;
  showHeader?: boolean;
  isProcessing?: boolean;
  progress?: number;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function ApplicationCard({
  title,
  description,
  icon: Icon,
  showFooter = true,
  showHeader = true,
  isProcessing = false,
  progress = 0,
  children,
  footer,
  className,
}: ApplicationCardProps) {
  return (
    <Card
      className={cn(
        "w-full shadow-lg transition-all duration-700 ease-in-out",
        isProcessing &&
          "animate-gradient bg-gradient-to-r from-blue-500 via-purple-200 to-blue-500 bg-[length:200%_100%] text-white",
        className
      )}
    >
      {showHeader && (
        <CardHeader
          className={cn("border-b p-4", isProcessing && "bg-black/20")}
        >
          <div className="flex items-center gap-2">
            <div
              className={cn("rounded-full p-2", isProcessing && "bg-white/20")}
            >
              <Icon className={cn("h-5 w-5", isProcessing && "text-white")} />
            </div>
            <div>
              <CardTitle>{title}</CardTitle>
              <CardDescription className={isProcessing ? "text-white/80" : ""}>
                {description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      )}
      <CardContent className="pt-6 pb-2">{children}</CardContent>
      {showFooter && (
        <CardFooter
          className={cn(
            "flex justify-center gap-2 border-t p-4",
            isProcessing && "bg-black/20"
          )}
        >
          {footer}
        </CardFooter>
      )}
      <style jsx global>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </Card>
  );
}
