"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

// Define our own simplified props
interface ProvidedThemeProps {
  children: React.ReactNode;
  [key: string]: any; // Allow any additional props
}

export function ThemeProvider({ children, ...props }: ProvidedThemeProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}