"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { CalendarDays, Download, MapPin, Receipt, Star, Loader2, Ticket as TicketIcon, Eye } from "lucide-react";
import { BookingTicket } from "@/components/dashboard/BookingTicket";
import { AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  useEffect(() => {
    if (status === "authenticated") {
      fetchBookings();
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [status]);

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/user/bookings");
      const data = await res.json();
      if (Array.isArray(data)) {
        setBookings(data);
      }
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setLoading(false);
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-brand-gold animate-spin" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-[2rem] shadow-xl text-center">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <TicketIcon size={32} />
          </div>
          <h2 className="text-2xl font-black text-brand-dark-green mb-4">Please Sign In</h2>
          <p className="text-gray-500 mb-8 font-medium">To view your tokens and booking history, you need to be logged in.</p>
          <Link 
            href="/login" 
            className="block w-full bg-brand-dark-green text-white py-4 rounded-xl font-bold hover:shadow-lg transition-all"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const upcomingBookings = bookings.filter(b => b.status === "CONFIRMED" || b.status === "PENDING");
  const pastBookings = bookings.filter(b => b.status === "COMPLETED" || b.status === "CANCELLED");

  return (
    <div className="flex flex-col min-h-screen py-12 px-4 bg-gray-50 uppercase font-sans">
      <div className="max-w-6xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-brand-dark-green tracking-tight">Your Dashboard</h1>
            <p className="text-gray-400 font-medium mt-2 normal-case">Manage your luxury stays and digital tokens.</p>
          </div>
          <button 
            onClick={() => signOut()}
            className="text-red-500 font-bold text-sm tracking-widest uppercase bg-red-50 px-6 py-2 rounded-full border border-red-100 hover:bg-red-100 transition-colors"
          >
            Sign Out
          </button>
        </div>
        
        <div className="grid lg:grid-cols-12 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-10">
            {/* Upcoming */}
            <section>
              <h2 className="text-xl font-black text-gray-800 mb-6 flex items-center gap-3">
                <div className="p-2 bg-brand-gold/10 rounded-lg">
                  <CalendarDays className="w-5 h-5 text-brand-gold" />
                </div>
                Active & Upcoming
              </h2>
              {upcomingBookings.length === 0 ? (
                <div className="bg-white p-12 rounded-[2.5rem] border border-dashed border-gray-200 text-center flex flex-col items-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 text-gray-300">
                    <TicketIcon size={32} />
                  </div>
                  <p className="text-gray-400 font-bold mb-6 normal-case">No active bookings found.</p>
                  <Link href="/services" className="bg-brand-dark-green text-white px-8 py-3 rounded-xl font-bold text-sm">Explore Stays</Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingBookings.map((bkg) => (
                    <div key={bkg.id} className="bg-white p-8 rounded-[2rem] shadow-sm border border-black/5 flex flex-col sm:flex-row justify-between items-center gap-6 group hover:shadow-xl hover:shadow-brand-green/5 transition-all">
                      <div className="w-full">
                        <div className="flex items-center gap-3 mb-3">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${
                            bkg.status === 'CONFIRMED' ? 'bg-green-100 text-green-600' : 'bg-brand-gold/10 text-brand-gold'
                          }`}>
                            {bkg.status}
                          </span>
                          <span className="text-xs text-gray-400 font-mono tracking-tighter">REF: {bkg.id.slice(-8).toUpperCase()}</span>
                        </div>
                        <h3 className="text-2xl font-black text-brand-dark-green tracking-tight">
                          {bkg.service_type === 'ROOM' ? 'Luxury Suite Stay' : 
                           bkg.service_type === 'HALL' ? 'Convention Grand' : 'Resort Experience'}
                        </h3>
                        <p className="text-gray-500 font-medium text-sm mt-1 normal-case">{bkg.items?.join(", ")}</p>
                        <div className="flex items-center gap-6 mt-6">
                           <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                             <CalendarDays size={14} className="text-brand-gold" />
                             {bkg.start_date || bkg.date}
                           </div>
                           <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                             <MapPin size={14} className="text-brand-gold" />
                             Lakkarm Premises
                           </div>
                        </div>
                      </div>
                      <div className="shrink-0 w-full sm:w-auto">
                        <button 
                          onClick={() => setSelectedBooking(bkg)}
                          className="w-full sm:w-auto flex items-center justify-center gap-3 bg-brand-dark-green text-white px-8 py-4 rounded-2xl font-black text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
                        >
                          <Eye size={18} /> View Token
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Past */}
            <section>
              <h2 className="text-lg font-black text-gray-500 mb-6 flex items-center gap-3">
                <Receipt className="w-5 h-5 opacity-30" /> History
              </h2>
              {pastBookings.length === 0 ? (
                <p className="text-xs text-gray-400 font-medium ml-8 italic normal-case">No past booking records.</p>
              ) : (
                <div className="space-y-3 opacity-60">
                  {pastBookings.map((bkg) => (
                    <div key={bkg.id} className="bg-white/50 p-6 rounded-[1.5rem] border border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                      <div className="w-full">
                        <div className="flex items-center gap-3 mb-2">
                           <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{bkg.status}</span>
                           <span className="text-[10px] text-gray-300 font-mono">{bkg.id}</span>
                        </div>
                        <h3 className="text-base font-bold text-gray-700">{bkg.service_type} Details</h3>
                        <p className="text-xs text-gray-400 font-medium normal-case">{bkg.items?.join(", ")} • {bkg.start_date || bkg.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-black/5 border border-gray-100 text-center">
              <div className="relative inline-block mb-6">
                <div className="w-24 h-24 bg-brand-dark-green rounded-[2rem] flex items-center justify-center text-white text-4xl font-black transform -rotate-3 border-4 border-white shadow-lg">
                  {session?.user?.name?.[0].toUpperCase() || "U"}
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-brand-gold rounded-full flex items-center justify-center text-white border-4 border-white shadow-lg">
                   <Star size={16} fill="white" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-brand-dark-green mb-1">{session?.user?.name || "Guest User"}</h3>
              <p className="text-gray-400 font-medium text-sm mb-8 normal-case">{session?.user?.email}</p>
              
              <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 text-left">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 italic leading-none">Status</p>
                 <div className="flex items-center justify-between">
                    <span className="text-brand-dark-green font-black uppercase">Elite Guest</span>
                    <span className="text-[10px] px-2 py-0.5 bg-brand-gold/20 text-brand-gold rounded font-black uppercase">Lvl 1</span>
                 </div>
              </div>
            </div>

            <div className="bg-brand-dark-green text-white p-8 rounded-[2.5rem] shadow-xl shadow-brand-green/20 relative overflow-hidden">
               <div className="absolute -right-8 -bottom-8 opacity-10">
                 <TicketIcon size={160} />
               </div>
               <h3 className="text-xl font-black mb-4 relative z-10 leading-tight">Unlock Exclusive Perks</h3>
               <p className="text-white/70 text-sm leading-relaxed mb-6 font-medium relative z-10 normal-case">
                 Your journey at SRR Resorts is more than just a stay—it's a bond of purity. Book more stays to unlock premium discounts and early-access events.
               </p>
               <Link href="/services" className="inline-block bg-brand-gold text-brand-dark-green px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest relative z-10">Upgrade Stays</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Ticket Modal */}
      <AnimatePresence>
        {selectedBooking && (
          <BookingTicket 
            booking={selectedBooking} 
            onClose={() => setSelectedBooking(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
