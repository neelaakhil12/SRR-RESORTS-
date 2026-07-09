import mongoose from "mongoose";

// Force Next.js to recompile the model on hot-reload to apply new schema fields
if (mongoose.models && mongoose.models.Coupon) {
  delete mongoose.models.Coupon;
}

const CouponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    discountType: { type: String, required: true, enum: ["fixed", "percentage"], default: "fixed" },
    discountValue: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export default mongoose.models.Coupon || mongoose.model("Coupon", CouponSchema);
