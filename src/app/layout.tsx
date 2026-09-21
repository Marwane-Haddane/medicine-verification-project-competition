import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Grainient from "@/components/reactbits/Grainient/Grainient";

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
      className={`${plusJakarta.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-slate-900 selection:bg-teal-500/20 selection:text-teal-900 relative">
        {/* React Bits <Grainient /> dynamic living background */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-40">
          <Grainient
            color1="#58aed9"
            color2="#3300ff"
            color3="#ffffff"
            timeSpeed={0.25}
            colorBalance={0.0}
            warpStrength={1.0}
            warpFrequency={5.0}
            warpSpeed={2.0}
            warpAmplitude={50.0}
            blendAngle={0.0}
            blendSoftness={0.05}
            rotationAmount={500.0}
            noiseScale={2.0}
            grainAmount={0.1}
            grainScale={2.0}
            grainAnimated={false}
            contrast={1.5}
            gamma={1.0}
            saturation={1.0}
            centerX={0.0}
            centerY={0.0}
            zoom={0.9}
            lightMode={true}
          />
        </div>

        {/* Subtle grid pattern overlay */}
        <div className="fixed inset-0 pointer-events-none bg-grid-cyber opacity-30 z-0" />
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
