// === delete.js ===
module.exports = {
  pattern: "delete",
  desc: "Delete a message. Admins can delete others' messages, users can delete their own",
  category: "group",
  react: "🗑️",
  filename: __filename,
  use: ".delete [reply to message]",

  execute: async (conn, message, m, { from, isGroup, reply, sender }) => {
    try {
      if (!m.quoted) return reply("❌ Reply to a message to delete it.");

      const metadata = isGroup ? await conn.groupMetadata(from) : null;
      let isAdmin = false;

      if (isGroup) {
        const participant = metadata.participants.find(p => p.id === sender);
        isAdmin = participant?.admin === "admin" || participant?.admin === "superadmin";
      }

      const quotedMsg = m.quoted;
      const canDeleteOthers = isAdmin;
      const msgSender = quotedMsg.key.participant || quotedMsg.key.remoteJid;

      if (!canDeleteOthers && msgSender !== sender) {
        return reply("❌ You need to be an admin to delete other users' messages.");
      }

      await conn.sendMessage(from, { react: { text: "🗑️", key: message.key } });

      await conn.deleteMessage(from, { id: quotedMsg.key.id, remoteJid: from, fromMe: canDeleteOthers || msgSender === sender });

    } catch (e) {
      console.error("Delete command error:", e);
      await conn.sendMessage(from, { react: { text: "❌", key: message.key } });
      reply("⚠️ Failed to delete the message.");
    }
  }
};