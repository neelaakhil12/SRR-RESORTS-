import mongoose from "mongoose";

const AssistantAdminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export default mongoose.models.AssistantAdmin || mongoose.model("AssistantAdmin", AssistantAdminSchema);
