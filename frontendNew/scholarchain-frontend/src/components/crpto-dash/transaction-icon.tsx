import { ArrowUpRight, ArrowDownLeft, CreditCard, Coins } from "lucide-react";

interface TransactionIconProps {
  action: string;
  className?: string;
}

export function TransactionIcon({ action, className }: TransactionIconProps) {
  switch (action.toLowerCase()) {
    case "buy":
      return <Coins className={`h-5 w-5 text-blue-500 ${className}`} />;
    case "debit":
      return <ArrowUpRight className={`h-5 w-5 text-red-500 ${className}`} />;
    case "credit":
      return (
        <ArrowDownLeft className={`h-5 w-5 text-green-500 ${className}`} />
      );
    default:
      return <CreditCard className={`h-5 w-5 text-gray-500 ${className}`} />;
  }
}
