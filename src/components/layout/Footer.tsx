import Link from "next/link";
import { MapPin, Phone, Mail, MessageSquare } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-black text-white/70 py-10 md:py-16 mt-auto border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="inline-block">
              <img 
                src="/logo.png" 
                alt="SRR Resorts Logo" 
                className="h-20 md:h-32 w-auto object-contain brightness-110"
              />
            </Link>
            <p className="text-sm leading-relaxed text-gray-400 max-w-xs">
              SRR Resort and Convention is your premium destination for peaceful luxury, family stays, and grand celebrations. Purity you can trust in every experience.
            </p>
            <div className="flex pt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-rose-400 shadow-sm border border-white/10 hover:bg-white/10 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="font-bold text-brand-gold text-lg tracking-tight">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link href="/" className="text-gray-300 hover:text-brand-gold transition-colors">Home</Link></li>
              <li><Link href="/services" className="text-gray-300 hover:text-brand-gold transition-colors">Our Services</Link></li>
              <li><Link href="/about" className="text-gray-300 hover:text-brand-gold transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-brand-gold transition-colors">Contact Us</Link></li>
              <li><Link href="/dashboard" className="text-gray-300 hover:text-brand-gold transition-colors">Your Bookings</Link></li>
            </ul>
          </div>
          
          {/* Services Column */}
          <div className="space-y-6">
            <h4 className="font-bold text-brand-gold text-lg tracking-tight">Our Services</h4>
            <ul className="space-y-4 text-gray-300">
              <li><Link href="/services" className="hover:text-brand-gold transition-colors">Luxury Rooms</Link></li>
              <li><Link href="/services" className="hover:text-brand-gold transition-colors">Independent Houses</Link></li>
              <li><Link href="/services" className="hover:text-brand-gold transition-colors">Convention Hall</Link></li>
              <li><Link href="/services" className="hover:text-brand-gold transition-colors">Leisure & Relaxation Activities</Link></li>
            </ul>
          </div>
          
          {/* Contact Details Column */}
          <div className="space-y-6">
            <h4 className="font-bold text-brand-gold text-lg tracking-tight">Contact Us</h4>
            <ul className="space-y-5">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                <span className="text-sm text-gray-300 leading-relaxed">
                  Lakkarm, Choutuppal,<br/>
                  Yadadri Bhuvanagiri, 508252
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-brand-gold shrink-0" />
                <span className="text-sm text-gray-300">+91 77021 99889</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-brand-gold shrink-0" />
                <span className="text-sm text-gray-300">srrresorts@gmail.com</span>
              </li>
              <li className="flex items-center gap-3 pt-2">
                <button className="flex items-center gap-2 text-green-400 font-medium hover:text-green-500 transition-colors">
                  <MessageSquare className="w-6 h-6 fill-green-500/20 text-green-400" />
                  <span>Chat with us</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/5 mt-16 pt-8 text-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} SRR Resort and Convention. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
