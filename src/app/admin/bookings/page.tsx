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
  Check,
  Mail,
  Phone,
  Users,
  Navigation,
  Building2,
  Home as HomeIcon,
  Waves,
  ShieldCheck,
  Upload,
  Info
} from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { BookingTicket } from "@/components/dashboard/BookingTicket";
import { useRef } from "react";
import { buildWhatsAppMessage, openWhatsApp } from "@/lib/whatsapp";



const FLOORS = [
  { name: "First Floor", rooms: ["A1", "A2", "A3", "A4"] },
  { name: "Second Floor", rooms: ["B1", "B2", "B3", "B4"] },
  { name: "Third Floor", rooms: ["C1", "C2", "C3", "C4"] },
];

const HOUSE_CLUSTERS = [
  { name: "Cluster A (Houses 1-3) - Bonfire", houses: ["House 1", "House 2", "House 3"] },
  { name: "Cluster B (Houses 4-6) - Foot Pool", houses: ["House 4", "House 5", "House 6"] }
];

const SERVICE_OPTIONS = [
  { id: 'ROOM', name: 'Luxury Rooms', icon: Building2, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'HOUSE', name: 'Independent Houses', icon: HomeIcon, color: 'text-orange-500', bg: 'bg-orange-50' },
  { id: 'HALL', name: 'Convention Hall', icon: Navigation, color: 'text-purple-500', bg: 'bg-purple-50' },
  { id: 'LEISURE', name: 'Leisure Activities', icon: Waves, color: 'text-cyan-500', bg: 'bg-cyan-50' },
];


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
  aadhar_url?: string;
}

