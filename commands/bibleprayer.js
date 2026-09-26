const axios = require("axios");

module.exports = {
  pattern: "bibleprayer",
  desc: "Receive a short prayer inspired by the Bible",
  react: "🙏",
  category: "religion",
  filename: __filename,

  execute: async (conn, mek, m, { from }) => {

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
      await send("⏳ Preparing a prayer for you...");

      const api = "https://bible-api.com/?random=verse&translation=kjv";
      const { data } = await axios.get(api);

      const verse = data.text.trim();
      const ref = data.reference;

      const prayer = `🙏 *Bible Prayer*\n\n` +
                     `📖 *Verse:* ${ref}\n` +
                     `${verse}\n\n` +
                     `🛐 *Prayer:*  
Heavenly Father, thank You for Your word.  
Let this scripture strengthen my spirit, guide my steps,  
and fill me with peace and wisdom today. Amen.\n\n` +
                     `> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɪꜱʀᴀᴇʟ ᴛᴇᴄʜ ᴅᴇᴠ`;

      await send(prayer);

    } catch {
      await send("❌ Unable to generate prayer now.");
    }
  }
};