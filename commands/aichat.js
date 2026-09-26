const axios = require("axios");
const config = require("../config");

module.exports = {
  pattern: "aichat",
  desc: "Chat with AI in conversation mode",
  react: "💬",
  category: "ai",
  filename: __filename,

  execute: async (conn, mek, m, { from, q, store }) => {
    const send = async (text) =>
      conn.sendMessage(from, { text }, { quoted: mek });

    if (!store.aiChat) store.aiChat = {};
    if (!store.aiChat[from]) store.aiChat[from] = [];

    if (!q) return send("💬 Send a message to chat.\nExample: .aichat hey");

    store.aiChat[from].push({ role: "user", content: q });

    await send("💬 AI typing…");

    try {
      const { data } = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4.1-mini",
          messages: store.aiChat[from],
          max_tokens: 200
        },
        {
          headers: {
            Authorization: `Bearer ${config.OPENAI_KEY}`
          }
        }
      );

      const reply = data.choices[0].message.content.trim();
      store.aiChat[from].push({ role: "assistant", content: reply });

      send(reply);
    } catch (error) {
      console.error("AI ERROR:", error.response?.data || error.message);
      send("❌ AI chat failed.");
    }
  }
};
