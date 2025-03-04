import Link from 'next/link';
import Dashboard from "@/components/kokonutui/dashboard"

export default function DashboardPage() {
  return (
  <Link href="/dashboard">
    <Dashboard />
  </Link>
    );
}