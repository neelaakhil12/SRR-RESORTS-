"use client";

import { useState, useEffect } from "react";
import { SplashScreen } from "./SplashScreen";
import { AnimatePresence } from "framer-motion";

export function RootWrapper({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const shown = sessionStorage.getItem("srr_splash_shown");
    if (shown) {
      setShowSplash(false);
    }
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
    sessionStorage.setItem("srr_splash_shown", "true");
  };

  if (!mounted) return <div className="opacity-0">{children}</div>;

  return (
    <>
      <AnimatePresence mode="wait">
        {showSplash ? (
          <SplashScreen key="splash" onComplete={handleSplashComplete} />
        ) : (
          <div key="content" className="flex-1 flex flex-col">
            {children}
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
