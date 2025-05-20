const fs = require("fs");
const path = require("path");

module.exports = {
    name: "install",
    author: "Vrn Esg",
    description: "Installs a command or event dynamically.",
    usage: "/install command <filename>.js <code> OR /install event <filename>.js <code>",

    async run({ api, event, args }) {
        if (args.length < 3) {
            return api.sendMessage("❌ Usage: /install <command/event> <filename>.js <code>", event.threadID);
        }

        const type = args[0].toLowerCase();
        const filename = args[1];
        const code = args.slice(2).join(" ");

        // Validate type
        if (type !== "command" && type !== "event") {
            return api.sendMessage("❌ Invalid type! Use `/install command` or `/install event`.", event.threadID);
        }

        // Validate filename
        if (!filename.endsWith(".js")) {
            return api.sendMessage("❌ Filename must end with `.js`!", event.threadID);
        }

        // Validate JavaScript module format
        if (!code.includes("module.exports")) {
            return api.sendMessage("❌ Invalid module structure. Make sure it contains `module.exports`.", event.threadID);
        }

        // Determine directory based on type
        const directory = path.join(__dirname, "..", type === "command" ? "commands" : "events");
        const filePath = path.join(directory, filename);

        // Ensure directory exists
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
        }

        // Write the file
        try {
            fs.writeFileSync(filePath, code, "utf8");
            api.sendMessage(`✅ Successfully installed ${type}: ${filename}`, event.threadID);
        } catch (err) {
            api.sendMessage(`❌ Failed to install ${type}: ${err.message}`, event.threadID);
        }
    }
};