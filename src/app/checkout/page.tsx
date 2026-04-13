"use client";

import { useState } from "react";
import { CreditCard, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Hardcoded for UI demo
  const bookingSummary = {
    type: "ROOM",
    items: ["A1", "A2"],
    date: "Dec 25, 2026",
    totalAmount: 14000, // INR
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate Razorpay/Stripe delay
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 2000);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-srr-cream flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md w-full text-center border border-black/5 animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-green-100 text-brand-green rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-brand-dark-green mb-4">Payment Successful!</h2>
          <p className="text-gray-500 mb-8">
            Your booking for {bookingSummary.items.join(", ")} is confirmed. Your ticket will be emailed to you shortly.
          </p>
          <Link href="/dashboard" className="bg-brand-dark-green text-white px-8 py-3 rounded-xl font-bold hover:opacity-90 inline-block w-full">
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen py-24 px-4 bg-srr-cream">
      <div className="max-w-6xl mx-auto w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-brand-dark-green mb-4">Checkout</h1>
          <div className="w-24 h-1 bg-sunset-gradient mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Summary */}
          <div className="bg-white rounded-3xl shadow-sm border border-black/5 p-8 order-2 md:order-1">
            <h2 className="text-2xl font-bold text-brand-dark-green mb-6">Booking Summary</h2>
            <div className="space-y-4 text-gray-600 border-b border-gray-100 pb-6 mb-6">
              <div className="flex justify-between">
                <span>Selected {bookingSummary.type === "ROOM" ? "Rooms" : "Hall"}</span>
                <span className="font-semibold text-gray-900">{bookingSummary.items.join(", ")}</span>
              </div>
              <div className="flex justify-between">
                <span>Date</span>
                <span className="font-semibold text-gray-900">{bookingSummary.date}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes & Fees</span>
                <span className="font-semibold text-gray-900">₹{bookingSummary.totalAmount * 0.18}</span>
              </div>
            </div>
            <div className="flex justify-between text-xl font-bold text-brand-dark-green">
              <span>Total Amount</span>
              <span>₹{bookingSummary.totalAmount + (bookingSummary.totalAmount * 0.18)}</span>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-3xl shadow-sm border border-black/5 p-8 order-1 md:order-2">
            <h2 className="text-2xl font-bold text-brand-dark-green mb-6">Guest Details</h2>
            <form onSubmit={handlePayment} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-brand-dark-green mb-2">Full Name</label>
                <input type="text" required className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-sunset-start" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-dark-green mb-2">Email</label>
                <input type="email" required className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-sunset-start" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-dark-green mb-2">Phone Number</label>
                <input type="tel" required className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-sunset-start" placeholder="+91 90000 00000" />
              </div>
              
              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-brand-dark-green text-white flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-70"
                >
                  {loading ? (
                    <span className="animate-pulse">Processing...</span>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" /> Pay Now
                    </>
                  )}
                </button>
                <p className="text-xs text-gray-400 text-center mt-4">Payments are secured and encrypted.</p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
