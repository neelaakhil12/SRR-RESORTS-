"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Calendar, 
  Settings, 
  Image as ImageIcon, 
  LayoutDashboard, 
  Package, 
  ChevronRight,
  LogOut,
  Ticket
} from "lucide-react";
import { useRouter } from "next/navigation";


const navItems = [
  { id: "overview", label: "Overview", href: "/admin", icon: LayoutDashboard },
  { id: "bookings", label: "All Bookings", href: "/admin/bookings", icon: Calendar },
  { id: "services", label: "Browse by Services", href: "/admin/services", icon: Package },
  { id: "gallery", label: "Gallery Mall", href: "/admin/gallery", icon: ImageIcon },
  { id: "coupons", label: "Manage Coupons", href: "/admin/coupons", icon: Ticket },
  { id: "settings", label: "Site Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/admin/profile");
        if (res.ok) {
          const data = await res.json();
          setRole(data.role);
        }
      } catch (err) {
        console.error("Failed to fetch admin profile", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleSignOut = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/employeelogin");
    router.refresh();
  };

  const filteredNavItems = navItems.filter(item => {
    if (loading) return false;
    if (role === "assistant") {
      return item.id === "bookings";
    }
    return true; // super admin sees all
  });

  return (
    <aside className="w-72 bg-[#0b1a10] text-white flex flex-col h-screen sticky top-0 border-r border-brand-gold/10">
      {/* Brand */}
      <div className="p-8">
        <Link href="/" className="group">
          <h2 className="text-2xl font-bold tracking-tighter">
            SRR{" "}
            <span className="text-brand-sunset-start group-hover:text-brand-gold transition-colors">
              {role === "super" ? "Super Admin" : role === "assistant" ? "Assistant Admin" : "Admin"}
            </span>
          </h2>
          <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] mt-1">
            {role === "super" ? "Owner Portal" : role === "assistant" ? "Assistant Panel" : "Management Portal"}
          </p>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {!loading &&
          filteredNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`
                  flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl font-medium transition-all group
                  ${isActive
                    ? "bg-brand-gold text-[#0b1a10] shadow-lg shadow-brand-gold/20"
                    : "hover:bg-white/5 text-white/60 hover:text-white"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <item.icon
                    className={`w-5 h-5 ${isActive ? "text-[#0b1a10]" : "text-brand-gold"} group-hover:scale-110 transition-transform`}
                  />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4" />}
              </Link>
            );
          })}
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-white/5">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-red-400 hover:bg-red-400/10 transition-all font-medium"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

