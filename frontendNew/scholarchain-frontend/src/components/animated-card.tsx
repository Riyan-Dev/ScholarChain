"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AnimatedCardProps {
  title: string;
  children: React.ReactNode;
  condition?: boolean;
  onToggle?: () => void;
  className?: string;
}

export default function AnimatedCard({
  title = "Animated Card",
  children,
  condition = true,
  onToggle,
  className,
}: AnimatedCardProps) {
  const [isActive, setIsActive] = useState(condition);

  const handleToggle = () => {
    setIsActive(!isActive);
    if (onToggle) onToggle();
  };

  return (
    <Card
      className={cn(
        "w-full max-w-md shadow-lg transition-all duration-700 ease-in-out",
        isActive
          ? "animate-gradient bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-[length:200%_100%] text-white"
          : "bg-green-500 text-white",
        className
      )}
    >
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter className="flex justify-end">
        <Button
          onClick={handleToggle}
          variant="outline"
          className="border-white/30 bg-white/20 text-white hover:bg-white/30"
        >
          {isActive ? "Deactivate" : "Activate"}
        </Button>
      </CardFooter>
    </Card>
  );
}
