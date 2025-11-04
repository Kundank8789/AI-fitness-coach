import React, { useState } from "react";
import axios from "axios";
import { exportPlanAsPDF } from "../utils/pdf";
import PlanCard from "./PlanCard";

export default function ChatUI() {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);
  const [seed, setSeed] = useState(Math.floor(Math.random() * 100000).toString());
  const [form, setForm] = useState({
    name: "Kulbhushan",
    age: 25,
    gender: "Male",
    height: 170,
    weight: 70,
    goal: "Muscle Gain",
    fitnessLevel: "Intermediate",
    location: "Gym",
    dietPref: "Non-Veg",
  });

  // ✅ Update form values
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Generate fitness plan
  const generate = async (customSeed = seed) => {
    setLoading(true);
    try {
      const res = await axios.post("/api/ai/generate-plan", {
        userDetails: form,
        seed: customSeed,
      });

      console.log("Response from API:", res.data);

      const planData = res.data?.plan;

      if (!planData) {
        throw new Error("No plan data received");
      }

      // 🔒 Ensure plan is stored as an object
      if (typeof planData === "string") {
        setPlan(JSON.parse(planData));
      } else {
        setPlan(planData);
      }

    } catch (err) {
      console.error("Generate error:", err.message || err);
      setPlan({ error: "Error generating plan. Please check server logs." });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Regenerate new plan with new seed
  const regenerate = () => {
    const newSeed = Math.floor(Math.random() * 100000).toString();
    setSeed(newSeed);
    generate(newSeed);
  };

  // ✅ Convert plan object to readable text for voice / export
  const getPlanText = (p) => {
    if (!p) return "";
    if (typeof p === "string") return p;

    const parts = [];

    if (p.workout) {
      parts.push("Workout Plan:");
      p.workout.forEach((day) => {
        parts.push(`${day.day}: ${day.exercises.join(", ")}`);
      });
    }

    if (p.diet) {
      parts.push("Diet Plan:");
      parts.push(
        `Breakfast: ${p.diet.breakfast || ""}. Lunch: ${p.diet.lunch || ""}. Dinner: ${p.diet.dinner || ""}. Snacks: ${p.diet.snacks || ""}`
      );
    }

    if (p.tips) {
      parts.push("Tips:");
      parts.push(p.tips.join(". "));
    }

    return parts.join("\n");
  };

  // ✅ Play AI-generated voice
  const playVoice = async (text) => {
    try {
      if (!text) {
        alert("Nothing to read. Generate a plan first.");
        return;
      }

      const res = await axios.post(
        "/api/ai/tts",
        { text },
        { responseType: "arraybuffer" }
      );

      const blob = new Blob([res.data], { type: "audio/mpeg" });
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.play();
      audio.onended = () => URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Voice error:", err);
      alert("Voice generation failed");
    }
  };

  // ✅ Save generated plan to database
  const savePlan = async () => {
    try {
      await axios.post("/api/ai/save-plan", { userDetails: form, plan, seed });
      alert("✅ Plan saved to MongoDB!");
    } catch (err) {
      console.error("Save failed:", err.message || err);
      alert("Save failed!");
    }
  };

  return (
    <div>
      {/* 🧾 User Input Section */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <label>Name</label>
          <input name="name" value={form.name} onChange={handleChange} />
        </div>
        <div>
          <label>Age</label>
          <input name="age" value={form.age} onChange={handleChange} />
        </div>
        <div>
          <label>Goal</label>
          <input name="goal" value={form.goal} onChange={handleChange} />
        </div>
        <div>
          <label>Diet</label>
          <input name="dietPref" value={form.dietPref} onChange={handleChange} />
        </div>
      </div>

      {/* ⚙️ Action Buttons */}
      <div style={{ marginTop: 12 }}>
        <button className="button" onClick={() => generate()} disabled={loading}>
          {loading ? "Generating..." : "Generate Plan"}
        </button>

        <button
          className="button"
          style={{ marginLeft: 8, background: "#7c3aed" }}
          onClick={regenerate}
          disabled={loading}
        >
          🔁 Regenerate
        </button>

        <button
          className="button"
          style={{ marginLeft: 8, background: "#374151" }}
          onClick={() => exportPlanAsPDF("plan", "Fitness_Plan.pdf")}
          disabled={!plan || loading}
        >
          📄 Export PDF
        </button>

        <button
          className="button"
          style={{ marginLeft: 8, background: "#16a34a" }}
          onClick={savePlan}
          disabled={!plan || loading}
        >
          💾 Save Plan
        </button>

        <button
          className="button"
          style={{ marginLeft: 8, background: "#6366f1" }}
          onClick={() => playVoice(getPlanText(plan))}
          disabled={!plan || loading}
        >
          🔊 Play Voice
        </button>
      </div>

      {/* 🧠 Generated Plan Display */}
      <div id="plan" className="plan" style={{ marginTop: 12 }}>
        {!plan ? (
          "Your generated plan will appear here."
        ) : plan.error ? (
          <p style={{ color: "red" }}>{plan.error}</p>
        ) : (
          <div className="grid gap-4 mt-3">
            {plan.workout && (
              <PlanCard title="🏋️ Workout Plan">
                {plan.workout.map((day, i) => (
                  <div key={i} className="mb-2">
                    <strong>{day.day}:</strong> {day.exercises.join(", ")}
                  </div>
                ))}
              </PlanCard>
            )}

            {plan.diet && (
              <PlanCard title="🥗 Diet Plan">
                <ul>
                  <li>
                    <b>Breakfast:</b> {plan.diet.breakfast}
                  </li>
                  <li>
                    <b>Lunch:</b> {plan.diet.lunch}
                  </li>
                  <li>
                    <b>Dinner:</b> {plan.diet.dinner}
                  </li>
                  <li>
                    <b>Snacks:</b> {plan.diet.snacks}
                  </li>
                </ul>
              </PlanCard>
            )}

            {plan.tips && (
              <PlanCard title="💬 Tips">
                <ul className="list-disc pl-5">
                  {plan.tips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </PlanCard>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
