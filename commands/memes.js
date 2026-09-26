const axios = require("axios");

module.exports = {
  pattern: "meme",
  desc: "Get a random meme",
  react: "🤣",
  category: "fun",
  filename: __filename,

  execute: async (conn, mek, m, { from }) => {
    const send = async (text, img) => await conn.sendMessage(from, { image: { url: img }, caption: text }, { quoted: mek });
    try {
      const { data } = await axios.get("https://meme-api.com/gimme");
      await send(data.title || "Meme", data.url);
    } catch {
      await send("❌ Failed to fetch meme.");
    }
  }
};