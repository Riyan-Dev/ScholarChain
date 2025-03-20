import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Sidebar from "@/components/kokonutui//sidebar";
import type React from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { ChatDock } from "@/components/chat-dock";
import { Toaster } from "@/components/ui/sonner";
import { cookies, headers } from "next/headers"; // ✅ Get current path on the server
import "./globals.css";
import TopNav from "@/components/kokonutui/top-nav";
import { Providers } from "./proviers";
import { AuthService } from "@/services/auth.service";
import config from "@/config/config";
import { DashboardNav } from "@/components/admin/dashboard-nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ScholarChain",
  description: "Study Loans Made Easier",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // // ✅ Get the current pathname from the request headers
  const headersList = await headers();
  const pathname = headersList.get("x-url");
  const cookieStore = await cookies();
  const authToken = cookieStore.get(config.jwtSecret)?.value;
  const userData = AuthService.getUserInfo(authToken as string);
  const userRole = userData?.role;
  console.log(pathname);
  // // ✅ Fetch the auth token from cookies
  // const cookieStore = cookies();
  // const authToken = (await cookieStore).get("authToken")?.value;

  // // ✅ Skip authentication check on "/auth" page
  // if (!authToken && pathname !== "/auth") {
  //   redirect("/auth"); // Redirect to login if not authenticated
  // }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {pathname === "/auth" ||
            pathname === "/" ||
            pathname === "/payment" ? (
              // Default layout
              <main className="flex-1 overflow-auto bg-white dark:bg-[#0F0F12]">
                {children}
              </main>
            ) : userRole && userRole === "donator" ? (
              // Layout for donor pages
              <div className="flex h-screen">
                <div className="flex w-full flex-1 flex-col">
                  <header className="h-16 border-b border-gray-200 dark:border-[#1F1F23]">
                    <TopNav />
                  </header>
                  <main className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-950">
                    {children}
                  </main>
                </div>
              </div>
            ) : userRole && userRole === "admin" ? (
              // Layout for donor pages
              <div className="flex h-screen">
                <aside className="bg-muted/40 hidden border-r md:block">
                  <DashboardNav />
                </aside>
                <div className="flex w-full flex-1 flex-col">
                  <header className="h-16 border-b border-gray-200 dark:border-[#1F1F23]">
                    <TopNav />
                  </header>
                  <main className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-950">
                    {children}
                  </main>
                </div>
              </div>
            ) : (
              // Layout with Sidebar
              <div className="flex h-screen">
                <Sidebar />
                <div className="flex w-full flex-1 flex-col">
                  <header className="h-16 border-b border-gray-200 dark:border-[#1F1F23]">
                    <TopNav />
                  </header>
                  <main className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-950">
                    {children}
                  </main>
                </div>
                <ChatDock />
              </div>
            )}
            <Toaster className="z-[9999]" />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
