const axios = require("axios");

module.exports = {
  pattern: "dua",
  desc: "Get a random Islamic dua",
  react: "🤲",
  category: "religion",
  filename: __filename,

  execute: async (conn, mek, m, { from }) => {
    const send = async (text) => conn.sendMessage(from, {
      text,
      contextInfo: {
        isForwarded: true,
        forwardingScore: 999,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363420740680510@newsletter",
          newsletterName: "MASKY MD",
          serverMessageId: 200
        }
      }
    }, { quoted: mek });

    try {
      await conn.sendMessage(from, { react: { text: module.exports.react, key: mek.key } });

      const { data } = await axios.get("https://dua-api.vercel.app/dua");

      if (!data || !data.dua)
        return send("❌ Could not fetch Dua.");

      const msg = `🤲 *Dua*\n\n` +
                  `✨ ${data.dua}\n\n` +
                  `> ᴘᴏᴡᴇʀᴇᴅ ʙy ɪꜱʀᴀᴇʟ ᴛᴇᴄʜ ᴅᴇᴠ`;

      await send(msg);

    } catch (e) {
      send("⚠️ Error fetching dua.");
    }
  }
};