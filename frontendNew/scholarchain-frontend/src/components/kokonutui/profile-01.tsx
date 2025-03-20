import { LogOut, MoveUpRight, FileText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AuthService } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from 'react';
import { getUserDetails } from "@/services/user.service"; // Import the service


interface MenuItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

// Removed avatar from the interface
interface Profile01Props {
  name: string;
  role: string;
}

const defaultProfile = {
  name: "Loading...", // Initial loading state
  role: "Loading..." // Initial loading state
} satisfies Required<Profile01Props>;

export default function Profile01() { // Removed prop arguments
  const router = useRouter();
  const [userDetails, setUserDetails] = useState<any>(null); // Store user details
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
        const fetchDetails = async () => {
            setIsLoading(true);
            try {
                const data = await getUserDetails();
                setUserDetails(data);
                setError(null);
            } catch (e: any) {  // Use 'any' or 'unknown' for now
                setError(e.message || 'Failed to fetch user details.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDetails();
    }, []);


  const menuItems: MenuItem[] = [
    // Menu items remain unchanged
  ];

  const handleLogout = () => {
    AuthService.removeToken();
    router.push("/auth");
  };

  let name = defaultProfile.name; // Default loading state
  let role = defaultProfile.role; // Default loading state

  if (userDetails) {
      name = userDetails.name;
      role = userDetails.role;
  }

  if (isLoading) {
        return (
            <div className="mx-auto w-full max-w-sm">
                <div className="relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
                    <div className="relative px-6 pt-12 pb-6">
                    <p>Loading user details...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="mx-auto w-full max-w-sm">
                <div className="relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
                    <div className="relative px-6 pt-12 pb-6">
                    <p>Error: {error}</p>
                    </div>
                </div>
            </div>
        )
    }


  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
        <div className="relative px-6 pt-12 pb-6">
          <div className="mb-8 flex items-center gap-4">
            {/* Removed the div containing the avatar */}

            {/* Profile Info */}
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                {name}
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400">{role}</p>
            </div>
          </div>
          <div className="my-6 h-px bg-zinc-200 dark:bg-zinc-800" />
          <div className="space-y-2">
            {/*{menuItems.map((item) => (*/}
            {/*  <Link*/}
            {/*    key={item.label}*/}
            {/*    href={item.href}*/}
            {/*    className="flex items-center justify-between rounded-lg p-2 transition-colors duration-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"*/}
            {/*  >*/}
            {/*    <div className="flex items-center gap-2">*/}
            {/*      {item.icon}*/}
            {/*      <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">*/}
            {/*        {item.label}*/}
            {/*      </span>*/}
            {/*    </div>*/}
            {/*    <div className="flex items-center">*/}
            {/*      {item.value && (*/}
            {/*        <span className="mr-2 text-sm text-zinc-500 dark:text-zinc-400">*/}
            {/*          {item.value}*/}
            {/*        </span>*/}
            {/*      )}*/}
            {/*      {item.external && <MoveUpRight className="h-4 w-4" />}*/}
            {/*    </div>*/}
            {/*  </Link>*/}
            {/*))}*/}

            <button // Changed to a button element
              onClick={handleLogout} // Call handleLogout on click
              className="flex w-full items-center justify-between rounded-lg p-2 transition-colors duration-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
            >
              <div className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  Logout
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}