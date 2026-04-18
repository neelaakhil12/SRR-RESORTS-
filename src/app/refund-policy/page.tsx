import React from "react";
import { HandHelping, Info, AlertTriangle, Clock, CalendarDays } from "lucide-react";

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] p-8 md:p-16 shadow-xl shadow-brand-green/5 border border-gray-100">
        <header className="mb-12 text-center">
          <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-red-500">
            <HandHelping size={40} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#0b1a10] mb-4 text-balance leading-tight">Refund & Cancellation Policy</h1>
          <p className="text-gray-400 font-medium italic">Standardized Policy regarding cancellations and refunds. Updated: April 2024</p>
        </header>

        <div className="space-y-8 prose prose-slate max-w-none text-gray-700 leading-relaxed font-semibold">
          
          <div className="space-y-6">
            {/* 50% Refund Section */}
            <div className="flex gap-6 p-8 bg-brand-green/5 rounded-[2rem] border border-brand-green/10">
              <CalendarDays className="w-10 h-10 text-brand-green shrink-0" />
              <div>
                <h2 className="text-2xl font-black text-[#0b1a10] mb-2 mt-0">50% Refund Availability</h2>
                <p className="text-lg text-gray-800 leading-snug m-0">
                  A 50% refund for the booking will be available only if the cancellation is made <span className="text-brand-green underline decoration-brand-green/30 underline-offset-4">before two days</span> (more than 48 hours) of the check-in date.
                </p>
              </div>
            </div>

            {/* No Refund Section */}
            <div className="flex gap-6 p-8 bg-red-50 rounded-[2rem] border border-red-100">
              <Clock className="w-10 h-10 text-red-500 shrink-0" />
              <div>
                <h2 className="text-2xl font-black text-red-700 mb-2 mt-0">No Refund Policy</h2>
                <p className="text-lg text-red-900 leading-snug m-0 font-bold opacity-80">
                  If the booking is cancelled within 24 hours of the scheduled check-in time, <span className="text-red-600 uppercase tracking-tight">there will be no refund</span> provided.
                </p>
              </div>
            </div>
          </div>

          <section className="mt-12 pt-12 border-t border-gray-100">
            <h3 className="text-xl font-bold text-[#0b1a10] mb-4 flex items-center gap-2">
              <Info size={20} className="text-brand-gold" />
              How to process a cancellation
            </h3>
            <p className="text-gray-500 font-medium text-sm">
              To request a cancellation, please email our support team at <span className="font-bold text-gray-700">srrresorts@gmail.com</span> with your booking ID and direct contact information. Our team will review the request based on the timings mentioned above and process the refund (if eligible) within 7-10 working days.
            </p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between text-gray-400 gap-4 text-sm italic text-center md:text-left">
          <div className="flex items-center gap-2">
            <span>SRR Resort and Convention &copy; {new Date().getFullYear()}</span>
          </div>
          <div className="bg-red-50 text-red-500 px-6 py-2 rounded-full not-italic font-black text-[10px] uppercase tracking-widest border border-red-100 shadow-sm">
            Strict Policy Enforcement
          </div>
        </div>
      </div>
    </div>
  );
}
