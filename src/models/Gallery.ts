import mongoose from "mongoose";

const GallerySchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    title: { type: String },
    category: { type: String },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export default mongoose.models.Gallery || mongoose.model("Gallery", GallerySchema);
