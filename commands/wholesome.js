const axios = require("axios");

module.exports = {
  pattern: "wholesome",
  desc: "Get a wholesome quote or meme",
  react: "💖",
  category: "fun",
  filename: __filename,

  execute: async (conn, mek, m, { from }) => {
    const send = async (text) => await conn.sendMessage(from, { text }, { quoted: mek });
    try {
      const { data } = await axios.get("https://www.affirmations.dev/");
      await send(data.affirmation || "💖 Stay positive!");
    } catch {
      await send("❌ Could not fetch a wholesome quote.");
    }
  }
};