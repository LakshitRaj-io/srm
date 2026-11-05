import type { Metadata } from "next";
import { Geist } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SrmGuide } from "@/components/SrmGuide";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });

export const metadata: Metadata = {
  title: { default: "SRMIST redesign concept", template: "%s | SRMIST redesign concept" },
  description: "Redesign concept for SRM Institute of Science and Technology.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-IN" data-theme="light" suppressHydrationWarning className={geist.variable}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `var d=document.documentElement,n=navigator,c=n.connection;d.dataset.js="1";if((c&&c.saveData)||n.deviceMemory<=2||n.hardwareConcurrency<=2)d.dataset.lite="1";try{var t=localStorage.getItem("srm-theme");d.dataset.theme=t||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light")}catch(e){}` }} />
      </head>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-tint focus:p-3 focus:font-bold">Skip to content</a>
        <Header />
        <main id="main" tabIndex={-1}>{children}</main>
        <Footer />
        <SrmGuide />
      </body>
    </html>
  );
}
