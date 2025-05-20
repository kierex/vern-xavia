const fs = require("fs");

const path = require("path");

const commands = new Map();

const commandsDir = path.join(__dirname, "commands");

const configFile = path.join(__dirname, "config.json");

let config = { vip: [], Prefix: ["!"] };

try {

    config = JSON.parse(fs.readFileSync(configFile, "utf8"));

} catch (error) {

    console.error("Error loading system/config.json:", error);

}



const loadCommands = () => {

    const commandFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith(".js"));

    for (const file of commandFiles) {

        try {

            const command = require(path.join(commandsDir, file));

            if (command.name) {

                commands.set(command.name.toLowerCase(), command);

            }

        } catch (error) {

            console.error(`Error loading system command '${file}':`, error);

        }

    }

};

loadCommands();

console.log("[𝗦𝗲𝗰𝗼𝗻𝗱—𝘀𝘆𝘀𝘁𝗲𝗺]:", [...commands.keys()]);



 



const executeCommand = async ({ api, event }) => {

    const { body, senderID, threadID } = event;

    const message = body.trim();

   

    const prefix = config.Prefix.find(p => message.startsWith(p));

    if (!prefix) return;

    // Remove prefix and split command & args

    const args = message.slice(prefix.length).trim().split(/ +/);

    const commandName = args.shift()?.toLowerCase();

    const command = commands.get(commandName);

    if (!command) return;

    

    if (!config.vip.includes(senderID)) {

        return api.sendMessage("⛔ Only VIP users can use this command.", threadID);

    }

    try {

        await command.run({ api, event, args });

    } catch (error) {

        api.sendMessage(`❌ Error executing command: ${error.message}`, threadID);

    }

};

module.exports = { executeCommand };