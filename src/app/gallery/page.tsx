import { Metadata } from "next";
import GalleryContent from "@/components/gallery/GalleryContent";

export const metadata: Metadata = {
  title: "Photo Gallery",
  description: "View the beautiful landscapes, luxury rooms, and grand events at SRR Resorts & Convention. A visual journey through our premium destination in Choutuppal.",
  alternates: {
    canonical: "https://srrresorts.com/gallery",
  },
};

export default function GalleryPage() {
  return <GalleryContent />;
}
