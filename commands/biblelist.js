module.exports = {
  pattern: "biblelist",
  desc: "List all Bible books (KJV)",
  react: "📚",
  category: "religion",
  filename: __filename,

  execute: async (conn, mek, m, { from }) => {

    const send = async (text) => {
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
      }, { quoted: mek });
    };

    const books = `
📚 *Books of the Bible (KJV)*

*Old Testament*
Genesis  
Exodus  
Leviticus  
Numbers  
Deuteronomy  
Joshua  
Judges  
Ruth  
1 Samuel  
2 Samuel  
1 Kings  
2 Kings  
1 Chronicles  
2 Chronicles  
Ezra  
Nehemiah  
Esther  
Job  
Psalms  
Proverbs  
Ecclesiastes  
Song of Solomon  
Isaiah  
Jeremiah  
Lamentations  
Ezekiel  
Daniel  
Hosea  
Joel  
Amos  
Obadiah  
Jonah  
Micah  
Nahum  
Habakkuk  
Zephaniah  
Haggai  
Zechariah  
Malachi  

*New Testament*
Matthew  
Mark  
Luke  
John  
Acts  
Romans  
1 Corinthians  
2 Corinthians  
Galatians  
Ephesians  
Philippians  
Colossians  
1 Thessalonians  
2 Thessalonians  
1 Timothy  
2 Timothy  
Titus  
Philemon  
Hebrews  
James  
1 Peter  
2 Peter  
1 John  
2 John  
3 John  
Jude  
Revelation
    `;

    await send(books.trim());
  }
};