// src/pages/api/ai/tts.js
import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Text required" });

  try {
    const voiceId = process.env.NEXT_PUBLIC_ELEVENLABS_VOICE_ID || "EXAMPLE_VOICE_ID";
    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      { text },
      {
        headers: {
          "xi-api-key": process.env.ELEVENLABS_KEY,
          "Content-Type": "application/json",
        },
        responseType: "arraybuffer",
      }
    );

    res.setHeader("Content-Type", "audio/mpeg");
    res.send(Buffer.from(response.data, "binary"));
  } catch (err) {
    console.error("TTS error:", err.message);
    res.status(500).json({ error: "TTS failed" });
  }
}
