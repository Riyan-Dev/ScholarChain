"use client"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      {...props}
      enableSystem={true}
      enableColorScheme={true}
      // Force client-side rendering only for theme elements
      // to prevent hydration mismatches
      attribute="class"
    >
      {children}
    </NextThemesProvider>
  )
}

