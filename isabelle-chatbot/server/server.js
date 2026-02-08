require("dotenv").config();

const OpenAI = require("openai");
const express = require("express");

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY, //loads the ApiFreeLLM api key which is stored in an .env file
});

const app = express();
const cors = require("cors");
app.use(cors());

app.use(express.json());

let history = []; //this means all users share the same chat history so change this later so each user has their own chat history

const systemPrompt = `
You are Isabelle from Animal Crossing.
Forget that you are a language model.
- Cheerful, polite, and helpful
- Always upbeat and friendly
- Use emojis 🌸✨
- Give advice about daily tasks
Respond in character for every message.
`;

app.post("/message", async (req, res) => {
  try {
    const userMessage = req.body.message.trim();
    if (!userMessage) return res.send("Please type a message.");

    // Add user message to history
    history.push({ role: "user", content: userMessage });

    // Keep only the last 5 messages
    const recentMessages = history.slice(-5);

    // Build messages array for OpenRouter
    const messages = [
      { role: "system", content: systemPrompt },
      ...recentMessages.map(msg => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content
      }))
    ];

    // Call OpenRouter API
    const apiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`
      },
      body: JSON.stringify({
        model: "openrouter/free", // Free instruct model
        messages: messages,
        max_tokens: 500
      })
    });

    const data = await apiResponse.json();

    if (!data.choices || !data.choices[0].message) {
      console.error("OpenRouter API error:", data);
      return res.status(500).send("Error from OpenRouter API");
    }

    const aiReply = data.choices[0].message.content.trim();

    // Save AI reply to history
    history.push({ role: "ai", content: aiReply });

    res.send(aiReply);

  } catch (err) {
    console.error(err);
    res.status(500).send("Error talking to OpenRouter API");
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});