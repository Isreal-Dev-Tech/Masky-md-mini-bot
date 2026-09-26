const axios = require("axios");

module.exports = {
  pattern: "aisummary",
  desc: "Summarize long text using AI",
  react: "📘",
  category: "ai",
  filename: __filename,

  execute: async (conn, mek, m, { from, q }) => {
    const send = async (text) =>
      conn.sendMessage(from, {
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

    if (!q) return send("❌ Provide text to summarize.\nExample: .aisummary long paragraph...");

    await send("📘 Summarizing…");

    try {
      const { data } = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: `Summarize this text: ${q}` }],
          max_tokens: 250
        },
        { headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` } }
      );

      send("📘 *Summary:*\n\n" + data.choices[0].message.content.trim());
    } catch {
      send("❌ Could not summarize text.");
    }
  }
};