const fs = require("fs");

const path = require("path");

const configFile = path.join(__dirname, "..", "config.json");

let config = { vip: [] };

try {

    config = JSON.parse(fs.readFileSync(configFile, "utf8"));

} catch (error) {

    console.error("Error loading config.json:", error);

}

module.exports = {

    name: "unsend",

    run: async ({ api, event }) => {

        const { threadID, messageID, senderID, type, messageReply } = event;

        // Check if the user is a VIP

        if (!config.vip.includes(senderID)) {

            return api.sendMessage("🚫 This command is for VIPs only.", threadID, messageID);

        }

        if (type !== "message_reply") {

            return api.sendMessage("⚠️ Please reply to the bot's message to unsend.", threadID, messageID);

        }

        if (!messageReply || messageReply.senderID !== api.getCurrentUserID()) {

            return api.sendMessage("🚫 You can only unsend the bot's messages.", threadID, messageID);

        }

        return api.unsendMessage(messageReply.messageID);

    }

};