"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
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

// Types for dynamic data
interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  points: string[] | any;
  count_info: string;
}

interface GalleryImage {
  id: string;
  url: string;
  title: string;
  category: string;
}

interface HeroSettings {
  title: string;
  subtitle: string;
  backgroundImage: string;
  ctaText: string;
}

const iconMap: Record<string, any> = {
  ROOM: Building2,
  HOUSE: HomeIcon,
  HALL: Calendar,
  LEISURE: Waves
};

const SERVICES_DETAILS = [
  { 
    id: "ROOM",
    title: "Luxury Rooms", 
    count: "12 units", 
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

// Fallback gallery shown until DB has images
const FALLBACK_GALLERY = [
  { id: "g1", title: "Luxury Rooms", category: "Rooms", url: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1000&auto=format&fit=crop" },
  { id: "g2", title: "Grand Convention Hall", category: "Events", url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1000&auto=format&fit=crop" },
  { id: "g3", title: "Swimming Pool", category: "Leisure", url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1000&auto=format&fit=crop" }
];

// Fallback services shown until DB has data
const FALLBACK_SERVICES: Service[] = [
  { id: "s1", name: "Luxury Rooms", description: "Premium stay experience", price: 2500, category: "ROOM", image_url: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1000&auto=format&fit=crop", count_info: "12 units", points: SERVICES_DETAILS[0].points },
  { id: "s2", name: "Independent Houses", description: "Private nature retreats", price: 3000, category: "HOUSE", image_url: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=1000&auto=format&fit=crop", count_info: "6 units", points: SERVICES_DETAILS[1].points },
  { id: "s3", name: "Convention Hall", description: "Premium event venue", price: 0, category: "HALL", image_url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1000&auto=format&fit=crop", count_info: "1 venue", points: SERVICES_DETAILS[2].points },
  { id: "s4", name: "Sports & Leisure Activities", description: "Recreation & fun", price: 350, category: "LEISURE", image_url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1000&auto=format&fit=crop", count_info: "Multiple", points: SERVICES_DETAILS[3].points },
];

export default function HomeContent() {
  const router = useRouter();
  const { data: session } = useSession();
  const today = new Date().toISOString().split('T')[0];
  
  // Dynamic Data State
  const [services, setServices] = useState<Service[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [hero, setHero] = useState<HeroSettings>({
    title: "Welcome to SRR",
    subtitle: "Where Comfort Meets Luxury",
    backgroundImage: "/hero.png",
    ctaText: "Book Now"
  });
  const [offerings, setOfferings] = useState({
    badge: "Our Offerings",
    titlePart1: "Browse by",
    titlePart2: "service type"
  });

  // Booking State
  const [serviceType, setServiceType] = useState("Select Service");
  const [activePopover, setActivePopover] = useState<string | null>(null);
  const [selectedQuickView, setSelectedQuickView] = useState<Service | null>(null);
  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState("");
  const [checkInTime, setCheckInTime] = useState({ hour: "10", minute: "00", period: "AM" });
  const [checkOutTime, setCheckOutTime] = useState({ hour: "06", minute: "00", period: "PM" });
  const [isExpanded, setIsExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch Services
      const sRes = await fetch("/api/admin/services");
      const sData = await sRes.json();
      if (Array.isArray(sData) && sData.length > 0) {
        setServices(sData);
      } else {
        setServices(FALLBACK_SERVICES);
      }

      // Fetch Gallery
      const gRes = await fetch("/api/admin/gallery");
      const gData = await gRes.json();
      if (Array.isArray(gData) && gData.length > 0) {
        setGallery(gData.slice(0, 3));
      } else {
        setGallery(FALLBACK_GALLERY);
      }

      // Fetch Hero
      const hRes = await fetch("/api/settings?key=hero"); // Using public API
      const hData = await hRes.json();
      if (hData?.value) setHero(hData.value);

      // Fetch Offerings Settings
      const oRes = await fetch("/api/settings?key=offerings"); // Using public API
      const oData = await oRes.json();
      if (oData?.value) setOfferings(oData.value);

    } catch (err) {
      console.error("Failed to fetch dynamic content", err);
      setServices(FALLBACK_SERVICES);
      setGallery(FALLBACK_GALLERY);
    }
  };
  
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
      {/* Hero Section */}
      <section 
        className={`relative w-full h-[56.25vw] min-h-[220px] md:h-auto md:min-h-[900px] flex items-center justify-center bg-cover bg-center md:bg-[50%_20%] text-white overflow-visible ${isExpanded ? 'mb-44' : 'mb-2'} md:mb-16 transition-all duration-500`}
        style={{ backgroundImage: `url('${hero.backgroundImage || "/hero.png"}')` }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center pt-2 md:pt-0">
          <div className="flex flex-col items-center mb-10 md:mb-16">
            <motion.div 
              className="text-sm md:text-5xl font-extrabold tracking-[0.2em] md:tracking-[0.3em] uppercase mb-4 text-brand-gold drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
              initial="hidden"
              animate="visible"
            >
              {mounted ? (hero.title || "").split("").map((char, index) => (
                <motion.span
                  key={index}
                  variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1 }
                  }}
                  transition={{ duration: 0.1, delay: index * 0.08 }}
                >
                  {char}
                </motion.span>
              )) : (hero.title || "")}
            </motion.div>

            <motion.div 
              className="text-xs md:text-2xl font-medium tracking-widest text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] italic"
              initial="hidden"
              animate="visible"
            >
              {mounted ? (hero.subtitle || "").split("").map((char, index) => (
                <motion.span
                  key={index}
                  variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1 }
                  }}
                  transition={{ duration: 0.1, delay: (index * 0.06) + 1.2 }}
                >
                  {char}
                </motion.span>
              )) : (hero.subtitle || "")}
            </motion.div>
          </div>
          
          {/* Booking Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="absolute top-[92%] md:top-auto md:-bottom-16 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-6xl z-30 transition-all duration-500"
          >
            <div className="bg-brand-gold p-1 rounded-xl shadow-2xl relative">
              <div className="bg-white rounded-[10px] p-1.5 md:p-1 flex flex-col md:flex-row items-stretch gap-0.5 md:gap-1 md:h-16">
                
                <div className="flex items-stretch flex-1 gap-0.5">
                  <div 
                    onClick={() => setActivePopover(activePopover === "service" ? null : "service")}
                    className={`flex-1 flex items-center gap-2 md:gap-3 px-3 py-2 md:px-4 md:py-0 border-b md:border-b-0 md:border-r border-gray-100 group cursor-pointer hover:bg-gray-50 transition-colors relative rounded-l-md ${activePopover === 'service' ? 'bg-gray-50' : ''}`}
                  >
                    <div className={`p-1.5 rounded-lg transition-colors ${serviceType === 'Select Service' ? 'bg-gray-100 text-gray-400' : 'bg-brand-dark-green/5 text-brand-dark-green'}`}>
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

                    <AnimatePresence>
                      {activePopover === "service" && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          onClick={(e) => e.stopPropagation()}
                          className="absolute top-full left-0 mt-2 w-[280px] bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 z-50 overflow-hidden"
                        >
                          {services.map((item) => {
                            const IconComp = iconMap[item.category] || Plus;
                            return (
                              <div
                                key={item.id}
                                onClick={() => {
                                  setServiceType(item.name);
                                  setActivePopover(null);
                                }}
                                className={`flex items-start gap-3 p-3 rounded-xl transition-all cursor-pointer hover:bg-gray-50 group/item ${serviceType === item.name ? 'bg-brand-dark-green/5' : ''}`}
                              >
                                <div className={`p-2 rounded-lg ${serviceType === item.name ? 'bg-brand-dark-green text-white' : 'bg-gray-100 text-gray-400 group-hover/item:bg-brand-gold/20 group-hover/item:text-brand-gold'}`}>
                                  <IconComp className="w-4 h-4" />
                                </div>
                                <div className="flex flex-col">
                                  <span className={`text-sm font-bold ${serviceType === item.name ? 'text-brand-dark-green' : 'text-gray-700'}`}>
                                    {item.name}
                                  </span>
                                  <span className="text-[10px] text-gray-400 leading-tight">
                                    {item.count_info}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="md:hidden flex items-center justify-center px-3 border-l border-gray-100 text-gray-400 hover:text-brand-dark-green transition-colors"
                  >
                    <ChevronDown className={`w-5 h-5 transition-transform duration-500 ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                <AnimatePresence>
                  {(isExpanded || (typeof window !== 'undefined' && window.innerWidth >= 768)) && (
                    <motion.div 
                      className="flex flex-col md:flex-row flex-1 items-stretch gap-0.5 md:gap-0"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      <div 
                        onClick={() => setActivePopover(activePopover === "dates" ? null : "dates")}
                        className={`flex-1 flex items-center gap-2 md:gap-3 px-3 py-2 md:px-4 md:py-0 border-b md:border-b-0 md:border-r border-gray-100 group cursor-pointer hover:bg-gray-50 transition-colors relative ${activePopover === 'dates' ? 'bg-gray-50' : ''}`}
                      >
                        <Calendar className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-hover:text-brand-dark-green transition-colors" />
                        <div className="flex flex-col text-left">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Check-in — Check-out</span>
                          <span className="text-sm font-bold text-brand-dark-green">
                            {checkIn && checkOut 
                              ? `${format(new Date(checkIn), 'MMM dd')} - ${format(new Date(checkOut), 'MMM dd')}`
                              : "Select Dates"}
                          </span>
                        </div>

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

                      {serviceType !== 'Convention Hall' && (
                        <div 
                          onClick={() => setActivePopover(activePopover === "times" ? null : "times")}
                          className={`flex-1 flex items-center gap-2 md:gap-3 px-3 py-2 md:px-4 md:py-0 border-b md:border-b-0 md:border-r border-gray-100 group cursor-pointer hover:bg-gray-50 transition-colors relative ${activePopover === 'times' ? 'bg-gray-50' : ''}`}
                        >
                          <Clock className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-hover:text-brand-dark-green transition-colors" />
                          <div className="flex flex-col text-left">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Select Time</span>
                            <span className="text-sm font-bold text-brand-dark-green">
                              {checkInTime.hour}:{checkInTime.minute} {checkInTime.period} - {checkOutTime.hour}:{checkOutTime.minute} {checkOutTime.period}
                            </span>
                          </div>

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
                                  <div className="space-y-3">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block border-b border-gray-50 pb-1">Arrival Time</label>
                                    <div className="flex items-center gap-2">
                                      <select 
                                        value={checkInTime.hour}
                                        onChange={(e) => setCheckInTime({...checkInTime, hour: e.target.value})}
                                        className="flex-1 p-2 bg-white border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-brand-gold text-sm font-bold shadow-sm text-brand-dark-green"
                                      >
                                        {Array.from({length: 12}, (_, i) => (i + 1).toString().padStart(2, '0')).map(h => (
                                          <option key={h} value={h}>{h}</option>
                                        ))}
                                      </select>
                                      <span className="font-bold text-gray-300">:</span>
                                      <select 
                                        value={checkInTime.minute}
                                        onChange={(e) => setCheckInTime({...checkInTime, minute: e.target.value})}
                                        className="flex-1 p-2 bg-white border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-brand-gold text-sm font-bold shadow-sm text-brand-dark-green"
                                      >
                                        {["00", "15", "30", "45"].map(m => (
                                          <option key={m} value={m}>{m}</option>
                                        ))}
                                      </select>
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

                                  <div className="space-y-3">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block border-b border-gray-50 pb-1">Departure Time</label>
                                    <div className="flex items-center gap-2">
                                      <select 
                                        value={checkOutTime.hour}
                                        onChange={(e) => setCheckOutTime({...checkOutTime, hour: e.target.value})}
                                        className="flex-1 p-2 bg-white border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-brand-gold text-sm font-bold shadow-sm text-brand-dark-green"
                                      >
                                        {Array.from({length: 12}, (_, i) => (i + 1).toString().padStart(2, '0')).map(h => (
                                          <option key={h} value={h}>{h}</option>
                                        ))}
                                      </select>
                                      <span className="font-bold text-gray-300">:</span>
                                      <select 
                                        value={checkOutTime.minute}
                                        onChange={(e) => setCheckOutTime({...checkOutTime, minute: e.target.value})}
                                        className="flex-1 p-2 bg-white border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-brand-gold text-sm font-bold shadow-sm text-brand-dark-green"
                                      >
                                        {["00", "15", "30", "45"].map(m => (
                                          <option key={m} value={m}>{m}</option>
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
                                    className="w-full bg-brand-dark-green text-white py-3 rounded-xl font-bold mt-2"
                                  >
                                    Confirm Time
                                  </button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}

                      <button 
                        onClick={handleSearch}
                        className="bg-brand-dark-green hover:bg-black text-white px-8 py-2.5 md:py-0 rounded-lg font-bold transition-all flex items-center justify-center gap-2 active:scale-95 m-1"
                      >
                        <Search className="w-5 h-5" />
                        <span className="md:inline">{hero.ctaText}</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Offerings Section */}
      <section className="py-16 px-4 md:py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mb-12 md:mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-gold/10 border border-brand-gold/20 mb-6">
              <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse" />
              <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-brand-gold">{offerings.badge}</span>
            </div>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-brand-dark-green leading-[1.1] tracking-tight">
              {offerings.titlePart1} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold via-brand-sunset-start to-brand-sunset-end">{offerings.titlePart2}</span>
            </h2>
          </motion.div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {services.map((s, idx) => (
              <motion.div 
                key={s.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative flex flex-col"
              >
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-3 border border-gray-100 shadow-sm transition-transform duration-500 group-hover:shadow-md">
                  <img src={s.image_url} alt={s.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
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
                    <h3 className="font-bold text-brand-dark-green text-sm md:text-base group-hover:text-brand-sunset-start transition-colors">{s.name}</h3>
                    <p className="text-xs text-gray-500">{s.count_info}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-4 bg-brand-dark-green text-white overflow-hidden relative">
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
              <Link href="/about" className="inline-flex items-center gap-2 bg-brand-gold text-brand-dark-green px-8 py-4 rounded-xl font-bold hover:bg-white transition-all shadow-xl">
                Learn More About Us <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
          <div className="flex-1 w-full max-w-xl">
            <div className="relative aspect-[1/1] rounded-[2rem] overflow-hidden border-8 border-white/5 shadow-2xl skew-y-2 hover:skew-y-0 transition-transform duration-700">
              <img src="/about.png" alt="Resort experience" className="w-full h-full object-cover object-top" />
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 px-4 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-brand-dark-green mb-2">Our Gallery</h2>
              <p className="text-gray-500">Glimpse into the luxury, peace, and grand celebrations</p>
            </div>
            <Link href="/gallery" className="text-brand-sunset-start font-bold flex items-center gap-1 hover:gap-2 transition-all">
              View full gallery <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {gallery.map((item) => (
              <div key={item.id} className="group relative rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-500 cursor-pointer h-64 md:h-80">
                <img src={item.url} alt={item.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark-green/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                  <h3 className="text-white text-xl font-bold">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 bg-srr-light-gray">
        <div className="max-w-6xl mx-auto bg-white rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row border border-gray-100">
          <div className="flex-1 bg-brand-dark-green p-10 md:p-16 text-white space-y-8">
            <h2 className="text-4xl font-bold leading-tight">Need help with your <br/>booking?</h2>
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
            </div>
          </div>
          <div className="flex-1 p-10 md:p-16">
            <form className="space-y-6">
              <input type="text" className="w-full border-b-2 border-gray-100 py-3 outline-none focus:border-brand-gold transition-colors font-medium" placeholder="Your Name" />
              <input type="email" className="w-full border-b-2 border-gray-100 py-3 outline-none focus:border-brand-gold transition-colors font-medium" placeholder="Email Address" />
              <textarea rows={3} className="w-full border-b-2 border-gray-100 py-3 outline-none focus:border-brand-gold transition-colors font-medium" placeholder="How can we help?" />
              <button className="w-full bg-brand-sunset-start text-white font-bold py-5 rounded-xl transition-all shadow-lg shadow-brand-sunset-start/20">
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedQuickView(null)} className="absolute inset-0 bg-brand-dark-green/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl">
              <div className="h-48 relative">
                <img src={selectedQuickView.image_url} alt={selectedQuickView.name} className="w-full h-full object-cover" />
                <button onClick={() => setSelectedQuickView(null)} className="absolute top-4 right-4 p-2 bg-white/20 rounded-full text-white"><X /></button>
              </div>
              <div className="p-8 space-y-6">
                <h3 className="text-2xl font-bold">{selectedQuickView.name}</h3>
                <p className="text-gray-600">{selectedQuickView.description}</p>
                <div className="grid grid-cols-2 gap-4">
                  {(selectedQuickView.points as string[] || []).map((p, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-500">
                      <CheckCircle2 className="w-4 h-4 text-brand-gold" /> {p}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => {
                    const category = selectedQuickView.category.toLowerCase().replace(/\s+/g, '-');
                    if (!session) {
                      router.push(`/login?callbackUrl=/services?type=${category}`);
                    } else {
                      router.push(`/services?type=${category}`);
                    }
                  }}
                  className="block w-full bg-brand-dark-green text-white text-center py-4 rounded-xl font-bold"
                >
                  Book Now
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
