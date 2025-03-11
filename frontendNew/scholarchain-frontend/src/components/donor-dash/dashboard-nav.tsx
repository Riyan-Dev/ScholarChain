import Link from "next/link"
import { CreditCard, DollarSign, LayoutDashboard, Settings, ShieldCheck, Star } from "lucide-react"

export function DashboardNav() {
  return (
    <nav className="grid items-start gap-2 py-6">
      {[
        {
          title: "Dashboard",
          href: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "Purchase Tokens",
          href: "/purchase",
          icon: CreditCard,
        },
        {
          title: "Transactions",
          href: "/transactions",
          icon: DollarSign,
        },
        {
          title: "Premium Features",
          href: "/premium",
          icon: Star,
        },
        {
          title: "Admin",
          href: "/admin",
          icon: ShieldCheck,
        },
        {
          title: "Settings",
          href: "/settings",
          icon: Settings,
        },
      ].map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground"
        >
          <item.icon className="h-4 w-4" />
          {item.title}
        </Link>
      ))}
    </nav>
  )
}

