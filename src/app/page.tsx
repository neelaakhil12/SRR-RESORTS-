"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { 
  Star, 
  ArrowRight, 
  ShieldCheck, 
  Heart, 
  MapPin, 
  Phone, 
  Mail, 
  Building2, 
  Home as HomeIcon, 
  Calendar, 
  Clock,
  Search,
  Waves,
  PartyPopper,
  CheckCircle2,
  Plus,
  Minus,
  X,
  ChevronDown,
  Navigation,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SERVICES_DETAILS = [
  { 
    id: "ROOM",
    title: "Luxury Rooms", 
    count: "12 units", 
    icon: Building2, 
    img: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1000&auto=format&fit=crop",
    points: [
      "Premium floor options (Level A, B, C)",
      "Private pool view architectures",
      "Dedicated room service & cleanup",
      "Complimentary organic breakfast",
      "Modern climate control systems",
      "Smart TV & High-speed fiber WiFi",
      "Priority access to Box Cricket"
    ]
  },
  { 
    id: "HOUSE",
    title: "Independent Houses", 
    count: "6 units", 
    icon: HomeIcon, 
    img: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=1000&auto=format&fit=crop",
    points: [
      "Private individual nature cottages",
      "Full-cluster booking options (3 houses)",
      "Private Bonfire pits (Cluster A)",
      "Premium Foot Pool experience (Cluster B)",
      "Nature-immersed living spaces",
      "Spacious 2-bedroom configurations",
      "Personal assistance on-call"
    ]
  },
  { 
    id: "HALL",
    title: "Convention Hall", 
    count: "1 venue", 
    icon: Calendar, 
    img: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1000&auto=format&fit=crop",
    points: [
      "Massive 1000+ guest capacity",
      "Strict one-event policy for privacy",
      "Lush garden for outdoor cocktails",
      "State-of-the-art Sound & LED logic",
      "Integrated catering & kitchen zone",
      "Luxurious air-conditioned bridal suite",
      "High-security parking lot"
    ]
  },
  { 
    id: "LEISURE",
    title: "Sports & Leisure Activities", 
    count: "Multiple", 
    icon: Waves, 
    img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1000&auto=format&fit=crop",
    points: [
      "Professional-grade Box Cricket turf",
      "Temperature-controlled Swimming Pool",
      "All sports gear included on request",
      "Certified lifeguards on-site",
      "Deluxe changing & locker rooms",
      "Daily & hourly slots available",
      "Poolside refreshments bar access"
    ]
  }
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

export default function Home() {
  const router = useRouter();
  const today = new Date().toISOString().split('T')[0];
  
  // Booking State
  const [serviceType, setServiceType] = useState("Select Service");
  const [activePopover, setActivePopover] = useState<string | null>(null);
  const [selectedQuickView, setSelectedQuickView] = useState<typeof SERVICES_DETAILS[0] | null>(null);
  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState("");
  const [checkInTime, setCheckInTime] = useState({ hour: "10", minute: "00", period: "AM" });
  const [checkOutTime, setCheckOutTime] = useState({ hour: "06", minute: "00", period: "PM" });
  
  const handleSearch = () => {
    if (serviceType === "Select Service") {
      router.push("/services");
      return;
    }

    const params = new URLSearchParams({
      type: serviceType.toLowerCase().replace(/\s+/g, '-'),
      checkIn: checkIn || "",
      checkOut: checkOut || "",
      checkInTime: `${checkInTime.hour}:${checkInTime.minute} ${checkInTime.period}`,
      checkOutTime: `${checkOutTime.hour}:${checkOutTime.minute} ${checkOutTime.period}`
    });
    router.push(`/services?${params.toString()}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section - Booking.com Style Header Integrated */}
      <section className="relative w-full min-h-[620px] md:min-h-[900px] flex items-center justify-center bg-[url('/hero.png')] bg-cover bg-[50%_20%] text-white overflow-visible mb-28 md:mb-16">
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center pt-20 md:pt-0">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-6xl font-bold tracking-tight mb-4 leading-tight drop-shadow-lg"
          >
            Your Private Paradise <br/> Awaits at SRR Resorts
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-2xl mb-12 font-medium text-white/90 drop-shadow-md"
          >
            Luxury stays, grand events & nature escapes — all in one exclusive destination
          </motion.p>
          
          {/* SRR Booking Bar - The Focal Point */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-6xl z-30"
          >
            <div className="bg-brand-gold p-1 rounded-xl shadow-2xl relative">
              <div className="bg-white rounded-[10px] p-2 md:p-1 flex flex-col md:flex-row items-stretch gap-1 md:h-16">
                
                {/* Service Type Selection */}
                <div 
                  onClick={() => setActivePopover(activePopover === "service" ? null : "service")}
                  className={`flex-1 flex items-center gap-3 px-4 py-3 md:py-0 border-b md:border-b-0 md:border-r border-gray-100 group cursor-pointer hover:bg-gray-50 transition-colors relative rounded-l-md ${activePopover === 'service' ? 'bg-gray-50' : ''}`}
                >
                  <div className={`p-2 rounded-lg transition-colors ${serviceType === 'Select Service' ? 'bg-gray-100 text-gray-400' : 'bg-brand-dark-green/5 text-brand-dark-green'}`}>
                    {serviceType === 'Luxury Rooms' && <Building2 className="w-5 h-5" />}
                    {serviceType === 'Independent Houses' && <HomeIcon className="w-5 h-5" />}
                    {serviceType === 'Convention Hall' && <Calendar className="w-5 h-5" />}
                    {serviceType === 'Sports & Leisure Activities' && <Waves className="w-5 h-5" />}
                    {serviceType === 'Select Service' && <Plus className="w-5 h-5" />}
                  </div>
                  <div className="flex flex-col text-left flex-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Service Type</span>
                    <div className="flex items-center justify-between gap-1">
                      <span className={`text-sm font-bold truncate ${serviceType === 'Select Service' ? 'text-gray-400' : 'text-brand-dark-green'}`}>
                        {serviceType}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${activePopover === 'service' ? 'rotate-180' : ''}`} />
                    </div>
                  </div>

                  {/* Service Selection Popover */}
                  <AnimatePresence>
                    {activePopover === "service" && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        onClick={(e) => e.stopPropagation()}
                        className="absolute top-full left-0 mt-2 w-[280px] bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 z-50 overflow-hidden"
                      >
                        {[
                          { name: 'Luxury Rooms', icon: Building2, desc: '12 premium rooms across 3 floors' },
                          { name: 'Independent Houses', icon: HomeIcon, desc: 'Private stays with bonfire & water body' },
                          { name: 'Convention Hall', icon: Calendar, desc: '1000+ capacity for grand events' },
                          { name: 'Sports & Leisure Activities', icon: Waves, desc: 'Pool & Box Cricket for day visitors' }
                        ].map((item) => (
                          <div
                            key={item.name}
                            onClick={() => {
                              setServiceType(item.name);
                              setActivePopover(null);
                            }}
                            className={`flex items-start gap-3 p-3 rounded-xl transition-all cursor-pointer hover:bg-gray-50 group/item ${serviceType === item.name ? 'bg-brand-dark-green/5' : ''}`}
                          >
                            <div className={`p-2 rounded-lg ${serviceType === item.name ? 'bg-brand-dark-green text-white' : 'bg-gray-100 text-gray-400 group-hover/item:bg-brand-gold/20 group-hover/item:text-brand-gold'}`}>
                              <item.icon className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col">
                              <span className={`text-sm font-bold ${serviceType === item.name ? 'text-brand-dark-green' : 'text-gray-700'}`}>
                                {item.name}
                              </span>
                              <span className="text-[10px] text-gray-400 leading-tight">
                                {item.desc}
                              </span>
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Date Selection */}
                <div 
                  onClick={() => setActivePopover(activePopover === "dates" ? null : "dates")}
                  className={`flex-1 flex items-center gap-3 px-4 py-3 md:py-0 border-b md:border-b-0 md:border-r border-gray-100 group cursor-pointer hover:bg-gray-50 transition-colors relative ${activePopover === 'dates' ? 'bg-gray-50' : ''}`}
                >
                  <Calendar className="w-5 h-5 text-gray-400 group-hover:text-brand-dark-green transition-colors" />
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Check-in — Check-out</span>
                    <span className="text-sm font-bold text-brand-dark-green">
                      {checkIn && checkOut 
                        ? `${format(new Date(checkIn), 'MMM dd')} - ${format(new Date(checkOut), 'MMM dd')}`
                        : "Select Dates"}
                    </span>
                  </div>

                  {/* Date Picker Popover */}
                  <AnimatePresence>
                    {activePopover === "dates" && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        onClick={(e) => e.stopPropagation()}
                        className="absolute top-full left-0 mt-2 w-[320px] bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 z-50 overflow-hidden"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-bold text-brand-dark-green">Select Stay Dates</h4>
                          <button onClick={() => setActivePopover(null)} className="p-1 hover:bg-gray-100 rounded-full">
                            <X className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase">Check-in</label>
                            <input 
                              type="date" 
                              min={today}
                              value={checkIn}
                              onChange={(e) => setCheckIn(e.target.value)}
                              className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-brand-sunset-start transition-all font-bold text-brand-dark-green"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase">Check-out</label>
                            <input 
                              type="date" 
                              min={checkIn || today}
                              value={checkOut}
                              onChange={(e) => setCheckOut(e.target.value)}
                              className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-brand-sunset-start transition-all font-bold text-brand-dark-green"
                            />
                          </div>
                          <button 
                            onClick={() => setActivePopover(null)}
                            className="w-full bg-brand-dark-green text-white py-3 rounded-xl font-bold mt-2"
                          >
                            Set Dates
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Time Selection - Hidden for Convention Hall */}
                {serviceType !== 'Convention Hall' && (
                  <div 
                    onClick={() => setActivePopover(activePopover === "times" ? null : "times")}
                    className={`flex-1 flex items-center gap-3 px-4 py-3 md:py-0 border-b md:border-b-0 md:border-r border-gray-100 group cursor-pointer hover:bg-gray-50 transition-colors relative ${activePopover === 'times' ? 'bg-gray-50' : ''}`}
                  >
                    <Clock className="w-5 h-5 text-gray-400 group-hover:text-brand-dark-green transition-colors" />
                    <div className="flex flex-col text-left">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Select Time</span>
                      <span className="text-sm font-bold text-brand-dark-green">
                        {checkInTime.hour}:{checkInTime.minute} {checkInTime.period} - {checkOutTime.hour}:{checkOutTime.minute} {checkOutTime.period}
                      </span>
                    </div>

                    {/* Time Picker Popover */}
                    <AnimatePresence>
                      {activePopover === "times" && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          onClick={(e) => e.stopPropagation()}
                          className="absolute top-full right-0 md:left-0 mt-2 w-[340px] bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 z-50 overflow-hidden"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-bold text-brand-dark-green text-sm flex items-center gap-2">
                              <Clock className="w-4 h-4 text-brand-gold" /> Select Booking Time
                            </h4>
                            <button onClick={() => setActivePopover(null)} className="p-1 hover:bg-gray-100 rounded-full">
                              <X className="w-4 h-4 text-gray-400" />
                            </button>
                          </div>
                          
                          <div className="space-y-6">
                            {/* From Time Selector */}
                            <div className="space-y-3">
                              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block border-b border-gray-50 pb-1">Arrival Time</label>
                              <div className="flex items-center gap-2">
                                {/* Hours Select */}
                                <select 
                                  value={checkInTime.hour}
                                  onChange={(e) => setCheckInTime({...checkInTime, hour: e.target.value})}
                                  className="flex-1 p-2 bg-white border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-brand-gold text-sm font-bold shadow-sm text-brand-dark-green"
                                >
                                  {Array.from({length: 12}, (_, i) => (i + 1).toString().padStart(2, '0')).map(h => (
                                    <option key={h} value={h} className="text-brand-dark-green">{h}</option>
                                  ))}
                                </select>
                                <span className="font-bold text-gray-300">:</span>
                                {/* Minutes Select */}
                                <select 
                                  value={checkInTime.minute}
                                  onChange={(e) => setCheckInTime({...checkInTime, minute: e.target.value})}
                                  className="flex-1 p-2 bg-white border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-brand-gold text-sm font-bold shadow-sm text-brand-dark-green"
                                >
                                  {["00", "15", "30", "45"].map(m => (
                                    <option key={m} value={m} className="text-brand-dark-green">{m}</option>
                                  ))}
                                </select>
                                {/* AM/PM PM Selector */}
                                <div className="flex p-0.5 bg-gray-100 rounded-lg">
                                  {["AM", "PM"].map(p => (
                                    <button
                                      key={p}
                                      onClick={() => setCheckInTime({...checkInTime, period: p})}
                                      className={`px-3 py-1.5 text-[10px] font-black rounded-md transition-all ${checkInTime.period === p ? 'bg-white text-brand-dark-green shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                      {p}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* To Time Selector */}
                            <div className="space-y-3">
                              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block border-b border-gray-50 pb-1">Departure Time</label>
                              <div className="flex items-center gap-2">
                                <select 
                                  value={checkOutTime.hour}
                                  onChange={(e) => setCheckOutTime({...checkOutTime, hour: e.target.value})}
                                  className="flex-1 p-2 bg-white border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-brand-gold text-sm font-bold shadow-sm text-brand-dark-green"
                                >
                                  {Array.from({length: 12}, (_, i) => (i + 1).toString().padStart(2, '0')).map(h => (
                                    <option key={h} value={h} className="text-brand-dark-green">{h}</option>
                                  ))}
                                </select>
                                <span className="font-bold text-gray-300">:</span>
                                <select 
                                  value={checkOutTime.minute}
                                  onChange={(e) => setCheckOutTime({...checkOutTime, minute: e.target.value})}
                                  className="flex-1 p-2 bg-white border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-brand-gold text-sm font-bold shadow-sm text-brand-dark-green"
                                >
                                  {["00", "15", "30", "45"].map(m => (
                                    <option key={m} value={m} className="text-brand-dark-green">{m}</option>
                                  ))}
                                </select>
                                <div className="flex p-0.5 bg-gray-100 rounded-lg">
                                  {["AM", "PM"].map(p => (
                                    <button
                                      key={p}
                                      onClick={() => setCheckOutTime({...checkOutTime, period: p})}
                                      className={`px-3 py-1.5 text-[10px] font-black rounded-md transition-all ${checkOutTime.period === p ? 'bg-white text-brand-dark-green shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                      {p}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                            
                            <button
                              onClick={() => setActivePopover(null)}
                              className="w-full bg-brand-dark-green text-white py-3 rounded-xl font-bold mt-2 hover:bg-black transition-all"
                            >
                              Confirm Time
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Search Button */}
                <button 
                  onClick={handleSearch}
                  className="bg-brand-dark-green hover:bg-black text-white px-8 py-4 md:py-0 rounded-lg font-bold transition-all flex items-center justify-center gap-2 active:scale-95 m-1"
                >
                  <Search className="w-5 h-5" />
                  <span>Search</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Browse by Service Type - The Property Grid */}
      <section className="py-16 px-4 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-dark-green mb-8">Browse by service type</h2>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {SERVICES_DETAILS.map((s, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative flex flex-col"
              >
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-3 border border-gray-100 shadow-sm transition-transform duration-500 group-hover:shadow-md">
                  <img src={s.img} alt={s.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button 
                      onClick={() => setSelectedQuickView(s)}
                      className="bg-white text-brand-dark-green px-4 py-2 rounded-full text-xs font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                    >
                      View More
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-brand-dark-green text-sm md:text-base group-hover:text-brand-sunset-start transition-colors">{s.title}</h3>
                    <p className="text-xs text-gray-500">{s.count}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section - "Why Choose Us" Style */}
      <section className="py-16 px-4 bg-brand-dark-green text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-sunset-start/10 rounded-full blur-3xl -mr-48 -mt-48" />
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">
          <div className="flex-1 space-y-8">
            <div className="inline-block px-4 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-widest text-brand-gold">
              SRR Excellence
            </div>
            <h2 className="text-3xl md:text-5xl font-bold leading-tight">Experience Nature's Luxury <br/> at its Finest</h2>
            <p className="text-white/70 text-lg leading-relaxed max-w-xl">
              SRR Resort and Convention stands as a beacon of hospitality, offering a unique blend of modern comfort and natural serenity. Purity you can trust in every experience.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-brand-gold shrink-0" />
                <div>
                  <h4 className="font-bold text-white">Unmatched Privacy</h4>
                  <p className="text-sm text-white/50">One event at a time policy</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-brand-gold shrink-0" />
                <div>
                  <h4 className="font-bold text-white">Nature Immersed</h4>
                  <p className="text-sm text-white/50">Private bonfires & water bodies</p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Link href="/about" className="inline-flex items-center gap-2 bg-brand-gold text-brand-dark-green px-8 py-4 rounded-xl font-bold hover:bg-white transition-all active:scale-95 shadow-xl shadow-black/20">
                Learn More About Us <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
          
          <div className="flex-1 w-full max-w-xl">
            <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden border-8 border-white/5 shadow-2xl skew-y-2 hover:skew-y-0 transition-transform duration-700">
              <img src="/about.png" alt="Resort experience" className="w-full h-full object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark-green/60 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Offers / Deals Section - Booking.com Look */}
      <section className="py-16 px-4 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-brand-dark-green mb-2">Explore SRR Resorts</h2>
              <p className="text-gray-500">Discover the perfect spot for your next escape</p>
            </div>
            <Link href="/services" className="text-brand-sunset-start font-bold flex items-center gap-1 hover:gap-2 transition-all">
              See all deals <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Weekend Getaway", price: "Starts from ₹4,999", tag: "Most Popular", img: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1000&auto=format&fit=crop" },
              { title: "Grand Wedding Package", price: "Custom Pricing", tag: "Special Event", img: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1000&auto=format&fit=crop" },
              { title: "Day Outing Relax", price: "Starts from ₹1,200", tag: "Limited Time", img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1000&auto=format&fit=crop" }
            ].map((offer, idx) => (
              <div key={idx} className="group relative rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-500 cursor-pointer">
                <div className="h-64 relative overflow-hidden">
                  <img src={offer.img} alt={offer.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  <div className="absolute top-4 left-4 bg-brand-sunset-start text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
                    {offer.tag}
                  </div>
                </div>
                <div className="p-6 bg-white">
                  <h3 className="font-bold text-xl text-brand-dark-green mb-1">{offer.title}</h3>
                  <p className="text-sm font-bold text-brand-sunset-start">{offer.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrated Contact Section */}
      <section className="py-20 px-4 bg-srr-light-gray">
        <div className="max-w-6xl mx-auto bg-white rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row border border-gray-100">
          <div className="flex-1 bg-brand-dark-green p-10 md:p-16 text-white space-y-8">
            <h2 className="text-4xl font-bold leading-tight">Need help with your <br/>booking?</h2>
            <p className="text-white/60">Our hospitality team is available 24/7 to assist you with your requirements.</p>
            
            <div className="space-y-6 pt-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
                  <Phone className="w-5 h-5 text-brand-gold" />
                </div>
                <div>
                  <p className="text-xs text-white/40 uppercase font-black tracking-widest">Call us</p>
                  <p className="font-bold">+91 77021 99889</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
                  <Mail className="w-5 h-5 text-brand-gold" />
                </div>
                <div>
                  <p className="text-xs text-white/40 uppercase font-black tracking-widest">Email us</p>
                  <p className="font-bold">srrresorts@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
                  <MapPin className="w-5 h-5 text-brand-gold" />
                </div>
                <div>
                  <p className="text-xs text-white/40 uppercase font-black tracking-widest">Visit us</p>
                  <p className="font-bold">Lakkarm, Choutuppal, 508252</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex-1 p-10 md:p-16">
            <form className="space-y-6">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Your Name</label>
                <input type="text" className="w-full border-b-2 border-gray-100 py-3 focus:border-brand-gold outline-none transition-colors font-medium text-brand-dark-green" placeholder="John Doe" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Email Address</label>
                <input type="email" className="w-full border-b-2 border-gray-100 py-3 focus:border-brand-gold outline-none transition-colors font-medium text-brand-dark-green" placeholder="john@example.com" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">How can we help?</label>
                <textarea rows={3} className="w-full border-b-2 border-gray-100 py-3 focus:border-brand-gold outline-none transition-colors font-medium text-brand-dark-green resize-none" placeholder="Tell us about your plans..." />
              </div>
              <button className="w-full bg-brand-sunset-start hover:bg-brand-sunset-end text-white font-bold py-5 rounded-xl transition-all active:scale-95 shadow-lg shadow-brand-sunset-start/20">
                Send Inquiry
              </button>
            </form>
          </div>
        </div>
      </section>
      {/* Quick View Modal */}
      <AnimatePresence>
        {selectedQuickView && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedQuickView(null)}
              className="absolute inset-0 bg-brand-dark-green/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl"
            >
              <button 
                onClick={() => setSelectedQuickView(null)}
                className="absolute top-6 right-6 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-brand-dark-green transition-all z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="h-48 relative">
                <img src={selectedQuickView.img} className="w-full h-full object-cover" alt={selectedQuickView.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-8">
                  <h3 className="text-3xl font-bold text-white">{selectedQuickView.title}</h3>
                  <p className="text-brand-gold font-bold text-sm tracking-widest uppercase">{selectedQuickView.count}</p>
                </div>
              </div>

              <div className="p-8 md:p-10">
                <h4 className="text-brand-dark-green font-bold text-lg mb-6 flex items-center gap-2">
                  <Info className="w-5 h-5 text-brand-gold" /> Service Highlights
                </h4>
                <div className="grid grid-cols-1 gap-4 mb-10">
                  {selectedQuickView.points.map((point, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 + 0.3 }}
                      className="flex items-center gap-3"
                    >
                      <CheckCircle2 className="w-5 h-5 text-brand-gold shrink-0" />
                      <span className="text-gray-600 font-medium">{point}</span>
                    </motion.div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setServiceType(selectedQuickView.title);
                    setSelectedQuickView(null);
                    // Standard search logic will execute on navigate
                    const params = new URLSearchParams({
                      type: selectedQuickView.title.toLowerCase().replace(/\s+/g, '-').replace('&', '-and-'),
                      checkIn: checkIn || today,
                      checkOut: checkOut || "",
                      checkInTime: `${checkInTime.hour}:${checkInTime.minute} ${checkInTime.period}`,
                      checkOutTime: `${checkOutTime.hour}:${checkOutTime.minute} ${checkOutTime.period}`
                    });
                    router.push(`/services?${params.toString()}`);
                  }}
                  className="w-full bg-sunset-gradient text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-brand-sunset-start/20 hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  Book This Service <ArrowRight className="w-5 h-5" />
                </button>

                <p className="text-center text-xs text-gray-400 mt-6 flex items-center justify-center gap-1">
                   <ShieldCheck className="w-3 h-3 text-brand-gold" /> Exclusive SRR Hospitality Standard
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

