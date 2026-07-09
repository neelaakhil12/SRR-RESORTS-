"use client";

import { useEffect, useState } from "react";
import { 
  ImageIcon, 
  Plus, 
  Trash2, 
  Loader2, 
  X, 
  Upload, 
  Image as LucideImage,
  Tag,
  Check,
  Edit3
} from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

interface GalleryImage {
  id: string;
  url: string;
  title: string;
  category: string;
  videoUrl?: string;
}

export default function GalleryManagement() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);

  const [category, setCategory] = useState("Exterior");
  const [videoUrl, setVideoUrl] = useState("");

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    if (editingImage) {
      setCategory(editingImage.category || "Exterior");
      setVideoUrl(editingImage.videoUrl || "");
    } else {
      setCategory("Exterior");
      setVideoUrl("");
      setSelectedVideoFile(null);
      setVideoPreview(null);
    }
  }, [editingImage, isModalOpen]);

  const fetchImages = async () => {
    try {
      const res = await fetch("/api/admin/gallery");
      if (!res.ok) throw new Error("Failed to load gallery");
      const data = await res.json();
      setImages(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Failed to fetch gallery", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setUploadError(null);
    }
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
      setUploadError(null);
    }
  };

  const getCloudinaryVideoThumbnail = (url: string) => {
    if (url.includes("cloudinary.com") && url.includes("/video/upload/")) {
      return url.replace("/video/upload/", "/video/upload/c_fill,g_center,h_360,w_640/").replace(/\.[^/.]+$/, ".jpg");
    }
    return "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1000&auto=format&fit=crop";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;

    if (!editingImage && category === "Videos" && !selectedVideoFile) {
      setUploadError("Please select a video file to upload");
      return;
    }

    if (!editingImage && category !== "Videos" && !selectedFile) {
      setUploadError("Please select an image file");
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      let imageUrl = editingImage?.url || "";
      let publicId = (editingImage as any)?.public_id || "";
      let finalVideoUrl = editingImage?.videoUrl || "";

      // 1. If a video is selected, upload it first
      if (category === "Videos" && selectedVideoFile) {
        const uploadVideoFormData = new FormData();
        uploadVideoFormData.append("file", selectedVideoFile);
        uploadVideoFormData.append("folder", "gallery_videos");

        const uploadRes = await fetch("/api/admin/upload", {
          method: "POST",
          body: uploadVideoFormData
        });
        const uploadData = await uploadRes.json();

        if (!uploadRes.ok || !uploadData.url) {
          throw new Error(uploadData.error || "Video upload to Cloudinary failed");
        }
        finalVideoUrl = uploadData.url;
        // Auto-generate the thumbnail URL using Cloudinary
        imageUrl = getCloudinaryVideoThumbnail(finalVideoUrl);
        publicId = uploadData.public_id;
      }

      // 2. If a custom thumbnail/image file is selected, upload it
      if (selectedFile) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", selectedFile);
        uploadFormData.append("folder", "gallery");

        const uploadRes = await fetch("/api/admin/upload", {
          method: "POST",
          body: uploadFormData
        });
        const uploadData = await uploadRes.json();

        if (!uploadRes.ok || !uploadData.url) {
          throw new Error(uploadData.error || "Image upload to Cloudinary failed");
        }
        imageUrl = uploadData.url;
        if (category !== "Videos") {
          publicId = uploadData.public_id;
        }
      }

      // 3. Save/Update record in database
      const method = editingImage ? "PUT" : "POST";
      const payload = editingImage 
        ? { id: editingImage.id, title, url: imageUrl, public_id: publicId, category, videoUrl: finalVideoUrl }
        : { url: imageUrl, public_id: publicId, title, category, videoUrl: finalVideoUrl };

      const saveRes = await fetch("/api/admin/gallery", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const saveData = await saveRes.json();

      if (!saveRes.ok) {
        throw new Error(saveData.error || `Failed to ${editingImage ? 'update' : 'save'} gallery record`);
      }

      setSuccessMsg(`Gallery item ${editingImage ? 'updated' : 'added'} successfully!`);
      setTimeout(() => setSuccessMsg(null), 4000);
      await fetchImages();
      setIsModalOpen(false);
      setEditingImage(null);
      setSelectedFile(null);
      setSelectedVideoFile(null);
      setPreview(null);
      setVideoPreview(null);
    } catch (err: any) {
      console.error("Operation failed", err);
      setUploadError(err.message || "Operation failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/admin/gallery?id=${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        alert("Delete failed: " + (data.error || "Unknown error"));
        return;
      }
      await fetchImages();
    } catch (err) {
      console.error("Delete failed", err);
      alert("Delete failed. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <AdminSidebar />

      <main className="flex-1 p-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-black text-[#0b1a10]">Gallery Mall</h1>
            <p className="text-gray-400 font-medium mt-2">Manage the resort's visual showcase. Add, delete, or categorize images.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-brand-gold text-[#0b1a10] px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-[#0b1a10] hover:text-white transition-all shadow-xl shadow-brand-gold/10"
          >
            <Plus className="w-5 h-5" /> Add New Image
          </button>
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
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {images.map((img) => (
              <div key={img.id} className="group relative bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500">
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img src={img.url} alt={img.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button 
                      onClick={() => {
                        setEditingImage(img);
                        setPreview(img.url);
                        setIsModalOpen(true);
                      }}
                      className="p-3 bg-brand-gold text-[#0b1a10] rounded-2xl hover:bg-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 shadow-lg"
                      title="Edit Image Details"
                    >
                      <Edit3 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(img.id)}
                      className="p-3 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 shadow-lg delay-75"
                      title="Delete Image"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-xs font-black text-brand-gold uppercase tracking-widest">{img.category}</p>
                  <h3 className="text-sm font-bold text-[#0b1a10] mt-1 truncate">{img.title}</h3>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#0b1a10]/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
            <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh] border border-gray-100">
              <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
                <div>
                  <h2 className="text-2xl font-bold text-[#0b1a10]">{editingImage ? 'Update Gallery Item' : 'Upload New Media'}</h2>
                  {editingImage && <p className="text-[10px] font-black uppercase text-brand-gold tracking-widest mt-1">Editing existing entry</p>}
                </div>
                <button 
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingImage(null);
                    setPreview(null);
                    setSelectedFile(null);
                    setSelectedVideoFile(null);
                    setVideoPreview(null);
                  }} 
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <div className="overflow-y-auto flex-1">
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                  {uploadError && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 font-bold text-sm">
                      ⚠️ {uploadError}
                    </div>
                  )}

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold transition-all font-bold"
                  >
                    <option value="Exterior">Exterior</option>
                    <option value="Rooms">Rooms</option>
                    <option value="Hall">Convention Hall</option>
                    <option value="Leisure">Leisure</option>
                    <option value="Videos">Videos</option>
                  </select>
                </div>

                {category === "Videos" && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
                      {editingImage ? 'Replace Video File (optional)' : 'Upload Video File'}
                    </label>
                    <label className="relative flex flex-col items-center justify-center gap-4 bg-gray-50 border-2 border-dashed border-gray-100 p-8 rounded-[2rem] cursor-pointer hover:border-brand-gold hover:bg-brand-gold/5 transition-all">
                      <input type="file" accept="video/*" className="hidden" onChange={handleVideoFileChange} />
                      {videoPreview ? (
                        <div className="relative w-full">
                          <video src={videoPreview} className="w-full h-48 object-contain rounded-2xl shadow-md bg-black" controls />
                          <div className="absolute top-2 left-2 bg-green-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow">
                            New Video Selected
                          </div>
                        </div>
                      ) : editingImage?.videoUrl ? (
                        <div className="relative w-full">
                          <video src={editingImage.videoUrl} className="w-full h-48 object-contain rounded-2xl shadow-md bg-black" controls />
                          <div className="absolute top-2 left-2 bg-brand-gold text-[#0b1a10] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow">
                            Current Video
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="p-4 bg-white rounded-2xl shadow-sm text-brand-gold">
                            <Upload className="w-8 h-8" />
                          </div>
                          <p className="text-sm font-bold text-gray-500">Click to upload Video file (MP4, WebM)</p>
                        </>
                      )}
                    </label>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
                    {category === "Videos" 
                      ? (editingImage ? 'Replace Video Cover Thumbnail (optional)' : 'Upload Video Cover Thumbnail (optional)')
                      : (editingImage ? 'Replace Image (optional)' : 'Select File')
                    }
                  </label>
                  <label className="relative flex flex-col items-center justify-center gap-4 bg-gray-50 border-2 border-dashed border-gray-100 p-8 rounded-[2rem] cursor-pointer hover:border-brand-gold hover:bg-brand-gold/5 transition-all">
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    {preview ? (
                      <div className="relative w-full">
                        <img src={preview} className="w-full h-48 object-cover rounded-2xl shadow-md" alt="Preview" />
                        {editingImage && !selectedFile && (
                          <div className="absolute top-2 left-2 bg-brand-gold text-[#0b1a10] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow">
                            Current Image
                          </div>
                        )}
                        {selectedFile && (
                          <div className="absolute top-2 left-2 bg-green-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow">
                            New Image Selected
                          </div>
                        )}
                      </div>
                    ) : (
                      <>
                        <div className="p-4 bg-white rounded-2xl shadow-sm text-brand-gold">
                          <Upload className="w-8 h-8" />
                        </div>
                        <p className="text-sm font-bold text-gray-500">Click to upload or drag & drop</p>
                      </>
                    )}
                  </label>
                  {editingImage && <p className="text-xs text-gray-400 text-center">Leave empty to keep the existing image</p>}
                  {category === "Videos" && !preview && <p className="text-xs text-gray-400 text-center">If left empty, Cloudinary will auto-generate the cover thumbnail image from the video</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">{category === "Videos" ? "Video Title" : "Image Title"}</label>
                  <input
                    key={editingImage?.id || 'new'}
                    name="title"
                    required
                    defaultValue={editingImage?.title || ''}
                    className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold transition-all font-bold"
                    placeholder="e.g. Resort Promo Video"
                  />
                </div>

                <div className="pt-4">
                  <button 
                    disabled={uploading || (!editingImage && !selectedFile && category !== "Videos") || (!editingImage && category === "Videos" && !selectedVideoFile)}
                    className="w-full bg-[#0b1a10] text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-xl shadow-black/10 disabled:opacity-50"
                  >
                    {uploading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                      <>
                        <Check className="w-6 h-6 text-brand-gold" />
                        {editingImage ? 'Save Changes' : 'Add to Gallery'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
          </div>
        )}
      </main>
    </div>
  );
}
