"use client";

import { useEffect, useState } from "react";
import { 
  Ticket, 
  Plus, 
  Trash2, 
  Loader2, 
  X, 
  Check, 
  Percent, 
  IndianRupee 
} from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { motion, AnimatePresence } from "framer-motion";

interface Coupon {
  id: string;
  code: string;
  discountType: "fixed" | "percentage";
  discountValue: number;
  isActive: boolean;
}

export default function CouponsManagement() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form Fields
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"fixed" | "percentage">("fixed");
  const [discountValue, setDiscountValue] = useState("");

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await fetch("/api/admin/coupons");
      if (!res.ok) throw new Error("Failed to load coupons");
      const data = await res.json();
      setCoupons(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Failed to fetch coupons", err);
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !discountValue) return;

    setFormLoading(true);
    setSaveError(null);

    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          discountType,
          discountValue: Number(discountValue),
          isActive: true
        })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save coupon");
      }

      setSuccessMsg("Coupon created successfully!");
      setTimeout(() => setSuccessMsg(null), 4000);
      await fetchCoupons();
      setIsModalOpen(false);
      setCode("");
      setDiscountValue("");
      setDiscountType("fixed");
    } catch (err: any) {
      console.error("Save error", err);
      setSaveError(err.message || "Save failed. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    try {
      const res = await fetch("/api/admin/coupons?id=" + id, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        alert("Delete failed: " + (data.error || "Unknown error"));
        return;
      }
      setSuccessMsg("Coupon deleted.");
      setTimeout(() => setSuccessMsg(null), 3000);
      await fetchCoupons();
    } catch (err) {
      console.error("Delete error", err);
      alert("Delete failed. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <AdminSidebar />

      <main className="flex-1 p-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-black text-[#0b1a10]">Manage Coupons</h1>
            <p className="text-gray-400 font-medium mt-2">Create discount coupons that customers can apply to their bookings.</p>
          </div>
          <button 
            onClick={() => { 
              setIsModalOpen(true); 
            }}
            className="bg-brand-gold text-[#0b1a10] px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-[#0b1a10] hover:text-white transition-all shadow-xl shadow-brand-gold/10"
          >
            <Plus className="w-5 h-5" /> Add New Coupon
          </button>
        </header>

        {/* Banners */}
        {successMsg && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl text-green-700 font-bold text-sm flex items-center gap-2">
            <Check className="w-5 h-5" /> {successMsg}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-brand-gold" />
          </div>
        ) : coupons.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Ticket className="w-12 h-12 mb-3 opacity-30 text-brand-gold" />
            <p className="font-bold mb-2">No coupons available.</p>
            <p className="text-xs max-w-xs text-center">Click "Add New Coupon" to create your first discount code.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coupons.map((coupon) => (
              <div key={coupon.id} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all flex items-center justify-between gap-6 relative overflow-hidden">
                {/* Visual Accent */}
                <div className="absolute left-0 top-0 bottom-0 w-2 bg-brand-gold" />
                
                <div className="pl-2">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-brand-dark-green text-brand-gold rounded-full text-xs font-black uppercase tracking-wider">
                      {coupon.code}
                    </span>
                    <span className="text-xs text-green-600 font-bold">Active</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-[#0b1a10] mt-3">
                    {coupon.discountType === "percentage" ? (
                      <span className="flex items-center gap-1">
                        {coupon.discountValue}% Off
                      </span>
                    ) : (
                      <span>₹{coupon.discountValue} Off</span>
                    )}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 font-bold">
                    {coupon.discountType === "percentage" ? "Percentage Discount" : "Flat Discount Amount"}
                  </p>
                </div>

                <div>
                  <button 
                    onClick={() => handleDelete(coupon.id)}
                    className="p-4 rounded-2xl bg-gray-50 text-red-400 hover:bg-red-400/10 transition-all shrink-0"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsModalOpen(false)} 
                className="absolute inset-0 bg-[#0b1a10]/80 backdrop-blur-md" 
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                className="relative bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden flex flex-col"
              >
                {/* Modal Header */}
                <div className="p-8 border-b border-gray-100 flex justify-between items-center shrink-0">
                  <div>
                    <h2 className="text-2xl font-black text-[#0b1a10]">Create Coupon</h2>
                    <p className="text-xs text-brand-gold font-bold uppercase tracking-widest mt-1">
                      DISCOUNT CODE RULES
                    </p>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSave} className="p-8 space-y-6">
                  {saveError && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 font-bold text-sm">
                      ⚠️ {saveError}
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0b1a10]/40 px-1">Coupon Code</label>
                    <input 
                      value={code} 
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      required 
                      className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold transition-all font-black uppercase tracking-wider placeholder:text-gray-300" 
                      placeholder="e.g. WELCOME10" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0b1a10]/40 px-1">Discount Type</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setDiscountType("fixed")}
                        className={`p-4 rounded-2xl font-bold flex items-center justify-center gap-2 border transition-all ${
                          discountType === "fixed" 
                            ? "bg-brand-dark-green text-white border-brand-dark-green shadow-lg shadow-brand-dark-green/20" 
                            : "bg-white text-brand-dark-green border-gray-100"
                        }`}
                      >
                        <IndianRupee className="w-4 h-4" /> Flat Discount
                      </button>
                      <button
                        type="button"
                        onClick={() => setDiscountType("percentage")}
                        className={`p-4 rounded-2xl font-bold flex items-center justify-center gap-2 border transition-all ${
                          discountType === "percentage" 
                            ? "bg-brand-dark-green text-white border-brand-dark-green shadow-lg shadow-brand-dark-green/20" 
                            : "bg-white text-brand-dark-green border-gray-100"
                        }`}
                      >
                        <Percent className="w-4 h-4" /> Percentage
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0b1a10]/40 px-1">
                      {discountType === "percentage" ? "Discount Percentage (%)" : "Flat Discount Value (₹)"}
                    </label>
                    <input 
                      type="number"
                      min="1"
                      max={discountType === "percentage" ? "100" : undefined}
                      value={discountValue} 
                      onChange={(e) => setDiscountValue(e.target.value)}
                      required 
                      className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold transition-all font-black text-[#0b1a10] placeholder:text-gray-300" 
                      placeholder={discountType === "percentage" ? "10" : "500"} 
                    />
                  </div>

                  <div className="pt-4">
                    <button 
                      disabled={formLoading}
                      className="w-full bg-[#0b1a10] text-white py-6 rounded-3xl font-black text-lg uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-brand-dark-green transition-all shadow-2xl shadow-black/10 disabled:opacity-50"
                    >
                      {formLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                        <>
                          <Check className="w-6 h-6 text-brand-gold" /> Create Coupon
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
