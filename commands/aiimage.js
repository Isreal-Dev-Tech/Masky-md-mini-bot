const { GoogleGenAI } = require("@google/genai"); 
const geminiApiKey = 'AIzaSyCe-Fqwgwq8NMBeQOpqyl2rWwcfCxUuW2w'
const ai = new GoogleGenAI({ apiKey: geminiApiKey }); 

// Utility function (Repeated for standalone file)
const generateAndSendImage = async (conn, from, mek, prompt, style = "photorealistic") => {
    const fullPrompt = `${prompt}, in a ${style} style.`;
    
    conn.sendMessage(from, { text: `⏳ Generating image with style: **${style}** for prompt: **${prompt}**...` }, { quoted: mek });

    try {
        const response = await ai.models.generateImages({
            model: "imagen-3.0-generate-002", // Official Google Image Model
            prompt: fullPrompt,
            config: {
                numberOfImages: 1,
                outputMimeType: "image/jpeg",
                aspectRatio: "1:1", 
            }
        });

        const base64Image = response.generatedImages[0].image.imageBytes;
        const imageBuffer = Buffer.from(base64Image, 'base64');
        
        conn.sendMessage(from, {
            image: imageBuffer,
            caption: `✅ ${style.toUpperCase()} Image generated successfully.`
        }, { quoted: mek });

    } catch (e) {
        console.error("Image generation error:", e);
        conn.sendMessage(from, { text: "❌ Image generation failed. Check your API key, subscription, and the content filter." }, { quoted: mek });
    }
}

module.exports = {
  pattern: "aiimage",
  desc: "Generate a photorealistic image",
  react: "🖼️",
  category: "ai",
  filename: __filename,
  execute: async (conn, mek, m, { from, q }) => {
    if (!q) return conn.sendMessage(from, { text: "🖼️ Send a description.\nExample: .aiimage detailed oil painting of a wolf" }, { quoted: mek });
    await generateAndSendImage(conn, from, mek, q, "photorealistic and cinematic");
  }
};
