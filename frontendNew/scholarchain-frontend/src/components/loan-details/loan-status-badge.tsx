import { Badge } from "@/components/ui/badge"

interface LoanStatusBadgeProps {
  status: "ongoing" | "completed" | "defaulted"
}

export function LoanStatusBadge({ status }: LoanStatusBadgeProps) {
  switch (status) {
    case "ongoing":
      return <Badge variant="secondary">Active</Badge>
    case "completed":
      return <Badge variant="default">Completed</Badge>
    case "defaulted":
      return <Badge variant="destructive">Defaulted</Badge>
    default:
      return null
  }
}

