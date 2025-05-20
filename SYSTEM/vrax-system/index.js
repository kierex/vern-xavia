const fs = require("fs");

const path = require("path");

const { status, shadow } = require("./config.json");

const commands = new Map();

const inventoryPath = path.join(__dirname, "Inventory");

// Load all commands dynamically

fs.readdirSync(inventoryPath).forEach(file => {

    if (file.endsWith(".js")) {

        try {

            const command = require(path.join(inventoryPath, file));

            if (command.config?.name) {

                commands.set(command.config.name.toLowerCase(), command);

            }

        } catch (error) {

            console.error(`❌ Failed to load command ${file}:`, error);

        }

    }

});

console.log("✅ Jinwoo-System Loaded Successfully!");

// Execute Commands

async function executeCommand({ api, event }) {

    const { body, threadID, senderID, messageID } = event;

    if (!body) return;

    // Check if message starts with the prefix

    if (!body.startsWith(status)) return;

    const args = body.slice(status.length).trim().split(/ +/);

    const commandName = args.shift().toLowerCase();

    if (!commands.has(commandName)) return;

    const command = commands.get(commandName);

    // Check Permissions

    if (command.config.hasPermission > 0 && !shadow.includes(senderID)) {

        return api.sendMessage("⛔ You don't have permission to use this command!", threadID);

    }

    try {

        if (command.onStart) {

            const response = await command.onStart({ api, event, args });

            // Ensure bot replies to user properly

            if (typeof response === "string") {

                api.sendMessage(response, threadID, messageID);

            }

            console.log(`✅ Command executed: ${commandName} by ${senderID}`);

        } else {

            api.sendMessage("⚠️ This command has no onStart function.", threadID, messageID);

        }

    } catch (error) {

        api.sendMessage(" Error ", threadID, messageID);

        console.error(`❌ Error in command (${commandName}):`, error);

    }

}

// Handle Chat-Based Commands (like AI interactions)

async function handleChat({ api, event }) {

    const { body, threadID, messageID } = event;

    if (!body) return;

    for (const command of commands.values()) {

        if (command.onChat) {

            try {

                const response = await command.onChat({ api, event });

                // Ensure bot replies to user properly

                if (typeof response === "string") {

                    api.sendMessage(response, threadID, messageID);

                }

            } catch (error) {

                console.error(`❌ Error in onChat (${command.config?.name}):`, error);

            }

        }

    }

}

module.exports = { executeCommand, handleChat };