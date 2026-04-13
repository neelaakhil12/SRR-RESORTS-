import { Calendar, Users, Home, Settings, Lock } from "lucide-react";

export default function AdminPanel() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-dark-green text-white flex flex-col">
        <div className="p-6">
          <h2 className="text-2xl font-bold tracking-tighter">
            SRR <span className="text-brand-sunset-start">Admin</span>
          </h2>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <a href="#" className="flex items-center gap-3 bg-white/10 px-4 py-3 rounded-xl font-medium">
            <Home className="w-5 h-5" /> Overview
          </a>
          <a href="#" className="flex items-center gap-3 hover:bg-white/5 px-4 py-3 rounded-xl font-medium transition-colors">
            <Calendar className="w-5 h-5" /> All Bookings
          </a>
          <a href="#" className="flex items-center gap-3 hover:bg-white/5 px-4 py-3 rounded-xl font-medium transition-colors">
             <Lock className="w-5 h-5" /> Manage Room Blocks
          </a>
          <a href="#" className="flex items-center gap-3 hover:bg-white/5 px-4 py-3 rounded-xl font-medium transition-colors">
            <Users className="w-5 h-5" /> Customers
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Overview</h1>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm border-l-4 border-l-brand-green">
            <p className="text-sm text-gray-500 font-medium">Pending Bookings</p>
            <p className="text-3xl font-bold text-gray-800 mt-2">12</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm border-l-4 border-l-brand-sunset-start">
            <p className="text-sm text-gray-500 font-medium">Rooms Available Today</p>
            <p className="text-3xl font-bold text-gray-800 mt-2">5 <span className="text-sm font-normal text-gray-400">/ 12</span></p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm border-l-4 border-l-brand-gold">
            <p className="text-sm text-gray-500 font-medium">Hall Booked Today</p>
            <p className="text-3xl font-bold text-gray-800 mt-2">Yes</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-2 gap-4">
             <button className="flex flex-col items-start p-6 bg-srr-cream rounded-xl hover:bg-orange-50 transition-colors border border-gray-100">
               <Calendar className="w-6 h-6 text-brand-sunset-start mb-2" />
               <h3 className="font-bold text-gray-800">Add Manual Booking</h3>
               <p className="text-sm text-gray-500 mt-1 text-left">Instantly block a room for a walk-in customer.</p>
             </button>
             <button className="flex flex-col items-start p-6 bg-srr-cream rounded-xl hover:bg-green-50 transition-colors border border-gray-100">
               <Lock className="w-6 h-6 text-brand-green mb-2" />
               <h3 className="font-bold text-gray-800">Block Function Hall</h3>
               <p className="text-sm text-gray-500 mt-1 text-left">Reserve the hall for maintenance or an offline event.</p>
             </button>
          </div>
        </div>
      </main>
    </div>
  );
}
