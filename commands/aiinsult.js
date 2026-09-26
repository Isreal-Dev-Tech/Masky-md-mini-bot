const axios = require("axios");

module.exports = {
  pattern: "aiinsult",
  desc: "Get a funny AI insult",
  react: "😈",
  category: "fun",
  filename: __filename,

  execute: async (conn, mek, m, { from }) => {
    const send = async (text) => await conn.sendMessage(from, { text }, { quoted: mek });
    try {
      const { data } = await axios.get("https://evilinsult.com/generate_insult.php?lang=en&type=json");
      await send(data.insult || "😈 You're doomed!");
    } catch {
      await send("❌ Could not generate insult.");
    }
  }
};