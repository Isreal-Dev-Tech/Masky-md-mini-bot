const axios = require("axios");

module.exports = {
  pattern: "aitranslate",
  desc: "AI Translate — reply to a message or use <lang> <text>",
  category: "tools",
  react: "🌐",
  filename: __filename,

  execute: async (conn, message, m, { from, args, reply }) => {
    try {

      // =============== LANGUAGE LIST ===============
      if (args[0] === "list") {
        return reply(
`🌐 *AI Translate — Supported Languages*

en = English  
ar = Arabic  
zh = Chinese  
fr = French  
de = German  
hi = Hindi  
it = Italian  
ja = Japanese  
ko = Korean  
pt = Portuguese  
ru = Russian  
es = Spanish  
tr = Turkish  
nl = Dutch  
pl = Polish  
sv = Swedish  
uk = Ukrainian  
vi = Vietnamese  
he = Hebrew  
id = Indonesian  
ro = Romanian  
cs = Czech  
el = Greek  
fi = Finnish  
hu = Hungarian  
no = Norwegian  
sk = Slovak  
bg = Bulgarian  
fa = Persian  
sr = Serbian  
da = Danish  
tl = Tagalog  
sw = Swahili  
af = Afrikaans  
ms = Malay  
et = Estonian  
lt = Lithuanian  
sl = Slovenian  
hr = Croatian`
        );
      }
      // =============================================

      let targetLang = args[0];
      let text = args.slice(1).join(" ");

      // 1️⃣ If replying to a message
      if (m?.quoted?.text) {
        text = m.quoted.text;
        if (!targetLang) targetLang = "en"; // default
      }

      // 2️⃣ If user typed: aitranslate en Hello
      if (!text && args.length >= 2) {
        text = args.slice(1).join(" ");
      }

      // 3️⃣ If user typed only ".aitranslate"
      if (!text) {
        return reply(
          `🌐 *How to use AI Translate*\n\n` +
          `Reply to any message:\n> .aitranslate\n\n` +
          `Translate into a language:\n> .aitranslate es\n\n` +
          `Or type text:\n> .aitranslate fr Hello world\n\n` +
          `Show languages:\n> .aitranslate list`
        );
      }

      // Default language = English
      if (!targetLang) targetLang = "en";

      // =============== TRANSLATION REQUEST ===============
      const res = await axios.post(
        "https://libretranslate.de/translate",
        {
          q: text,
          source: "auto",
          target: targetLang,
          format: "text"
        },
        { headers: { "Content-Type": "application/json" } }
      );

      const output = res.data?.translatedText;
      if (!output) return reply("❌ Translation failed.");
      // ====================================================

      // VV style reply formatting
      await conn.sendMessage(
        from,
        {
          text: `🌐 *Translated (${targetLang})*\n\n${output}`,
          contextInfo: {
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: "120363420740680510@newsletter",
              newsletterName: "MASKY MD",
              serverMessageId: 203
            }
          }
        },
        { quoted: message }
      );

    } catch (err) {
      console.error(err);
      reply(`❌ Error: ${err.message}`);
    }
  }
};