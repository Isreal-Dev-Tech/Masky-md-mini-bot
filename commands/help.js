const fs = require("fs");
const path = require("path");

module.exports = {
    name: "help",
    category: "general",
    description: "Show the list of all commands and their descriptions",

    execute: async (conn, msg, args) => {
        try {
            const commandsPath = path.join(__dirname); // folder of all commands
            const categories = fs.readdirSync(commandsPath);

            let helpText = "📌 *COMMAND HELP LIST*\n\n";

            for (const category of categories) {
                const categoryPath = path.join(commandsPath, category);
                if (!fs.lstatSync(categoryPath).isDirectory()) continue;

                helpText += `\n🔷 *${category.toUpperCase()}*\n`;

                const files = fs.readdirSync(categoryPath).filter(f => f.endsWith(".js"));

                for (const file of files) {
                    const command = require(path.join(categoryPath, file));

                    helpText += `\n• *${command.name}* — ${command.description || "No description"}`;
                }
            }

            await conn.sendMessage(msg.key.remoteJid, { text: helpText });

        } catch (err) {
            console.error(err);
            await conn.sendMessage(msg.key.remoteJid, { text: "❌ Error generating help list" });
        }
    }
};