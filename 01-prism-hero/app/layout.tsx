import type { Metadata } from "next";
import { Bodoni_Moda, JetBrains_Mono, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const bodoni = Bodoni_Moda({
  variable: "--font-display",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Prism Hero",
  description: "Crystal refraction hero frontend",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(bodoni.variable, jetbrains.variable, "font-sans", geist.variable)}>
      <body>{children}</body>
    </html>
  );
}
