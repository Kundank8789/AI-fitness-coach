// src/pages/api/ai/generate-plan.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import { connectToDB } from "../../../lib/mongoose";
import Plan from "../../../model/Plan";

const ai = new GoogleGenerativeAI(process.env.GOOGLE_API_KEYS);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { userDetails, seed } = req.body;
  if (!userDetails) return res.status(400).json({ error: "userDetails required" });

  try {
    const prompt = `
You are a professional fitness and nutrition expert.
Based on the following user details, create a personalized 7-day workout and diet plan.
Respond strictly in JSON format only, no explanations.

Example format:
{
  "workout": [
    {"day": "Monday", "exercises": ["Exercise 1", "Exercise 2", "Exercise 3"]},
    {"day": "Tuesday", "exercises": ["Exercise 1", "Exercise 2"]}
  ],
  "diet": {
    "breakfast": "Meal details",
    "lunch": "Meal details",
    "dinner": "Meal details",
    "snacks": "Snack details"
  },
  "tips": ["Tip 1", "Tip 2"]
}

User Details:
${JSON.stringify(userDetails)}
`;

    // 🧠 Generate response from Gemini
    const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);

    const text = result.response.text();

    // 🧾 Clean and parse JSON safely
    const cleanText = text.trim().replace(/^```json|```$/g, "").trim();
    const plan = JSON.parse(cleanText);

    // 💾 Save to MongoDB
    await connectToDB();
    const doc = await Plan.create({ userDetails, plan, seed });

    res.status(200).json({ success: true, id: doc._id, plan });
  } catch (error) {
    console.error("Error:", error.message);

    res.status(500).json({
      success: false,
      error: "AI generation failed",
      details: error.message,
    });
  }
}
