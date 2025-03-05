"use client";

import {
  BarChart2,
  Receipt,
  Building2,
  CreditCard,
  Folder,
  Wallet,
  Users2,
  Shield,
  MessagesSquare,
  Video,
  Settings,
  HelpCircle,
  Menu,
} from "lucide-react";

import { Home } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  function handleNavigation() {
    setIsMobileMenuOpen(false);
  }

  function NavItem({
    href,
    icon: Icon,
    children,
  }: {
    href: string;
    icon: any;
    children: React.ReactNode;
  }) {
    return (
      <Link
        href={href}
        onClick={handleNavigation}
        className="flex items-center rounded-md px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-[#1F1F23] dark:hover:text-white"
      >
        <Icon className="mr-3 h-4 w-4 flex-shrink-0" />
        {children}
      </Link>
    );
  }

  return (
    <>
      <button
        type="button"
        className="fixed top-4 left-4 z-[70] rounded-lg bg-white p-2 shadow-md lg:hidden dark:bg-[#0F0F12]"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
      </button>
      <nav
        className={`fixed inset-y-0 left-0 z-[70] w-64 transform border-r border-gray-200 bg-white transition-transform duration-200 ease-in-out lg:static lg:w-64 lg:translate-x-0 dark:border-[#1F1F23] dark:bg-[#0F0F12] ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} `}
      >
        <div className="flex h-full flex-col">
          <Link
            href="https://kokonutui.com/"
            target="_blank"
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

          <div className="flex-1 overflow-y-auto px-4 py-4">
            <div className="space-y-6">
              <div>
                <div className="mb-2 px-3 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  Overview
                </div>
                <div className="space-y-1">
                  <NavItem href="#" icon={Home}>
                    Dashboard
                  </NavItem>
                  <NavItem href="#" icon={BarChart2}>
                    Analytics
                  </NavItem>
                  <NavItem href="#" icon={Building2}>
                    Organization
                  </NavItem>
                  <NavItem href="#" icon={Folder}>
                    Projects
                  </NavItem>
                </div>
              </div>

              <div>
                <div className="mb-2 px-3 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  Finance
                </div>
                <div className="space-y-1">
                  <NavItem href="#" icon={Wallet}>
                    Transactions
                  </NavItem>
                  <NavItem href="#" icon={Receipt}>
                    Invoices
                  </NavItem>
                  <NavItem href="#" icon={CreditCard}>
                    Payments
                  </NavItem>
                </div>
              </div>

              <div>
                <div className="mb-2 px-3 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  Team
                </div>
                <div className="space-y-1">
                  <NavItem href="#" icon={Users2}>
                    Members
                  </NavItem>
                  <NavItem href="#" icon={Shield}>
                    Permissions
                  </NavItem>
                  <NavItem href="#" icon={MessagesSquare}>
                    Chat
                  </NavItem>
                  <NavItem href="#" icon={Video}>
                    Meetings
                  </NavItem>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 px-4 py-4 dark:border-[#1F1F23]">
            <div className="space-y-1">
              <NavItem href="#" icon={Settings}>
                Settings
              </NavItem>
              <NavItem href="#" icon={HelpCircle}>
                Help
              </NavItem>
            </div>
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div
          className="bg-opacity-50 fixed inset-0 z-[65] bg-black lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
