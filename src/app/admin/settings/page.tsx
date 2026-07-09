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
  Upload,
  Users,
  UserPlus,
  Trash2,
  Key
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

  // Assistant Admin state
  const [assistants, setAssistants] = useState<any[]>([]);
  const [assistantsLoading, setAssistantsLoading] = useState(true);
  const [newAssistant, setNewAssistant] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [submittingAssistant, setSubmittingAssistant] = useState(false);
  const [assistantError, setAssistantError] = useState<string | null>(null);
  const [assistantSuccess, setAssistantSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
    fetchAssistants();
  }, []);

  const fetchAssistants = async () => {
    try {
      const res = await fetch("/api/admin/assistants");
      if (res.ok) {
        const data = await res.json();
        setAssistants(data);
      }
    } catch (err) {
      console.error("Failed to fetch assistant admins", err);
    } finally {
      setAssistantsLoading(false);
    }
  };

  const handleCreateAssistant = async (e: React.FormEvent) => {
    e.preventDefault();
    setAssistantError(null);
    setAssistantSuccess(null);

    const { name, email, password, confirmPassword } = newAssistant;
    if (!name || !email || !password || !confirmPassword) {
      setAssistantError("All fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      setAssistantError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setAssistantError("Password must be at least 6 characters.");
      return;
    }

    setSubmittingAssistant(true);
    try {
      const res = await fetch("/api/admin/assistants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setAssistantSuccess("Assistant admin account created successfully!");
        setNewAssistant({ name: "", email: "", password: "", confirmPassword: "" });
        fetchAssistants();
      } else {
        setAssistantError(data.error || "Failed to create assistant admin.");
      }
    } catch (err) {
      setAssistantError("An error occurred. Please try again.");
    } finally {
      setSubmittingAssistant(false);
    }
  };

  const handleDeleteAssistant = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the assistant admin account for ${name}?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/assistants?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        alert("Account deleted successfully.");
        fetchAssistants();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete account.");
      }
    } catch (err) {
      alert("An error occurred while deleting the account.");
    }
  };

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



            {/* Assistant Admins Management Card */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-brand-gold/10 rounded-2xl text-brand-gold">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#0b1a10]">Assistant Admin Accounts</h2>
                  <p className="text-sm text-gray-400">Manage accounts that have restricted access to bookings only.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Form to Create */}
                <div>
                  <h3 className="text-lg font-bold text-[#0b1a10] mb-6 flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-brand-gold" /> Create Credentials
                  </h3>
                  
                  {assistantError && (
                    <div className="mb-4 p-4 rounded-xl text-xs font-bold bg-red-50 text-red-500 border border-red-100 animate-in fade-in duration-300">
                      {assistantError}
                    </div>
                  )}
                  {assistantSuccess && (
                    <div className="mb-4 p-4 rounded-xl text-xs font-bold bg-green-50 text-green-600 border border-green-100 animate-in fade-in duration-300">
                      {assistantSuccess}
                    </div>
                  )}

                  <form onSubmit={handleCreateAssistant} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Name</label>
                      <input 
                        required
                        type="text"
                        placeholder="e.g. John Doe"
                        className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold transition-all font-bold text-sm"
                        value={newAssistant.name}
                        onChange={e => setNewAssistant({...newAssistant, name: e.target.value})}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Email Address</label>
                      <input 
                        required
                        type="email"
                        placeholder="e.g. assistant@srrresorts.com"
                        className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold transition-all font-bold text-sm"
                        value={newAssistant.email}
                        onChange={e => setNewAssistant({...newAssistant, email: e.target.value})}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Password</label>
                        <input 
                          required
                          type="password"
                          placeholder="••••••••"
                          className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold transition-all font-bold text-sm"
                          value={newAssistant.password}
                          onChange={e => setNewAssistant({...newAssistant, password: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Confirm Password</label>
                        <input 
                          required
                          type="password"
                          placeholder="••••••••"
                          className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold transition-all font-bold text-sm"
                          value={newAssistant.confirmPassword}
                          onChange={e => setNewAssistant({...newAssistant, confirmPassword: e.target.value})}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={submittingAssistant}
                      className="w-full bg-[#0b1a10] hover:bg-[#152e1d] text-white p-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-2 shadow-lg shadow-black/10"
                    >
                      {submittingAssistant ? (
                        <Loader2 className="w-5 h-5 animate-spin text-brand-gold" />
                      ) : (
                        <>
                          <Key className="w-4 h-4 text-brand-gold" /> Create Account
                        </>
                      )}
                    </button>
                  </form>
                </div>

                {/* List of active assistant admins */}
                <div className="flex flex-col h-full border-t md:border-t-0 md:border-l border-gray-100 md:pl-10 pt-10 md:pt-0">
                  <h3 className="text-lg font-bold text-[#0b1a10] mb-6 flex items-center gap-2">
                    <Users className="w-5 h-5 text-brand-gold" /> Active Accounts
                  </h3>

                  {assistantsLoading ? (
                    <div className="flex items-center justify-center py-10 flex-1">
                      <Loader2 className="w-6 h-6 animate-spin text-brand-gold" />
                    </div>
                  ) : assistants.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-gray-400 border border-dashed border-gray-100 rounded-2xl p-6 flex-1">
                      <p className="font-bold text-sm">No assistant accounts</p>
                      <p className="text-xs mt-1 text-center">Use the form to create new login credentials.</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 flex-1">
                      {assistants.map((ast) => (
                        <div 
                          key={ast._id} 
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-brand-gold/20 transition-all"
                        >
                          <div>
                            <p className="font-bold text-[#0b1a10] text-sm">{ast.name}</p>
                            <p className="text-xs text-gray-400 font-medium">{ast.email}</p>
                          </div>
                          <button
                            onClick={() => handleDeleteAssistant(ast._id, ast.name)}
                            className="p-3 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                            title="Delete Account"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
