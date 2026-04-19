"use client";

import React from "react";
import { motion } from "framer-motion";
import { X, Calendar, MapPin, Users, Ticket, CheckCircle2, Clock, User, Download } from "lucide-react";
import jsPDF from "jspdf";

interface BookingTicketProps {
  booking: any;
  onClose: () => void;
}

export function BookingTicket({ booking, onClose }: BookingTicketProps) {
  if (!booking) return null;

  const handleDownload = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [100, 150]
    });

    // Branding Colors
    const darkGreen = [11, 26, 16];
    const gold = [197, 160, 89];

    // Header Background
    doc.setFillColor(0, 0, 0);
    doc.rect(0, 0, 100, 45, 'F');

    // Logo Placeholder or Text
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("SRR RESORTS", 50, 15, { align: "center" });

    doc.setTextColor(gold[0], gold[1], gold[2]);
    doc.setFontSize(10);
    doc.text("PURITY YOU CAN TRUST", 50, 22, { align: "center" });

    doc.setDrawColor(gold[0], gold[1], gold[2]);
    doc.setLineWidth(0.5);
    doc.line(30, 25, 70, 25);

    doc.setFontSize(14);
    doc.text("DIGITAL PASS", 50, 35, { align: "center" });

    // Perforation
    doc.setDrawColor(200, 200, 200);
    doc.setLineDashPattern([2, 1], 0);
    doc.line(0, 48, 100, 48);
    doc.setLineDashPattern([], 0);

    // Guest Details
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(8);
    doc.text("GUEST NAME", 10, 60);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(booking.name || "Guest", 10, 65);

    doc.setTextColor(150, 150, 150);
    doc.setFontSize(8);
    doc.text("BOOKING ID", 90, 60, { align: "right" });
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`#${(booking.id || "").slice(-6).toUpperCase()}`, 90, 65, { align: "right" });

    // Details Card
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(10, 75, 80, 40, 5, 5, 'F');

    doc.setTextColor(100, 100, 100);
    doc.setFontSize(7);
    doc.text("SERVICE TYPE", 15, 82);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.text(booking.service_type || "Resort Stay", 15, 87);

    doc.setTextColor(100, 100, 100);
    doc.setFontSize(7);
    doc.text("DATE & TIME", 15, 95);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.text(`${booking.start_date || booking.date} @ ${booking.check_in_time || "06:00 AM"}`, 15, 100);

    doc.setTextColor(100, 100, 100);
    doc.setFontSize(7);
    doc.text("ITEMS", 15, 108);
    doc.setTextColor(215, 70, 35); // sunset orange
    doc.setFontSize(8);
    doc.text((booking.items || []).join(" • "), 15, 113, { maxWidth: 70 });

    // Token ID
    doc.setDrawColor(gold[0], gold[1], gold[2]);
    doc.setLineWidth(0.3);
    doc.roundedRect(10, 122, 80, 15, 3, 3, 'D');
    
    doc.setTextColor(gold[0], gold[1], gold[2]);
    doc.setFontSize(7);
    doc.text("UNIQUE TOKEN ID", 50, 127, { align: "center" });
    
    doc.setTextColor(darkGreen[0], darkGreen[1], darkGreen[2]);
    doc.setFontSize(14);
    doc.text(booking.token_id || booking.id?.slice(0, 8).toUpperCase() || "SRR-PASS", 50, 134, { align: "center" });

    // Footer
    doc.setTextColor(180, 180, 180);
    doc.setFontSize(6);
    doc.text("SRR RESORT & CONVENTION • LAKKARM PREMISES", 50, 145, { align: "center" });

    doc.save(`SRR-TOKEN-${booking.id?.slice(-6).toUpperCase()}.pdf`);
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
        <div className="bg-gray-50 p-6 flex flex-col gap-3">
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
