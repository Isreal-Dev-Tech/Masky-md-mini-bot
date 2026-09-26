module.exports = {
  pattern: "emojiart",
  desc: "Convert text to emoji art",
  react: "🎨",
  category: "fun",
  filename: __filename,

  execute: async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ Provide text for emoji art.");
    const art = q.split("").map(c => c === " " ? "⬛" : "🟩").join(" ");
    await conn.sendMessage(from, { text: art }, { quoted: mek });
  }
};