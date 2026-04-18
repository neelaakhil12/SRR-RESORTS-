import React from "react";
import { ScrollText, Info, Users, Clock, ShieldAlert, Camera, MapPin, Beer } from "lucide-react";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] p-8 md:p-16 shadow-xl shadow-brand-green/5 border border-gray-100">
        <header className="mb-12 text-center">
          <div className="w-20 h-20 bg-brand-gold/10 rounded-3xl flex items-center justify-center mx-auto mb-6 text-brand-gold">
            <ScrollText size={40} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#0b1a10] mb-4 text-balance leading-tight">Terms & Conditions of Occupancy</h1>
          <p className="text-gray-400 font-medium italic">Establishing a foundation of trust and respect. Updated: April 2024</p>
        </header>

        <div className="space-y-12 prose prose-slate max-w-none text-gray-600 leading-relaxed font-medium">
          <section>
            <h2 className="text-2xl font-bold text-[#0b1a10] mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-brand-gold/10 text-brand-gold rounded-full flex items-center justify-center text-sm font-black">01</span>
              Acceptance of Terms
            </h2>
            <p>
              By accessing and using the services provided by SRR Resort and Convention, you agree to comply with and be bound by the following terms and conditions. These terms apply to all guests, visitors, and users of the resort premises and digital platforms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0b1a10] mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-brand-gold/10 text-brand-gold rounded-full flex items-center justify-center text-sm font-black">02</span>
              Check-in and Guest Policy
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="p-5 border border-gray-100 rounded-3xl bg-gray-50/50">
                <Clock className="w-6 h-6 text-brand-green mb-3" />
                <h4 className="font-bold text-[#0b1a10] mb-2">Timings</h4>
                <p className="text-sm">Check-in: 11:30 AM <br/> Check-out: 10:00 AM <br/> Early check-in or late check-out is subject to availability and additional charges.</p>
              </div>
              <div className="p-5 border border-gray-100 rounded-3xl bg-gray-50/50">
                <Users className="w-6 h-6 text-brand-gold mb-3" />
                <h4 className="font-bold text-[#0b1a10] mb-2">Identification</h4>
                <p className="text-sm">Valid government-issued ID (AADHAR, PAN, Passport) is mandatory for ALL guests at the time of check-in. Foreigner nationals must provide a valid Passport and Visa.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0b1a10] mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-brand-gold/10 text-brand-gold rounded-full flex items-center justify-center text-sm font-black">03</span>
              Resort Conduct & Rules
            </h2>
            <p className="mb-6">To ensure all guests enjoy a peaceful environment, we maintain strict conduct rules:</p>
            <ul className="space-y-4">
              <li className="flex items-start gap-4">
                <div className="p-2 bg-red-50 text-red-500 rounded-lg shrink-0 mt-1"><Beer size={16}/></div>
                <div><span className="font-bold text-[#0b1a10]">Prohibited Substances:</span> Consumption of illegal drugs or excessive public intoxication is strictly prohibited. Management reserves the right to evict guests violating this rule.</div>
              </li>
              <li className="flex items-start gap-4">
                <div className="p-2 bg-brand-gold/10 text-brand-gold rounded-lg shrink-0 mt-1"><ShieldAlert size={16}/></div>
                <div><span className="font-bold text-[#0b1a10]">Noise Pollution:</span> Loud music or disruptive noise is not permitted after 10:00 PM in the residential areas to maintain tranquility for all guests.</div>
              </li>
              <li className="flex items-start gap-4">
                <div className="p-2 bg-brand-green/10 text-brand-green rounded-lg shrink-0 mt-1"><Camera size={16}/></div>
                <div><span className="font-bold text-[#0b1a10]">Commercial Use:</span> Professional photography or videography for commercial purposes is not allowed without prior written permission and potentially additional fees.</div>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0b1a10] mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-brand-gold/10 text-brand-gold rounded-full flex items-center justify-center text-sm font-black">04</span>
              Damages and Liability
            </h2>
            <p>
              Guests are responsible for any damage caused to the resort's property, including furniture, fixtures, and landscaping, during their stay. Any identified damages will be billed to the guest's account prior to check-out. 
            </p>
            <div className="mt-4 p-4 border-l-4 border-brand-gold bg-brand-gold/5 rounded-r-2xl italic text-sm">
              Note: SRR Resort and Convention is not liable for loss, theft, or damage to personal items brought onto the premises.
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0b1a10] mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-brand-gold/10 text-brand-gold rounded-full flex items-center justify-center text-sm font-black">05</span>
              Force Majeure
            </h2>
            <p>
              The resort shall not be liable for failure to provide services due to events beyond its control, including but not limited to natural disasters, government regulations, or large-scale utility failures.
            </p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between text-gray-400 gap-4 text-sm italic">
          <div className="flex items-center gap-2">
            <MapPin size={16} />
            <span>Lakkarm, Choutuppal, Yadadri Bhuvanagiri, 508252</span>
          </div>
          <div className="text-brand-gold font-bold not-italic">
            srrresorts@gmail.com
          </div>
        </div>
      </div>
    </div>
  );
}
