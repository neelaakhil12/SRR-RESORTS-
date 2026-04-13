"use client";

import { useState, useRef } from "react";
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

type BookingMode = "ROOM" | "HALL" | "HOUSE" | "LEISURE" | null;

const FLOORS = [
  { name: "First Floor", rooms: ["A1", "A2", "A3", "A4"] },
  { name: "Second Floor", rooms: ["B1", "B2", "B3", "B4"] },
  { name: "Third Floor", rooms: ["C1", "C2", "C3", "C4"] },
];

const HOUSE_CLUSTERS = [
  { name: "Cluster A (Houses 1-3)", houses: ["House 1", "House 2", "House 3"] },
  { name: "Cluster B (Houses 4-6)", houses: ["House 4", "House 5", "House 6"] }
];

const SERVICES = [
  {
    id: "ROOM",
    name: "Luxury Room Booking",
    description: "Experience absolute comfort in our 12 premium luxury rooms. Choose your preferred floor and room to secure your perfect stay.",
    features: ["Room-wise selection (A1-C4)", "Premium amenities", "Scenic views", "24/7 Room Service"],
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "HOUSE",
    name: "Independent Houses",
    description: "Book one of our 6 exclusive independent houses. Set in nature, every cluster of three houses shares a private bonfire and a serene water body.",
    features: ["Private accommodations", "Shared bonfire pit", "Water body access", "Nature immersed"],
    image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "HALL",
    name: "Grand Function Hall & Convention",
    description: "Host your weddings, corporate events, and parties in our exclusive function hall. We guarantee complete privacy by booking only one event at a time.",
    features: ["Large seating capacity", "Customizable decor", "Catering options", "Dedicated entrance"],
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "LEISURE",
    name: "Leisure & Relaxation",
    description: "Unwind by the pool, enjoy indoor activities, and experience modern leisure amenities designed to rejuvenate your mind and body.",
    features: ["Indoor Games", "Swimming Pool", "Nature Walks", "Large dining area for family"],
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1000&auto=format&fit=crop"
  }
];

