"use client";

import { useEffect, useState } from "react";
import { 
  Package, 
  Plus, 
  Trash2, 
  Edit3, 
  ChevronRight,
  TrendingUp,
  Tag,
  Loader2,
  X,
  Check,
  ImageIcon,
  Upload,
  ArrowRight,
  Image as LucideImage
} from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { motion, AnimatePresence } from "framer-motion";

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  count_info: string;
  points?: string[];
}

const DEFAULT_SERVICES = [
  {
    name: "Luxury Rooms",
    description: "Experience absolute comfort in our 12 premium luxury rooms. Choose your preferred floor and room to secure your perfect stay.",
    price: 2500,
    category: "ROOM",
    image_url: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1000&auto=format&fit=crop",
    count_info: "12 units",
    points: [
      "Premium floor options (Level A, B, C)",
      "Private pool view architectures",
      "Dedicated room service & cleanup",
      "Complimentary organic breakfast",
      "Modern climate control systems",
      "Smart TV & High-speed fiber WiFi",
      "Priority access to Box Cricket"
    ]
  },
  {
    name: "Independent Houses",
    description: "Book one of our 6 exclusive independent houses. Set in nature, Cluster A (Houses 1-3) features a private bonfire, and Cluster B (Houses 4-6) features a premium foot pool.",
    price: 3000,
    category: "HOUSE",
    image_url: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=1000&auto=format&fit=crop",
    count_info: "6 units",
    points: [
      "Private individual nature cottages",
      "Full-cluster booking options (3 houses)",
      "Private Bonfire pits (Cluster A)",
      "Premium Foot Pool experience (Cluster B)",
      "Nature-immersed living spaces",
      "Spacious 2-bedroom configurations",
      "Personal assistance on-call"
    ]
  },
  {
    name: "Convention Hall",
    description: "Host your weddings, corporate events, and parties in our exclusive function hall. We guarantee complete privacy by booking only one event at a time.",
    price: 0,
    category: "HALL",
    image_url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1000&auto=format&fit=crop",
    count_info: "1 venue",
    points: [
      "Massive 1000+ guest capacity",
      "Strict one-event policy for privacy",
      "Lush garden for outdoor cocktails",
      "State-of-the-art Sound & LED logic",
      "Integrated catering & kitchen zone",
      "Luxurious air-conditioned bridal suite",
      "High-security parking lot"
    ]
  },
  {
    name: "Sports & Leisure Activities",
    description: "Perfect for day visitors! Enjoy our professional-grade sports facilities and swimming pool. Available for individual and group bookings.",
    price: 350,
    category: "LEISURE",
    image_url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1000&auto=format&fit=crop",
    count_info: "Multiple",
    points: [
      "Professional-grade Box Cricket turf",
      "Temperature-controlled Swimming Pool",
      "All sports gear included on request",
      "Certified lifeguards on-site",
      "Deluxe changing & locker rooms",
      "Daily & hourly slots available",
      "Poolside refreshments bar access"
    ]
  }
];

