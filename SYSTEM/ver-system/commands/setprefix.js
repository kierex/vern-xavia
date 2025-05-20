const fs = require("fs");

const path = require("path");

module.exports = {

    name: "setprefix",

    run: async ({ api, event, args }) => {

        const { threadID, messageID, senderID } = event;

        // VIP Check

        const configPath = path.join(__dirname, "../config.json");

        let config = require(configPath);

        if (!config.vip.includes(senderID)) {

            return api.sendMessage("🚫 This command is for VIP users only.", threadID, messageID);

        }

        const newPrefix = args[1];

        if (!newPrefix) {

            return api.sendMessage("⚠️ Please provide a new prefix.", threadID, messageID);

        }

        try {

            config.Prefix = [newPrefix];

            fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

            return api.sendMessage(`✅ Successfully changed bot prefix to: ${newPrefix}`, threadID, messageID);

        } catch (error) {

            console.error(error);

            return api.sendMessage("❌ Failed to change prefix. Make sure the bot has write permissions.", threadID, messageID);

        }

    }

};