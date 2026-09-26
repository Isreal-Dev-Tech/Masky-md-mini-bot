const { GoogleGenAI } = require("@google/genai"); 
// Assuming config.js exports an object like { GEMINI_API_KEY: '...' }
const config = require("../config"); 

// Initialize the GoogleGenAI instance
// It will use config.GEMINI_API_KEY if available, or fall back to process.env
const ai = new GoogleGenAI({ apiKey: config.GEMINI_API_KEY || process.env.GEMINI_API_KEY }); 

// Utility function to generate and send an image
const generateAndSendImage = async (conn, from, mek, prompt, style = "photorealistic") => {
    // Add the style preference directly to the prompt for better results
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

        // The image data is returned as a base64 encoded string
        const base64Image = response.generatedImages[0].image.imageBytes;
        const imageBuffer = Buffer.from(base64Image, 'base64');
        
        conn.sendMessage(from, {
            image: imageBuffer,
            caption: `✅ **${style.toUpperCase()}** Image generated successfully for: *${prompt}*`
        }, { quoted: mek });

    } catch (e) {
        console.error("Image generation error:", e);
        // Provide a clearer error message for common issues
        conn.sendMessage(from, { 
            text: "❌ Image generation failed.\n\nPossible Reasons:\n1. Invalid or missing `GEMINI_API_KEY` in config.\n2. The prompt violates safety policy." 
        }, { quoted: mek });
    }
}

module.exports = {
  pattern: "aianime",
  desc: "Generate an image in anime/manga style",
  react: "🎬",
  category: "ai",
  filename: __filename,
  execute: async (conn, mek, m, { from, q }) => {
    if (!q) return conn.sendMessage(from, { text: "🎬 Send a description for the anime image.\nExample: .aianime samurai girl standing on a rooftop" }, { quoted: mek });
    
    // Use a specific, high-quality anime style prompt
    await generateAndSendImage(conn, from, mek, q, "detailed anime illustration, high quality manga style, digital art, vibrant colors");
  }
};
                         
