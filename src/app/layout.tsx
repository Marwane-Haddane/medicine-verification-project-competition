import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MediVerify | Digital Medicine Traceability & Verification Platform",
  description:
    "Verify medicine packaging identifiers (GS1 DataMatrix, EAN-13, batch, serial, expiry) against AMMPS (Morocco) and BDPM (France) official registries with AI visual packaging inspection.",
  keywords: [
    "medicine verification",
    "GS1 DataMatrix",
    "AMMPS Morocco",
    "BDPM France",
    "anti-counterfeit pharmaceuticals",
    "serial verification",
    "pharmaceutical traceability",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${jetbrainsMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#070E1B] text-slate-100 selection:bg-teal-500/30 selection:text-teal-200">
        <div className="fixed inset-0 pointer-events-none bg-grid-cyber opacity-35 z-0" />
        <div className="fixed inset-0 pointer-events-none bg-radial-aurora z-0" />
        <div className="relative z-10 flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
