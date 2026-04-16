"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, Bed, Building2, PartyPopper, Waves } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

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
    <header className="z-50 w-full sticky top-0 bg-brand-dark-green shadow-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Header Bar */}
        <div className="flex h-16 md:h-20 items-center justify-between">
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
          <div className="hidden md:flex items-center gap-6">
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
          
          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden relative z-[60] p-2 text-white"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Categories Bar (Desktop only, similar to Booking.com sub-nav) */}
        {!isOpen && (
          <nav className="hidden md:flex justify-end gap-2 pb-4">
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
  );
}
