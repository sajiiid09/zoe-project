import type { Metadata } from "next";

import { env } from "@/lib/config/env";

import "./globals.css";

export const metadata: Metadata = {
  title: `${env.appName} | Marketplace`,
  description: "Mass-market ecommerce marketplace frontend foundation",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
