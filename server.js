require("dotenv").config();
const express = require("express");
const rateLimit = require("express-rate-limit");
const OpenAI = require("openai");

const app = express();
app.use(express.json({ limit: "1mb" }));
const path = require("path");

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/app.js", (req, res) => {
  res.sendFile(path.join(__dirname, "app.js"));
});

app.get("/styles.css", (req, res) => {
  res.sendFile(path.join(__dirname, "styles.css"));
});
app.use("/api/chat", rateLimit({ windowMs: 60_000, limit: 20 }));

const client = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

app.post("/api/chat", async (req, res) => {
  try {
    if (!client) {
      return res.status(503).json({
        error: "AI is not connected yet. Add your API key to the .env file."
      });
    }

    const messages = Array.isArray(req.body.messages) ? req.body.messages : [];
    const safeMessages = messages
      .filter(m => m && ["user", "assistant"].includes(m.role) && typeof m.content === "string")
      .slice(-16)
      .map(m => ({ role: m.role, content: m.content.slice(0, 6000) }));

    if (!safeMessages.length || safeMessages[safeMessages.length - 1].role !== "user") {
      return res.status(400).json({ error: "Please send a message first." });
    }

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      instructions: "You are Kaif AI, a helpful, clear, respectful multilingual assistant. Reply in the language the user uses. Be honest about uncertainty. Do not claim to have performed actions you have not performed.",
      input: safeMessages
    });

    res.json({ reply: response.output_text || "I couldn't create a response. Please try again." });
  } catch (err) {
    console.error("Chat API error:", err.message);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Kaif AI is running on http://localhost:${port}`));
