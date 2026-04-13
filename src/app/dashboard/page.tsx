import { CalendarDays, Download, MapPin, Receipt, Star } from "lucide-react";

export default function DashboardPage() {
  // Mock data for UI
  const upcomingBookings = [
    {
      id: "BKG-84931",
      type: "ROOM",
      items: ["A1", "A2"],
      date: "Dec 25 - Dec 27, 2026",
      status: "CONFIRMED",
    }
  ];

  const pastBookings = [
    {
      id: "BKG-11234",
      type: "HALL",
      items: ["Grand Function Hall"],
      date: "Oct 10, 2026 (10:00 AM - 5:00 PM)",
      status: "COMPLETED",
    }
  ];

  return (
    <div className="flex flex-col min-h-screen py-12 px-4 bg-srr-cream">
      <div className="max-w-6xl mx-auto w-full">
        <h1 className="text-3xl md:text-4xl font-bold text-brand-dark-green mb-8">My Dashboard</h1>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            {/* Upcoming */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-brand-sunset-start" /> Upcoming Bookings
              </h2>
              {upcomingBookings.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl border border-dashed border-gray-300 text-center text-gray-500">
                  No upcoming bookings. Time to plan a retreat!
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingBookings.map((bkg) => (
                    <div key={bkg.id} className="bg-white p-6 rounded-2xl shadow-sm border border-black/5 flex flex-col sm:flex-row justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="bg-green-100 text-brand-green px-2 py-1 rounded text-xs font-bold">{bkg.status}</span>
                          <span className="text-sm text-gray-500 font-mono">{bkg.id}</span>
                        </div>
                        <h3 className="text-xl font-bold text-brand-dark-green">{bkg.type === "ROOM" ? "Luxury Stay" : "Event Booking"}</h3>
                        <p className="text-gray-600 mt-1">{bkg.items.join(", ")}</p>
                        <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                          <CalendarDays className="w-4 h-4" /> {bkg.date}
                        </div>
                      </div>
                      <div className="flex flex-col justify-center sm:items-end gap-2">
                        <button className="flex items-center justify-center gap-2 bg-brand-dark-green text-white px-4 py-2 rounded-lg text-sm hover:opacity-90 transition-opacity">
                          <Download className="w-4 h-4" /> Download Ticket
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Past */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-brand-gold" /> Past Bookings
              </h2>
              <div className="space-y-4">
                {pastBookings.map((bkg) => (
                  <div key={bkg.id} className="bg-white/50 p-6 rounded-2xl border border-black/5 flex flex-col sm:flex-row justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded text-xs font-bold">{bkg.status}</span>
                        <span className="text-sm text-gray-500 font-mono">{bkg.id}</span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-700">{bkg.type === "ROOM" ? "Luxury Stay" : "Event Booking"}</h3>
                      <p className="text-gray-500 mt-1">{bkg.items.join(", ")}</p>
                      <div className="flex items-center gap-2 mt-3 text-sm text-gray-400">
                        <CalendarDays className="w-4 h-4" /> {bkg.date}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-black/5">
              <div className="w-16 h-16 bg-sunset-gradient rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                JD
              </div>
              <h3 className="text-lg font-bold text-brand-dark-green">John Doe</h3>
              <p className="text-gray-500 text-sm">john@example.com</p>
              
              <div className="mt-6 pt-6 border-t border-gray-100">
                <button className="text-red-500 text-sm font-medium hover:underline">Sign Out</button>
              </div>
            </div>

            <div className="bg-brand-dark-green text-white p-6 rounded-2xl shadow-sm">
              <h3 className="font-bold flex items-center gap-2 mb-2"><Star className="w-4 h-4 text-brand-gold fill-brand-gold" /> Membership</h3>
              <p className="text-sm text-white/80 leading-relaxed mb-4">You are a valued guest at SRR Resorts. Book more stays to unlock exclusive discounts.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
