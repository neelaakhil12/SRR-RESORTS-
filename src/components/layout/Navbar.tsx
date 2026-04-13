"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
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
    { name: "Gallery", href: "/gallery" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className={`z-50 w-full bg-black border-b border-white/10 ${isHome ? 'absolute top-0' : 'sticky top-0'}`}>
      <div className={`mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 ${isHome ? 'h-24 md:h-28' : 'h-16 md:h-20'}`}>
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 relative z-[60]">
            <img 
              src="/logo.png" 
              alt="SRR Resorts Logo" 
              className={`${isHome ? 'h-20 md:h-36' : 'h-16 md:h-24'} w-auto object-contain transition-all duration-300`}
            />
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name}
              href={link.href} 
              className={`text-sm font-medium hover:text-brand-sunset-start transition-colors ${pathname === link.href ? 'text-brand-sunset-start' : 'text-white/90'}`}
            >
              {link.name}
            </Link>
          ))}
        </nav>
        
        <div className="hidden md:flex items-center gap-6">
          <Link 
            href="/login" 
            className="text-sm font-medium text-white/90 hover:text-brand-sunset-start transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/services"
            className="rounded-full bg-sunset-gradient px-6 py-2.5 text-sm font-medium text-white shadow-md hover:opacity-90 transition-opacity"
          >
            Book Now
          </Link>
        </div>
        
        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden relative z-[60] p-2 text-white hover:text-brand-gold transition-colors"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
        </button>
      </div>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 bg-black flex flex-col pt-32 px-10 md:hidden"
          >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-sunset-start opacity-10 rounded-full blur-[100px] -mr-32 -mt-32" />
            
            <nav className="flex flex-col gap-6 relative z-10">
              {navLinks.map((link, idx) => (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + idx * 0.1 }}
                  key={link.name}
                >
                  <Link
                    href={link.href}
                    className={`text-xl md:text-2xl font-bold transition-all ${pathname === link.href ? 'text-brand-sunset-start pl-4 border-l-4 border-brand-sunset-start' : 'text-white/70 hover:text-white'}`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.6 }}
               className="mt-10 space-y-3 relative z-10"
            >
              <Link
                href="/services"
                className="flex items-center justify-between w-full bg-sunset-gradient text-white px-5 py-3 rounded-lg font-bold text-base shadow-xl active:scale-95 transition-all"
              >
                Book Now <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/login"
                className="block text-center w-full bg-white/5 border border-white/10 text-white/70 px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-white/10 transition-all"
              >
                Log in
              </Link>
            </motion.div>

            <div className="mt-auto pb-12 text-center relative z-10">
               <p className="text-white/30 text-xs font-bold uppercase tracking-widest leading-loose">
                 SRR Resorts & Convention <br/>
                 Purity You Can Trust
               </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
