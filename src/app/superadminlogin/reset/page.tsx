"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Loader2, ArrowRight, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import Link from "next/link";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Eye icon states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError("Reset token is missing in the URL.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/superadminlogin");
        }, 3000);
      } else {
        setError(data.error || "Failed to reset password.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center">
        <h2 className="text-center text-2xl font-black text-white">Invalid Reset Link</h2>
        <p className="mt-3 text-center text-xs text-red-400 font-bold uppercase tracking-widest leading-relaxed">
          The link is missing a security token.
        </p>
        <div className="mt-8">
          <Link
            href="/superadminlogin"
            className="text-[10px] font-black uppercase tracking-widest text-brand-gold hover:text-white transition-colors"
          >
            Go back to Login
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle2 className="w-16 h-16 text-brand-gold animate-bounce" />
        </div>
        <h2 className="text-center text-2xl font-black text-white">Password Updated!</h2>
        <p className="text-center text-sm text-gray-400 font-bold leading-relaxed">
          Your password has been changed successfully. Redirecting you to the login page...
        </p>
        <div className="pt-4">
          <Link
            href="/superadminlogin"
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#0b1a10] bg-brand-gold hover:bg-white px-6 py-3 rounded-xl transition-all"
          >
            Login Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form className="mt-10 space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-4">
        {/* New Password Field */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-white/40 px-1">New Password</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-white/40 group-focus-within:text-brand-gold transition-colors">
              <Lock className="h-5 w-5" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              className="appearance-none relative block w-full pl-14 pr-14 py-5 border border-white/10 placeholder-white/20 text-white rounded-[1.25rem] focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition-all font-bold bg-white/[0.03] focus:bg-white/[0.05]"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-5 flex items-center text-white/40 hover:text-brand-gold transition-colors"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-white/40 px-1">Confirm New Password</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-white/40 group-focus-within:text-brand-gold transition-colors">
              <Lock className="h-5 w-5" />
            </div>
            <input
              id="confirm-password"
              name="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              required
              className="appearance-none relative block w-full pl-14 pr-14 py-5 border border-white/10 placeholder-white/20 text-white rounded-[1.25rem] focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition-all font-bold bg-white/[0.03] focus:bg-white/[0.05]"
              placeholder="••••••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-5 flex items-center text-white/40 hover:text-brand-gold transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl text-[11px] font-black uppercase tracking-wider bg-red-950/50 text-red-400 border border-red-900/50 animate-in fade-in slide-in-from-top-1 duration-300">
          {error}
        </div>
      )}

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
              Update Password <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          )}
        </button>
      </div>
    </form>
  );
}

export default function ResetPasswordPage() {
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
          <h2 className="text-center text-3xl font-black text-white">Set New Password</h2>
          <p className="mt-3 text-center text-xs text-brand-gold font-black uppercase tracking-[0.2em] leading-relaxed">
            Create a secure new password
          </p>
        </div>

        <Suspense
          fallback={
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-brand-gold" />
            </div>
          }
        >
          <ResetPasswordForm />
        </Suspense>

        <div className="pt-6">
          <p className="text-center text-[10px] text-white/30 font-bold uppercase tracking-widest leading-relaxed">
            Owner Security clearance required.
          </p>
        </div>
      </div>
    </div>
  );
}
