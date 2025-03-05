"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  // Use mounted state to prevent hydration mismatch
  const [mounted, setMounted] = useState(false);

  // Only render theme-dependent UI after mounting on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Return a non-themed version for SSR
  if (!mounted) {
    return (
      <div className="flex h-screen">
        <div className="hidden w-64 border-r border-gray-200 lg:block"></div>
        <div className="flex w-full flex-1 flex-col">
          <header className="h-16 border-b border-gray-200"></header>
          <main className="flex-1 overflow-auto bg-white p-6">{children}</main>
        </div>
      </div>
    );
  }

  // Client-side rendering with proper theme
  return (
    <div className="flex h-screen">
      <div className="flex w-full flex-1 flex-col">
        <header className="h-16 border-b border-gray-200 dark:border-[#1F1F23]"></header>
        <main className="flex-1 overflow-auto bg-white p-6 dark:bg-[#0F0F12]">
          {children}
        </main>
      </div>
    </div>
  );
}
