// /src/pages/api/ai/save-plan.js
import { connectToDB } from "../../../lib/mongoose";
import Plan from "../../../model/Plan";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { userDetails, plan, seed } = req.body;

  try {
    await connectToDB();
    const doc = await Plan.create({ userDetails, plan, seed });
    return res.status(200).json({ success: true, id: doc._id });
  } catch (error) {
    console.error("Save plan error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to save plan",
      error: error.message,
    });
  }
}
