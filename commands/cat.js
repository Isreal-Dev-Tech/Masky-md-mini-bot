const axios = require("axios");

module.exports = {
  pattern: "cat",
  desc: "Send a cute cat picture",
  react: "🐱",
  category: "fun",
  filename: __filename,

  execute: async (conn, mek, m, { from }) => {
    const send = async (img) => await conn.sendMessage(from, { image: { url: img }, caption: "🐱 Here's a cute cat for you!" }, { quoted: mek });
    try {
      const { data } = await axios.get("https://api.thecatapi.com/v1/images/search");
      await send(data[0].url);
    } catch {
      await send("❌ Could not fetch a cat picture.");
    }
  }
};