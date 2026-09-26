const { downloadContentFromMessage } = require("@whiskeysockets/baileys");

module.exports = {
  pattern: "vv2",
  desc: "Open view-once media and forward it to a bot JID",
  category: "utility",
  react: "🙉",
  filename: __filename,
  use: "<reply to a view-once media>",

  execute: async (conn, message, m, { from, reply }) => {
    const BOT_JID = conn.user.id; // send to bot jid 

    const sendMessageWithContext = async (text, quoted = message) => {
      return await conn.sendMessage(from, {
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
      }, { quoted });
    };

    try {
      let quotedNode = m?.quoted?.message?.message || m?.quoted?.message || m?.quoted || message?.message?.extendedTextMessage?.contextInfo?.quotedMessage;

      if (!quotedNode) return sendMessageWithContext("🍁 Please reply to a *view-once* media with `.vv2`.");

      const viewOnceWrapper = quotedNode.viewOnceMessage || quotedNode.viewOnceMessageV2 || (quotedNode.message && (quotedNode.message.viewOnceMessage || quotedNode.message.viewOnceMessageV2)) || null;
      const innerPayload = viewOnceWrapper ? viewOnceWrapper.message || viewOnceWrapper : quotedNode.message || quotedNode;

      const innerNode = innerPayload.imageMessage || innerPayload.videoMessage || innerPayload.audioMessage || innerPayload.stickerMessage || innerPayload.documentMessage || null;
      if (!innerNode) return sendMessageWithContext("❌ That's not a view-once media.");

      let mediaType = null;
      if (innerPayload.imageMessage || innerNode?.mimetype?.startsWith?.("image")) mediaType = "image";
      else if (innerPayload.videoMessage || innerNode?.mimetype?.startsWith?.("video")) mediaType = "video";
      else if (innerPayload.audioMessage || innerNode?.mimetype?.startsWith?.("audio")) mediaType = "audio";
      else if (innerPayload.stickerMessage) mediaType = "sticker";
      else if (innerPayload.documentMessage) mediaType = "document";

      if (!mediaType) return sendMessageWithContext("❌ Unsupported media type in view-once message.");

      if (module.exports.react) {
        try { await conn.sendMessage(from, { react: { text: module.exports.react, key: message.key } }); } catch(e) {}
      }

      // Download media
      let buffer = null;
      try {
        if (typeof m?.quoted?.download === "function") buffer = await m.quoted.download();
        else if (typeof quotedNode.download === "function") buffer = await quotedNode.download();
      } catch {}

      if (!buffer) {
        const stream = await downloadContentFromMessage(innerNode, mediaType);
        buffer = Buffer.from([]);
        for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
      }

      if (!buffer || buffer.length === 0) return sendMessageWithContext("❌ Downloaded view-once media is empty.");

      const contextInfo = {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363420740680510@newsletter",
          newsletterName: "MASKY MD",
          serverMessageId: 200
        }
      };

      // Forward media to bot JID
      if (mediaType === "image") {
        await conn.sendMessage(BOT_JID, { image: buffer, caption: "Opened view-once image", contextInfo });
      } else if (mediaType === "video") {
        await conn.sendMessage(BOT_JID, { video: buffer, caption: "Opened view-once video", contextInfo });
      } else if (mediaType === "audio") {
        await conn.sendMessage(BOT_JID, { audio: buffer, mimetype: innerNode.mimetype || "audio/mp4", ptt: innerNode.ptt || false, contextInfo });
      } else if (mediaType === "sticker") {
        await conn.sendMessage(BOT_JID, { sticker: buffer, contextInfo });
      } else if (mediaType === "document") {
        await conn.sendMessage(BOT_JID, { document: buffer, fileName: innerNode.fileName || "file", contextInfo });
      }

      await sendMessageWithContext("✅ View-once media forwarded to bot successfully!");

    } catch (err) {
      console.error("vv2.js error:", err);
      await sendMessageWithContext("❌ Failed to open/forward view-once media.");
    }
  }
};