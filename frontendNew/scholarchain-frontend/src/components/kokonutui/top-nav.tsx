"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import Profile01 from "./profile-01";
import { ThemeToggle } from "../theme-toggle";
import Link from "next/link";
import { AuthService } from "@/services/auth.service";

export default function TopNav() {
  const role = AuthService.getUserRole();
  return (
    <nav className="flex h-full items-center justify-between border-b border-gray-200 bg-white px-3 sm:px-6 dark:border-[#1F1F23] dark:bg-[#0F0F12]">
      {role === "donator" ? (
        <Link
          href="/donor"
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
      ) : (
        <div> </div>
      )}
      <div className="ml-auto flex items-center gap-2 sm:ml-0 sm:gap-4">
        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <Image
              src="https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-01-n0x8HFv8EUetf9z6ht0wScJKoTHqf8.png"
              alt="User avatar"
              width={28}
              height={28}
              className="cursor-pointer rounded-full ring-2 ring-gray-200 sm:h-8 sm:w-8 dark:ring-[#2B2B30]"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="bg-background border-border w-[280px] rounded-lg shadow-lg sm:w-80"
          >
            <Profile01 avatar="https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-01-n0x8HFv8EUetf9z6ht0wScJKoTHqf8.png" />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
