const { GoogleGenAI } = require("@google/genai"); // You must install this package: npm install @google/genai

// Initializes the GoogleGenAI client. 
// It automatically looks for the GEMINI_API_KEY environment variable.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }); 

module.exports = {
  pattern: "geminichat",
  desc: "Chat with Gemini in conversation mode",
  react: "🤖",
  category: "ai",
  filename: __filename,

  execute: async (conn, mek, m, { from, q, store }) => {
    const send = async (text) =>
      conn.sendMessage(from, {
        text,
        contextInfo: {
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: "120363420740680510@newsletter",
            newsletterName: "MASKY MD",
            serverMessageId: 200
          }
        }
      }, { quoted: mek });

    if (!q) return send("🤖 Send a message to chat.\nExample: .geminichat explain quantum physics simply");

    if (!store.chats) store.chats = {};
    
    // Initialize or retrieve the chat session
    if (!store.chats[from]) {
        store.chats[from] = ai.chats.create({ model: "gemini-2.5-flash" });
    }
    const chat = store.chats[from];

    await send("🤖 Gemini is thinking...");

    try {
      // Send the user's message to the ongoing chat session
      const response = await chat.sendMessage({ message: q });

      const reply = response.text.trim();
      send(reply);
      
    } catch (e) {
      console.error(e);
      send("❌ Gemini chat failed. Please check your `GEMINI_API_KEY` and network connection.");
    }
  }
};
