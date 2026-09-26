const axios = require("axios");

module.exports = {
  pattern: "roastme",
  desc: "Get roasted by the bot",
  react: "🔥",
  category: "fun",
  filename: __filename,

  execute: async (conn, mek, m, { from }) => {
    const send = async (text) => await conn.sendMessage(from, { text }, { quoted: mek });
    try {
      const { data } = await axios.get("https://evilinsult.com/generate_insult.php?lang=en&type=json");
      await send(data.insult || "❌ Failed to roast you.");
    } catch {
      await send("❌ Could not roast you right now.");
    }
  }
};