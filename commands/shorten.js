const axios = require("axios");

module.exports = {
  pattern: "shorten",
  desc: "Shorten a long URL",
  category: "utility",
  react: "🔗",
  filename: __filename,
  use: ".shorten <url>",

  execute: async (conn, message, m, { from, q }) => {
    const sendText = async (text, quoted = message) => {
      return conn.sendMessage(from, { 
        text,
        contextInfo: {
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: "120363420740680510@newsletter",
            newsletterName: "MASKU MD",
            serverMessageId: 200
          }
        }
      }, { quoted });
    };

    try {
      if (!q) return await sendText("❌ Please provide a URL to shorten.\n\n*Usage:* `.shorten https://example.com`");

      const api = `https://tinyurl.com/api-create.php?url=${encodeURIComponent(q)}`;
      const { data } = await axios.get(api);

      if (!data) return await sendText("❌ Failed to shorten URL.");

      await sendText(`🔗 Shortened URL:\n${data}`);

    } catch (err) {
      console.error("Shorten command error:", err);
      await sendText("⚠️ Failed to shorten URL.");
    }
  }
};