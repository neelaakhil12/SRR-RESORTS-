"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function SuperAdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, requiredRole: "super" }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.error || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050d08] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-brand-gold/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-brand-sunset-start/5 blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full space-y-8 bg-[#0b1a10]/80 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.8)] border border-brand-gold/20 relative z-10">
        <div className="text-center">
          <Link href="/" className="inline-block mb-6">
            <h2 className="text-3xl font-black tracking-tighter text-white">
              SRR <span className="text-brand-gold">Resorts</span>
            </h2>
          </Link>
          <h2 className="text-center text-3xl font-black text-white">Super Admin Portal</h2>
          <p className="mt-3 text-center text-xs text-brand-gold font-black uppercase tracking-[0.2em] leading-relaxed">
            Executive Owner Login
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-2xl text-[11px] font-black uppercase tracking-wider bg-red-950/50 text-red-400 border border-red-900/50 animate-in fade-in slide-in-from-top-1 duration-300">
            {error}
          </div>
        )}

        <form className="mt-10 space-y-5" onSubmit={handleLogin}>
          <div className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 px-1">Super Admin Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-white/40 group-focus-within:text-brand-gold transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none relative block w-full pl-14 pr-5 py-5 border border-white/10 placeholder-white/20 text-white rounded-[1.25rem] focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition-all font-bold bg-white/[0.03] focus:bg-white/[0.05]"
                  placeholder="admin@srrresorts.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 px-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-white/40 group-focus-within:text-brand-gold transition-colors">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none relative block w-full pl-14 pr-5 py-5 border border-white/10 placeholder-white/20 text-white rounded-[1.25rem] focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition-all font-bold bg-white/[0.03] focus:bg-white/[0.05]"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-5 px-4 border border-transparent text-sm font-black rounded-[1.25rem] text-[#0b1a10] bg-brand-gold hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-gold disabled:opacity-70 transition-all shadow-2xl shadow-brand-gold/10"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin text-[#0b1a10]" />
              ) : (
                <span className="flex items-center gap-2">
                  Access Dashboard <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </div>
        </form>

        <div className="pt-6">
          <p className="text-center text-[10px] text-white/30 font-bold uppercase tracking-widest leading-relaxed">
            Owner Security clearance required.
          </p>
        </div>
      </div>
    </div>
  );
}