export default function BookingsManagement() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<"selection" | "form">("selection");
  const [selectedService, setSelectedService] = useState<any>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successBookingData, setSuccessBookingData] = useState<any>(null);
  const [selectedAadharUrl, setSelectedAadharUrl] = useState<string | null>(null);
  const aadharInputRef = useRef<HTMLInputElement>(null);
  const today = new Date().toISOString().split('T')[0];



  // Manual Booking Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    date: today,
    checkOutDate: today,
    checkInTime: "06:00",
    checkOutTime: "22:00",
    time: "10:00 AM",
    durationHours: 1,
    houseBookingType: "individual" as "individual" | "cluster",
    items: [] as string[],
    isStayer: false,
    roomNumber: "",
    tokenId: "",
    guests: 1,
    total_amount: 0,
    payment_method: "CASH",
    aadharFile: null as File | null
  });

  const [availability, setAvailability] = useState<any[]>([]);
  const [checkingAvailability, setCheckingAvailability] = useState(false);


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

  const checkAvailability = async () => {
    if (!formData.date || !selectedService) return;
    setCheckingAvailability(true);
    try {
      const start = formData.date;
      const end = formData.checkOutDate || formData.date;
      const startTime = formData.checkInTime || "06:00";
      const endTime = formData.checkOutTime || "22:00";
      
      const res = await fetch(`/api/availability?startDate=${start}&endDate=${end}&startTime=${startTime}&endTime=${endTime}&type=${selectedService.id}`);
      const data = await res.json();
      setAvailability(data.bookings || []);
    } catch (err) {
      console.error("Failed to check availability", err);
    } finally {
      setCheckingAvailability(false);
    }
  };

  useEffect(() => {
    if (isModalOpen && modalStep === 'form' && selectedService) {
      checkAvailability();
    }
  }, [formData.date, formData.checkOutDate, formData.checkInTime, formData.checkOutTime, selectedService, modalStep]);

  const calculateTotal = () => {
    const basePrice = selectedService?.id === 'ROOM' ? 2500 : 
                      selectedService?.id === 'HOUSE' ? 3000 : 
                      selectedService?.id === 'LEISURE' ? 350 : 0;

    let days = 1;
    if (formData.date && formData.checkOutDate && (selectedService?.id === 'ROOM' || selectedService?.id === 'HOUSE')) {
      // Combining date and time for precise calculation
      const startDateTime = new Date(`${formData.date}T${formData.checkInTime}`);
      const endDateTime = new Date(`${formData.checkOutDate}T${formData.checkOutTime}`);

      if (endDateTime > startDateTime) {
        const diffInMs = endDateTime.getTime() - startDateTime.getTime();
        const diffInHours = diffInMs / (1000 * 60 * 60);
        // Every 24-hour block (or fraction thereof) counts as a day
        days = Math.ceil(diffInHours / 24);
      } else {
        days = 1;
      }
    }

    if (selectedService?.id === 'ROOM') return formData.items.length * basePrice * days;
    if (selectedService?.id === 'HOUSE') {
      if (formData.houseBookingType === 'cluster') return 8000 * days;
      return formData.items.length * basePrice * days;
    }
    if (selectedService?.id === 'LEISURE') {
      let rate = 0;
      if (formData.items.includes('Box Cricket')) rate += 350;
      if (formData.items.includes('Swimming Pool')) rate += 400;
      return rate * formData.durationHours;
    }
    if (selectedService?.id === 'HALL') return formData.total_amount; // Manual entry for Hall
    return 0;
  };

  const isItemBooked = (item: string) => {
    return availability.some(b => {
      if (b.items?.includes(item)) return true;
      const parentCluster = HOUSE_CLUSTERS.find(c => c.houses.includes(item));
      if (parentCluster && b.items?.includes(parentCluster.name)) return true;
      const currentCluster = HOUSE_CLUSTERS.find(c => c.name === item);
      if (currentCluster && b.items?.some((bookedItem: string) => currentCluster.houses.includes(bookedItem))) return true;
      return false;
    });
  };

  const get12hPart = (time24: string) => {
    const [h, m] = (time24 || "06:00").split(":");
    let hour = parseInt(h);
    const period = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return { hour: hour.toString(), minute: m, period };
  };

  const handleTimeChange = (type: "checkInTime" | "checkOutTime", part: "hour" | "minute" | "period", value: string) => {
    const current = get12hPart(formData[type]);
    const next = { ...current, [part]: value };
    let h = parseInt(next.hour);
    if (next.period === "PM" && h < 12) h += 12;
    if (next.period === "AM" && h === 12) h = 0;
    const time24 = `${h.toString().padStart(2, "0")}:${next.minute}`;
    setFormData({ ...formData, [type]: time24 });
  };

  const toggleItem = (item: string) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.includes(item) 
        ? prev.items.filter(i => i !== item) 
        : [...prev.items, item]
    }));
  };

  const handleManualBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    let aadharUrl = "";
    try {
      // 1. Upload Aadhar if exists
      if (formData.aadharFile) {
        const uploadForm = new FormData();
        uploadForm.append("file", formData.aadharFile);
        uploadForm.append("folder", "aadhar_cards");
        const uploadRes = await fetch("/api/admin/upload", {
          method: "POST",
          body: uploadForm,
        });
        const uploadData = await uploadRes.json();
        if (uploadRes.status === 200) {
          aadharUrl = uploadData.url;
        }
      }

      // 2. Calculate duration days based on 24h cycles
      let finalDuration = formData.durationHours;
      if (selectedService?.id === "ROOM" || selectedService?.id === "HOUSE") {
        const startDateTime = new Date(`${formData.date}T${formData.checkInTime}`);
        const endDateTime = new Date(`${formData.checkOutDate}T${formData.checkOutTime}`);
        if (endDateTime > startDateTime) {
          finalDuration = Math.ceil(
            (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60 * 24)
          );
        } else {
          finalDuration = 1;
        }
      }

      const finalAmount = calculateTotal();
      const body = {
        ...formData,
        email: formData.email || "walk-in@srr.com",
        total_amount: finalAmount,
        service_type: selectedService.id,
        booking_source: "WALK_IN",
        status: "CONFIRMED",
        payment_status: "PAID",
        start_date: formData.date,
        end_date:
          selectedService.id === "ROOM" || selectedService.id === "HOUSE"
            ? formData.checkOutDate
            : formData.date,
        time_slot: formData.time,
        duration: finalDuration,
        check_in_time: formData.checkInTime,
        check_out_time: formData.checkOutTime,
        aadhar_url: aadharUrl,
      };

      // 3. Save booking
      const res = await fetch("/api/admin/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const data = await res.json();

        // 4. WhatsApp Redirect — same details as admin panel
        const waMessage = buildWhatsAppMessage({
          name: formData.name,
          phone: formData.phone,
          email: formData.email || undefined,
          guests: formData.guests,
          serviceName: selectedService?.name || selectedService?.id || "Service",
          items: formData.items,
          date: formData.date || undefined,
          checkOutDate:
            selectedService?.id === "ROOM" || selectedService?.id === "HOUSE"
              ? formData.checkOutDate
              : undefined,
          checkInTime:
            selectedService?.id === "ROOM" || selectedService?.id === "HOUSE"
              ? formData.checkInTime
              : undefined,
          checkOutTime:
            selectedService?.id === "ROOM" || selectedService?.id === "HOUSE"
              ? formData.checkOutTime
              : undefined,
          timeSlot: selectedService?.id === "LEISURE" ? formData.time : undefined,
          durationHours: formData.durationHours,
          totalAmount: finalAmount,
          paymentMethod: formData.payment_method,
          isStayer: formData.isStayer,
          roomNumber: formData.roomNumber || undefined,
          aadharUrl: aadharUrl || undefined,
          bookingId: data.id,
        });
        openWhatsApp(waMessage);

        // 5. Reset form
        setModalStep("selection");
        setSelectedService(null);
        setFormData({
          name: "",
          phone: "",
          email: "",
          date: today,
          checkOutDate: today,
          checkInTime: "06:00",
          checkOutTime: "22:00",
          time: "10:00 AM",
          durationHours: 1,
          houseBookingType: "individual",
          items: [],
          isStayer: false,
          roomNumber: "",
          tokenId: "",
          guests: 1,
          total_amount: 0,
          payment_method: "CASH",
          aadharFile: null as File | null,
        });

        // 6. Show success ticket
        setSuccessBookingData(data);
        setIsModalOpen(false);
        setIsSuccessOpen(true);
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
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">ID proof</th>
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
                      {bkg.aadhar_url ? (
                        <button 
                          onClick={() => setSelectedAadharUrl(bkg.aadhar_url || null)}
                          className="text-xs font-black text-brand-gold hover:text-brand-dark-green flex items-center gap-1.5 px-3 py-1.5 bg-brand-gold/5 rounded-lg border border-brand-gold/10 transition-all"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" /> View Aadhar
                        </button>
                      ) : (
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded">N/A</span>
                      )}
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
            <div className="absolute inset-0 bg-[#0b1a10]/60 backdrop-blur-sm" onClick={() => {
              setIsModalOpen(false);
              setModalStep("selection");
              setSelectedService(null);
            }} />
            <div className="relative bg-white w-full max-w-3xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
               <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
                <div>
                  <h2 className="text-2xl font-bold text-[#0b1a10]">
                    {modalStep === 'selection' ? 'Select Service' : `New ${selectedService?.name} Booking`}
                  </h2>
                  <p className="text-xs text-gray-400 font-medium">
                    {modalStep === 'selection' ? 'Choose the type of reservation you want to record.' : 'Enter the reservation details carefully.'}
                  </p>
                </div>
                <button onClick={() => {
                  setIsModalOpen(false);
                  setModalStep("selection");
                  setSelectedService(null);
                }} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <div className="overflow-y-auto flex-1 p-8">
                {modalStep === 'selection' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {SERVICE_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setSelectedService(opt);
                          setModalStep("form");
                          setFormData({
                            ...formData,
                            items: [],
                            total_amount: opt.id === 'LEISURE' ? 0 : (opt.id === 'HALL' ? 0 : (opt.id === 'ROOM' ? 2500 : 3000))
                          });
                        }}
                        className="group p-6 rounded-3xl border border-gray-100 hover:border-brand-gold hover:shadow-xl hover:shadow-brand-gold/10 transition-all text-left flex items-center gap-6 bg-white"
                      >
                        <div className={`w-14 h-14 rounded-2xl ${opt.bg} flex items-center justify-center shrink-0`}>
                          <opt.icon className={`w-6 h-6 ${opt.color}`} />
                        </div>
                        <div>
                          <h3 className="font-bold text-[#0b1a10] group-hover:text-brand-gold transition-colors">{opt.name}</h3>
                          <p className="text-xs text-gray-400">Record a {opt.name.toLowerCase()} reservation</p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <form onSubmit={handleManualBooking} className="space-y-8">
                    {/* Common Fields: Guest Info */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Guest Name</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input 
                            required
                            type="text" 
                            className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none font-bold text-sm" 
                            placeholder="Guest Name" 
                            value={formData.name} 
                            onChange={(e) => setFormData({...formData, name: e.target.value})} 
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Guest Phone</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input 
                            required
                            type="tel" 
                            className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none font-bold text-sm" 
                            placeholder="+91 ..." 
                            value={formData.phone} 
                            onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Guest Email</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input 
                            type="email" 
                            className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none font-bold text-sm" 
                            placeholder="guest@example.com" 
                            value={formData.email} 
                            onChange={(e) => setFormData({...formData, email: e.target.value})} 
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 pt-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1 block">Aadhar Document (Required for Stays)</label>
                      <div 
                        onClick={() => aadharInputRef.current?.click()} 
                        className="border-2 border-dashed border-gray-100 rounded-3xl p-8 text-center cursor-pointer hover:bg-gray-50 hover:border-brand-gold/30 transition-all group"
                      >
                        <input 
                          type="file" 
                          ref={aadharInputRef} 
                          className="hidden" 
                          accept="image/*,.pdf" 
                          onChange={(e) => setFormData({...formData, aadharFile: e.target.files?.[0] || null})} 
                        />
                        <Upload className="mx-auto mb-3 text-gray-300 group-hover:text-brand-gold transition-colors" size={32} />
                        <p className="text-sm font-black text-gray-800">
                          {formData.aadharFile ? (formData.aadharFile as any).name : 'Click to Upload Aadhar Card'}
                        </p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Image or PDF (Max 5MB)</p>
                      </div>
                    </div>

                    {/* Service Specific Fields */}
                    {selectedService?.id === 'ROOM' && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Check-in Date & Time</label>
                            <input type="date" min={today} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none font-bold" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
                            <div className="flex gap-2">
                              <select className="flex-1 p-2 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-bold outline-none" value={get12hPart(formData.checkInTime).hour} onChange={(e) => handleTimeChange("checkInTime", "hour", e.target.value)}>
                                {Array.from({length: 12}, (_, i) => (i + 1).toString()).map(h => <option key={h} value={h}>{h}</option>)}
                              </select>
                              <select className="flex-1 p-2 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-bold outline-none" value={get12hPart(formData.checkInTime).minute} onChange={(e) => handleTimeChange("checkInTime", "minute", e.target.value)}>
                                {["00", "15", "30", "45"].map(m => <option key={m} value={m}>{m}</option>)}
                              </select>
                              <select className="flex-1 p-2 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-bold outline-none" value={get12hPart(formData.checkInTime).period} onChange={(e) => handleTimeChange("checkInTime", "period", e.target.value)}>
                                <option value="AM">AM</option>
                                <option value="PM">PM</option>
                              </select>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Check-out Date & Time</label>
                            <input type="date" min={formData.date} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none font-bold" value={formData.checkOutDate} onChange={(e) => setFormData({...formData, checkOutDate: e.target.value})} />
                            <div className="flex gap-2">
                              <select className="flex-1 p-2 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-bold outline-none" value={get12hPart(formData.checkOutTime).hour} onChange={(e) => handleTimeChange("checkOutTime", "hour", e.target.value)}>
                                {Array.from({length: 12}, (_, i) => (i + 1).toString()).map(h => <option key={h} value={h}>{h}</option>)}
                              </select>
                              <select className="flex-1 p-2 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-bold outline-none" value={get12hPart(formData.checkOutTime).minute} onChange={(e) => handleTimeChange("checkOutTime", "minute", e.target.value)}>
                                {["00", "15", "30", "45"].map(m => <option key={m} value={m}>{m}</option>)}
                              </select>
                              <select className="flex-1 p-2 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-bold outline-none" value={get12hPart(formData.checkOutTime).period} onChange={(e) => handleTimeChange("checkOutTime", "period", e.target.value)}>
                                <option value="AM">AM</option>
                                <option value="PM">PM</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Select Rooms</label>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {FLOORS.map(f => (
                              <div key={f.name} className="space-y-2 p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{f.name}</p>
                                <div className="grid grid-cols-2 gap-2">
                                  {f.rooms.map(r => {
                                    const booked = isItemBooked(r);
                                    return (
                                      <button
                                        key={r}
                                        type="button"
                                        disabled={booked}
                                        onClick={() => toggleItem(r)}
                                        className={`p-2 text-xs font-bold border rounded-lg transition-all ${
                                          booked ? 'bg-gray-100 text-gray-300 cursor-not-allowed' :
                                          formData.items.includes(r) ? 'bg-brand-gold text-white border-brand-gold' : 'bg-white hover:border-brand-gold'
                                        }`}
                                      >
                                        {r} {booked && '(Booked)'}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedService?.id === 'HOUSE' && (
                       <div className="space-y-6">
                          <div className="flex gap-2 p-1.5 bg-gray-50 rounded-2xl w-fit border border-gray-100">
                            <button type="button" onClick={() => setFormData({...formData, houseBookingType: 'individual', items: []})} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${formData.houseBookingType === 'individual' ? 'bg-white shadow-sm text-brand-dark-green' : 'text-gray-400'}`}>Individual</button>
                            <button type="button" onClick={() => setFormData({...formData, houseBookingType: 'cluster', items: []})} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${formData.houseBookingType === 'cluster' ? 'bg-brand-gold text-white shadow-md' : 'text-gray-400'}`}>Full Cluster</button>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Check-in Date & Time</label>
                              <input type="date" min={today} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none font-bold" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
                              <div className="flex gap-2">
                                <select className="flex-1 p-2 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-bold outline-none" value={get12hPart(formData.checkInTime).hour} onChange={(e) => handleTimeChange("checkInTime", "hour", e.target.value)}>
                                  {Array.from({length: 12}, (_, i) => (i + 1).toString()).map(h => <option key={h} value={h}>{h}</option>)}
                                </select>
                                <select className="flex-1 p-2 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-bold outline-none" value={get12hPart(formData.checkInTime).minute} onChange={(e) => handleTimeChange("checkInTime", "minute", e.target.value)}>
                                  {["00", "15", "30", "45"].map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                                <select className="flex-1 p-2 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-bold outline-none" value={get12hPart(formData.checkInTime).period} onChange={(e) => handleTimeChange("checkInTime", "period", e.target.value)}>
                                  <option value="AM">AM</option>
                                  <option value="PM">PM</option>
                                </select>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Check-out Date & Time</label>
                              <input type="date" min={formData.date} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none font-bold" value={formData.checkOutDate} onChange={(e) => setFormData({...formData, checkOutDate: e.target.value})} />
                              <div className="flex gap-2">
                                <select className="flex-1 p-2 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-bold outline-none" value={get12hPart(formData.checkOutTime).hour} onChange={(e) => handleTimeChange("checkOutTime", "hour", e.target.value)}>
                                  {Array.from({length: 12}, (_, i) => (i + 1).toString()).map(h => <option key={h} value={h}>{h}</option>)}
                                </select>
                                <select className="flex-1 p-2 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-bold outline-none" value={get12hPart(formData.checkOutTime).minute} onChange={(e) => handleTimeChange("checkOutTime", "minute", e.target.value)}>
                                  {["00", "15", "30", "45"].map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                                <select className="flex-1 p-2 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-bold outline-none" value={get12hPart(formData.checkOutTime).period} onChange={(e) => handleTimeChange("checkOutTime", "period", e.target.value)}>
                                  <option value="AM">AM</option>
                                  <option value="PM">PM</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          {formData.houseBookingType === 'individual' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {HOUSE_CLUSTERS.map(c => (
                                <div key={c.name} className="space-y-2 p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{c.name.split(' ')[0]} {c.name.split(' ')[1]}</p>
                                  <div className="grid grid-cols-3 gap-2">
                                    {c.houses.map(h => {
                                      const booked = isItemBooked(h);
                                      return (
                                        <button
                                          key={h}
                                          type="button"
                                          disabled={booked}
                                          onClick={() => toggleItem(h)}
                                          className={`p-2 text-xs font-bold border rounded-lg transition-all ${
                                            booked ? 'bg-gray-100 text-gray-300 cursor-not-allowed' :
                                            formData.items.includes(h) ? 'bg-brand-gold text-white border-brand-gold' : 'bg-white hover:border-brand-gold'
                                          }`}
                                        >
                                          {h.split(' ')[1]}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 gap-4">
                               {HOUSE_CLUSTERS.map(c => {
                                 const booked = c.houses.some(h => isItemBooked(h));
                                 return (
                                   <button 
                                      key={c.name}
                                      type="button"
                                      disabled={booked}
                                      onClick={() => setFormData({...formData, items: [c.name]})}
                                      className={`p-6 text-center border-2 rounded-2xl transition-all ${
                                        booked ? 'bg-gray-50 border-gray-100 opacity-50 cursor-not-allowed' :
                                        formData.items.includes(c.name) ? 'bg-brand-gold border-brand-gold text-white shadow-lg' : 'bg-white border-gray-100 hover:border-brand-gold'
                                      }`}
                                   >
                                      <p className="font-bold">{c.name.split(' (')[0]}</p>
                                      <p className="text-[10px] opacity-70">Full Cluster Access</p>
                                   </button>
                                 );
                               })}
                            </div>
                          )}
                       </div>
                    )}

                    {selectedService?.id === 'LEISURE' && (
                       <div className="space-y-6">
                          <div className="flex gap-4">
                            <div className="flex-1 space-y-2">
                              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Date</label>
                              <input type="date" min={today} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none font-bold" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
                            </div>
                            <div className="flex-1 space-y-2">
                              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Time Slot</label>
                              <select className="w-full p-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none font-bold" value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})}>
                                {Array.from({length: 12}, (_, i) => 9 + i).map(h => {
                                  const label = `${h > 12 ? h-12 : h}:00 ${h >= 12 ? 'PM' : 'AM'}`;
                                  return <option key={h} value={label}>{label}</option>;
                                })}
                              </select>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Activities</label>
                            <div className="grid grid-cols-2 gap-3">
                               {['Swimming Pool', 'Box Cricket'].map(act => (
                                 <button key={act} type="button" onClick={() => toggleItem(act)} className={`py-4 rounded-2xl border font-bold transition-all ${formData.items.includes(act) ? 'bg-brand-gold text-white border-brand-gold shadow-lg shadow-brand-gold/20' : 'bg-white border-gray-100 hover:border-brand-gold'}`}>{act}</button>
                               ))}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Duration (Hours)</label>
                            <input type="number" min="1" max="12" className="w-full p-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none font-bold" value={formData.durationHours} onChange={(e) => setFormData({...formData, durationHours: parseInt(e.target.value) || 1})} />
                          </div>
                       </div>
                    )}

                    {selectedService?.id === 'HALL' && (
                       <div className="space-y-6">
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Event Date</label>
                            <input type="date" min={today} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none font-bold" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Event Details / Notes</label>
                            <textarea rows={3} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold" placeholder="Wedding/Conference details..." value={formData.tokenId} onChange={(e) => setFormData({...formData, tokenId: e.target.value})} />
                          </div>
                       </div>
                    )}

                    {/* Guest Count and Payment Method */}
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Total Guests</label>
                        <input type="number" min="1" className="w-full p-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none font-bold" value={formData.guests} onChange={(e) => setFormData({...formData, guests: parseInt(e.target.value) || 1})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Payment Method</label>
                        <div className="w-full p-3.5 bg-gray-50 border border-gray-100 rounded-xl font-bold text-[#0b1a10]">
                          Cash
                        </div>
                      </div>
                    </div>

                    {/* Summary and Submit */}
                    <div className="p-6 bg-[#0b1a10]/5 rounded-3xl border border-[#0b1a10]/10 flex flex-col md:flex-row justify-between items-center gap-4">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#0b1a10]/40">Total Amount to Collect</p>
                        <p className="text-3xl font-black text-brand-sunset-start">₹{selectedService?.id === 'HALL' ? (
                          <input type="number" className="bg-transparent border-b border-brand-sunset-start outline-none w-32" value={formData.total_amount} onChange={(e) => setFormData({...formData, total_amount: parseInt(e.target.value) || 0})} />
                        ) : calculateTotal().toLocaleString()}</p>
                      </div>
                      <div className="flex gap-3 w-full md:w-auto">
                        <button 
                          type="button" 
                          onClick={() => {
                            setModalStep("selection");
                            setSelectedService(null);
                          }}
                          className="flex-1 px-8 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-all"
                        >
                          Back
                        </button>
                        <button 
                          disabled={formLoading || (formData.items.length === 0 && selectedService?.id !== 'HALL')}
                          className="flex-[2] bg-brand-sunset-start text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-xl shadow-brand-sunset-start/20 disabled:opacity-50"
                        >
                          {formLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                            <>
                              <CheckCircle2 className="w-5 h-5 text-white" /> Confirm Booking
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
      {/* Aadhar Viewer Modal */}
      <AnimatePresence>
        {selectedAadharUrl && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-10">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setSelectedAadharUrl(null)}
              className="absolute inset-0 bg-brand-dark-green/90 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white rounded-[2.5rem] overflow-hidden shadow-2xl w-full max-w-4xl max-h-full flex flex-col"
            >
               <div className="p-6 border-b border-gray-100 flex justify-between items-center shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-gold/10 rounded-xl">
                      <ShieldCheck className="w-5 h-5 text-brand-gold" />
                    </div>
                    <p className="text-xl font-black text-brand-dark-green uppercase tracking-tighter">Guest Aadhar Card</p>
                  </div>
                  <button onClick={() => setSelectedAadharUrl(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <X />
                  </button>
               </div>
               <div className="flex-1 overflow-auto bg-gray-100 p-4 md:p-8 flex items-center justify-center min-h-[400px]">
                  {selectedAadharUrl && (() => {
                    const url = selectedAadharUrl;
                    const isPdf = url.toLowerCase().endsWith('.pdf');

                    // Cloudinary stores PDFs under /image/upload/.
                    // Changing .pdf → .jpg triggers Cloudinary's first-page render.
                    // This avoids the 401 that Cloudinary gives for direct PDF serves.
                    const displayUrl = isPdf
                      ? url.replace(/\.pdf$/i, '.jpg')
                      : url;

                    return (
                      <img
                        src={displayUrl}
                        alt="Aadhar Card"
                        className="max-w-full h-auto rounded-xl shadow-lg border border-white"
                        onError={(e) => {
                          // If even the JPG conversion fails, show a friendly fallback
                          const img = e.target as HTMLImageElement;
                          img.style.display = 'none';
                          const msg = document.createElement('div');
                          msg.className = 'text-center p-8 text-gray-500';
                          msg.innerHTML = `
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                            <p class="font-bold text-sm">Preview not available</p>
                            <p class="text-xs mt-1">Use the button below to open the original file.</p>
                          `;
                          img.parentElement?.appendChild(msg);
                        }}
                      />
                    );
                  })()}
               </div>
               <div className="p-6 bg-gray-50 border-t border-gray-100 text-center shrink-0">
                  <a 
                    href={selectedAadharUrl
                      ? `/api/admin/aadhar-download?url=${encodeURIComponent(selectedAadharUrl)}`
                      : '#'}
                    className="inline-flex items-center gap-2 bg-brand-dark-green text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download PDF
                  </a>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Ticket Modal */}

      <AnimatePresence>
        {isSuccessOpen && (
          <BookingTicket 
            booking={successBookingData} 
            onClose={() => setIsSuccessOpen(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
