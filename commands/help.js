const fs = require("fs");

const path = require("path");

module.exports = {

  name: "help",

  category: "Utility",

  

  execute: async (api, event, args, commands, prefix, admins, appState, sendMessage) => {

    const { threadID } = event;

    const mainCommandsDir = path.join(__dirname, "..", "commands");

    let commandList = [];

    let eventList = [];

    let cmdCount = 1, eventCount = 1;

    try {

      const commandFiles = fs.readdirSync(mainCommandsDir).filter(file => file.endsWith(".js"));

      commandFiles.forEach((file) => {

        const commandPath = path.join(mainCommandsDir, file);

        try {

          const command = require(commandPath);

          const commandName = file.replace(".js", ""); // Remove .js extension

          if (typeof command !== "object" || !command.name) {

            console.warn(`⚠️ Skipping invalid command file: ${file}`);

            return;

          }

          if (command.handleEvent) {

            eventList.push(`  ├──\n  | 【 ${eventCount++}. 】 ${commandName}\n  └───────────────✦`);

          } else {

            commandList.push(`  ├──\n  | 【 ${cmdCount++}. 】 ${commandName}\n  └───────────────✦`);

          }

        } catch (cmdError) {

          console.error(`❌ Error loading command: ${file}`, cmdError);

        }

      });

    } catch (error) {

      console.error("❌ Error reading commands directory:", error);

      sendMessage(api, { threadID, message: "❌ Error loading command list." });

      return;

    }

    // Construct the help message

    let helpMessage = "====【Vrax AKA vern 】====\n\n";

    helpMessage += commandList.length > 0 ? commandList.join("\n") + "\n\n" : "No available commands.\n\n";

    if (eventList.length > 0) {

      helpMessage += "====【 Event Commands 】====\n\n";

      helpMessage += eventList.join("\n") + "\n\n";

    }

    helpMessage += `> You are using now the bot owned by vern aka vrax, this bot has multiple system and multiple command structures.\n`;

    helpMessage += `> This is the original version 2.0 of Cid bot, will release soon.\n`;

    helpMessage += `> For further assistance, contact the developer,\n`;

    helpMessage += `Gmail: heroxattackz@gmail.com\n`;

    helpMessage += `Facebook: https://www.facebook.com/vern.23x`;

  

    sendMessage(api, { threadID, message: helpMessage });

  }

};