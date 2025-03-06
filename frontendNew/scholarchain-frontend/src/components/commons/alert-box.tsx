import React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

interface AlertDialogBoxProps {
  open: boolean;
  title?: string;
  description?: string;
  closeText?: string;
  confirmText?: string;
  showConfirm?: boolean;
  onConfirm?: () => void;
  onCancel: () => void;
  onOpenChange?: (open: boolean) => void;
}

const AlertDialogBox: React.FC<AlertDialogBoxProps> = ({
  open,
  title = "Alert",
  description = "Are you sure you want to continue?",
  closeText = "Close",
  confirmText = "Confirm",
  showConfirm = false,
  onConfirm,
  onCancel,
  onOpenChange,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>{closeText}</AlertDialogCancel>
          {showConfirm && (
            <AlertDialogAction onClick={onConfirm}>
              {confirmText}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertDialogBox;
