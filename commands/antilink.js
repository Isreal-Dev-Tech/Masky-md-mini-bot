// === antilink.js ===
module.exports = {
  pattern: "antilink",
  desc: "Toggle anti-link in the group and set action type (Owner/Admin only)",
  category: "group",
  react: "🔗",
  filename: __filename,
  use: ".antilink on/off | .antilink action warn/delete/kick",

  execute: async (conn, message, m, { from, isGroup, reply, sender, q }) => {
    try {
      if (!isGroup) return reply("❌ This command only works in groups.");

      const metadata = await conn.groupMetadata(from);
      const participant = metadata.participants.find(p => p.id === sender);
      const botId = conn.user.id.split(":")[0];
      const isAdmin = participant?.admin === "admin" || participant?.admin === "superadmin";
      const isOwner = botId === sender.split("@")[0];

      if (!isAdmin && !isOwner) return reply("❌ Only admins or owner can toggle anti-link.");

      // Initialize group settings if not exist
      if (!global.antiLinkSettings) global.antiLinkSettings = {};
      if (!global.antiLinkSettings[from]) {
        global.antiLinkSettings[from] = { enabled: false, action: "warn", warnLimit: 10, warnCount: {} };
      }

      const groupSettings = global.antiLinkSettings[from];

      if (!q) {
        return reply(
          `⚙️ Usage:\n.antilink on/off\n.antilink action warn/delete/kick\n\nCurrent Status: ${groupSettings.enabled ? "ON ✅" : "OFF ❌"}\nAction: ${groupSettings.action}`
        );
      }

      const [cmd, option] = q.split(" ");

      if (cmd.toLowerCase() === "on") {
        groupSettings.enabled = true;
        return reply("✅ Anti-link enabled in this group.");
      } else if (cmd.toLowerCase() === "off") {
        groupSettings.enabled = false;
        return reply("❌ Anti-link disabled in this group.");
      } else if (cmd.toLowerCase() === "action") {
        if (!["warn", "delete", "kick"].includes(option))
          return reply("❌ Invalid action. Use: warn, delete, or kick.");
        groupSettings.action = option;
        return reply(`⚡ Anti-link action set to: ${option}`);
      } else {
        return reply("❌ Invalid command. Use on/off or action warn/delete/kick.");
      }

    } catch (e) {
      console.error("Anti-link command error:", e);
      await conn.sendMessage(from, { react: { text: "❌", key: message.key } });
      reply("⚠️ Failed to execute anti-link command.");
    }
  }
};