const axios = require("axios");

module.exports = {
  pattern: "biblemotivation",
  desc: "Get a motivational Bible verse (KJV)",
  react: "📖",
  category: "religion",
  filename: __filename,

  execute: async (conn, mek, m, { from, reply }) => {

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
      await send("⏳ Fetching Bible motivation...");

      // API for random KJV verse  
      const api = "https://bible-api.com/?random=verse&translation=kjv";
      const { data } = await axios.get(api);

      const caption = `📖 *Bible Motivation*\n\n` +
                      `🔹 *Verse:* ${data.reference}\n` +
                      `🔸 *KJV:* ${data.text.trim()}\n\n` +
                      `> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɪꜱʀᴀᴇʟ ᴛᴇᴄʜ ᴅᴇᴠ`;

      await send(caption);

    } catch (err) {
      return await send("❌ Unable to fetch Bible verse.");
    }
  }
};