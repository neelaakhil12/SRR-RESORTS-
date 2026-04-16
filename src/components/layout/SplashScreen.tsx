"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(3);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => {
        setCount(count - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setIsExiting(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [count]);

  useEffect(() => {
    if (isExiting) {
      const timer = setTimeout(() => {
        onComplete();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isExiting, onComplete]);

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-brand-dark-green text-white"
        >
          {/* Background Ambient Glow */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-brand-gold/10 blur-[120px] rounded-full" />
            <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-brand-sunset-start/10 blur-[120px] rounded-full" />
          </div>

          <div className="relative z-10 flex flex-col items-center gap-8">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative"
            >
              <img 
                src="/logo.png" 
                alt="SRR Resorts" 
                className="h-32 md:h-48 w-auto object-contain"
              />
              <motion.div 
                animate={{ 
                  scale: [1, 1.05, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 bg-brand-gold/20 blur-2xl -z-10 rounded-full"
              />
            </motion.div>

            {/* Welcome Text */}
            <div className="text-center space-y-2">
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-2xl md:text-4xl font-black tracking-[0.2em] text-brand-gold uppercase"
              >
                Welcome To
              </motion.h1>
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="text-lg md:text-xl font-bold tracking-[0.1em] text-white/80"
              >
                SRR RESORTS & CONVENTION
              </motion.h2>
            </div>

            {/* Countdown Overlay */}
            <div className="h-32 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {count > 0 ? (
                  <motion.span
                    key={count}
                    initial={{ scale: 0, opacity: 0, rotate: -20 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    exit={{ scale: 2, opacity: 0, rotate: 20 }}
                    transition={{ duration: 0.5, ease: "backOut" }}
                    className="text-7xl md:text-9xl font-black text-white/20"
                  >
                    {count}
                  </motion.span>
                ) : (
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1.2, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center"
                  >
                    <div className="h-1 w-24 bg-brand-gold rounded-full" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Bottom Progress Indicator */}
          <div className="absolute bottom-12 w-48 h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 3.5, ease: "linear" }}
              className="h-full bg-brand-gold shadow-[0_0_10px_rgba(212,175,55,0.5)]"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
