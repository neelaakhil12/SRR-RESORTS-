"use client";

import { useEffect, useState } from "react";
import { 
  Calendar, 
  Users, 
  Home, 
  Settings, 
  Lock, 
  TrendingUp, 
  CreditCard, 
  Clock,
  ArrowUpRight,
  Plus
} from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { StatCard } from "@/components/admin/StatCard";
import Link from "next/link";

export default function AdminPanel() {
  const [stats, setStats] = useState({
    dailyBookings: 0,
    dailyRevenue: 0,
    pendingPayments: 0,
    totalBookings: 0
  });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchRecentBookings();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch stats", err);
    }
  };

  const fetchRecentBookings = async () => {
    try {
      const res = await fetch("/api/admin/bookings");
      if (res.ok) {
        const data = await res.json();
        // Sort by created_at or start_date descending
        const sorted = data.sort((a: any, b: any) => {
          const dateA = new Date(a.created_at || a.start_date || 0).getTime();
          const dateB = new Date(b.created_at || b.start_date || 0).getTime();
          return dateB - dateA;
        });
        setRecentBookings(sorted.slice(0, 3));
      }
    } catch (err) {
      console.error("Failed to fetch recent bookings", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDisplayDate = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-black text-[#0b1a10]">Super Admin Dashboard</h1>
            <p className="text-gray-400 font-medium mt-2">Welcome back. Here's what's happening today at SRR Resorts.</p>
          </div>

          <div className="flex items-center gap-4">
             <Link href="/admin/bookings" className="bg-[#0b1a10] text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-xl shadow-black/10">
               <Plus className="w-5 h-5 text-brand-gold" /> Manual Booking
             </Link>
          </div>
        </header>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard 
            label="Daily Revenue" 
            value={`₹${stats.dailyRevenue}`} 
            icon={TrendingUp} 
            color="green" 
            trend="+12%" 
            trendType="up"
          />
          <StatCard 
            label="Today's Bookings" 
            value={stats.dailyBookings} 
            icon={Calendar} 
            color="sunset"
          />
          <StatCard 
            label="Pending Payments" 
            value={stats.pendingPayments} 
            icon={Clock} 
            color="gold"
          />
          <StatCard 
            label="Total Bookings" 
            value={stats.totalBookings} 
            icon={Users}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Recent Activity Mockup */}
          <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-[#0b1a10]">Recent Bookings</h2>
              <Link href="/admin/bookings" className="text-brand-sunset-start font-bold text-sm hover:underline">View All</Link>
            </div>
            
            <div className="space-y-6">
              {loading ? (
                <p className="text-sm text-gray-400 font-bold uppercase tracking-widest text-center py-6">Loading Recent Bookings...</p>
              ) : recentBookings.length === 0 ? (
                <p className="text-sm text-gray-400 font-bold uppercase tracking-widest text-center py-6">No bookings recorded yet.</p>
              ) : (
                recentBookings.map((b) => (
                  <div key={b.id || b._id} className="flex items-center justify-between p-4 rounded-3xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-brand-gold/10 flex items-center justify-center text-brand-gold font-black">
                        {b.name?.charAt(0) || "B"}
                      </div>
                      <div>
                        <p className="font-bold text-[#0b1a10]">{b.name || "Unknown Guest"}</p>
                        <p className="text-sm text-gray-400">{b.service_type} • {formatDisplayDate(b.start_date)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#0b1a10]">₹{b.total_amount || 0}</p>
                      <p className={`text-[10px] font-bold uppercase tracking-wider ${
                        b.status === 'CONFIRMED' ? 'text-green-500' : 
                        b.status === 'CANCELLED' ? 'text-red-500' : 'text-yellow-500'
                      }`}>{b.status}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8">
            <h2 className="text-2xl font-bold text-[#0b1a10] mb-8">Quick Actions</h2>
            <div className="space-y-4">
              <Link href="/admin/bookings" className="w-full flex items-center justify-between p-5 bg-srr-cream/30 rounded-3xl hover:bg-brand-gold/10 transition-all group border border-gray-50">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-2xl shadow-sm text-brand-sunset-start">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-[#0b1a10]">Manual Booking</p>
                    <p className="text-[10px] text-gray-400">Add walk-in guests</p>
                  </div>
                </div>
                <ArrowUpRight className="w-5 h-5 text-gray-300 group-hover:text-brand-sunset-start transition-colors" />
              </Link>

              <button className="w-full flex items-center justify-between p-5 bg-srr-cream/30 rounded-3xl hover:bg-brand-green/10 transition-all group border border-gray-50">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-2xl shadow-sm text-brand-green">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-[#0b1a10]">Block Hall</p>
                    <p className="text-[10px] text-gray-400">Offline reservations</p>
                  </div>
                </div>
                <ArrowUpRight className="w-5 h-5 text-gray-300 group-hover:text-brand-green transition-colors" />
              </button>

              <button className="w-full flex items-center justify-between p-5 bg-srr-cream/30 rounded-3xl hover:bg-brand-gold/10 transition-all group border border-gray-50">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-2xl shadow-sm text-brand-gold">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-[#0b1a10]">New Service</p>
                    <p className="text-[10px] text-gray-400">Expand offerings</p>
                  </div>
                </div>
                <ArrowUpRight className="w-5 h-5 text-gray-300 group-hover:text-brand-gold transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
