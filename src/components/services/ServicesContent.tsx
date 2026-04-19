"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { format } from "date-fns";
import { 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Navigation, 
  Clock, 
  ArrowLeft, 
  Home as HomeIcon, 
  X, 
  Upload, 
  User, 
  Phone as PhoneIcon, 
  Mail as MailIcon,
  ShieldCheck,
  Info
} from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

type BookingMode = "ROOM" | "HALL" | "HOUSE" | "LEISURE" | null;

const FLOORS = [
  { name: "First Floor", rooms: ["A1", "A2", "A3", "A4"] },
  { name: "Second Floor", rooms: ["B1", "B2", "B3", "B4"] },
  { name: "Third Floor", rooms: ["C1", "C2", "C3", "C4"] },
];

const HOUSE_CLUSTERS = [
  { name: "Cluster A (Houses 1-3) - Bonfire", houses: ["House 1", "House 2", "House 3"] },
  { name: "Cluster B (Houses 4-6) - Foot Pool", houses: ["House 4", "House 5", "House 6"] }
];

const FALLBACK_SERVICES = [
  {
    id: "ROOM",
    name: "Luxury Rooms",
    description: "Experience absolute comfort in our 12 premium luxury rooms. Choose your preferred floor and room to secure your perfect stay.",
    features: [
      "Premium floor options (Level A, B, C)",
      "Private pool view architectures",
      "Dedicated room service & cleanup",
      "Complimentary organic breakfast",
      "Modern climate control systems",
      "Smart TV & High-speed fiber WiFi",
      "Priority access to Box Cricket"
    ],
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1000&auto=format&fit=crop",
    price: 2500,
    priceUnit: "Room"
  },
  {
    id: "HOUSE",
    name: "Independent Houses",
    description: "Book one of our 6 exclusive independent houses. Set in nature, Cluster A (Houses 1-3) features a private bonfire, and Cluster B (Houses 4-6) features a premium foot pool.",
    features: [
      "Private individual nature cottages",
      "Full-cluster booking options (3 houses)",
      "Private Bonfire pits (Cluster A)",
      "Premium Foot Pool experience (Cluster B)",
      "Nature-immersed living spaces",
      "Spacious 2-bedroom configurations",
      "Personal assistance on-call"
    ],
    image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=1000&auto=format&fit=crop",
    price: 3000,
    priceUnit: "House"
  },
  {
    id: "HALL",
    name: "Convention Hall",
    description: "Host your weddings, corporate events, and parties in our exclusive function hall. We guarantee complete privacy by booking only one event at a time.",
    features: [
      "Massive 1000+ guest capacity",
      "Strict one-event policy for privacy",
      "Lush garden for outdoor cocktails",
      "State-of-the-art Sound & LED logic",
      "Integrated catering & kitchen zone",
      "Luxurious air-conditioned bridal suite",
      "High-security parking lot"
    ],
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1000&auto=format&fit=crop",
    price: 0,
    priceUnit: "Event"
  },
  {
    id: "LEISURE",
    name: "Sports & Leisure Activities",
    description: "Perfect for day visitors! Enjoy our professional-grade sports facilities and swimming pool. Available for individual and group bookings.",
    features: [
      "Professional-grade Box Cricket turf",
      "Temperature-controlled Swimming Pool",
      "All sports gear included on request",
      "Certified lifeguards on-site",
      "Deluxe changing & locker rooms",
      "Daily & hourly slots available",
      "Poolside refreshments bar access"
    ],
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1000&auto=format&fit=crop",
    price: 350,
    priceUnit: "Hour"
  }
];

