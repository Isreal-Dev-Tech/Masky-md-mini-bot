const axios = require("axios");

module.exports = {
  pattern: "aiquote",
  desc: "AI-generated funny or witty quote",
  react: "🧠",
  category: "fun",
  filename: __filename,

  execute: async (conn, mek, m, { from }) => {
    const send = async (text) => await conn.sendMessage(from, { text }, { quoted: mek });
    try {
      const prompt = "Give me a funny or witty one-line quote.";
      const { data } = await axios.post("https://api.quotable.io/random");
      await send(data.content || "😎 Keep smiling!");
    } catch {
      await send("❌ Could not fetch AI quote.");
    }
  }
};