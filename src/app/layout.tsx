import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://srrresorts.com"),
  title: {
    default: "SRR Resorts & Convention | Luxury Stay & Events in Choutuppal",
    template: "%s | SRR Resorts & Convention"
  },
  description: "Experience absolute luxury and peace at SRR Resorts & Convention. Premium rooms, independent cottages, and a grand 1000+ capacity convention hall in Choutuppal.",
  keywords: ["resorts in choutuppal", "luxury stay hyderabad", "convention hall choutuppal", "wedding venue choutuppal", "srr resorts", "box cricket choutuppal"],
  authors: [{ name: "SRR Resorts Team" }],
  creator: "SRR Resorts",
  publisher: "SRR Resorts",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "SRR Resorts & Convention | Luxury Stay & Events",
    description: "Experience absolute luxury and peace at SRR Resorts & Convention. Premium rooms, cottages, and a grand convention hall.",
    url: "https://srrresorts.com",
    siteName: "SRR Resorts & Convention",
    images: [
      {
        url: "/og-image.png", // Make sure this exists later or use a generic one
        width: 1200,
        height: 630,
        alt: "SRR Resorts & Convention",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SRR Resorts & Convention",
    description: "Experience absolute luxury and peace at SRR Resorts & Convention.",
    images: ["/og-image.png"],
  },
  verification: {
    google: "YOUR_GOOGLE_VERIFICATION_CODE_HERE", // User can replace this later
  },
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
      <head>
        <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
      </head>
      <body className="min-h-full flex flex-col">
        <RootWrapper>
          {children}
        </RootWrapper>
      </body>
    </html>
  );
}
