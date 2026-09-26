const axios = require("axios");

module.exports = {
  pattern: "quran",
  desc: "Get Quran Surah or Verse",
  category: "islamic",
  react: "📖",
  filename: __filename,

  execute: async (conn, message, m, { from, args, reply }) => {
    try {
      if (!args[0]) {
        return reply(
          `📖 *Quran Command Usage*\n\n` +
          `• Surah only:\n> .quran 36\n` +
          `• Surah + Verse:\n> .quran 18 10\n` +
          `• Surah list:\n> .quranlist`
        );
      }

      const surah = args[0];
      const verse = args[1];

      let url = verse
        ? `https://api.alquran.cloud/v1/ayah/${surah}:${verse}/en.asad`
        : `https://api.alquran.cloud/v1/surah/${surah}/en.asad`;

      const arabicURL = verse
        ? `https://api.alquran.cloud/v1/ayah/${surah}:${verse}/ar.alafasy`
        : `https://api.alquran.cloud/v1/surah/${surah}/ar.alafasy`;

      const en = await axios.get(url);
      const ar = await axios.get(arabicURL);

      let english, arabic;

      if (verse) {
        english = en.data.data.text;
        arabic = ar.data.data.text;
      } else {
        english = en.data.data.ayahs.map(a => `${a.numberInSurah}. ${a.text}`).join("\n");
        arabic = ar.data.data.ayahs.map(a => `${a.numberInSurah}. ${a.text}`).join("\n");
      }

      const send = 
`📖 *Quran Surah ${surah}${verse ? ":" + verse : ""}*

🇦🇪 *Arabic:*  
${arabic}

🇬🇧 *English:*  
${english}
`;

      await conn.sendMessage(
        from,
        {
          text: send,
          contextInfo: {
            forwardingScore: 999,
            isForwarded: true
          }
        },
        { quoted: message }
      );

    } catch (err) {
      console.error(err);
      reply("❌ Error fetching Quran. Check Surah/Verse number.");
    }
  }
};