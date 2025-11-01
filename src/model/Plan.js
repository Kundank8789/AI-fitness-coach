import mongoose from "mongoose";

const PlanSchema = new mongoose.Schema({
  userDetails: { type: Object },
  plan: { type: Object },
  seed: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Plan || mongoose.model("Plan", PlanSchema);
