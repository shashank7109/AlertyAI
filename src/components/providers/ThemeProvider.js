/**
 * Copyright (c) 2026 Shashank Bindal
 * AlertyAI Software License
 */

'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'

export function ThemeProvider({ children }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
      {children}
    </NextThemesProvider>
  )
}

