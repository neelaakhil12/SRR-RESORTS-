import mongoose from "mongoose";

const SuperAdminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export default mongoose.models.SuperAdmin || mongoose.model("SuperAdmin", SuperAdminSchema);
