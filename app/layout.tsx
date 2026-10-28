import type { Metadata } from "next";
import { eventConfig } from "@/config/event";
import "./globals.css";

export const metadata: Metadata = {
  title: eventConfig.eventName,
  description: eventConfig.tagline
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body style={{
    "--primary": eventConfig.theme.primary,
    "--accent": eventConfig.theme.accent,
    "--theme-background": eventConfig.theme.background,
    "--theme-surface": eventConfig.theme.surface,
    "--theme-foreground": eventConfig.theme.foreground,
    "--theme-muted": eventConfig.theme.muted
  } as React.CSSProperties}>{children}</body></html>;
}
