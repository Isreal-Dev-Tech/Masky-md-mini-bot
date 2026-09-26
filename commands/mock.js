module.exports = {
  pattern: "mock",
  desc: "Convert your text to mocking SpongeBob style",
  react: "🗣️",
  category: "fun",
  filename: __filename,

  execute: async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ Please provide text to mock.");
    const mockText = q.split("").map((c, i) => i % 2 === 0 ? c.toUpperCase() : c.toLowerCase()).join("");
    await conn.sendMessage(from, { text: mockText }, { quoted: mek });
  }
};