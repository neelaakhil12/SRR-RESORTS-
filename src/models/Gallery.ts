import mongoose from "mongoose";

// Force Next.js to recompile the model on hot-reload to apply new schema fields
if (mongoose.models && mongoose.models.Gallery) {
  delete mongoose.models.Gallery;
}

const GallerySchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    title: { type: String },
    category: { type: String },
    videoUrl: { type: String },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export default mongoose.models.Gallery || mongoose.model("Gallery", GallerySchema);
