"use client";

import type React from "react";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  CreditCard,
  Home,
  Settings,
  Users,
  FileBarChart,
  Wallet,
  FileCheck,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: Home,
  },
  {
    title: "Loans",
    href: "/admin/loans",
    icon: CreditCard,
  },
  {
    title: "Applications",
    href: "/admin/applications",
    icon: FileCheck,
  },
  {
    title: "Wallet & Transactions",
    href: "/admin/wallet",
    icon: Wallet,
  },
  {
    title: "Reports",
    href: "/admin/reports",
    icon: FileBarChart,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="grid items-start gap-2">
      <Link
        href="/admin"
        rel="noopener noreferrer"
        className="flex h-16 items-center border-b border-gray-200 px-6 dark:border-[#1F1F23]"
      >
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Acme"
            width={64}
            height={64}
            className="block flex-shrink-0"
          />
          <span className="text-lg font-semibold text-gray-900 hover:cursor-pointer dark:text-white">
            ScholarChain
          </span>
        </div>
      </Link>
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link key={item.href} href={item.href}>
            <Button
              variant={pathname === item.href ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                pathname === item.href
                  ? "bg-secondary"
                  : "hover:bg-transparent hover:underline"
              )}
            >
              <Icon className="mr-2 h-4 w-4" />
              {item.title}
            </Button>
          </Link>
        );
      })}
    </nav>
  );
}
