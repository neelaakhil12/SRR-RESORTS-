import { MapPin, Phone, Mail } from "lucide-react";

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
          <form className="bg-white p-8 rounded-2xl shadow-sm border border-black/5 space-y-6">
            <div>
              <label className="block text-sm font-medium text-brand-dark-green mb-2">Name</label>
              <input type="text" className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-sunset-start" placeholder="Your Name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-dark-green mb-2">Email</label>
              <input type="email" className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-sunset-start" placeholder="Your Email" />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-dark-green mb-2">Message</label>
              <textarea rows={4} className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-sunset-start" placeholder="How can we help?" />
            </div>
            <button type="button" className="w-full bg-sunset-gradient text-white rounded-lg px-4 py-3 font-semibold hover:opacity-90 transition-opacity">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
