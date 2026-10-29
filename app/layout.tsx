import type { Metadata } from "next";
import { eventConfig } from "@/config/event";
import "./globals.css";

export const metadata: Metadata = {
  title: eventConfig.eventName,
  description: eventConfig.tagline
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body suppressHydrationWarning style={{
    "--primary": eventConfig.theme.primary,
    "--accent": eventConfig.theme.accent
  } as React.CSSProperties}><script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem("dj-ticket-theme");document.body.dataset.theme=t==="light"?"light":"dark"}catch(e){document.body.dataset.theme="dark"}` }} />{children}</body></html>;
}
