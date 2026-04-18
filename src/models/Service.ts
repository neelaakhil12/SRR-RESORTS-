import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { 
      type: String, 
      required: true,
      enum: ['ROOM', 'HALL', 'LEISURE', 'HOUSE']
    },
    image_url: { type: String },
    points: { type: [String], default: [] },
    count_info: { type: String },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export default mongoose.models.Service || mongoose.model("Service", ServiceSchema);
