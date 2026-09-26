// === welcomepro.js ===
module.exports = {
  pattern: "welcomepro",
  desc: "Advanced welcome message with group count & motivation (Admin/Owner only)",
  category: "group",
  react: "🎉",
  filename: __filename,
  use: ".welcomepro on/off",

  execute: async (conn, message, m, { q, reply, from, isGroup, sender }) => {
    try {
      // --- normalize JIDs ---
      const jidToBase = (jid) => String(jid).split("@")[0].split(":")[0];
      const senderBase = jidToBase(sender);
      const botBase = jidToBase(conn?.user?.id || "");

      // --- Owner check ---
      let owners = [];
      if (process.env.OWNER_NUMBER) {
        owners = process.env.OWNER_NUMBER.split(",").map(num => num.trim());
      }
      const isOwner = botBase === senderBase || owners.includes(senderBase);

      // --- Admin check ---
      let isAdmin = false;
      if (isGroup) {
        try {
          const metadata = await conn.groupMetadata(from);
          const participant = metadata.participants.find(p => jidToBase(p.id) === senderBase);
          isAdmin = participant?.admin === "admin" || participant?.admin === "superadmin";
        } catch {
          return reply("❌ Failed to get group information.");
        }
      }

      // --- Permissions ---
      if (!isOwner) {
        if (isGroup && !isAdmin) return reply("❌ Only group admins or the owner can toggle this.");
        if (!isGroup) return reply("❌ Only the owner can toggle this in DMs.");
      }

      // --- Toggle logic ---
      if (!q) {
        return reply(
          `⚙️ Usage: \`.welcomepro on\` or \`.welcomepro off\`\n\n📡 Current status: *${process.env.WELCOMEPRO_ENABLED === "true" ? "ON ✅" : "OFF ❌"}*`
        );
      }

      if (q.toLowerCase() === "on") {
        process.env.WELCOMEPRO_ENABLED = "true";
        await conn.sendMessage(from, { react: { text: "🎉", key: message.key } });
        reply("✅ WelcomePro messages enabled.\n📡 Status: *ON*");
      } else if (q.toLowerCase() === "off") {
        process.env.WELCOMEPRO_ENABLED = "false";
        await conn.sendMessage(from, { react: { text: "🎉", key: message.key } });
        reply("❌ WelcomePro messages disabled.\n📡 Status: *OFF*");
      } else {
        return reply(
          `⚙️ Usage: \`.welcomepro on\` or \`.welcomepro off\`\n\n📡 Current status: *${process.env.WELCOMEPRO_ENABLED === "true" ? "ON ✅" : "OFF ❌"}*`
        );
      }

      // --- Event listener for new participants ---
      conn.ev.on("group-participants.update", async (update) => {
        if (process.env.WELCOMEPRO_ENABLED !== "true") return;
        if (!isGroup) return;

        const metadata = await conn.groupMetadata(from);
        const added = update.action === "add" ? update.participants : [];

        const motivations = [
          "💡 Great things take time!",
          "✨ Shine bright today!",
          "🌟 You are amazing, welcome!",
          "🔥 Let's make this group fun!",
          "💫 Keep smiling and enjoy!"
        ];

        for (const user of added) {
          const groupCount = metadata.participants.length;
          const mot = motivations[Math.floor(Math.random() * motivations.length)];

          await conn.sendMessage(from, {
            text: `👋 Welcome @${user.split("@")[0]}!\nYou are member #${groupCount} in this group.\n${mot}`,
            mentions: [user],
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
        }
      });

    } catch (e) {
      console.error("WelcomePro error:", e);
      await conn.sendMessage(from, { react: { text: "❌", key: message.key } });
      reply("⚠️ Failed to toggle WelcomePro messages.");
    }
  }
};