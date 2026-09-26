const axios = require("axios");

module.exports = {
  pattern: "ayat",
  desc: "Get a random Quran verse",
  react: "📜",
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

      const { data } = await axios.get("https://random-quran-ayat.vercel.app/api");

      if (!data || !data.verse)
        return send("❌ Unable to fetch Quran verse.");

      const msg = `📿 *Random Quran Verse*\n\n` +
                  `🔖 *Surah*: ${data.surah}\n` +
                  `📜 *Ayah*: ${data.ayah}\n\n` +
                  `✨ ${data.verse}\n\n` +
                  `> ᴘᴏᴡᴇʀᴇᴅ ʙy ɪꜱʀᴀᴇʟ ᴛᴇᴄʜ ᴅᴇᴠ`;

      await send(msg);

    } catch (e) {
      send("⚠️ Unable to fetch Quran ayat.");
    }
  }
};