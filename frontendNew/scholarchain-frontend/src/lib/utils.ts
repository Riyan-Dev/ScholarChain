import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function getDaysRemaining(dateString: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueDate = new Date(dateString);
  dueDate.setHours(0, 0, 0, 0);

  const differenceInTime = dueDate.getTime() - today.getTime();
  const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));

  return differenceInDays;
}

export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(date);
}

// Format hash for display (truncate with ellipsis)
export function formatHash(hash: string, length = 8): string {
  if (!hash || hash.length <= length * 2) return hash;
  return `${hash.substring(0, length)}...${hash.substring(hash.length - length)}`;
}

export function truncateAddress(address: string, chars = 6): string {
  if (!address) return "";
  return `${address.substring(0, chars)}...${address.substring(address.length - 4)}`;
}

function parseMonthYear(monthYearString: string): Date | undefined {
  if (!monthYearString) {
    return undefined; // Handle empty or null input
  }

  const [monthName, yearStr] = monthYearString.split("-");

  if (!monthName || !yearStr) {
    return undefined; // Handle invalid string format
  }

  const monthMapping = {
    jan: 0,
    feb: 1,
    mar: 2,
    apr: 3,
    may: 4,
    jun: 5,
    jul: 6,
    aug: 7,
    sep: 8,
    oct: 9,
    nov: 10,
    dec: 11,
  } as const;

  const monthIndex =
    monthMapping[monthName.toLowerCase() as keyof typeof monthMapping];
  const year = parseInt(yearStr, 10);

  if (monthIndex === undefined || isNaN(year)) {
    return undefined; // Handle invalid month or year
  }

  return new Date(year, monthIndex);
}
