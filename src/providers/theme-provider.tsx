"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

type Attribute = "class" | "data-theme" | "style";

interface ThemeProviderProps {
  children: React.ReactNode;
  attribute?: Attribute ;
  defaultTheme?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
