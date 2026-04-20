'use client';

import { useState } from "react";
import { openWhatsApp } from "@/lib/whatsapp";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { name, email, message } = formData;
      
      const whatsappMsg = `*New Contact Inquiry from SRR Resorts Website*\n\n` +
        `*Name:* ${name}\n` +
        `*Email:* ${email}\n` +
        `*Message:* ${message}\n\n` +
        `_Sent via SRR Resorts Contact Form_`;

      openWhatsApp(whatsappMsg);
      
      // We don't clear the form immediately so the user can see what they sent
      // but we could if desired.
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-black/5 space-y-6">
      <div>
        <label className="block text-sm font-medium text-brand-dark-green mb-2">Name</label>
        <input 
          type="text" 
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-sunset-start" 
          placeholder="Your Name" 
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-brand-dark-green mb-2">Email</label>
        <input 
          type="email" 
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-sunset-start" 
          placeholder="Your Email" 
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-brand-dark-green mb-2">Message</label>
        <textarea 
          name="message"
          rows={4} 
          value={formData.message}
          onChange={handleChange}
          required
          className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-sunset-start" 
          placeholder="How can we help?" 
        />
      </div>
      <button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full bg-sunset-gradient text-white rounded-lg px-4 py-3 font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {isSubmitting ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
