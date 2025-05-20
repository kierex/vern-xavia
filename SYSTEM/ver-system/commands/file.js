const fs = require("fs");

const path = require("path");

module.exports = {

  name: "file",

  run: async ({ api, event, args }) => {

    const { threadID, senderID } = event;

    const fileName = args[0];

    // Load VIPs from system/config.json

    const configPath = path.join(__dirname, "..", "config.json");

    let vipList = [];

    if (fs.existsSync(configPath)) {

      try {

        const configData = JSON.parse(fs.readFileSync(configPath, "utf8"));

        vipList = configData.vip || [];

      } catch (error) {

        console.error("❌ Error loading VIP list:", error);

        return api.sendMessage("❌ Error loading VIP list.", threadID);

      }

    }

    // Check if the user is a VIP

    if (!vipList.includes(senderID)) {

      return api.sendMessage("⛔ Only VIP users can use this command.", threadID);

    }

    if (!fileName) {

      return api.sendMessage("⚠️ Please specify a command file name. Example: !file ai.js", threadID);

    }

    // Define the paths for both main system and second system commands

    const mainCommandsPath = path.join(__dirname, "..", "..", "commands", fileName);

    const systemCommandsPath = path.join(__dirname, "..", "commands", fileName);

    let filePath = null;

    // Check if the file exists in the second system

    if (fs.existsSync(systemCommandsPath)) {

      filePath = systemCommandsPath;

    }

    // Check if the file exists in the main system

    else if (fs.existsSync(mainCommandsPath)) {

      filePath = mainCommandsPath;

    } else {

      return api.sendMessage(`❌ Command file '${fileName}' not found.`, threadID);

    }

    // Read and send the file content

    try {

      const fileContent = fs.readFileSync(filePath, "utf8");

      if (fileContent.length > 19000) {

        return api.sendMessage("⚠️ File is too large to display.", threadID);

      }

      api.sendMessage(`📂 Raw code of '${fileName}':\n\n${fileContent}`, threadID);

    } catch (error) {

      console.error("❌ Error reading file:", error);

      api.sendMessage("❌ Error reading the file.", threadID);

    }

  }

};