export default function ServicesManagement() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [currentPoints, setCurrentPoints] = useState<string[]>([]);
  const [newPoint, setNewPoint] = useState("");

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch("/api/admin/services");
      if (!res.ok) throw new Error("Failed to load services");
      const data = await res.json();
      // Always ensure we set an array to avoid .map crash
      setServices(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Failed to fetch services", err);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    if (!confirm("This will import the 4 default services into your database. Continue?")) return;
    setSyncing(true);
    setSaveError(null);
    try {
      for (const service of DEFAULT_SERVICES) {
        const res = await fetch("/api/admin/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(service)
        });
        if (!res.ok) throw new Error("Failed to sync one or more services");
      }
      setSuccessMsg("Services imported successfully!");
      setTimeout(() => setSuccessMsg(null), 4000);
      await fetchServices();
    } catch (err: any) {
      console.error("Sync error", err);
      setSaveError("Failed to sync services. Try again later.");
    } finally {
      setSyncing(false);
    }
  };

  const handleReset = async () => {
    if (!confirm("WARNING: This will delete ALL current services and restore the default 4 services with full descriptions. This cannot be undone. Proceed?")) return;
    setSyncing(true);
    setSaveError(null);
    try {
      // 1. Get all services
      const res = await fetch("/api/admin/services");
      const currentServices = await res.json();
      
      // 2. Delete all
      if (Array.isArray(currentServices)) {
        for (const s of currentServices) {
          await fetch("/api/admin/services?id=" + s.id, { method: "DELETE" });
        }
      }

      // 3. Re-sync
      for (const service of DEFAULT_SERVICES) {
        await fetch("/api/admin/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(service)
        });
      }

      setSuccessMsg("System reset to defaults successfully!");
      setTimeout(() => setSuccessMsg(null), 4000);
      await fetchServices();
    } catch (err: any) {
      console.error("Reset error", err);
      setSaveError("Failed to reset services. Please try manually deleting them.");
    } finally {
      setSyncing(false);
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormLoading(true);
    setSaveError(null);
    const formData = new FormData(e.currentTarget);
    const body = Object.fromEntries(formData.entries());
    
    // Add points to body
    (body as any).points = currentPoints;

    // Convert price to number
    (body as any).price = Number(body.price);

    try {
      const method = editingService?.id ? "PUT" : "POST";
      const payload = editingService?.id ? { ...body, id: editingService.id } : body;

      const res = await fetch("/api/admin/services", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save service");
      }

      setSuccessMsg(editingService ? "Service updated successfully!" : "Service created successfully!");
      setTimeout(() => setSuccessMsg(null), 4000);
      await fetchServices();
      setIsModalOpen(false);
      setEditingService(null);
      setPreviewUrl(null);
    } catch (err: any) {
      console.error("Save error", err);
      setSaveError(err.message || "Save failed. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service? This cannot be undone.")) return;
    try {
      const res = await fetch("/api/admin/services?id=" + id, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        alert("Delete failed: " + (data.error || "Unknown error"));
        return;
      }
      setSuccessMsg("Service deleted.");
      setTimeout(() => setSuccessMsg(null), 3000);
      await fetchServices();
    } catch (err) {
      console.error("Delete error", err);
      alert("Delete failed. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <AdminSidebar />

      <main className="flex-1 p-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-black text-[#0b1a10]">Browse by Service Type</h1>
            <p className="text-gray-400 font-medium mt-2">Manage the images, descriptions, and highlights seen in the "Offerings" grid on the homepage.</p>
          </div>
          <div className="flex gap-3">
            {services.length > 0 && (
              <button 
                onClick={handleReset}
                disabled={syncing}
                className="px-6 py-3 border border-gray-200 rounded-2xl font-bold flex items-center gap-2 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all disabled:opacity-50"
              >
                {syncing ? <Loader2 className="w-5 h-5 animate-spin" /> : <TrendingUp className="w-5 h-5" />} Reset to Defaults
              </button>
            )}
            <button 
              onClick={() => { 
                  setEditingService(null); 
                  setCurrentPoints([]);
                  setPreviewUrl(null);
                  setIsModalOpen(true); 
              }}
              className="bg-brand-gold text-[#0b1a10] px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-[#0b1a10] hover:text-white transition-all shadow-xl shadow-brand-gold/10"
            >
              <Plus className="w-5 h-5" /> Add New Service
            </button>
          </div>
        </header>

        {/* Success / Error Banners */}
        {successMsg && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl text-green-700 font-bold text-sm flex items-center gap-2">
            <Check className="w-5 h-5" /> {successMsg}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-brand-gold" />
          </div>
        ) : services.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Package className="w-12 h-12 mb-3 opacity-30" />
            <p className="font-bold mb-6">No services found in database.</p>
            <button 
              onClick={handleSync}
              disabled={syncing}
              className="px-6 py-3 bg-[#0b1a10] text-white rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-all disabled:opacity-50"
            >
              {syncing ? <Loader2 className="w-5 h-5 animate-spin" /> : <TrendingUp className="w-5 h-5 text-brand-gold" />}
              Sync Default Services
            </button>
            <p className="text-[10px] mt-4 max-w-xs text-center">This will import the existing site services (Rooms, Houses, Hall, Leisure) into your database so you can edit them.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {services.map((service) => (
              <div key={service.id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all flex items-center gap-6">
                <div className="w-32 h-32 rounded-3xl overflow-hidden shrink-0 border border-gray-100">
                  <img src={service.image_url} alt={service.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-3 py-0.5 rounded-full bg-brand-gold/10 text-brand-gold text-[10px] font-black uppercase tracking-wider">
                      {service.category}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="text-xs text-gray-400 font-bold">{service.count_info}</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#0b1a10]">{service.name}</h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-1">{service.description}</p>
                </div>

                <div className="px-8 border-x border-gray-100 text-center">
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Current Price</p>
                  <p className="text-2xl font-black text-brand-green">₹{service.price}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => { 
                        setEditingService(service); 
                        setCurrentPoints(service.points || []);
                        setPreviewUrl(null);
                        setIsModalOpen(true); 
                    }}
                    className="p-4 rounded-2xl bg-gray-50 text-[#0b1a10] hover:bg-brand-gold/10 hover:text-brand-gold transition-all"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(service.id)}
                    className="p-4 rounded-2xl bg-gray-50 text-red-400 hover:bg-red-400/10 transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit/Add Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsModalOpen(false)} 
                className="absolute inset-0 bg-[#0b1a10]/80 backdrop-blur-md" 
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
              >
                {/* Modal Header */}
                <div className="p-8 border-b border-gray-100 flex justify-between items-center shrink-0">
                  <div>
                    <h2 className="text-2xl font-black text-[#0b1a10]">{editingService ? 'Edit Service' : 'Add New Service'}</h2>
                    <p className="text-xs text-brand-gold font-bold uppercase tracking-widest mt-1">
                      {editingService?.category || 'PROPERTIES'} DETAILS
                    </p>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSave} className="p-8 space-y-8 overflow-y-auto no-scrollbar">
                  {saveError && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 font-bold text-sm flex items-center gap-2">
                       <TrendingUp className="w-4 h-4 rotate-180" /> {saveError}
                    </div>
                  )}

                  {/* Basic Info Group */}
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0b1a10]/40 px-1">Service Display Name</label>
                        <input name="name" defaultValue={editingService?.name} required className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold transition-all font-bold placeholder:text-gray-300" placeholder="e.g. Luxury Rooms" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0b1a10]/40 px-1">Main Category</label>
                        <select name="category" defaultValue={editingService?.category || 'ROOM'} className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold transition-all font-bold appearance-none">
                          <option value="ROOM">Luxury Room</option>
                          <option value="HOUSE">Independent House</option>
                          <option value="HALL">Convention Hall</option>
                          <option value="LEISURE">Sports & Leisure</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0b1a10]/40 px-1">Base Price (₹)</label>
                        <input name="price" type="number" defaultValue={editingService?.price} required className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold transition-all font-black text-brand-green" placeholder="0.00" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0b1a10]/40 px-1">Inventory / Capacity Info</label>
                        <input name="count_info" defaultValue={editingService?.count_info} required className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold transition-all font-bold placeholder:text-gray-300" placeholder="e.g. 12 units" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0b1a10]/40 px-1">Public Description</label>
                      <textarea name="description" defaultValue={editingService?.description} rows={3} className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold transition-all font-medium resize-none placeholder:text-gray-300" placeholder="Briefly describe the service for your visitors..." />
                    </div>
                  </div>

                  {/* Highlights Editor - The 7 Point Feature List */}
                  <div className="p-8 bg-brand-dark-green rounded-[2.5rem] space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Tag className="w-5 h-5 text-brand-gold" />
                        <h4 className="text-sm font-bold text-white">Service Highlights</h4>
                      </div>
                      <span className="bg-brand-gold/20 text-brand-gold px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{currentPoints.length}/10 Points</span>
                    </div>
                    
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2 no-scrollbar">
                      {currentPoints.map((point, idx) => (
                        <motion.div 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          key={idx} 
                          className="flex items-center gap-3 bg-white/5 border border-white/10 p-4 rounded-xl group hover:border-brand-gold/30 transition-all"
                        >
                          <Check className="w-4 h-4 text-brand-gold shrink-0" />
                          <span className="flex-1 text-sm font-medium text-white/80">{point}</span>
                          <button 
                            type="button" 
                            onClick={() => setCurrentPoints(prev => prev.filter((_, i) => i !== idx))}
                            className="p-1.5 text-white/20 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </motion.div>
                      ))}
                      {currentPoints.length === 0 && (
                        <div className="py-10 text-center border-2 border-dashed border-white/5 rounded-2xl">
                          <p className="text-xs text-white/30 font-bold uppercase tracking-widest italic">No highlights defined yet</p>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <input 
                        value={newPoint}
                        onChange={(e) => setNewPoint(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (newPoint.trim()) {
                              setCurrentPoints([...currentPoints, newPoint.trim()]);
                              setNewPoint("");
                            }
                          }
                        }}
                        placeholder="Add a premium highlight point..." 
                        className="flex-1 bg-white/10 border border-white/10 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold transition-all text-sm font-bold text-white placeholder:text-white/20" 
                      />
                      <button 
                        type="button"
                        onClick={() => {
                          if (newPoint.trim()) {
                            setCurrentPoints([...currentPoints, newPoint.trim()]);
                            setNewPoint("");
                          }
                        }}
                        className="p-4 bg-brand-gold text-brand-dark-green rounded-2xl font-bold hover:bg-white transition-all shadow-xl shadow-brand-gold/10"
                      >
                        <Plus className="w-6 h-6" />
                      </button>
                    </div>
                  </div>

                  {/* Image Upload Group */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0b1a10]/40 px-1">Cover Image</label>
                    <div className="grid grid-cols-[160px_1fr] gap-6">
                      <div className="aspect-square bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 flex items-center justify-center relative group">
                        {(previewUrl || editingService?.image_url) ? (
                          <>
                            <img src={previewUrl || editingService?.image_url} className="w-full h-full object-cover" alt="Preview" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <p className="text-[10px] font-black uppercase text-white tracking-widest">Update Photo</p>
                            </div>
                          </>
                        ) : (
                          <div className="text-center">
                            <ImageIcon className="w-8 h-8 text-gray-200 mx-auto" />
                            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mt-2">No Image</p>
                          </div>
                        )}
                        {uploading && (
                          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                            <Loader2 className="w-6 h-6 animate-spin text-brand-gold" />
                          </div>
                        )}
                      </div>
                      
                      <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-[2rem] p-8 cursor-pointer hover:bg-brand-gold/5 hover:border-brand-gold transition-all group border-spacing-4">
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            
                            setUploading(true);
                            const formData = new FormData();
                            formData.append("file", file);
                            formData.append("folder", "services");

                            try {
                              const res = await fetch("/api/admin/upload", {
                                method: "POST",
                                body: formData
                              });
                              const data = await res.json();
                              if (data.url) {
                                setPreviewUrl(data.url);
                              }
                            } catch (err) {
                              console.error("Upload failed", err);
                            } finally {
                              setUploading(false);
                            }
                          }} 
                        />
                        <div className="p-4 bg-gray-50 rounded-2xl group-hover:bg-brand-gold/10 group-hover:text-brand-gold text-gray-400 transition-colors mb-4">
                          <Upload className="w-8 h-8" />
                        </div>
                        <h5 className="font-black text-[#0b1a10] text-sm uppercase tracking-widest mb-1">Click to {previewUrl || editingService?.image_url ? 'replace' : 'upload'} image</h5>
                        <p className="text-xs text-gray-400 font-medium">Recommended: 1200x800px or larger</p>
                      </label>
                    </div>
                    <input type="hidden" name="image_url" value={previewUrl || editingService?.image_url || ''} />
                  </div>

                  <div className="pt-6">
                    <button 
                      disabled={formLoading || uploading}
                      className="w-full bg-[#0b1a10] text-white py-6 rounded-3xl font-black text-lg uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-brand-dark-green transition-all shadow-2xl shadow-black/10 disabled:opacity-50"
                    >
                      {formLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                        <>
                          <Check className="w-6 h-6 text-brand-gold" /> {editingService ? 'Update Site Content' : 'Publish New Service'}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
