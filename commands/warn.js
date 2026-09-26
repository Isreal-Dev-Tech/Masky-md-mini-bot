// === warn.js ===
module.exports = {
  pattern: "warn",
  desc: "Warn a member in the group (Admin/Owner only)",
  category: "group",
  react: "⚠️",
  filename: __filename,
  use: ".warn @user",

  execute: async (conn, message, m, { from, isGroup, reply, sender }) => {
    try {
      if (!isGroup) return reply("❌ This command can only be used in groups.");

      const metadata = await conn.groupMetadata(from);
      const participant = metadata.participants.find(p => p.id === sender);
      const botId = conn.user.id.split(":")[0];
      const isAdmin = participant?.admin === "admin" || participant?.admin === "superadmin";
      const isOwner = botId === sender.split("@")[0];

      if (!isAdmin && !isOwner) return reply("❌ Only admins or the owner can warn members.");

      const mentioned = m.mentionedJid ? m.mentionedJid[0] : null;
      if (!mentioned) return reply("❌ Please mention a user to warn.");

      await conn.sendMessage(from, {
        react: { text: "⚠️", key: message.key }
      });

      await conn.sendMessage(from, {
        text: `⚠️ User @${mentioned.split("@")[0]} has been warned!`,
        mentions: [mentioned],
        contextInfo: {
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: "120363420740680510@newsletter",
            newsletterName: "MASKY MD",
            serverMessageId: 200
          }
        }
      });

    } catch (e) {
      console.error("Warn error:", e);
      await conn.sendMessage(from, { react: { text: "❌", key: message.key } });
      reply("⚠️ Failed to warn the user.");
    }
  }
};