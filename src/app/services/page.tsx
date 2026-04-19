import { Metadata } from "next";
import { Suspense } from "react";
import ServicesContent from "@/components/services/ServicesContent";

export const metadata: Metadata = {
  title: "Premium Services & Bookings",
  description: "Book your luxury stay or event at SRR Resorts. Premium rooms, independent houses, convention hall, and leisure activities including Box Cricket and Swimming Pool.",
  alternates: {
    canonical: "https://srrresorts.com/services",
  },
};

export default function ServicesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-srr-cream animate-pulse" />}>
      <ServicesContent />
    </Suspense>
  );
}
