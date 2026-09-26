const axios = require("axios");

module.exports = {
  pattern: "pun",
  desc: "Get a random pun",
  react: "😏",
  category: "fun",
  filename: __filename,

  execute: async (conn, mek, m, { from }) => {
    const send = async (text) => await conn.sendMessage(from, { text }, { quoted: mek });
    try {
      const { data } = await axios.get("https://v2.jokeapi.dev/joke/Any?type=single&contains=pun");
      await send(data.joke || "❌ Could not fetch a pun.");
    } catch {
      await send("❌ Failed to get a pun.");
    }
  }
};