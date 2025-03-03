"use client"

import type { ReactNode } from "react"
import Sidebar from "./sidebar"
import TopNav from "./top-nav"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  // Use mounted state to prevent hydration mismatch
  const [mounted, setMounted] = useState(false)
  const { theme, resolvedTheme } = useTheme()

  // Only render theme-dependent UI after mounting on the client
  useEffect(() => {
    setMounted(true)
  }, [])

  // Return a non-themed version for SSR
  if (!mounted) {
    return (
      <div className="flex h-screen">
        <div className="w-64 border-r border-gray-200 hidden lg:block"></div>
        <div className="w-full flex flex-1 flex-col">
          <header className="h-16 border-b border-gray-200"></header>
          <main className="flex-1 overflow-auto p-6 bg-white">{children}</main>
        </div>
      </div>
    )
  }

  // Client-side rendering with proper theme
  return (
    <div className="flex h-screen">
      {/* <Sidebar /> */}
      <div className="w-full flex flex-1 flex-col">
        <header className="h-16 border-b border-gray-200 dark:border-[#1F1F23]">
          <TopNav />
        </header>
        <main className="flex-1 overflow-auto p-6 bg-white dark:bg-[#0F0F12]">{children}</main>
      </div>
    </div>
  )
}

