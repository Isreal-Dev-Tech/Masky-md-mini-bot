const axios = require("axios");

module.exports = {
  pattern: "pickupline",
  desc: "Get a cheesy pickup line",
  react: "💘",
  category: "fun",
  filename: __filename,

  execute: async (conn, mek, m, { from }) => {
    const send = async (text) => await conn.sendMessage(from, { text }, { quoted: mek });
    try {
      const { data } = await axios.get("https://getpickuplines.herokuapp.com/lines/random");
      await send(data.line || "❌ Could not fetch a pickup line.");
    } catch {
      await send("❌ Failed to get a pickup line.");
    }
  }
};