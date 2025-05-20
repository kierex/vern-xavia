const fs = require("fs");

const path = require("path");

module.exports = {

  name: "viplist",

  run: async ({ api, event }) => {

    const { threadID } = event;

    // Path to the 2ND SYSTEM config.json

    const configPath = path.join(__dirname, "..", "config.json");

    // Check if config file exists

    if (!fs.existsSync(configPath)) {

      return api.sendMessage("❌ VIP list not found.", threadID);

    }

    // Read VIP list from config.json

    const configData = JSON.parse(fs.readFileSync(configPath, "utf8"));

    const vipUsers = configData.vip || [];

    // If no VIP users

    if (vipUsers.length === 0) {

      return api.sendMessage("🚫 No VIP users found.", threadID);

    }

    let vipListMessage = "====『 𝟮𝗡𝗗 𝗦𝗬𝗦𝗧𝗘𝗠 𝗩𝗜𝗣 𝗟𝗜𝗦𝗧 』====\n\n";

    

    // Fetch and format each VIP user

    let count = 1;

    for (const uid of vipUsers) {

      try {

        const userInfo = await api.getUserInfo(uid);

        const name = userInfo[uid]?.name || "Unknown User";

        vipListMessage += `  ╭─╮\n  | 『 ${count++}.』 ${name}\n  | UID: ${uid}\n  ╰─────────────ꔪ\n`;

      } catch (error) {

        console.error(`❌ Error fetching user ${uid}:`, error);

        vipListMessage += `  | 『 ${count++}.』 UID: ${uid} (Name Unavailable)\n`;

      }

    }

    // Send VIP list message

    api.sendMessage(vipListMessage, threadID);

  }

};