const axios = require("axios");

module.exports = {
  pattern: "verse",
  desc: "Get a random Bible verse",
  react: "📖",
  category: "religion",
  filename: __filename,

  execute: async (conn, mek, m, { from }) => {
    const send = async (text) => conn.sendMessage(from, {
      text,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363420740680510@newsletter",
          newsletterName: "MASKY MD",
          serverMessageId: 200
        }
      }
    }, { quoted: mek });

    try {
      await conn.sendMessage(from, { react: { text: module.exports.react, key: mek.key } });

      const response = await axios.get("https://bible-api.com/random");
      const data = response.data;

      if (!data || !data.text)
        return send("❌ Unable to fetch Bible verse.");

      const message =
        `📖 *Bible Verse*\n\n` +
        `📌 *${data.reference}*\n` +
        `${data.text}\n\n` +
        `> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɪꜱʀᴀᴇʟ ᴛᴇᴄʜ ᴅᴇᴠ`;

      send(message);
    } catch (e) {
      send("⚠️ Unable to fetch Bible verse right now.");
    }
  }
};