export default function ServicesContent() {
  const router = useRouter();
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const today = new Date().toISOString().split('T')[0];
  const [activeModal, setActiveModal] = useState<BookingMode>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    checkOutDate: "",
    checkInTime: "06:00",
    checkOutTime: "22:00",
    time: "",
    durationHours: 1,
    houseBookingType: "individual" as "individual" | "cluster",
    items: [] as string[],
    aadharFile: null as File | null,
    isStayer: false,
    roomNumber: "",
    tokenId: "",
    guests: 1
  });

  const [availability, setAvailability] = useState<any[]>([]);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  const [services, setServices] = useState(FALLBACK_SERVICES);

  // Time format helpers
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


  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/admin/services");
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const formatted = data.map((s: any) => ({
            id: s.category,
            name: s.name,
            description: s.description,
            features: Array.isArray(s.points) && s.points.length > 0 ? s.points : [],
            image: s.image_url,
            price: s.price,
            priceUnit: s.count_info?.split(" ")[1] || "Unit"
          }));
          setServices(formatted);
        }
      } catch (err) {
        console.error("Failed to fetch services, using fallbacks", err);
      }
    };
    fetchServices();
  }, []);

  const calculateTotal = () => {
    const service = services.find(s => s.id === activeModal);
    const basePrice = service?.price || 0;

    let days = 1;
    if (formData.date && formData.checkOutDate && (activeModal === 'ROOM' || activeModal === 'HOUSE')) {
      const start = new Date(formData.date);
      const end = new Date(formData.checkOutDate);
      if (end >= start) {
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        days = diffDays + 1;
      }
    }

    if (activeModal === 'ROOM') return formData.items.length * (basePrice || 2500) * days;
    if (activeModal === 'HOUSE') {
      if (formData.houseBookingType === 'cluster') return 8000 * days;
      return formData.items.length * (basePrice || 3000) * days;
    }
    if (activeModal === 'LEISURE') {
      if (formData.isStayer) return 0;
      let rate = 0;
      if (formData.items.includes('Box Cricket')) rate += 350;
      if (formData.items.includes('Swimming Pool')) rate += 400;
      return rate * formData.durationHours;
    }
    if (activeModal === 'HALL') return basePrice || 0;
    return 0;
  };


  const parseTimeSlot = (slotStr: string) => {
    if (!slotStr) return 0;
    const parts = slotStr.split(' ');
    if (parts.length < 2) return 0;
    const [time, period] = parts;
    let [hour] = time.split(':').map(Number);
    if (period === 'PM' && hour < 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;
    return hour;
  };

  const checkAvailability = async () => {
    if (!formData.date || !activeModal) return;
    setCheckingAvailability(true);
    try {
      const start = formData.date;
      const end = formData.checkOutDate || formData.date;
      const startTime = formData.checkInTime || "06:00";
      const endTime = formData.checkOutTime || "22:00";
      
      const res = await fetch(`/api/availability?startDate=${start}&endDate=${end}&startTime=${startTime}&endTime=${endTime}&type=${activeModal}`);
      const data = await res.json();
      setAvailability(data.bookings || []);
    } catch (err) {
      console.error("Failed to check availability", err);
    } finally {
      setCheckingAvailability(false);
    }
  };


  useEffect(() => {
    if (activeModal && formData.date) {
      checkAvailability();
    }
  }, [formData.date, formData.checkOutDate, formData.checkInTime, formData.checkOutTime, activeModal]);


  const hasCollision = () => {
    if (activeModal !== 'LEISURE' || !formData.time || formData.items.length === 0) return false;
    
    const startHour = parseTimeSlot(formData.time);
    const endHour = startHour + (formData.durationHours || 1);
    const requestedSlots = Array.from({length: endHour - startHour}, (_, i) => startHour + i);

    return availability.some(b => {
      const sharesItems = b.items.some((item: string) => formData.items.includes(item));
      if (!sharesItems) return false;

      const bStart = parseTimeSlot(b.time_slot);
      const bEnd = bStart + (b.duration || 1);
      const bookedSlots = Array.from({length: bEnd - bStart}, (_, i) => bStart + i);
      
      return requestedSlots.some(s => bookedSlots.includes(s));
    });
  };

  const isItemBooked = (item: string) => {
    return availability.some(b => {
      // Direct match
      if (b.items?.includes(item)) return true;

      // If checking a house, see if its parent cluster is booked
      const parentCluster = HOUSE_CLUSTERS.find(c => c.houses.includes(item));
      if (parentCluster && b.items?.includes(parentCluster.name)) return true;

      // If checking a cluster, see if any of its individual houses are booked
      const currentCluster = HOUSE_CLUSTERS.find(c => c.name === item);
      if (currentCluster && b.items?.some((bookedItem: string) => currentCluster.houses.includes(bookedItem))) return true;

      return false;
    });
  };


  useEffect(() => {
    const type = searchParams.get("type");
    const checkIn = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");
    const checkInTime = searchParams.get("checkInTime");

    if (type) {
      const typeMap: Record<string, BookingMode> = {
        "luxury-rooms": "ROOM",
        "independent-houses": "HOUSE",
        "convention-hall": "HALL",
        "sports-&-outdoor-activities": "LEISURE",
        "leisure-activities": "LEISURE",
        "sports-&-leisure-activities": "LEISURE"
      };

      const serviceId = typeMap[type];
      if (serviceId) {
        setActiveModal(serviceId);
        
        let formattedCheckIn = "";
        let formattedCheckOut = "";
        if (checkIn && checkOut) {
          formattedCheckIn = checkIn;
          formattedCheckOut = checkOut;
        } else if (checkIn) {
          formattedCheckIn = checkIn;
        }

        let formattedTime = "";
        if (checkInTime) {
          const [timePart, period] = checkInTime.split(" ");
          if (timePart && period) {
            let [hours, minutes] = timePart.split(":");
            let h = parseInt(hours);
            if (period === "PM" && h < 12) h += 12;
            if (period === "AM" && h === 12) h = 0;
            formattedTime = `${h.toString().padStart(2, "0")}:${minutes}`;
          }
        }

        setFormData(prev => ({
          ...prev,
          date: formattedCheckIn,
          checkOutDate: formattedCheckOut,
          time: formattedTime
        }));
      }
    }
  }, [searchParams]);

  const handleBookNow = (serviceId: string) => {
    if (serviceId === 'HALL') {
      const message = "Hello, I am interested in booking the SRR Convention Hall. Could you please provide more details and availability?";
      const whatsappUrl = `https://wa.me/917702199889?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
      return;
    }

    if (!session) {
      const currentType = serviceId.toLowerCase().replace(/\s+/g, '-');
      router.push(`/login?callbackUrl=/services?type=${currentType}`);
      return;
    }

    setFormData({
      name: "",
      phone: "",
      email: "",
      date: "",
      checkOutDate: "",
      checkInTime: "06:00",
      checkOutTime: "22:00",
      time: "",
      durationHours: 1,
      houseBookingType: "individual",
      items: [],
      aadharFile: null,
      isStayer: false,
      roomNumber: "",
      tokenId: "",
      guests: 1
    });

    setIsSuccess(false);
    setActiveModal(serviceId as BookingMode);
  };

  const toggleItem = (item: string) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.includes(item) 
        ? prev.items.filter(i => i !== item) 
        : [...prev.items, item]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const serviceName = services.find(s => s.id === activeModal)?.name || "Service";
    const itemsList = formData.items.length > 0 ? formData.items.join(", ") : "None selected";
    const totalPrice = calculateTotal();

    setIsProcessing(true);
    
    let bookingId = "";
    try {
      const bookingData = {
        name: formData.name,
        email: formData.email || (formData.isStayer ? `stayer-${formData.roomNumber}@srr.com` : ""),
        phone: formData.phone,
        service_id: activeModal,
        service_type: activeModal,
        items: formData.items,
        start_date: formData.date,
        end_date: (activeModal === 'ROOM' || activeModal === 'HOUSE') ? formData.checkOutDate : formData.date,
        check_in_time: (activeModal === 'ROOM' || activeModal === 'HOUSE') ? formData.checkInTime : formData.time,
        check_out_time: (activeModal === 'ROOM' || activeModal === 'HOUSE') ? formData.checkOutTime : "",
        date: formData.date,
        time_slot: formData.time,
        duration: formData.durationHours,
        guests: formData.guests || 1,
        total_amount: totalPrice,
        is_stayer: formData.isStayer,
        room_number: formData.roomNumber,
        token_id: formData.tokenId,
        status: (formData.isStayer || totalPrice === 0) ? 'CONFIRMED' : 'PENDING'
      };


      const res = await fetch("/api/admin/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData)
      });
      const data = await res.json();
      bookingId = data.id;

      if (!bookingId) throw new Error("Failed to create booking reference");

      // If it's a paid booking and not a stayer, proceed to payment
      if (totalPrice > 0 && !formData.isStayer) {
        await initiatePayment(totalPrice, bookingId);
      } else {
        // For free/stayer bookings, complete immediately
        completeBooking(formData, serviceName, totalPrice, itemsList);
      }
    } catch (err: any) {
      console.error("Booking failed:", err);
      alert("Something went wrong. Please try again or contact support.");
    } finally {
      setIsProcessing(false);
    }
  };

  const initiatePayment = async (amount: number, bookingId: string) => {
    try {
      // 1. Create order on server
      const orderRes = await fetch("/api/payment/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, bookingId })
      });
      const orderData = await orderRes.json();

      if (orderRes.status !== 200) throw new Error(orderData.error);

      // 2. Open Razorpay Modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "SRR Resorts & Convention",
        description: `Booking for ${services.find(s => s.id === activeModal)?.name}`,
        image: "/logo.png",
        order_id: orderData.id,
        handler: async function (response: any) {
          // 3. Verify payment on server
          const verifyRes = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId
            })
          });

          const verifyData = await verifyRes.json();
          if (verifyRes.status === 200) {
            completeBooking(formData, services.find(s => s.id === activeModal)?.name || "Service", amount, formData.items.join(", "));
          } else {
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: "#0B3D2E" // brand-dark-green
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err: any) {
      console.error("Payment initiation failed:", err);
      alert("Failed to start payment process. Please try again.");
    }
  };

  const completeBooking = (data: any, serviceName: string, totalPrice: number, itemsList: string) => {
    // Construct WhatsApp message (Keep this as a backup/record notification)
    let message = `*SRR Resorts Booking Confirmed*\n\n`;
    message += `*Name:* ${data.name}\n`;
    message += `*Phone:* ${data.phone}\n`;
    if (data.isStayer) {
      message += `*Guest Type:* Resort Stayer (Free Access)\n`;
      message += `*Room No:* ${data.roomNumber}\n`;
    } else {
      message += `*Payment:* PAID ONLINE\n`;
    }
    message += `*Service:* ${serviceName}\n`;
    message += `*Check-in:* ${data.date}\n`;
    if (data.checkOutDate) message += `*Check-out:* ${data.checkOutDate}\n`;
    message += `*Selections:* ${itemsList}\n`;
    message += `*Total Amount:* ₹${totalPrice.toLocaleString()}\n`;
    
    const whatsappUrl = `https://wa.me/917702199889?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    setIsSuccess(true);
  };

  return (
    <div className="flex flex-col min-h-screen py-12 md:py-24 px-4 bg-srr-cream">
      <div className="max-w-6xl mx-auto w-full">
        <div className="text-center mb-10 md:mb-16">
          <h1 className="text-3xl md:text-5xl font-bold text-brand-dark-green mb-4 leading-tight">Our Premium Services</h1>
          <div className="w-20 h-1 bg-sunset-gradient mx-auto rounded-full" />
          <p className="mt-4 md:mt-6 text-gray-600 max-w-2xl mx-auto text-base md:text-lg">
            Explore our world-class offerings. Select a service to book your luxury stay or event directly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-3xl shadow-sm border border-black/5 overflow-hidden flex flex-col hover:shadow-lg transition-all group">
              <div className="relative h-56 md:h-64 w-full bg-gray-200 overflow-hidden">
                <img src={service.image} alt={service.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider border border-white/20">
                    {service.id === 'HALL' ? 'Exclusive' : 'Premium'}
                  </span>
                </div>
              </div>
              <div className="p-6 md:p-8 flex flex-col flex-1">
                <h2 className="text-xl md:text-2xl font-bold text-brand-dark-green mb-2 md:mb-3">{service.name}</h2>
                <p className="text-sm md:text-base text-gray-600 mb-6 flex-1 leading-relaxed">{service.description}</p>
                <ul className="grid grid-cols-2 gap-2 mb-6 md:mb-8">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-[12px] md:text-sm text-gray-500">
                      <CheckCircle2 className="w-4 h-4 text-brand-sunset-start" /> {feature}
                    </li>
                  ))}
                </ul>
                <button onClick={() => handleBookNow(service.id)} className="w-full bg-brand-dark-green hover:bg-black text-white py-3 md:py-4 rounded-xl font-bold transition-all shadow-md">Book Now</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {activeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 z-20 bg-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-sunset-start/10 rounded-xl">
                  {activeModal === 'ROOM' && <Navigation className="w-5 h-5 text-brand-sunset-start" />}
                  {activeModal === 'HOUSE' && <HomeIcon className="w-5 h-5 text-brand-sunset-start" />}
                  {activeModal === 'HALL' && <CalendarIcon className="w-5 h-5 text-brand-sunset-start" />}
                  {activeModal === 'LEISURE' && <Info className="w-5 h-5 text-brand-sunset-start" />}
                </div>
                <h3 className="text-xl font-bold text-brand-dark-green">
                  {isSuccess ? 'Booking Requested' : `Book ${services.find(s => s.id === activeModal)?.name}`}
                </h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400"><X /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-10">
              {isSuccess ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-100 text-brand-green rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h2 className="text-3xl font-bold text-brand-dark-green mb-4">Request Received!</h2>
                  <p className="text-gray-500 mb-8 max-w-md mx-auto">Thank you. We will contact you at **{formData.phone}** shortly.</p>
                  <button onClick={() => setActiveModal(null)} className="bg-brand-dark-green text-white px-10 py-4 rounded-xl font-bold">Done</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="grid lg:grid-cols-2 gap-10">
                  {activeModal === 'LEISURE' && (
                    <div className="col-span-full border-b border-gray-50 pb-6 mb-2">
                       <label className="text-xs font-bold text-brand-dark-green/60 uppercase ml-1 block mb-3">Guest Type</label>
                       <div className="flex gap-2 p-1.5 bg-gray-50 rounded-2xl w-full sm:w-fit border border-gray-100">
                        <button type="button" onClick={() => setFormData({...formData, isStayer: false})} className={`px-8 py-3 rounded-xl text-sm font-extrabold transition-all ${!formData.isStayer ? 'bg-white shadow-md text-brand-dark-green' : 'text-gray-400'}`}>Outer Guest</button>
                        <button type="button" onClick={() => setFormData({...formData, isStayer: true})} className={`px-8 py-3 rounded-xl text-sm font-extrabold transition-all ${formData.isStayer ? 'bg-brand-gold text-white shadow-md' : 'text-gray-400'}`}>Resort Guest</button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-6">
                    <div className="space-y-4">
                      <label className="text-xs font-bold text-brand-dark-green/60 uppercase tracking-widest block">Personal Details</label>
                      <input required type="text" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:bg-white" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                      <input required type="tel" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:bg-white" placeholder="Phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                      {formData.isStayer ? (
                        <>
                          <input required type="text" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:bg-white" placeholder="Room Number" value={formData.roomNumber} onChange={(e) => setFormData({...formData, roomNumber: e.target.value})} />
                          <input required type="text" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:bg-white" placeholder="Token ID" value={formData.tokenId} onChange={(e) => setFormData({...formData, tokenId: e.target.value})} />
                        </>
                      ) : (
                        <input required type="email" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:bg-white" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                      )}
                    </div>
                    {(activeModal === 'ROOM' || activeModal === 'HOUSE') && (
                      <div className="space-y-4">
                        <label className="text-xs font-bold text-brand-dark-green/60 uppercase tracking-widest block">Aadhar Document</label>
                        <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center cursor-pointer hover:bg-gray-50 transition-all">
                          <input type="file" ref={fileInputRef} className="hidden" accept="image/*,.pdf" onChange={(e) => setFormData({...formData, aadharFile: e.target.files?.[0] || null})} />
                          <Upload className="mx-auto mb-2 text-gray-400" />
                          <p className="text-sm font-bold">{formData.aadharFile ? formData.aadharFile.name : 'Upload Aadhar'}</p>
                        </div>

                        {/* Mandatory Notes */}
                        <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-5 space-y-3">
                          <div className="flex items-center gap-2 text-amber-700">
                            <ShieldCheck className="w-4 h-4" />
                            <p className="text-[10px] font-black uppercase tracking-[0.2em]">Important Policies</p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex gap-3">
                              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                              <p className="text-[11px] font-bold text-amber-900/80 leading-relaxed">
                                Bring physical Aadhar Card when you come to resort (Mandatory).
                              </p>
                            </div>
                            <div className="flex gap-3">
                              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                              <p className="text-[11px] font-bold text-amber-900/80 leading-relaxed">
                                Occupancy: Max 3 members (2 Adults + 1 Kid) per room. Extra bed requests will attract additional charges.
                              </p>
                            </div>
                            <div className="flex gap-3">
                              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                              <p className="text-[11px] font-bold text-amber-900/80 leading-relaxed">
                                To extend your booking, you must inform the reception at least 2 hours in advance.
                              </p>
                            </div>

                          </div>
                        </div>
                      </div>
                    )}

                  </div>

                    <div className="space-y-6">
                    <label className="text-xs font-bold text-brand-dark-green/60 uppercase tracking-widest block">Booking Info</label>
                    
                    {activeModal === 'HOUSE' && (
                      <div className="space-y-3 p-1.5 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="flex gap-1">
                          <button 
                            type="button" 
                            onClick={() => setFormData({...formData, houseBookingType: 'individual', items: []})} 
                            className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${formData.houseBookingType === 'individual' ? 'bg-white shadow-sm text-brand-dark-green' : 'text-gray-400 opacity-60'}`}
                          >
                            Individual Houses
                          </button>
                          <button 
                            type="button" 
                            onClick={() => setFormData({...formData, houseBookingType: 'cluster', items: []})} 
                            className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${formData.houseBookingType === 'cluster' ? 'bg-brand-gold text-white shadow-md' : 'text-gray-400 opacity-60'}`}
                          >
                            Full Cluster Booking
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Check-in</label>
                        <input required type="date" min={today} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
                        {(activeModal === 'ROOM' || activeModal === 'HOUSE') && (
                          <div className="flex gap-2">
                            <select className="flex-1 p-2 bg-gray-50 border border-gray-100 rounded-lg text-xs outline-none" value={get12hPart(formData.checkInTime).hour} onChange={(e) => handleTimeChange("checkInTime", "hour", e.target.value)}>
                              {Array.from({length: 12}, (_, i) => (i + 1).toString()).map(h => <option key={h} value={h}>{h}</option>)}
                            </select>
                            <select className="flex-1 p-2 bg-gray-50 border border-gray-100 rounded-lg text-xs outline-none" value={get12hPart(formData.checkInTime).minute} onChange={(e) => handleTimeChange("checkInTime", "minute", e.target.value)}>
                              {["00", "15", "30", "45"].map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                            <select className="flex-1 p-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold outline-none" value={get12hPart(formData.checkInTime).period} onChange={(e) => handleTimeChange("checkInTime", "period", e.target.value)}>
                              <option value="AM">AM</option>
                              <option value="PM">PM</option>
                            </select>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Check-out</label>
                        {(activeModal === 'ROOM' || activeModal === 'HOUSE') ? (
                          <>
                            <input required type="date" min={formData.date || today} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none" value={formData.checkOutDate} onChange={(e) => setFormData({...formData, checkOutDate: e.target.value})} />
                            <div className="flex gap-2">
                              <select className="flex-1 p-2 bg-gray-50 border border-gray-100 rounded-lg text-xs outline-none" value={get12hPart(formData.checkOutTime).hour} onChange={(e) => handleTimeChange("checkOutTime", "hour", e.target.value)}>
                                {Array.from({length: 12}, (_, i) => (i + 1).toString()).map(h => <option key={h} value={h}>{h}</option>)}
                              </select>
                              <select className="flex-1 p-2 bg-gray-50 border border-gray-100 rounded-lg text-xs outline-none" value={get12hPart(formData.checkOutTime).minute} onChange={(e) => handleTimeChange("checkOutTime", "minute", e.target.value)}>
                                {["00", "15", "30", "45"].map(m => <option key={m} value={m}>{m}</option>)}
                              </select>
                              <select className="flex-1 p-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold outline-none" value={get12hPart(formData.checkOutTime).period} onChange={(e) => handleTimeChange("checkOutTime", "period", e.target.value)}>
                                <option value="AM">AM</option>
                                <option value="PM">PM</option>
                              </select>
                            </div>
                          </>
                        ) : (

                          <div className="w-full p-3 bg-gray-100 border border-gray-100 rounded-xl outline-none text-gray-400 text-sm h-[46px] flex items-center">Single Day Only</div>
                        )}
                      </div>
                    </div>


                    {activeModal === 'LEISURE' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-2">
                          {['Swimming Pool', 'Box Cricket'].map(act => (
                            <button key={act} type="button" onClick={() => toggleItem(act)} className={`py-3 px-4 text-xs font-bold rounded-xl border transition-all ${formData.items.includes(act) ? 'bg-brand-dark-green text-white' : 'bg-white text-brand-dark-green border-gray-100'}`}>{act}</button>
                          ))}
                        </div>
                        <select required className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none font-bold" value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})}>
                          <option value="">Select Time Slot</option>
                          {Array.from({length: 12}, (_, i) => 9 + i).map(h => {
                            const label = `${h > 12 ? h-12 : h}:00 ${h >= 12 ? 'PM' : 'AM'}`;
                            return <option key={h} value={label}>{label}</option>;
                          })}
                        </select>
                        <select required className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none font-bold" value={formData.durationHours} onChange={(e) => setFormData({...formData, durationHours: parseInt(e.target.value)})}>
                          <option value="1">1 Hour</option>
                          {Array.from({length: 11}, (_, i) => i + 2).map(h => (
                            <option key={h} value={h}>{h} Hours</option>
                          ))}
                        </select>
                      </div>

                    )}

                    {(activeModal === 'ROOM' || (activeModal === 'HOUSE' && formData.houseBookingType === 'individual')) && (
                      <div className="max-h-60 overflow-y-auto pr-2 space-y-4 border rounded-xl p-4">
                         {activeModal === 'ROOM' ? FLOORS.map(f => (

                          <div key={f.name} className="space-y-2">
                             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{f.name}</p>
                             <div className="grid grid-cols-4 gap-2">
                               {f.rooms.map(r => {
                                 const isBooked = isItemBooked(r);
                                 return (
                                   <button 
                                     key={r} 
                                     type="button" 
                                     disabled={isBooked}
                                     onClick={() => toggleItem(r)} 
                                     className={`p-2 text-xs font-bold border rounded-lg transition-all ${
                                       isBooked ? 'bg-gray-100 text-gray-300 cursor-not-allowed' :
                                       formData.items.includes(r) ? 'bg-brand-dark-green text-white' : 'bg-white hover:border-brand-gold'
                                     }`}
                                   >
                                     {r}
                                   </button>
                                 );
                               })}
                             </div>
                          </div>
                        )) : HOUSE_CLUSTERS.map(c => (
                          <div key={c.name} className="space-y-2">
                             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{c.name}</p>
                             <div className="grid grid-cols-3 gap-2">
                               {c.houses.map(h => {
                                 const isBooked = isItemBooked(h);
                                 return (
                                   <button 
                                     key={h} 
                                     type="button" 
                                     disabled={isBooked}
                                     onClick={() => toggleItem(h)} 
                                     className={`p-2 text-xs font-bold border rounded-lg transition-all ${
                                       isBooked ? 'bg-gray-100 text-gray-300 cursor-not-allowed' :
                                       formData.items.includes(h) ? 'bg-brand-dark-green text-white' : 'bg-white hover:border-brand-gold'
                                     }`}
                                   >
                                     {h}
                                   </button>
                                 );
                               })}
                             </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {activeModal === 'HOUSE' && formData.houseBookingType === 'cluster' && (
                      <div className="space-y-4">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Select Cluster (Fixed ₹8,000/day)</p>
                        <div className="grid grid-cols-2 gap-3">
                          {HOUSE_CLUSTERS.map(c => {
                             const isSelected = formData.items.includes(c.name);
                             const isAnyHouseBooked = c.houses.some(h => isItemBooked(h));
                             
                             return (
                               <button 
                                 key={c.name}
                                 type="button"
                                 disabled={isAnyHouseBooked}
                                 onClick={() => setFormData({...formData, items: [c.name]})}
                                 className={`p-6 text-center border-2 rounded-2xl transition-all ${
                                   isAnyHouseBooked ? 'bg-gray-50 border-gray-100 opacity-50 cursor-not-allowed' :
                                   isSelected ? 'bg-brand-dark-green border-brand-dark-green text-white shadow-lg' : 'bg-white border-gray-100 hover:border-brand-gold text-brand-dark-green'
                                 }`}
                               >
                                 <p className="text-sm font-black mb-1">{c.name.split(' ')[0] + ' ' + c.name.split(' ')[1]}</p>
                                 <p className={`text-[9px] font-bold uppercase tracking-widest ${isSelected ? 'text-white/60' : 'text-gray-400'}`}>Full Access</p>
                                 {isAnyHouseBooked && <p className="text-[8px] text-red-500 font-bold uppercase mt-2">Partially Occupied</p>}
                               </button>
                             );
                          })}
                        </div>
                      </div>
                    )}


                    <div className="p-6 bg-brand-dark-green/5 rounded-2xl border border-brand-dark-green/10 space-y-2">
                       <div className="flex justify-between items-center text-xs font-bold text-gray-500 uppercase tracking-widest">
                          <span>Summary</span>
                          <span className="text-brand-dark-green">{formData.items.length} {activeModal === 'ROOM' ? 'Rooms' : (activeModal === 'HOUSE' ? 'Houses' : 'Units')}</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-600">Duration</span>
                          <span className="text-sm font-bold text-brand-dark-green">
                            {activeModal === 'LEISURE' ? `${formData.durationHours} Hours` : 
                             (() => {
                               const start = new Date(formData.date);
                               const end = new Date(formData.checkOutDate);
                               const days = (end >= start) ? Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1 : 1;
                               return `${days} Day${days > 1 ? 's' : ''}`;
                             })()
                            }
                          </span>
                       </div>
                       {activeModal !== 'LEISURE' && (
                         <div className="pt-2 border-t border-brand-dark-green/10 flex justify-between items-center">
                            <span className="text-base font-black text-brand-dark-green">Total Amount</span>
                            <span className="text-xl font-black text-brand-sunset-start">₹{calculateTotal().toLocaleString()}</span>
                         </div>
                       )}
                    </div>


                    <button 
                      type="submit" 
                      disabled={hasCollision() || isProcessing || (formData.items.length === 0 && activeModal !== 'HALL')} 
                      className={`w-full py-4 rounded-2xl font-bold text-lg shadow-xl shadow-brand-sunset-start/20 ${hasCollision() || isProcessing || (formData.items.length === 0 && activeModal !== 'HALL') ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-sunset-gradient text-white hover:opacity-90 transition-opacity'}`}
                    >
                      {isProcessing ? 'Processing...' : (hasCollision() ? 'Slot Unavailable' : (calculateTotal() > 0 && !formData.isStayer && activeModal !== 'LEISURE' ? `Pay ₹${calculateTotal().toLocaleString()}` : 'Confirm Booking'))}
                    </button>


                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
      
      <AnimatePresence>
        {isSuccess && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[120] flex items-center justify-center bg-brand-dark-green/90 backdrop-blur-sm p-4">
             <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl p-12 text-center max-w-sm w-full shadow-2xl">
               <CheckCircle2 className="mx-auto mb-6 text-green-500 w-16 h-16" />
               <h3 className="text-2xl font-bold mb-2">Booking Successful!</h3>
               <p className="text-gray-600 mb-8">Your booking is completed successfully! You can view your digital token in your dashboard.</p>
               <button onClick={() => router.push('/dashboard')} className="w-full bg-brand-dark-green text-white py-4 rounded-xl font-bold">Okay</button>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
