module.exports = {

    name: "setnick",

    run: async ({ api, event, args }) => {

        const { threadID, messageID, senderID } = event;

        

        // VIP Check

        const config = require("../config.json");

        if (!config.vip.includes(senderID)) {

            return api.sendMessage("🚫 This command is for VIP users only.", threadID, messageID);

        }

        const newNick = args.join(" ");

        if (!newNick) {

            return api.sendMessage("⚠️ Please provide a new nickname for the bot.", threadID, messageID);

        }

        try {

            const botID = api.getCurrentUserID();

            await api.changeNickname(newNick, threadID, botID);

            return api.sendMessage(`✅ Successfully changed bot nickname to: ${newNick}`, threadID, messageID);

        } catch (error) {

            console.error(error);

            return api.sendMessage("❌ Failed to change nickname. Make sure the bot has admin permissions.", threadID, messageID);

        }

    }

};