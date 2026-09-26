const axios = require("axios");

module.exports = {
  pattern: "dog",
  desc: "Send a cute dog picture",
  react: "🐶",
  category: "fun",
  filename: __filename,

  execute: async (conn, mek, m, { from }) => {
    const send = async (img) => await conn.sendMessage(from, { image: { url: img }, caption: "🐶 Here's a cute dog for you!" }, { quoted: mek });
    try {
      const { data } = await axios.get("https://dog.ceo/api/breeds/image/random");
      await send(data.message);
    } catch {
      await send("❌ Could not fetch a dog picture.");
    }
  }
};