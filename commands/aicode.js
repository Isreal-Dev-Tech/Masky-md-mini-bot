const axios = require("axios");

module.exports = {
  pattern: "aicode",
  desc: "Generate code using AI",
  react: "💻",
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

    if (!q) return send("❌ Example: .aicode write a login system in python");

    await send("💻 Generating code…");

    try {
      const { data } = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: q }],
          max_tokens: 400
        },
        { headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` } }
      );

      send("💻 *AI Code:*\n\n" + data.choices[0].message.content.trim());
    } catch {
      send("❌ Could not generate code.");
    }
  }
};