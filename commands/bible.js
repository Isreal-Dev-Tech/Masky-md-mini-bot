const axios = require("axios");

module.exports = {
  pattern: "bible",
  desc: "Get Bible verse in KJV. Example: .bible John 3:16",
  react: "📜",
  category: "religion",
  filename: __filename,

  execute: async (conn, mek, m, { from, q }) => {

    const send = async (text) => {
      return await conn.sendMessage(from, {
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
    };

    try {
      if (!q) return await send("❌ Example: .bible John 3:16");

      await send("⏳ Fetching scripture...");

      const api = `https://bible-api.com/${encodeURIComponent(q)}?translation=kjv`;
      const { data } = await axios.get(api);

      if (!data.text) return await send("❌ Verse not found. Check reference.");

      const verse = `📜 *Bible (KJV)*\n\n` +
                    `📖 *${data.reference}*\n` +
                    `${data.text.trim()}\n\n` +
                    `> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɪꜱʀᴀᴇʟ ᴛᴇᴄʜ ᴅᴇᴠ`;

      await send(verse);

    } catch {
      await send("❌ Unable to fetch that Bible verse.");
    }
  }
};