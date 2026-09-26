const axios = require("axios");

module.exports = {
  pattern: "hadith",
  desc: "Get a random hadith",
  react: "🕌",
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
      await conn.sendMessage(from, { react: { text: module.exports.react, key: mek.key } });

      const { data } = await axios.get("https://api.sunnah.com/v1/hadiths/random");
      
      if (!data || !data.hadith) 
        return send("❌ Unable to fetch hadith at the moment.");

      const text = `🕌 *RANDOM HADITH*\n\n` +
                   `📖 ${data.hadith}\n\n` +
                   `> ᴘᴏᴡᴇʀᴇᴅ ʙy: ɪꜱʀᴀᴇʟ ᴛᴇᴄʜ ᴅᴇᴠ`;

      await send(text);

    } catch (e) {
      send("⚠️ Error fetching hadith.");
    }
  }
};