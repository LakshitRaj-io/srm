import type { Metadata } from "next";
import { Archivo, Newsreader } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";
import { CampaignNotice } from "@/components/CampaignNotice";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

const display = Archivo({ subsets: ["latin"], variable: "--font-archivo", display: "swap" });
const serif = Newsreader({ subsets: ["latin"], variable: "--font-newsreader", display: "swap" });

export const metadata: Metadata = {
  title: { default: "SRMIST redesign concept", template: "%s | SRMIST redesign concept" },
  description: "Independent redesign concept for SRM Institute of Science and Technology. Not the official website.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-IN" className={`${display.variable} ${serif.variable}`}>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-gold focus:p-3 focus:font-bold">Skip to content</a>
        <p className="bg-ink px-4 py-1.5 text-center text-xs text-paper">Independent redesign concept. Not the official SRMIST website or application portal.</p>
        <CampaignNotice />
        <Header />
        <main id="main" tabIndex={-1}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
