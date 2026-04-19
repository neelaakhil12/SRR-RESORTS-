"use client";

import { useEffect, useState } from "react";
import { 
  Calendar, 
  Search, 
  Filter, 
  Download, 
  Plus, 
  CheckCircle2, 
  Clock, 
  XCircle,
  MoreVertical,
  Loader2,
  ChevronDown,
  User,
  CreditCard,
  MapPin,
  X,
  Check
} from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { format } from "date-fns";

interface Booking {
  id: string;
  name?: string;
  email?: string;
  service_type: string;
  items: string[];
  start_date: string;
  end_date: string;
  total_amount: number;
  status: string;
  payment_status: string;
  payment_method?: string;
  booking_source: string;
  created_at: string;
}

export default function BookingsManagement() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const safeFormatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return "Invalid Date";
      return format(date, 'MMM dd, yyyy');
    } catch (err) {
      return "Format Error";
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/admin/bookings");
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch bookings", err);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (id: string, status: string, payment_status?: string) => {
    try {
      await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, ...(payment_status && { payment_status }) })
      });
      fetchBookings();
    } catch (err) {
      console.error("Update error", err);
    }
  };

  const handleManualBooking = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    const body = {
      ...data,
      items: [data.service_name],
      service_type: data.service_name.toString().toUpperCase().includes('ROOM') ? 'ROOM' : 'HALL',
      booking_source: 'WALK_IN',
      status: 'CONFIRMED'
    };

    try {
      const res = await fetch("/api/admin/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchBookings();
      }
    } catch (err) {
      console.error("Manual booking error", err);
    } finally {
      setFormLoading(false);
    }
  };

  const filteredBookings = bookings.filter(b => {
    const matchesStatus = filterStatus === "ALL" || b.status === filterStatus;
    const matchesSearch = (b.id.toLowerCase().includes(searchTerm.toLowerCase())) || 
                         (b.name?.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <AdminSidebar />

      <main className="flex-1 p-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-black text-[#0b1a10]">Bookings</h1>
            <p className="text-gray-400 font-medium mt-2">Oversee all reservations and manage walk-in customers.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#0b1a10] text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-xl shadow-black/10"
          >
            <Plus className="w-5 h-5 text-brand-gold" /> Manual Booking
          </button>
        </header>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by ID or Guest Name..."
              className="w-full bg-white border border-gray-100 pl-12 pr-4 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold transition-all font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {['ALL', 'CONFIRMED', 'PENDING', 'CANCELLED'].map((s) => (
              <button 
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-6 py-4 rounded-2xl font-bold text-xs transition-all ${
                  filterStatus === s 
                    ? "bg-brand-gold text-[#0b1a10] shadow-lg shadow-brand-gold/20" 
                    : "bg-white text-gray-400 border border-gray-100 hover:bg-gray-50"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-brand-gold" />
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Guest</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Stay Duration</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Amount</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredBookings.map((bkg) => (
                  <tr key={bkg.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-srr-cream flex items-center justify-center text-[#0b1a10] font-bold text-xs">
                          {bkg.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-[#0b1a10]">{bkg.name || 'Unknown'}</p>
                          <p className="text-xs text-xs text-gray-400">{bkg.service_type} • {bkg.items.join(', ')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-bold text-[#0b1a10]">{safeFormatDate(bkg.start_date)}</p>
                      <p className="text-xs text-gray-400">{bkg.booking_source}</p>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-black text-[#0b1a10]">₹{bkg.total_amount}</p>
                      <span className={`text-[9px] font-black uppercase tracking-widest ${bkg.payment_status === 'PAID' ? 'text-green-500' : 'text-orange-400'}`}>
                        {bkg.payment_status}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        bkg.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 
                        bkg.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {bkg.status}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         {bkg.status !== 'CONFIRMED' && (
                           <button onClick={() => updateBookingStatus(bkg.id, 'CONFIRMED', 'PAID')} className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100">
                             <Check className="w-4 h-4" />
                           </button>
                         )}
                         {bkg.status !== 'CANCELLED' && (
                           <button onClick={() => updateBookingStatus(bkg.id, 'CANCELLED')} className="p-2 bg-red-50 text-red-400 rounded-lg hover:bg-red-100">
                             <X className="w-4 h-4" />
                           </button>
                         )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Manual Booking Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#0b1a10]/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
            <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
               <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div>
                  <h2 className="text-2xl font-bold text-[#0b1a10]">New Manual Booking</h2>
                  <p className="text-xs text-gray-400 font-medium">Record a walk-in or offline reservation.</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

               <form onSubmit={handleManualBooking} className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Guest Name</label>
                    <div className="relative">
                       <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                       <input name="name" required className="w-full bg-gray-50 border border-gray-100 pl-12 pr-4 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold transition-all font-bold" placeholder="Guest Name" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Selected Service</label>
                    <select name="service_name" className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold transition-all font-bold appearance-none">
                      <option value="Luxury Room A1">Luxury Room A1</option>
                      <option value="Luxury Room A2">Luxury Room A2</option>
                      <option value="Grand Convention Hall">Grand Convention Hall</option>
                      <option value="Independent House 1">Independent House 1</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Start Date</label>
                    <input name="start_date" type="date" required className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold transition-all font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">End Date</label>
                    <input name="end_date" type="date" required className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold transition-all font-bold" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Total Amount (₹)</label>
                    <div className="relative">
                       <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                       <input name="total_amount" type="number" required className="w-full bg-gray-50 border border-gray-100 pl-12 pr-4 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold transition-all font-black text-brand-green" placeholder="0.00" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Payment Method</label>
                    <select name="payment_method" className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold transition-all font-bold appearance-none">
                      <option value="CASH">Cash</option>
                      <option value="UPI">UPI / PhonePe</option>
                      <option value="CARD">Debit/Credit Card</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    disabled={formLoading}
                    className="w-full bg-brand-sunset-start text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-xl shadow-brand-sunset-start/20 disabled:opacity-50"
                  >
                    {formLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                      <>
                        <CheckCircle2 className="w-6 h-6 text-white" /> Confirm Manual Booking
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
