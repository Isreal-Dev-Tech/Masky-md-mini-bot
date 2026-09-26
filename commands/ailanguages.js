module.exports = {
  pattern: "ailanguages",
  desc: "Show supported AI translate languages",
  category: "tools",
  react: "🌐",
  filename: __filename,

  execute: async (conn, message, m, { from, reply }) => {
    const text = 
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
hr = Croatian
`;

    await conn.sendMessage(
      from,
      {
        text,
        contextInfo: {
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: "120363420740680510@newsletter",
            newsletterName: "MASKY MD",
            serverMessageId: 202
          }
        }
      },
      { quoted: message }
    );
  }
};