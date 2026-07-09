"use client";

import { useState, useEffect } from "react";
import { Camera, MapPin, Layers, Play, X } from "lucide-react";

const GALLERY_IMAGES = [
  {
    id: "g1",
    src: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1000&auto=format&fit=crop",
    category: "Exterior",
    title: "Resort Entrance",
    videoUrl: ""
  },
  {
    id: "g2",
    src: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1000&auto=format&fit=crop",
    category: "Rooms",
    title: "Luxury King Suite",
    videoUrl: ""
  },
  {
    id: "g3",
    src: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1000&auto=format&fit=crop",
    category: "Hall",
    title: "Grand Convention Hall",
    videoUrl: ""
  },
  {
    id: "g4",
    src: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1000&auto=format&fit=crop",
    category: "Leisure",
    title: "Infinity Pool",
    videoUrl: ""
  },
  {
    id: "g5",
    src: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=1000&auto=format&fit=crop",
    category: "Exterior",
    title: "Independent Houses",
    videoUrl: ""
  },
  {
    id: "g6",
    src: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1000&auto=format&fit=crop",
    category: "Rooms",
    title: "Premium Triple Room",
    videoUrl: ""
  },
  {
    id: "g7",
    src: "https://images.unsplash.com/photo-1505944270255-bd2b88a4c951?q=80&w=1000&auto=format&fit=crop",
    category: "Leisure",
    title: "Evening Bonfire",
    videoUrl: ""
  },
  {
    id: "g8",
    src: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=1000&auto=format&fit=crop",
    category: "Hall",
    title: "Corporate Setup",
    videoUrl: ""
  },
  {
    id: "g9",
    src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000&auto=format&fit=crop",
    category: "Exterior",
    title: "Lush Greenery",
    videoUrl: ""
  }
];

const CATEGORIES = ["All", "Exterior", "Rooms", "Hall", "Leisure", "Videos"];

export default function GalleryContent() {
  const [images, setImages] = useState<any[]>(GALLERY_IMAGES);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/gallery")
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setImages(data.map((d: any) => ({
            id: d.id,
            src: d.url,
            category: d.category || "General",
            title: d.title || "SRR Resort",
            videoUrl: d.videoUrl || ""
          })));
        }
      })
      .catch(() => {});
  }, []);

  const filtered = activeCategory === "All"
    ? images
    : images.filter(img => img.category === activeCategory);

  const getEmbedUrl = (url: string) => {
    const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
    if (ytMatch && ytMatch[1]) {
      return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`;
    }
    return url;
  };

  return (
    <div className="flex flex-col min-h-screen py-12 md:py-24 px-4 bg-srr-cream">
      <div className="max-w-7xl mx-auto w-full">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-brand-dark-green mb-3 md:mb-4 flex items-center justify-center gap-3">
            <Camera className="w-10 h-10 text-brand-sunset-start" />
            Our Visual Story
          </h1>
          <div className="w-20 h-1 bg-sunset-gradient mx-auto rounded-full mb-4 md:mb-6" />
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
            Glimpse into the luxury, peace, and grand celebrations at SRR Resorts.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                activeCategory === cat
                  ? "bg-brand-dark-green text-white shadow-lg"
                  : "bg-white text-brand-dark-green border border-gray-200 hover:border-brand-dark-green"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((img, idx) => {
            const isVideo = img.category === "Videos" || !!img.videoUrl;
            return (
              <div
                key={img.id || idx}
                onClick={() => {
                  if (isVideo && img.videoUrl) {
                    setActiveVideo(img.videoUrl);
                  }
                }}
                className={`group relative h-[280px] md:h-96 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 ${
                  isVideo ? "cursor-pointer" : ""
                }`}
              >
                <img
                  src={img.src}
                  alt={img.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />

                {/* Play Button Overlay for Videos */}
                {isVideo && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/35 transition-colors duration-500">
                    <div className="w-16 h-16 rounded-full bg-brand-gold text-white flex items-center justify-center shadow-2xl shadow-brand-gold/30 group-hover:scale-110 transition-transform duration-300">
                      <Play className="w-6 h-6 fill-white ml-1" />
                    </div>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark-green/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                  <h3 className="text-white text-2xl font-bold">{img.title}</h3>
                  <div className="w-12 h-1 bg-brand-sunset-start mt-4 rounded-full" />
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
            <Layers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No items in this category.</p>
          </div>
        )}

        <div className="mt-20 text-center bg-brand-dark-green text-white rounded-3xl p-10 shadow-xl overflow-hidden relative">
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-brand-sunset-start opacity-10 rounded-full blur-3xl" />
          <h2 className="text-2xl font-bold mb-4">Ready to see it in person?</h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Book your stay or event today and experience the luxury of SRR Resorts & Convention first-hand.
          </p>
          <a
            href="/services"
            className="inline-block bg-white text-brand-dark-green px-8 py-3 rounded-full font-bold hover:bg-brand-gold transition-colors"
          >
            Book Your Experience Now
          </a>
        </div>
      </div>

      {/* Lightbox / Video Player Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setActiveVideo(null)} />
          <div className="relative bg-black w-full max-w-4xl aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/10 animate-in zoom-in-95 duration-300 z-10">
            <button 
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 z-20 p-3 bg-black/60 hover:bg-black text-white hover:text-brand-gold rounded-full transition-all border border-white/10"
            >
              <X className="w-5 h-5" />
            </button>
            {activeVideo.includes("youtube.com") || activeVideo.includes("youtu.be") || activeVideo.includes("youtube-nocookie.com") ? (
              <iframe
                src={getEmbedUrl(activeVideo)}
                title="SRR Resorts Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            ) : (
              <video
                src={activeVideo}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
