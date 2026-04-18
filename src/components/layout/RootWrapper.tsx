"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { SplashScreen } from "./SplashScreen";
import { WhatsAppButton } from "./WhatsAppButton";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { AnimatePresence } from "framer-motion";
import NextAuthProvider from "../providers/NextAuthProvider";
import { AuthProvider } from "@/context/AuthContext";

export function RootWrapper({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  const isAdminRoute = pathname?.startsWith("/admin") || pathname?.startsWith("/admin-login");

  useEffect(() => {
    setMounted(true);
    const shown = sessionStorage.getItem("srr_splash_shown");
    if (shown || isAdminRoute) {
      setShowSplash(false);
    }
  }, [isAdminRoute]);

  const handleSplashComplete = () => {
    setShowSplash(false);
    sessionStorage.setItem("srr_splash_shown", "true");
  };

  // Important: Server and first client render must match.
  // We render the Splash by default, and only show children once mounted AND splash is skipped.
  
  if (isAdminRoute) {
    return (
      <main className="flex-1 flex flex-col">
        {children}
      </main>
    );
  }

  return (
    <NextAuthProvider>
      <AuthProvider>
        <AnimatePresence mode="wait">
          {!mounted || showSplash ? (
            <SplashScreen key="splash" onComplete={handleSplashComplete} />
          ) : (
            <div key="content" className="flex-1 flex flex-col">
              <Navbar />
              <main className="flex-1 flex flex-col">
                {children}
              </main>
              <Footer />
              <WhatsAppButton />
            </div>
          )}
        </AnimatePresence>
      </AuthProvider>
    </NextAuthProvider>
  );
}
