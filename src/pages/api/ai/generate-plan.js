import OpenAI from "openai";
import { connectToDB } from "../../../lib/mongoose";
import Plan from "../../../model/Plan";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
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

    // 🧠 Ask GPT for JSON response
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      response_format: { type: "json_object" } // forces valid JSON output
    });

    // 🧾 Parse JSON safely
    const aiMessage = response.choices[0]?.message?.content || "{}";
    const plan = JSON.parse(aiMessage);

    // Save to DB
    try {
      await connectToDB();
      const doc = await Plan.create({ userDetails, plan, seed });
      return res.status(200).json({ success: true, id: doc._id, plan });
    } catch (dbErr) {
      console.error("Save error:", dbErr.message);
      // Return the generated plan even if save fails
      return res.status(200).json({ success: false, error: 'DB_SAVE_FAILED', details: dbErr.message, plan });
    }
  } catch (error) {
    console.error("AI Error:", error.message);
    res.status(500).json({ error: "AI generation failed", details: error.message });
  }
}
