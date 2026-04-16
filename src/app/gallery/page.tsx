"use client";

import { useState } from "react";
import { CheckCircle2, Camera, MapPin, Grid, Layers, Home } from "lucide-react";


const GALLERY_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1000&auto=format&fit=crop",
    category: "Exterior",
    title: "Resort Entrance"
  },
  {
    src: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1000&auto=format&fit=crop",
    category: "Rooms",
    title: "Luxury King Suite"
  },
  {
    src: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1000&auto=format&fit=crop",
    category: "Hall",
    title: "Grand Convention Hall"
  },
  {
    src: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1000&auto=format&fit=crop",
    category: "Leisure",
    title: "Infinity Pool"
  },
  {
    src: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=1000&auto=format&fit=crop",
    category: "Exterior",
    title: "Independent Houses"
  },
  {
    src: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1000&auto=format&fit=crop",
    category: "Rooms",
    title: "Premium Triple Room"
  },
  {
    src: "https://images.unsplash.com/photo-1505944270255-bd2b88a4c951?q=80&w=1000&auto=format&fit=crop",
    category: "Leisure",
    title: "Evening Bonfire"
  },
  {
    src: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=1000&auto=format&fit=crop",
    category: "Hall",
    title: "Corporate Setup"
  },
  {
    src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000&auto=format&fit=crop",
    category: "Exterior",
    title: "Lush Greenery"
  }
];

export default function GalleryPage() {
  const images = GALLERY_IMAGES;

  return (
    <div className="flex flex-col min-h-screen py-12 md:py-24 px-4 bg-srr-cream">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
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

        
        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {images.map((img, idx) => (
            <div 
              key={idx} 
              className="group relative h-[280px] md:h-96 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 animate-in zoom-in-95"
            >
              {/* Image */}
              <img 
                src={img.src} 
                alt={img.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark-green/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                <span className="text-brand-gold text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-1">
                   <MapPin className="w-3 h-3" /> {img.category}
                </span>
                <h3 className="text-white text-2xl font-bold">{img.title}</h3>
                <div className="w-12 h-1 bg-brand-sunset-start mt-4 rounded-full" />
              </div>

              {/* Tag (Always visible) */}
              <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-tighter border border-white/20 group-hover:hidden transition-all">
                {img.category}
              </div>
            </div>
          ))}
        </div>

        {images.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
            <Layers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No images found.</p>
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-20 text-center bg-brand-dark-green text-white rounded-3xl p-10 shadow-xl overflow-hidden relative">
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-brand-sunset-start opacity-10 rounded-full blur-3xl" />
          <h2 className="text-2xl font-bold mb-4">Ready to see it in person?</h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Book your stay or event today and experience the luxury of SRR Resorts & Convention first-hand.
          </p>
          <button className="bg-white text-brand-dark-green px-8 py-3 rounded-full font-bold hover:bg-brand-gold transition-colors">
            Book Your Experience Now
          </button>
        </div>
      </div>
    </div>
  );
}
