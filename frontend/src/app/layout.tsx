import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";

import { AppProviders } from "@/components/commerce/AppProviders";
import { env } from "@/lib/config/env";

import "./globals.css";

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${env.appName} | Marketplace`,
  description: "Mass-market ecommerce marketplace frontend foundation",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={notoSans.className}>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
