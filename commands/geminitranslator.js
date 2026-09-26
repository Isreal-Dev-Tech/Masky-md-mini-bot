const { GoogleGenAI } = require("@google/genai"); 
// Initialize the AI client using the environment variable GEMINI_API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }); 

module.exports = {
  pattern: "geminitranslator",
  desc: "Translate text using the Gemini 2.5 Flash model",
  react: "🌐",
  category: "ai",
  filename: __filename,

  execute: async (conn, mek, m, { from, q }) => {
    const send = async (text) =>
      conn.sendMessage(from, {
        text,
        contextInfo: {
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: "120363420740680510@newsletter",
            newsletterName: "AI GENERATOR",
            serverMessageId: 200
          }
        }
      }, { quoted: mek });

    if (!q) return send("🌐 Send the target language and text to translate.\nExample: .geminitranslator es Hello world");

    // Split the query into target language (first word) and text (rest)
    const parts = q.split(/\s+/);
    if (parts.length < 2) {
        return send("🌐 Invalid format. Use: .geminitranslator [to_language] [text]\nExample: .geminitranslator fr I love AI");
    }

    const targetLang = parts[0].trim();
    const textToTranslate = parts.slice(1).join(" ");
    
    // Construct the prompt for the model
    const prompt = `Translate the following text into the language represented by the code or name '${targetLang}'. Only return the translated text and nothing else.
    
    Original Text: "${textToTranslate}"`;

    await send(`⏳ Translating to **${targetLang.toUpperCase()}**...`);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
      });

      const translatedText = response.text.trim();

      send(`✅ **Translation (${targetLang.toUpperCase()}):**\n\n${translatedText}`);
    } catch (e) {
      console.error(e);
      send("❌ Translation failed. Check your `GEMINI_API_KEY` or the language code.");
    }
  }
};
