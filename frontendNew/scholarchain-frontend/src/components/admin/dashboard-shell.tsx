import type React from "react"
export default function DashboardShell({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="flex-1 space-y-6">{children}</div>
}

