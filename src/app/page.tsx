import { Metadata } from "next";
import HomeContent from "@/components/home/HomeContent";

export const metadata: Metadata = {
  title: "SRR Resorts & Convention | Luxury Stay & Events in Choutuppal",
  description: "Experience absolute luxury and peace at SRR Resorts & Convention. Our resort in Choutuppal offers premium rooms, independent houses with bonfires, and a grand convention hall for weddings and corporate events. Book your stay or event today.",
  alternates: {
    canonical: "https://srrresorts.com",
  },
  openGraph: {
    title: "SRR Resorts & Convention | Luxury Stay & Events in Choutuppal",
    description: "Book your luxury stay or grand event at SRR Resorts. Premium rooms, private cottages, and 1000+ guest convention hall.",
    images: ["/hero.png"],
  }
};

export default function Home() {
  return <HomeContent />;
}
