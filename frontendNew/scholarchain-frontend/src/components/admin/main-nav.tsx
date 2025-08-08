import Link from "next/link"
import { CreditCard } from "lucide-react"

export function MainNav() {
  return (
    <div className="flex items-center space-x-4 lg:space-x-6">
      <Link href="/dashboard" className="flex items-center space-x-2 text-sm font-medium transition-colors">
        <CreditCard className="h-5 w-5" />
        <span className="hidden sm:inline-block font-bold">Student Loan Management</span>
      </Link>
    </div>
  )
}

