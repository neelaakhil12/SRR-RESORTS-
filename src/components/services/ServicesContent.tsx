"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { format } from "date-fns";
import { buildWhatsAppMessage, openWhatsApp } from "@/lib/whatsapp";
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
  const [whatsappMessage, setWhatsappMessage] = useState("");
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

  // Auto-fill user details from session
  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || session.user?.name || "",
        email: prev.email || session.user?.email || "",
      }));
    }
  }, [session]);

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
      const startDateTime = new Date(`${formData.date}T${formData.checkInTime}`);
      const endDateTime = new Date(`${formData.checkOutDate}T${formData.checkOutTime}`);

      if (endDateTime > startDateTime) {
        const diffInMs = endDateTime.getTime() - startDateTime.getTime();
        const diffInHours = diffInMs / (1000 * 60 * 60);
        // Every 24-hour cycle (or fraction thereof) counts as a day
        days = Math.ceil(diffInHours / 24);
      } else {
        days = 1;
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

    setFormData(prev => ({
      name: prev.name,
      phone: prev.phone,
      email: prev.email,
      date: "",
      checkOutDate: "",
      checkInTime: "06:00",
      checkOutTime: "22:00",
      time: "",
      durationHours: 1,
      houseBookingType: "individual" as "individual" | "cluster",
      items: [],
      aadharFile: null,
      isStayer: false,
      roomNumber: "",
      tokenId: "",
      guests: 1
    }));

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
    
    let aadharUrl = "";
    try {
      // 1. Upload Aadhar if exists
      if (formData.aadharFile) {
        const uploadForm = new FormData();
        uploadForm.append("file", formData.aadharFile);
        uploadForm.append("folder", "aadhar_cards");
        
        const uploadRes = await fetch("/api/admin/upload", {
          method: "POST",
          body: uploadForm
        });
        const uploadData = await uploadRes.json();
        if (uploadRes.status === 200) {
          aadharUrl = uploadData.url;
        }
      }

      // 2. Prepare booking data
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
        aadhar_url: aadharUrl,
        status: (formData.isStayer || totalPrice === 0) ? 'CONFIRMED' : 'PENDING'
      };


      const res = await fetch("/api/admin/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData)
      });
      const data = await res.json();
      const bookingId = data.id;

      if (!bookingId) throw new Error("Failed to create booking reference");

      // 3. If it's a paid booking and not a stayer, proceed to payment
      if (totalPrice > 0 && !formData.isStayer) {
        await initiatePayment(totalPrice, bookingId, aadharUrl);
      } else {
        // For free/stayer bookings, complete immediately
        completeBooking(formData, serviceName, totalPrice, itemsList, aadharUrl);
      }
    } catch (err: any) {
      console.error("Booking failed:", err);
      alert("Something went wrong. Please try again or contact support.");
    } finally {
      setIsProcessing(false);
    }
  };

  const initiatePayment = async (amount: number, bookingId: string, aadharUrl: string = "") => {
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
            completeBooking(formData, services.find(s => s.id === activeModal)?.name || "Service", amount, formData.items.join(", "), aadharUrl, bookingId);
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

  const completeBooking = (data: any, serviceName: string, totalPrice: number, itemsList: string, aadharUrl: string = "", bookingId?: string) => {
    const message = buildWhatsAppMessage({
      name: data.name,
      phone: data.phone,
      email: data.email || undefined,
      guests: data.guests,
      serviceName,
      items: itemsList ? itemsList.split(", ") : [],
      date: data.date,
      checkOutDate: data.checkOutDate || undefined,
      checkInTime: data.checkInTime || undefined,
      checkOutTime: data.checkOutTime || undefined,
      timeSlot: data.time || undefined,
      durationHours: data.durationHours,
      totalAmount: totalPrice,
      paymentMethod: data.isStayer ? undefined : "ONLINE",
      isStayer: data.isStayer,
      roomNumber: data.roomNumber || undefined,
      aadharUrl: aadharUrl || undefined,
      bookingId,
    });

    setWhatsappMessage(message);
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
                  <h2 className="text-3xl font-bold text-brand-dark-green mb-4">Booking Successful!</h2>
                  <p className="text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
                    Your payment was successful. Please send your booking details to our official WhatsApp to complete the process.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button 
                      onClick={() => {
                        const url = `https://wa.me/917702199889?text=${encodeURIComponent(whatsappMessage)}`;
                        window.open(url, "_blank");
                        
                        // Give the browser 1.5 seconds to fully launch WhatsApp before we navigate away
                        setTimeout(() => {
                          router.push("/dashboard");
                        }, 1500);
                      }} 
                      className="bg-[#25D366] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#20BE5A] transition-all flex items-center justify-center gap-3 w-full sm:w-auto shadow-lg shadow-green-500/20"
                    >
                      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                         <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.878-.788-1.47-1.761-1.643-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                      </svg>
                      Send WhatsApp Details
                    </button>
                    
                    <button 
                      onClick={() => router.push("/dashboard")} 
                      className="text-gray-500 font-bold hover:text-brand-dark-green hover:bg-gray-100 px-6 py-4 rounded-xl transition-all"
                    >
                      Go to Dashboard
                    </button>
                  </div>
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
                               const startDateTime = new Date(`${formData.date}T${formData.checkInTime}`);
                               const endDateTime = new Date(`${formData.checkOutDate}T${formData.checkOutTime}`);
                               let days = 1;
                               if (endDateTime > startDateTime) {
                                 days = Math.ceil((endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60 * 24));
                               }
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
      
    </div>
  );
}
