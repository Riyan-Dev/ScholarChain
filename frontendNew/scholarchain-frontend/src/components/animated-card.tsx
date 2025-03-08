"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AnimatedCardProps {
  title: string;
  active: boolean; // Just a boolean now
  setActive: React.Dispatch<React.SetStateAction<boolean>>; // And a separate setter function
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({
  title,
  active,
  setActive,
}) => {
  useEffect(() => {
    console.log("hello");
  }, [active]);
  return (
    <>
      <Card
        className={cn(
          "w-full max-w-md shadow-lg transition-all duration-700 ease-in-out",
          active
            ? "animate-gradient bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-[length:200%_100%] text-white"
            : "bg-green-500 text-white"
        )}
      >
        <CardHeader className="bg-black/20 px-6 py-4">
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="px-6 py-4 text-center">
          <p>This card is reflecting document upload status.</p>
        </CardContent>
        <CardFooter className="flex justify-end bg-black/20 px-6 py-4">
          <Button variant="outline" onClick={() => setActive(!active)}>
            {active ? "Deactivate" : "Activate"}
          </Button>
        </CardFooter>
      </Card>
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
    </>
  );
};

export default AnimatedCard;
