import { Metadata } from "next";
import { MapPin, Phone, Mail } from "lucide-react";
import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Contact SRR Resorts & Convention for bookings, inquiries, and event planning. Located in Choutuppal, we are here to provide the best hospitality experience.",
  alternates: {
    canonical: "https://srrresorts.com/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen py-10 md:py-24 px-4 bg-background">
      <div className="max-w-4xl mx-auto w-full">
        <h2 className="text-3xl md:text-5xl font-bold text-brand-dark-green mb-4 md:mb-8 text-center pt-8 md:pt-0">Contact Us</h2>
        <div className="w-20 h-1 bg-sunset-gradient mx-auto rounded-full mb-10 md:mb-16" />
        
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Details */}
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-brand-dark-green mb-4">Get in Touch</h3>
            <p className="text-foreground/70">
              Have questions about a booking or an upcoming event? Reach out to our hospitality team.
            </p>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-black/5">
                <MapPin className="text-brand-sunset-start w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold text-brand-dark-green">Location</p>
                <p className="text-foreground/70">
                  SRR Resorts & Convention, Lakkarm,<br/>
                  Choutuppal, Yadadri Bhuvanagiri,<br/>
                  PIN code: 508252
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-black/5">
                <Phone className="text-brand-sunset-start w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold text-brand-dark-green">Phone</p>
                <div className="text-foreground/70">
                  <p>+91 77021 99889</p>
                  <p>+91 93965 28908</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-black/5">
                <Mail className="text-brand-sunset-start w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold text-brand-dark-green">Email</p>
                <p className="text-foreground/70">srrresorts@gmail.com</p>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <ContactForm />
        </div>

        {/* Google Maps Section */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-brand-dark-green mb-6 text-center">Find Us on Google Maps</h3>
          <div className="bg-white p-4 rounded-3xl shadow-xl border border-black/5 overflow-hidden ring-1 ring-brand-gold/20">
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-gray-100">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3810.1257177651065!2d78.8988358!3d17.2514336!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcba95193c72e27%3A0xe67f9600a9486c43!2sSRR%20Resorts%20%26%20Convention!5e0!3m2!1sen!2sin!4v1713251234567!5m2!1sen!2sin" 
                className="absolute inset-0 w-full h-full border-0"
                allowFullScreen={true}
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
          <div className="mt-8 text-center">
            <a 
              href="https://maps.app.goo.gl/mSrzT1v9DHBVwcn78?g_st=iw" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-brand-dark-green hover:bg-black text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg active:scale-95"
            >
              <MapPin className="w-5 h-5 text-brand-gold" />
              Open in Google Maps
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
