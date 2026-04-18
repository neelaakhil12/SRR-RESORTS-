import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SRR Resorts & Convention",
  description: "Experience luxury and comfort at SRR Resorts & Convention. Book your stay or event today.",
};

import { RootWrapper } from "@/components/layout/RootWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased bg-background text-foreground`}
    >
      <body className="min-h-full flex flex-col">
        <RootWrapper>
          {children}
        </RootWrapper>
      </body>
    </html>
  );
}
