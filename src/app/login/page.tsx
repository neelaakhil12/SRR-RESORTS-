"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Loader2, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function UserLoginPage() {
  const { sendOtp, verifyOtp, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<1 | 2>(1); // 1: Email, 2: OTP
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await sendOtp(email);
      if (res?.error) {
        setError(res.error);
      } else {
        setStep(2); // Move to OTP step
      }
    } catch (err: any) {
      setError("Failed to send OTP. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await verifyOtp(email, otp);
      if (res?.error) {
        setError(res.error);
      } else {
        // Successful login!
        router.push("/");
        router.refresh();
      }
    } catch (err: any) {
      setError("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError("Failed to initialize Google login.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfcf9] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] border border-gray-100">
        <div className="text-center">
          <Link href="/" className="inline-block mb-6">
            <h2 className="text-3xl font-black tracking-tighter text-[#0b1a10]">
              SRR <span className="text-brand-gold">Resorts</span>
            </h2>
          </Link>
          <h2 className="text-center text-3xl font-black text-[#0b1a10]">
              {step === 1 ? "Welcome Back" : "Verify OTP"}
          </h2>
          <p className="mt-3 text-center text-sm text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
            {step === 1 
              ? "Sign in to manage your bookings and services." 
              : `Enter the 6-digit code sent to ${email}`
            }
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-2xl text-[11px] font-black uppercase tracking-wider bg-red-50 text-red-500 border border-red-100 animate-in fade-in slide-in-from-top-1 duration-300">
            {error}
          </div>
        )}

        {step === 1 ? (
          <form className="mt-10 space-y-4" onSubmit={handleSendOtp}>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-brand-gold transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  required
                  className="appearance-none relative block w-full pl-14 pr-5 py-5 border border-gray-100 placeholder-gray-300 text-[#0b1a10] rounded-[1.25rem] focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition-all font-bold bg-gray-50/50"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-5 px-4 border border-transparent text-sm font-black rounded-[1.25rem] text-white bg-[#0b1a10] hover:bg-[#152e1d] focus:outline-none focus:ring-2 focus:ring-brand-gold disabled:opacity-70 transition-all shadow-2xl shadow-black/10"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin text-brand-gold" />
                ) : (
                  <span className="flex items-center gap-2">
                    Send 6-Digit OTP <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </button>
            </div>
          </form>
        ) : (
          <form className="mt-10 space-y-4 animate-in fade-in zoom-in-95" onSubmit={handleVerifyOtp}>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Verification Code</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-brand-gold transition-colors">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  required
                  maxLength={6}
                  className="appearance-none relative block w-full pl-14 pr-5 py-5 text-center tracking-[0.5em] text-2xl border border-gray-100 placeholder-gray-300 text-[#0b1a10] rounded-[1.25rem] focus:outline-none focus:ring-2 focus:ring-brand-gold transition-all font-black bg-gray-50/50"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                />
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-3">
              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="group relative w-full flex justify-center py-5 px-4 border border-transparent text-sm font-black rounded-[1.25rem] text-white bg-brand-gold hover:bg-[#c29b47] focus:outline-none focus:ring-2 focus:ring-brand-gold disabled:opacity-70 transition-all shadow-2xl shadow-brand-gold/20"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin text-white" />
                ) : (
                  <span className="flex items-center gap-2 text-[#0b1a10]">
                    Verify & Sign In <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => { setStep(1); setOtp(""); }}
                className="text-xs font-bold text-gray-400 hover:text-[#0b1a10] transition-colors"
              >
                Use a different email
              </button>
            </div>
          </form>
        )}

        {step === 1 && (
          <>
            <div className="relative py-4 flex items-center justify-center">
              <div className="absolute left-0 right-0 h-[1px] bg-gray-100"></div>
              <span className="relative px-4 bg-white text-[10px] font-black uppercase tracking-widest text-gray-400">OR</span>
            </div>

            <button 
              onClick={handleGoogleLogin}
              className="w-full py-4 px-6 border-2 border-gray-100 rounded-2xl flex items-center justify-center gap-3 font-bold text-gray-700 hover:bg-gray-50 transition-all active:scale-[0.98]"
            >
              <svg className="w-6 h-6" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
              </svg>
              Continue with Google
            </button>
          </>
        )}

        <div className="mt-12 text-center">
          <Link href="/" className="text-gray-400 text-sm hover:text-[#0b1a10] transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
