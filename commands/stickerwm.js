const { downloadContentFromMessage } = require("@whiskeysockets/baileys");
const { videoToWebp, imageToWebp } = require('../lib/video-utils');
const { Sticker, StickerTypes } = require("wa-sticker-formatter");

module.exports = {
  pattern: "stickerwm",
  desc: "Convert media to sticker with custom pack & author",
  category: "sticker",
  react: "🔄",
  filename: __filename,
  use: "<reply to media> [pack|author]",

  execute: async (conn, message, m, { from, q, reply }) => {
    const sendText = async (text) => conn.sendMessage(from, { text }, { quoted: message });

    try {
      const quotedMsg = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      const target = quotedMsg || message.message;

      if (!target) return sendText("❌ Reply to an image/video to create a sticker.");

      let mediaNode = target.imageMessage || target.videoMessage;
      if (!mediaNode) return sendText("❌ Only images or videos can be converted to sticker.");

      const mediaType = target.imageMessage ? "image" : "video";

      const stream = await downloadContentFromMessage(mediaNode, mediaType);
      let buffer = Buffer.from([]);
      for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

      const webpBuffer = mediaType === "image" ? await imageToWebp(buffer) : await videoToWebp(buffer);

      const [pack, author] = q ? q.split("|").map(x => x.trim()) : ["", "MASKY - MD"];

      const sticker = new Sticker(webpBuffer, {
        pack: pack || "",
        author: author || "MASKY - MD",
        type: StickerTypes.FULL,
        quality: 75,
        background: "transparent",
      });

      const out = await sticker.toBuffer();
      await conn.sendMessage(from, { sticker: out }, { quoted: message });

    } catch (err) {
      console.error("StickerWM command error:", err);
      sendText("⚠️ Failed to create sticker.");
    }
  }
};