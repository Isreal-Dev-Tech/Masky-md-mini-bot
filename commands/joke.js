const axios = require("axios");

module.exports = {
  pattern: "joke",
  desc: "Get a random joke",
  react: "😂",
  category: "fun",
  filename: __filename,

  execute: async (conn, mek, m, { from, reply }) => {
    const send = async (text) => await conn.sendMessage(from, { text }, { quoted: mek });
    try {
      const { data } = await axios.get("https://v2.jokeapi.dev/joke/Any?type=single");
      await send(data.joke || "❌ Could not fetch a joke right now.");
    } catch (e) {
      await send("❌ Failed to get a joke.");
    }
  }
};