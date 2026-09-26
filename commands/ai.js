const axios = require("axios");
const config = require("../config");

module.exports = {
  pattern: "ai",
  desc: "Ask AI anything",
  react: "🤖",
  category: "ai",
  filename: __filename,

  execute: async (conn, mek, m, { from, q }) => {
    const send = async (text) =>
      conn.sendMessage(
        from,
        {
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
        },
        { quoted: mek }
      );

    if (!q) return send("❌ Example: .ai what is love?");

    await send("🤖 Thinking…");

    try {
      const { data } = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4.1-mini",
          messages: [{ role: "user", content: q }],
          max_tokens: 300
        },
        {
          headers: {
            Authorization: `Bearer ${config.OPENAI_KEY}`
          }
        }
      );

      send(data.choices[0].message.content.trim());
    } catch (err) {
      console.error("AI error:", err.response?.data || err.message);
      send("❌ AI unavailable at the moment.");
    }
  }
};
