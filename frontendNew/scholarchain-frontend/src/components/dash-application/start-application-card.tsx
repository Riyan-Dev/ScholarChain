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
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";



interface StartApplicationCardProps {
  onNext: () => void;
}

export function StartApplicationCard({ onNext }: StartApplicationCardProps) {
  const [loading, setLoading] = useState(false);

  const handleStartApplication = async () => { // ✅ Mark function as async
    setLoading(true); // Start loading
    try {
      await onNext(); // Execute the onNext function (must return a Promise)
      setTimeout(() => redirect("/upload-doc"), 100); // ✅ Small delay before redirection
    } catch (error) {
      console.error("Error starting application:", error);
    } finally {
      setLoading(false); // ✅ Ensure loading stops in all cases
    }
  };

  
  return (
    <ApplicationCard
      title="Start Application"
      description="Begin your loan application process"
      icon={FileText}
      showFooter={false}
    >
      <motion.div className=" flex flex-grow items-center justify-center space-y-6 " whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}>
      <Button
        type="button"
        variant="default"
        size="lg"
        onClick={handleStartApplication}
        disabled={loading} // Disable button while loading
        className="flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" /> Processing...
          </>
        ) : (
          <>
            <FilePlus className="mr-2 h-8 w-8" />
            Start Application
          </>
        )}
      </Button>
      </motion.div>
    </ApplicationCard>
  );
}
