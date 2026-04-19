"use client";

import { useEffect, useState } from "react";
import { 
  Settings, 
  Save, 
  Loader2, 
  Image as ImageIcon, 
  Type, 
  Layout, 
  Check,
  Upload
} from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

interface HeroSettings {
  title: string;
  subtitle: string;
  backgroundImage: string;
  ctaText: string;
}



export default function AdminSettings() {
  const [hero, setHero] = useState<HeroSettings>({
    title: "",
    subtitle: "",
    backgroundImage: "",
    ctaText: ""
  });
  const [announcement, setAnnouncement] = useState({
    text: "",
    active: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const hRes = await fetch("/api/admin/settings?key=hero");
      const hData = await hRes.json();
      if (hData?.value) setHero(hData.value);

      const aRes = await fetch("/api/admin/settings?key=announcement");
      const aData = await aRes.json();
      if (aData?.value) setAnnouncement(aData.value);
    } catch (err) {
      console.error("Failed to fetch settings", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "hero", value: hero })
      });

      await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "announcement", value: announcement })
      });
      alert("Settings saved successfully!");
    } catch (err) {
      console.error("Save error", err);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "hero");

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (data.url) {
        setHero(prev => ({ ...prev, backgroundImage: data.url }));
      }
    } catch (err) {
      console.error("Upload error", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <AdminSidebar />

      <main className="flex-1 p-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-black text-[#0b1a10]">Site Settings</h1>
            <p className="text-gray-400 font-medium mt-2">Customize the look and feel of the public website.</p>
          </div>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="bg-[#0b1a10] text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-xl shadow-black/10 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5 text-brand-gold" />}
            Save Changes
          </button>
        </header>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-brand-gold" />
          </div>
        ) : (
          <div className="max-w-4xl space-y-8">
            {/* Hero Customization Card */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-brand-gold/10 rounded-2xl text-brand-gold">
                  <Layout className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#0b1a10]">Hero Section</h2>
                  <p className="text-sm text-gray-400">Control the first impression guests get when they land on your site.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Text Fields */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Hero Title</label>
                    <div className="relative">
                      <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        value={hero.title} 
                        onChange={e => setHero({...hero, title: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-100 pl-12 pr-4 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold transition-all font-bold"
                        placeholder="e.g. Welcome to SRR"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Hero Subtitle</label>
                    <textarea 
                      value={hero.subtitle} 
                      onChange={e => setHero({...hero, subtitle: e.target.value})}
                      rows={3}
                      className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold transition-all font-medium resize-none"
                      placeholder="e.g. Where Comfort Meets Luxury"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Button text</label>
                    <input 
                      value={hero.ctaText} 
                      onChange={e => setHero({...hero, ctaText: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold transition-all font-bold"
                      placeholder="e.g. Book Your Stay"
                    />
                  </div>
                </div>

                {/* Image Field */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Background Image</label>
                    <div className="relative aspect-video rounded-[2rem] overflow-hidden group border border-gray-100 shadow-sm">
                      <img 
                        src={hero.backgroundImage || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1000&auto=format&fit=crop"} 
                        className="w-full h-full object-cover"
                        alt="Background"
                      />
                      <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 cursor-pointer">
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                        {uploading ? <Loader2 className="w-8 h-8 animate-spin text-white" /> : (
                          <>
                            <Upload className="w-8 h-8 text-white" />
                            <span className="text-white font-bold text-sm">Replace Image</span>
                          </>
                        )}
                      </label>
                    </div>
                    <p className="text-[10px] text-gray-400 text-center mt-2">Recommended size: 1920x1080px (JPEG or WebP)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Announcement Ticker Card */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-brand-sunset-start/10 rounded-2xl text-brand-sunset-start">
                    <Layout className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[#0b1a10]">Announcement Ticker</h2>
                    <p className="text-sm text-gray-400">The scrolling message at the top of the website.</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-2xl px-4 border border-gray-100">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${announcement.active ? 'text-green-500' : 'text-gray-400'}`}>
                    {announcement.active ? 'Active' : 'Inactive'}
                  </span>
                  <button 
                    onClick={() => setAnnouncement({...announcement, active: !announcement.active})}
                    className={`relative w-12 h-6 rounded-full transition-all duration-300 ${announcement.active ? 'bg-green-500 shadow-lg shadow-green-500/30' : 'bg-gray-200'}`}
                  >
                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${announcement.active ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Ticker Message</label>
                  <div className="relative">
                    <Type className="absolute left-4 top-4 w-4 h-4 text-gray-400" />
                    <textarea 
                      value={announcement.text} 
                      onChange={e => setAnnouncement({...announcement, text: e.target.value})}
                      rows={2}
                      className="w-full bg-gray-50 border border-gray-100 pl-12 pr-4 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold transition-all font-bold resize-none"
                      placeholder="e.g. Booking will be opened in June..."
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 ml-1 italic">* This will scroll infinitely from right to left.</p>
                </div>
              </div>
            </div>



            {/* Other Settings Placeholder */}
            <div className="bg-gray-100/50 border border-dashed border-gray-200 rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-gray-400">
               <Settings className="w-10 h-10 mb-2 opacity-20" />
               <p className="font-bold">More settings (Footer, Social Links) coming soon...</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
