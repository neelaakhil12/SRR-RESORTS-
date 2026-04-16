"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, Bed, Building2, PartyPopper, Waves } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Scroll detection for mobile bottom nav
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const handleScroll = () => {
      // Hide on scroll
      setIsVisible(false);
      
      // Clear previous timeout and set a new one to show on stop
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setIsVisible(true);
      }, 700); // 700ms delay after stop
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeout);
    };
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "About", href: "/about" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contact", href: "/contact" },
  ];

  const categories = [
    { name: "Stays", href: "/services?type=stays", icon: Bed },
    { name: "Convention", href: "/services?type=convention", icon: Building2 },
    { name: "Events", href: "/services?type=events", icon: PartyPopper },
    { name: "Leisure", href: "/services?type=leisure", icon: Waves },
  ];

  return (
    <>
    <header className="z-50 w-full sticky top-0 bg-brand-dark-green shadow-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Header Bar */}
        <div className="flex h-16 lg:h-20 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 relative z-[60]">
              <img 
                src="/logo.png" 
                alt="SRR Resorts Logo" 
                className="h-16 md:h-28 w-auto object-contain transition-all duration-300 transform translate-y-2 md:translate-y-4" 
              />
            </Link>
          </div>
          
          {/* Desktop Links (Main) */}
          <div className="hidden lg:flex items-center gap-6">
            <Link 
              href="/login" 
              className="text-sm font-bold text-white hover:text-brand-gold transition-colors"
            >
              Log in / Register
            </Link>
            <Link
              href="/services"
              className="rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 text-sm font-bold text-white transition-all"
            >
              List your inquiry
            </Link>
          </div>

          {/* Mobile Login Button (Re-added per request) */}
          <div className="lg:hidden">
            <Link 
              href="/login" 
              className="text-xs font-bold text-white bg-white/10 border border-white/20 px-4 py-2 rounded-lg active:scale-95 transition-all"
            >
              Login
            </Link>
          </div>
        </div>

        {/* Categories Bar (Desktop only, similar to Booking.com sub-nav) */}
        {!isOpen && (
          <nav className="hidden lg:flex justify-end gap-2 pb-4">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                href={link.href}
                className={`px-4 py-2 rounded-full border border-transparent text-sm font-bold transition-all hover:bg-white/20 ${pathname === link.href ? 'bg-white/20 border-white/40 text-white' : 'text-white hover:text-brand-gold'}`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        )}
      </div>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-50 bg-brand-dark-green flex flex-col pt-24 px-6 md:hidden"
          >
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-lg font-bold text-white border-b border-white/10 py-3"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-6 grid grid-cols-2 gap-4">
                {categories.map((cat) => (
                  <Link 
                    key={cat.name}
                    href={cat.href}
                    className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-xl border border-white/10"
                  >
                    <cat.icon className="w-6 h-6 text-brand-gold" />
                    <span className="text-xs text-white font-medium">{cat.name}</span>
                  </Link>
                ))}
              </div>
            </nav>

            <div className="mt-10 space-y-4">
              <Link
                href="/login"
                className="block text-center w-full bg-white text-brand-dark-green py-3 rounded-lg font-bold"
              >
                Sign in
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>

    {/* Mobile Bottom Navigation Bar (Smart visibility) */}
    <AnimatePresence>
      {!isOpen && isVisible && (
        <motion.div
          initial={{ y: 100, x: 0, opacity: 0 }}
          animate={{ y: 0, x: 0, opacity: 1 }}
          exit={{ y: 100, x: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-[100] lg:hidden"
        >
          <div className="bg-brand-dark-green border-t border-white/10 flex items-stretch justify-between overflow-hidden">
            {/* Horizontal Scrollable Container */}
            <div className="flex-1 overflow-x-auto no-scrollbar flex items-center px-2">
              <div className="flex items-center gap-0 whitespace-nowrap">
                {[
                  { name: "Home", href: "/", icon: Bed },
                  { name: "Services", href: "/services", icon: Building2 },
                  { name: "About", href: "/about", icon: PartyPopper },
                  { name: "Contact", href: "/contact", icon: ArrowRight },
                  { name: "Gallery", href: "/gallery", icon: Waves },
                ].map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`flex flex-col items-center justify-center gap-1.5 min-w-[85px] px-2 py-4 text-[11px] font-extrabold transition-all active:scale-95 ${pathname === link.href ? 'text-brand-gold' : 'text-white/70 hover:text-white'}`}
                  >
                    <link.icon className={`w-6 h-6 ${pathname === link.href ? 'text-brand-gold' : 'text-white/70'}`} />
                    <span>{link.name}</span>
                  </Link>
                ))}
              </div>
            </div>
            
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    
    <style jsx global>{`
      .no-scrollbar::-webkit-scrollbar {
        display: none;
      }
      .no-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `}</style>
    </>
  );
}
