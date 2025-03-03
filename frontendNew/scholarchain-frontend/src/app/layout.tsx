import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Sidebar from "../components/sidebar";
import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";
// import { headers } from "next/headers"; // ✅ Get current path on the server
import "./globals.css";

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
  // const pathname = (await headers()).get("x-pathname") || "/";

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
          <Sidebar />
          <main className="flex-1 ml-16 md:ml-64 p-5">{children}</main>
        </ThemeProvider>        
      </body>
    </html>
  );
}
