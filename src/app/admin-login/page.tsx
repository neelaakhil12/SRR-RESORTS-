"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
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
        body: JSON.stringify({ email, password }),
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
    <div className="min-h-screen flex items-center justify-center bg-[#fdfcf9] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] border border-gray-100">
        <div className="text-center">
          <Link href="/" className="inline-block mb-6">
            <h2 className="text-3xl font-black tracking-tighter text-[#0b1a10]">
              SRR <span className="text-brand-gold">Resorts</span>
            </h2>
          </Link>
          <h2 className="text-center text-3xl font-black text-[#0b1a10]">Owner Login</h2>
          <p className="mt-3 text-center text-sm text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
            Administrative Access Only
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-2xl text-[11px] font-black uppercase tracking-wider bg-red-50 text-red-500 border border-red-100 animate-in fade-in slide-in-from-top-1 duration-300">
            {error}
          </div>
        )}

        <form className="mt-10 space-y-4" onSubmit={handleLogin}>
          <div className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Admin Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-brand-gold transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none relative block w-full pl-14 pr-5 py-5 border border-gray-100 placeholder-gray-300 text-[#0b1a10] rounded-[1.25rem] focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition-all font-bold bg-gray-50/50"
                  placeholder="admin@srrresorts.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Admin Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-brand-gold transition-colors">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none relative block w-full pl-14 pr-5 py-5 border border-gray-100 placeholder-gray-300 text-[#0b1a10] rounded-[1.25rem] focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition-all font-bold bg-gray-50/50"
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
              className="group relative w-full flex justify-center py-5 px-4 border border-transparent text-sm font-black rounded-[1.25rem] text-white bg-[#0b1a10] hover:bg-[#152e1d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-gold disabled:opacity-70 transition-all shadow-2xl shadow-black/10"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin text-brand-gold" />
              ) : (
                <span className="flex items-center gap-2">
                  Access Dashboard <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </div>
        </form>

        <div className="pt-6">
          <p className="text-center text-[10px] text-gray-300 font-bold uppercase tracking-widest leading-relaxed">
            Protected by secure end-to-end encryption.
          </p>
        </div>
      </div>
    </div>
  );
}
