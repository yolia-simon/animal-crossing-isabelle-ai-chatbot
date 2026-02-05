require("dotenv").config();

const OpenAI = require("openai");
const express = require("express");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, //loads the openai api key which is stored in an .env file
});

const app = express();
const cors = require("cors");
app.use(cors());

app.use(express.json());

let messages = []; //this means all users share the same chat history so change this later so each user has their own chat history

//creating endpoints

app.post("/message", async (req, res) => {  //post request
   try {
    const message = req.body.message;

    messages.push({
      role: "user",
      content: message,
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
    });

    const reply = response.choices[0].message.content;

    messages.push({
      role: "assistant",
      content: reply,
    });

    res.send(reply);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error talking to OpenAI");
      }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});