export default function ServicesPage() {
  const [activeModal, setActiveModal] = useState<BookingMode>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    time: "",
    items: [] as string[],
    aadharFile: null as File | null
  });

  const handleBookNow = (serviceId: string) => {
    setFormData({
      name: "",
      phone: "",
      email: "",
      date: "",
      time: "",
      items: [],
      aadharFile: null
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send to an API
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
          {SERVICES.map((service) => (
            <div key={service.id} className="bg-white rounded-3xl shadow-sm border border-black/5 overflow-hidden flex flex-col hover:shadow-lg transition-all group">
              <div className="relative h-56 md:h-64 w-full bg-gray-200 overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
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

                <button 
                  onClick={() => handleBookNow(service.id)}
                  className="w-full bg-brand-dark-green hover:bg-black text-white py-3 md:py-4 rounded-xl font-bold text-base md:text-lg transition-all shadow-md active:scale-95"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-sunset-start/10 rounded-xl">
                  {activeModal === 'ROOM' && <Navigation className="w-5 h-5 text-brand-sunset-start" />}
                  {activeModal === 'HOUSE' && <HomeIcon className="w-5 h-5 text-brand-sunset-start" />}
                  {activeModal === 'HALL' && <CalendarIcon className="w-5 h-5 text-brand-sunset-start" />}
                  {activeModal === 'LEISURE' && <Info className="w-5 h-5 text-brand-sunset-start" />}
                </div>
                <h3 className="text-xl font-bold text-brand-dark-green">
                  {isSuccess ? 'Booking Confirmed' : `Book ${SERVICES.find(s => s.id === activeModal)?.name}`}
                </h3>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-10">
              {isSuccess ? (
                <div className="text-center py-12 animate-in zoom-in-95">
                  <div className="w-20 h-20 bg-green-100 text-brand-green rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h2 className="text-3xl font-bold text-brand-dark-green mb-4">Request Received!</h2>
                  <p className="text-gray-500 mb-8 max-w-md mx-auto">
                    Thank you for choosing SRR Resorts. Our team will verify your details and Aadhar document, then contact you at **{formData.phone}** to finalize your reservation.
                  </p>
                  <button 
                    onClick={() => setActiveModal(null)}
                    className="bg-brand-dark-green text-white px-10 py-4 rounded-xl font-bold hover:shadow-lg transition-all"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="grid lg:grid-cols-2 gap-10">
                  {/* Left Column: Personal Info */}
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-brand-gold uppercase tracking-[0.2em] mb-4">1. Personal Details</h4>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-brand-dark-green/60 uppercase ml-1">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input 
                            required 
                            type="text" 
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-sunset-start outline-none transition-all" 
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-brand-dark-green/60 uppercase ml-1">Phone</label>
                          <div className="relative">
                            <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input 
                              required 
                              type="tel" 
                              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-sunset-start outline-none transition-all" 
                              placeholder="+91 90000 00000"
                              value={formData.phone}
                              onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-brand-dark-green/60 uppercase ml-1">Email</label>
                          <div className="relative">
                            <MailIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input 
                              required 
                              type="email" 
                              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-sunset-start outline-none transition-all" 
                              placeholder="john@example.com"
                              value={formData.email}
                              onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-brand-gold uppercase tracking-[0.2em] mb-4">2. Identity Verification</h4>
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center cursor-pointer hover:border-brand-sunset-start hover:bg-brand-sunset-start/5 transition-all group"
                      >
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          className="hidden" 
                          accept="image/*,.pdf"
                          onChange={(e) => setFormData({...formData, aadharFile: e.target.files?.[0] || null})}
                        />
                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-brand-sunset-start/20">
                          <Upload className="w-5 h-5 text-gray-400 group-hover:text-brand-sunset-start" />
                        </div>
                        <p className="text-sm font-bold text-brand-dark-green mb-1">
                          {formData.aadharFile ? formData.aadharFile.name : 'Upload Aadhar Card'}
                        </p>
                        <p className="text-xs text-gray-400">PDF, JPG or PNG (Max 5MB)</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Slot/Date Info */}
                  <div className="space-y-6">
                    <h4 className="text-sm font-bold text-brand-gold uppercase tracking-[0.2em] mb-4">3. Booking Details</h4>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-brand-dark-green/60 uppercase ml-1">Select Date</label>
                        <div className="relative">
                          <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input 
                            required 
                            type="date" 
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-sunset-start outline-none transition-all"
                            value={formData.date}
                            onChange={(e) => setFormData({...formData, date: e.target.value})}
                          />
                        </div>
                      </div>

                      {activeModal === 'HALL' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-brand-dark-green/60 uppercase ml-1">Available Time</label>
                            <div className="relative">
                              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <input 
                                required 
                                type="time" 
                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-sunset-start outline-none transition-all"
                                value={formData.time}
                                onChange={(e) => setFormData({...formData, time: e.target.value})}
                              />
                            </div>
                          </div>
                          <div className="flex items-end pb-3">
                             <div className="flex items-center gap-2 text-[10px] text-gray-400 bg-gray-50 p-3 rounded-lg w-full">
                               <ShieldCheck className="w-3 h-3 text-brand-gold" /> Exclusive Event Access
                             </div>
                          </div>
                        </div>
                      )}

                      {(activeModal === 'ROOM' || activeModal === 'HOUSE') && (
                        <div className="space-y-4">
                          <label className="text-xs font-bold text-brand-dark-green/60 uppercase ml-1">Available Slots</label>
                          <div className="max-h-60 overflow-y-auto pr-2 space-y-4">
                            {activeModal === 'ROOM' ? FLOORS.map(floor => (
                              <div key={floor.name} className="space-y-2">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{floor.name}</p>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                  {floor.rooms.map(room => (
                                    <button
                                      key={room}
                                      type="button"
                                      onClick={() => toggleItem(room)}
                                      className={`py-3 text-xs font-bold rounded-lg transition-all border
                                        ${formData.items.includes(room) 
                                          ? 'bg-brand-dark-green text-white border-brand-dark-green shadow-md' 
                                          : 'bg-white text-brand-dark-green border-gray-100 hover:border-brand-sunset-start'}
                                      `}
                                    >
                                      {room}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )) : HOUSE_CLUSTERS.map(cluster => (
                              <div key={cluster.name} className="space-y-2">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{cluster.name}</p>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                  {cluster.houses.map(house => (
                                    <button
                                      key={house}
                                      type="button"
                                      onClick={() => toggleItem(house)}
                                      className={`py-3 text-[10px] font-bold rounded-lg transition-all border
                                        ${formData.items.includes(house) 
                                          ? 'bg-brand-dark-green text-white border-brand-dark-green shadow-md' 
                                          : 'bg-white text-brand-dark-green border-gray-100 hover:border-brand-sunset-start'}
                                      `}
                                    >
                                      {house}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-6 relative">
                       <button 
                         type="submit"
                         className="w-full bg-sunset-gradient text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-brand-sunset-start/20 hover:opacity-90 transition-all active:scale-[0.98]"
                       >
                         Request Booking Now
                       </button>
                       <p className="text-[10px] text-gray-400 text-center mt-3 flex items-center justify-center gap-1">
                         <ShieldCheck className="w-3 h-3" /> Securely processed by SRR Hospitality Systems
                       </p>
                    </div>
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
