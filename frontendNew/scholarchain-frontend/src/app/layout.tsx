import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Sidebar from "@/components/kokonutui//sidebar";
import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { headers } from "next/headers"; // ✅ Get current path on the server
import "./globals.css";
import TopNav from "@/components/kokonutui/top-nav";

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
  const pathname = headersList.get('x-url') ;
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
         { pathname !== "/auth" ? 
         <div className="flex h-screen">
            <Sidebar />
            <div className="w-full flex flex-1 flex-col">
              <header className="h-16 border-b border-gray-200 dark:border-[#1F1F23]">
                <TopNav />
              </header>
              <main className="flex-1 overflow-auto p-6 bg-white dark:bg-[#0F0F12]">
                {children}
              </main>
            </div>
          </div> : 
          <main className="flex-1 overflow-auto bg-white dark:bg-[#0F0F12]">
            {children}
          </main>
          }
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
