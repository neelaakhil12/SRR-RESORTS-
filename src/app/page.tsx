"use client";

import Link from "next/link";
import { Star, ArrowRight, ShieldCheck, Heart, Camera, MapPin, Phone, Mail, Building2, Home as HomeIcon } from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] md:min-h-screen flex items-center justify-center bg-[url('/hero.png')] bg-cover bg-center text-white overflow-hidden">
        {/* No overlays - showing raw image as requested */}
        <div className="z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center pt-20 md:pt-0" style={{ textShadow: '2px 2px 10px rgba(0,0,0,0.8)' }}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="hidden md:inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-black/30 backdrop-blur-sm mb-8 shadow-lg"
          >
            <Star className="w-4 h-4 text-brand-gold fill-brand-gold" />
            <span className="text-sm tracking-wide text-white uppercase font-bold">Premium Resort & Convention</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl md:text-7xl font-bold tracking-tight mb-6 md:mb-6 leading-tight text-white drop-shadow-2xl"
          >
            <span className="md:hidden">Welcome to SRR Resorts</span>
            <span className="hidden md:inline">
              Discover Serenity at <br/>
              <span className="text-brand-sunset-start">SRR Resorts</span>
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="hidden md:block text-lg md:text-xl text-white max-w-2xl mx-auto mb-10 leading-relaxed font-bold drop-shadow-lg"
          >
            Experience unparalleled luxury, seamless bookings, and memorable event hosting. Your ultimate destination for relaxation and grand celebrations.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex w-full justify-center px-6 md:px-0 mt-12 md:mt-0"
          >
            <Link 
              href="/services" 
              className="bg-brand-sunset-start hover:bg-brand-sunset-end text-white px-8 py-3 md:px-10 md:py-4 rounded-lg md:rounded-xl font-bold text-base md:text-lg flex items-center justify-center gap-3 transition-all shadow-xl shadow-brand-sunset-start/20 hover:opacity-90 active:scale-95"
            >
              Book Now <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* About Section Preview */}
      <motion.section {...fadeUp} className="py-12 md:py-24 px-4 bg-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-brand-dark-green mb-4 md:mb-6">Experience Nature's Luxury</h2>
          <div className="w-24 h-1 bg-sunset-gradient rounded-full mb-10" />
          <p className="text-lg text-gray-600 leading-relaxed max-w-4xl mb-12">
            SRR Resort and Convention stands as a beacon of hospitality, offering a unique blend of modern comfort and natural serenity. Whether you seek a quiet escape or a grand venue for celebrations, we provide a tailored experience that guarantees extraordinary memories.
          </p>
          <div className="grid md:grid-cols-2 gap-8 mb-12 text-left w-full">
            <div className="flex gap-4 items-start p-6 bg-srr-cream rounded-2xl border border-black/5">
              <ShieldCheck className="w-10 h-10 text-brand-sunset-start shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-brand-dark-green mb-2">Unmatched Privacy</h3>
                <p className="text-gray-500">Only one event at a time in our hall, ensuring your celebration has our full attention.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start p-6 bg-srr-cream rounded-2xl border border-black/5">
              <Heart className="w-10 h-10 text-brand-sunset-start shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-brand-dark-green mb-2">Nature Immersed</h3>
                <p className="text-gray-500">Clusters of houses featuring private bonfires and serene water bodies for the ultimate retreat.</p>
              </div>
            </div>
          </div>
          <Link href="/about" className="bg-sunset-gradient text-white px-10 py-4 rounded-full font-bold hover:shadow-xl transition-all flex items-center gap-3 active:scale-95">
            Learn More About Us <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </motion.section>

      {/* Services Showcase */}
      <motion.section {...fadeUp} className="py-12 md:py-24 px-4 bg-srr-cream">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-brand-dark-green mb-4 md:mb-6">Our Premium Offerings</h2>
            <div className="w-24 h-1 bg-sunset-gradient mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              { title: "Luxury Rooms", icon: Building2, img: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1000&auto=format&fit=crop" },
              { title: "Independent Houses", icon: HomeIcon, img: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=1000&auto=format&fit=crop" },
              { title: "Convention Hall", icon: Star, img: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1000&auto=format&fit=crop" },
              { title: "Leisure Activities", icon: Heart, img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1000&auto=format&fit=crop" }
            ].map((s, idx) => (
              <div key={idx} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-black/5 hover:shadow-xl transition-all group">
                <div className="relative h-48">
                  <img src={s.img} alt={s.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-black/20" />
                  <s.icon className="absolute top-4 right-4 w-8 h-8 text-white filter drop-shadow-lg" />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-brand-dark-green mb-4">{s.title}</h3>
                  <Link href="/services" className="text-brand-sunset-start font-bold uppercase text-xs tracking-widest hover:text-brand-sunset-end">View Details</Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/services" className="inline-flex items-center gap-2 bg-brand-dark-green text-white px-10 py-5 rounded-full font-bold hover:bg-black transition-all shadow-lg active:scale-95">
              Explore All Services <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Gallery Highlight */}
      <motion.section {...fadeUp} className="py-12 md:py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 md:gap-8 mb-10 md:mb-16">
            <div className="text-left">
              <h2 className="text-3xl md:text-5xl font-bold text-brand-dark-green mb-3 md:mb-4">A Visual Journey</h2>
              <div className="w-24 h-1 bg-sunset-gradient rounded-full mb-6" />
              <p className="text-gray-500 max-w-xl">Take a glimpse into the serene landscapes and elegant interiors that await you at SRR Resorts.</p>
            </div>
            <Link href="/gallery" className="text-brand-sunset-start font-bold flex items-center gap-2 hover:gap-4 transition-all pb-2 border-b-2 border-brand-sunset-start">
              Browse Full Gallery <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              {...fadeUp}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="h-[300px] md:h-[400px] rounded-3xl overflow-hidden shadow-xl group relative"
            >
              <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
              <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                <span className="text-brand-gold font-bold uppercase text-xs tracking-widest">Resort Exterior</span>
                <h4 className="text-white text-xl font-bold">Lush Landscapes</h4>
              </div>
            </motion.div>

            <motion.div 
              {...fadeUp}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="h-[300px] md:h-[400px] rounded-3xl overflow-hidden shadow-xl group relative"
            >
              <img src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
              <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                <span className="text-brand-gold font-bold uppercase text-xs tracking-widest">Convention Hall</span>
                <h4 className="text-white text-xl font-bold">Grand Celebrations</h4>
              </div>
            </motion.div>

            <motion.div 
              {...fadeUp}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="h-[300px] md:h-[400px] rounded-3xl overflow-hidden shadow-xl group relative"
            >
              <img src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
              <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                <span className="text-brand-gold font-bold uppercase text-xs tracking-widest">Leisure Pool</span>
                <h4 className="text-white text-xl font-bold">Refreshing Experience</h4>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Contact Section with Form */}
      <motion.section {...fadeUp} className="py-10 md:py-16 px-4 bg-srr-cream">
        <div className="max-w-5xl mx-auto bg-brand-dark-green rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-brand-sunset-start opacity-10 rounded-full blur-[100px]" />
          
          <div className="relative z-10 grid lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-2">
                <span className="w-2 h-2 bg-brand-gold rounded-full animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-brand-gold">Reach Out</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">Plan Your <br/>Experience</h2>
              <p className="text-white/70 text-base leading-relaxed max-w-sm">Our hospitality team is dedicated to making your stay truly exceptional. Send us a message and we'll get back to you promptly.</p>
              
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10 group-hover:bg-brand-sunset-start transition-colors duration-500">
                    <MapPin className="text-brand-gold group-hover:text-white w-5 h-5" />
                  </div>
                  <p className="text-sm text-white/90">Choutuppal, Yadadri Bhuvanagiri, 508252</p>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10 group-hover:bg-brand-sunset-start transition-colors duration-500">
                    <Phone className="text-brand-gold group-hover:text-white w-5 h-5" />
                  </div>
                  <p className="text-sm text-white/90">+91 77021 99889</p>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10 group-hover:bg-brand-sunset-start transition-colors duration-500">
                    <Mail className="text-brand-gold group-hover:text-white w-5 h-5" />
                  </div>
                  <p className="text-sm text-white/90">srrresorts@gmail.com</p>
                </div>
              </div>
            </div>
            
            <form className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl space-y-4 text-brand-dark-green">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider opacity-60 ml-1">Full Name</label>
                  <input type="text" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-brand-sunset-start outline-none transition-all placeholder:text-gray-300 text-sm" placeholder="John Doe" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider opacity-60 ml-1">Email Address</label>
                  <input type="email" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-brand-sunset-start outline-none transition-all placeholder:text-gray-300 text-sm" placeholder="john@example.com" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider opacity-60 ml-1">Inquiry Type</label>
                <select className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-brand-sunset-start outline-none transition-all text-gray-400 appearance-none text-sm">
                  <option>Select Option</option>
                  <option>Room Booking</option>
                  <option>Convention Hall</option>
                  <option>Independent House</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider opacity-60 ml-1">Your Message</label>
                <textarea rows={3} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-brand-sunset-start outline-none transition-all placeholder:text-gray-300 resize-none text-sm" placeholder="Tell us more about your requirements..." />
              </div>
              <button type="submit" className="w-full bg-brand-sunset-start hover:bg-brand-sunset-end text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 text-base">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
