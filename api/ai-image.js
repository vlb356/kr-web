// /api/ai-image.js  — Vercel Serverless Function
export default async function handler(req, res) {
  // CORS simple
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res.status(200).end();
  }
  res.setHeader("Access-Control-Allow-Origin", "*");

  try {
    const { prompt = "Sports venue, modern gym, photorealistic", size = "1024x576" } = req.query;

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res
        .status(200)
        .json({ url: null, note: "Missing OPENAI_API_KEY — frontend will use fallback." });
    }

    // OpenAI Images API (modelo gpt-image-1)
    const r = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt: String(prompt).slice(0, 1000),
        size,
        n: 1,
      }),
    });

    const data = await r.json();
    const url = data?.data?.[0]?.url || null;

    if (!url) {
      return res.status(200).json({
        url: null,
        note: data?.error?.message || "No image returned — frontend will fallback.",
      });
    }
    return res.status(200).json({ url });
  } catch (err) {
    return res.status(200).json({
      url: null,
      note: "Generation error — frontend will use fallback.",
    });
  }
}
