import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Forest ASCII Art | Canvas2D Effect",
  description:
    "A Canvas2D recreation of the Forest ASCII-art effect from 21st.dev: photo sampled into characters, blocks, patterns, and shapes with tilt-shift blur, chromatic offset, halftone, and film dust shimmer animation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col m-0 bg-[#050505] text-white">
        {children}
      </body>
    </html>
  );
}
