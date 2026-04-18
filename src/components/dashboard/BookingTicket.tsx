"use client";

import React from "react";
import QRCode from "react-qr-code";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, MapPin, Users, Ticket, CheckCircle2, Clock } from "lucide-react";

interface BookingTicketProps {
  booking: any;
  onClose: () => void;
}

export function BookingTicket({ booking, onClose }: BookingTicketProps) {
  if (!booking) return null;

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

      {/* Ticket Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-sm bg-white rounded-[2rem] overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="bg-brand-dark-green p-6 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-brand-gold/20 rounded-lg">
              <Ticket className="w-5 h-5 text-brand-gold" />
            </div>
            <span className="text-sm font-black tracking-widest uppercase opacity-70">Official Token</span>
          </div>
          <h2 className="text-2xl font-black">Digital Pass</h2>
          <p className="text-white/60 text-xs mt-1 font-mono uppercase tracking-widest">ID: {booking.id}</p>
        </div>

        {/* Status Bar */}
        <div className={`px-6 py-2 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest ${
          booking.status === 'CONFIRMED' ? 'bg-green-50 text-green-600' : 'bg-brand-gold/10 text-brand-gold'
        }`}>
          {booking.status === 'CONFIRMED' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
          {booking.status}
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* QR Code Container */}
          <div className="bg-gray-50 p-6 rounded-3xl flex flex-col items-center justify-center border border-gray-100 shadow-inner">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <QRCode 
                value={booking.id} 
                size={160}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                viewBox={`0 0 256 256`}
              />
            </div>
            <p className="mt-4 text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Scan at check-in</p>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="mt-1 p-2 bg-gray-50 rounded-lg text-brand-gold"><Calendar size={16}/></div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Stay Dates</p>
                <p className="text-sm font-bold text-gray-800">
                  {booking.start_date || booking.date} {booking.end_date ? `- ${booking.end_date}` : ""}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="mt-1 p-2 bg-gray-50 rounded-lg text-brand-gold"><MapPin size={16}/></div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Service</p>
                <p className="text-sm font-bold text-gray-800">{booking.service_type || "Resort Experience"}</p>
                <p className="text-xs text-brand-green font-medium">Items: {booking.items?.join(", ") || "Booking Details"}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="mt-1 p-2 bg-gray-50 rounded-lg text-brand-gold"><Users size={16}/></div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Occupancy</p>
                <p className="text-sm font-bold text-gray-800">{booking.guests} Guests</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 text-center">
            <div className="border-t border-dashed border-gray-200 mt-2 mb-6" />
            <p className="text-[10px] text-gray-400 leading-relaxed max-w-[200px] mx-auto uppercase font-bold tracking-tight">
                Valid only for SRR Resort & Convention Lakkarm Premises. Use by authorized person only.
            </p>
        </div>
      </motion.div>
    </div>
  );
}
