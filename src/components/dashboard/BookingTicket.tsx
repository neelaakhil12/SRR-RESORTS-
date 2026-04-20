"use client";

import React from "react";
import { motion } from "framer-motion";
import { X, Calendar, MapPin, Users, Ticket, CheckCircle2, Clock, User, Download } from "lucide-react";
import jsPDF from "jspdf";
import { domToPng } from "modern-screenshot";
import { useRef } from "react";

interface BookingTicketProps {
  booking: any;
  onClose: () => void;
}

export function BookingTicket({ booking, onClose }: BookingTicketProps) {
  const ticketRef = useRef<HTMLDivElement>(null);
  
  if (!booking) return null;

  const handleDownload = async () => {
    if (!ticketRef.current) return;

    try {
      const element = ticketRef.current;
      
      // Temporarily hide the download button part for the snapshot
      const downloadSection = element.querySelector('.download-section');
      if (downloadSection) (downloadSection as HTMLElement).style.display = 'none';

      // Capture using modern-screenshot (supports oklab/oklch)
      const dataUrl = await domToPng(element, {
        scale: 3,
      });

      if (downloadSection) (downloadSection as HTMLElement).style.display = 'flex';
      
      // Get base64 string
      const imgData = dataUrl;
      
      // Create a temporary image to get dimensions for the PDF
      const img = new Image();
      img.src = dataUrl;
      await new Promise(resolve => img.onload = resolve);

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [img.width * 0.264583 / 3, img.height * 0.264583 / 3]
      });

      pdf.addImage(imgData, "PNG", 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight(), undefined, 'FAST');
      pdf.save(`SRR-TOKEN-${booking.id?.slice(-6).toUpperCase()}.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("PDF generation failed. This might be due to browser security settings. Please try again or take a screenshot.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-brand-dark-green/60 backdrop-blur-md"
      />

      {/* Movie Ticket Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        ref={ticketRef}
        className="relative w-full max-w-sm bg-white rounded-[2rem] overflow-hidden shadow-2xl flex flex-col"
      >
        {/* Aesthetic Notches (Punch Holes) */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-black/60 rounded-full z-20 backdrop-blur-md" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-8 h-8 bg-black/60 rounded-full z-20 backdrop-blur-md" />

        {/* Header Section */}
        <div className="bg-black p-8 text-white relative">
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <img src="/logo.png" alt="SRR Logo" className="w-10 h-10 object-contain brightness-100" />
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-brand-gold"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-brand-gold/20 rounded-lg">
              <Ticket className="w-5 h-5 text-brand-gold" />
            </div>
            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-brand-gold/70">Entry Token</span>
          </div>
          
          <h2 className="text-3xl font-black tracking-tight leading-none mb-2 text-brand-gold">Digital Pass</h2>
          <div className="flex items-center gap-2 px-3 py-1 bg-brand-gold/10 rounded-full w-fit border border-brand-gold/20">
            <div className={`w-2 h-2 rounded-full ${booking.status === 'CONFIRMED' ? 'bg-green-400' : 'bg-brand-gold animate-pulse'}`} />
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-gold">
              {booking.status}
            </span>
          </div>
        </div>

        {/* Perforated Divider */}
        <div className="relative h-4 bg-white flex items-center justify-center px-4">
          <div className="w-full border-t-2 border-dashed border-gray-100" />
        </div>

        {/* Details Section */}
        <div className="p-8 pt-4 space-y-8 flex-1">
          {/* Main Identifiers */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Guest Name</p>
              <div className="flex items-center gap-2">
                <User size={14} className="text-brand-gold" />
                <p className="text-sm font-black text-brand-dark-green truncate">{booking.name}</p>
              </div>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Booking ID</p>
              <p className="text-sm font-mono font-bold text-gray-800">#{booking.id?.slice(-6).toUpperCase()}</p>
            </div>
          </div>

          <div className="bg-brand-dark-green/[0.03] p-6 rounded-[2rem] border border-gray-50 space-y-5">
            <div className="flex items-start gap-4">
              <div className="mt-1 p-2 bg-white rounded-xl shadow-sm border border-gray-100 text-brand-gold"><Calendar size={18}/></div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Stay / Event Category</p>
                <div className="space-y-1">
                  <p className="text-sm font-black text-gray-800">
                    {booking.start_date || booking.date} {booking.check_in_time ? `@ ${booking.check_in_time}` : ""}
                  </p>
                  {booking.end_date && (
                    <p className="text-sm font-black text-gray-800">
                      to {booking.end_date} {booking.check_out_time ? `@ ${booking.check_out_time}` : ""}
                    </p>
                  )}
                </div>

              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="mt-1 p-2 bg-white rounded-xl shadow-sm border border-gray-100 text-brand-gold"><MapPin size={18}/></div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Service Details</p>
                <p className="text-sm font-black text-gray-800">{booking.service_type || "Luxury Experience"}</p>
                <p className="text-[10px] text-brand-sunset-start font-bold uppercase mt-0.5">{booking.items?.join(" • ")}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="mt-1 p-2 bg-white rounded-xl shadow-sm border border-gray-100 text-brand-gold"><Users size={18}/></div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Occupancy</p>
                <p className="text-sm font-black text-gray-800">{booking.guests} {booking.guests > 1 ? 'Persons' : 'Person'}</p>
              </div>
            </div>
          </div>

          {/* Token ID (The "Movie Ticket" Code) */}
          <div className="text-center space-y-2 py-4 border-2 border-dashed border-brand-gold/20 rounded-3xl bg-brand-gold/[0.02]">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-gold/60">Unique Token ID</p>
            <p className="text-3xl font-black text-brand-dark-green tracking-tighter uppercase">
              {booking.token_id || booking.id?.slice(0, 8).toUpperCase() || "SRR-PASS"}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-6 flex flex-col gap-3 download-section">
            <button 
              onClick={handleDownload}
              className="w-full flex items-center justify-center gap-2 bg-brand-gold text-white py-3 rounded-xl font-black text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-md uppercase tracking-widest"
            >
              <Download size={14} /> Download PDF Ticket
            </button>
            <p className="text-[9px] text-gray-400 leading-relaxed font-black uppercase tracking-tighter opacity-70 text-center">
                Purity You Can Trust • SRR Resort & Convention • Lakkarm Premises • Verify token at check-in counter
            </p>
        </div>
      </motion.div>
    </div>
  );
}
