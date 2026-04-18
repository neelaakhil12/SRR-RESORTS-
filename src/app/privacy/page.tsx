import React from "react";
import { ShieldCheck, Info, Scale, Lock, Eye, RefreshCcw, UserCheck } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] p-8 md:p-16 shadow-xl shadow-brand-green/5 border border-gray-100">
        <header className="mb-12 text-center">
          <div className="w-20 h-20 bg-brand-green/10 rounded-3xl flex items-center justify-center mx-auto mb-6 text-brand-green">
            <ShieldCheck size={40} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#0b1a10] mb-4 text-balance leading-tight">Privacy & Data Protection Policy</h1>
          <p className="text-gray-400 font-medium italic">Your privacy is our priority. Last Updated: April 2024</p>
        </header>

        <div className="space-y-12 prose prose-slate max-w-none text-gray-600 leading-relaxed font-medium">
          <section>
            <h2 className="text-2xl font-bold text-[#0b1a10] mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-brand-gold/10 text-brand-gold rounded-full flex items-center justify-center text-sm font-black">01</span>
              Personal Information We Collect
            </h2>
            <p>
              When you interact with SRR Resort and Convention, we may collect several types of information to provide you with a seamless and personalized experience:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>Identity Data:</strong> Includes first name, last name, username or similar identifier, and government-issued ID (collected at check-in).</li>
              <li><strong>Contact Data:</strong> Includes billing address, email address, and telephone numbers.</li>
              <li><strong>Financial Data:</strong> Includes payment card details and transaction history (processed through secure payment gateways).</li>
              <li><strong>Transactional Data:</strong> Details about payments to and from you and other details of services you have purchased from us.</li>
              <li><strong>Technical Data:</strong> Includes internet protocol (IP) address, browser type and version, time zone setting, and location data.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0b1a10] mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-brand-gold/10 text-brand-gold rounded-full flex items-center justify-center text-sm font-black">02</span>
              How We Use Your Information
            </h2>
            <p>We use your data only when the law allows us to. Most commonly, we use your data in the following circumstances:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <h4 className="font-bold text-[#0b1a10] mb-2 flex items-center gap-2 text-sm"><Lock className="w-4 h-4 text-brand-green" /> Service Fulfillment</h4>
                <p className="text-xs">To process your booking, manage your stay, and provide personalized guest services.</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <h4 className="font-bold text-[#0b1a10] mb-2 flex items-center gap-2 text-sm"><Eye className="w-4 h-4 text-brand-gold" /> Communication</h4>
                <p className="text-xs">To notify you about changes to our services, confirm your booking, or respond to your inquiries.</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <h4 className="font-bold text-[#0b1a10] mb-2 flex items-center gap-2 text-sm"><RefreshCcw className="w-4 h-4 text-brand-green" /> Improvement</h4>
                <p className="text-xs">To improve our website functionality, service quality, and overall guest experience.</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <h4 className="font-bold text-[#0b1a10] mb-2 flex items-center gap-2 text-sm"><UserCheck className="w-4 h-4 text-brand-gold" /> Legal Compliance</h4>
                <p className="text-xs">To fulfill legal obligations, such as tax reporting or responding to government requests.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0b1a10] mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-brand-gold/10 text-brand-gold rounded-full flex items-center justify-center text-sm font-black">03</span>
              Cookies and Tracking
            </h2>
            <p>
              Our website uses cookies to distinguish you from other users. This helps us to provide you with a good experience when you browse our website and also allows us to improve our site. You can set your browser to refuse all or some browser cookies, but note that some parts of this website may become inaccessible or not function properly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0b1a10] mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-brand-gold/10 text-brand-gold rounded-full flex items-center justify-center text-sm font-black">04</span>
              Data Sharing and Disclosure
            </h2>
            <p>
              We do not sell your personal data. We may share your data with:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4 text-sm">
              <li><strong>Service Providers:</strong> IT and administration service providers who help us run our booking systems.</li>
              <li><strong>Professional Advisers:</strong> Including lawyers, bankers, auditors, and insurers.</li>
              <li><strong>Authorities:</strong> Revenue and Customs, regulators, and other authorities based in India who require reporting of processing activities in certain circumstances.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0b1a10] mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-brand-gold/10 text-brand-gold rounded-full flex items-center justify-center text-sm font-black">05</span>
              Your Legal Rights
            </h2>
            <p>Under certain circumstances, you have rights under data protection laws in relation to your personal data:</p>
            <ul className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4 text-xs font-bold uppercase tracking-wider text-brand-gold">
              <li>Request access to data</li>
              <li>Request correction</li>
              <li>Request erasure</li>
              <li>Object to processing</li>
              <li>Right to withdraw consent</li>
              <li>Request restriction</li>
            </ul>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between text-gray-400 gap-4 text-sm italic">
          <div className="flex items-center gap-2">
            <Info size={16} />
            <span>Questions? Contact us at srrresorts@gmail.com</span>
          </div>
          <div className="bg-brand-green/5 text-brand-green px-4 py-2 rounded-full not-italic font-bold text-[10px] uppercase tracking-widest border border-brand-green/10">
            Secure & Encrypted Site
          </div>
        </div>
      </div>
    </div>
  );
}
