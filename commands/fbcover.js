const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { promisify } = require("util");

const unlinkAsync = promisify(fs.unlink);

module.exports = {
    name: "fbcover",
    description: "Generate a Facebook cover image with custom details.",
    usage: "fbcover <Name> <Subname> <Phone> <Address> <Email> <Color>",
    async run({ api, event, args }) {
        const { threadID, senderID } = event;

        // Extract and parse arguments
        const input = args.join(" ");
        const matches = [...input.matchAll(/"([^"]+)"|(\S+)/g)];
        const parsedArgs = matches.map(m => m[1] || m[2]);

        // Validate argument count
        if (parsedArgs.length < 6) {
            return api.sendMessage(
                "⚠ Usage: fbcover <Name> <Subname> <Phone> <Address> <Email> <Color>\n" +
                "Example: fbcover \"Mark Zuckerberg\" n/a 0123456789 USA zuck@gmail.com Cyan",
                threadID
            );
        }

        const [name, subname, phone, address, email, ...colorParts] = parsedArgs;
        const color = colorParts.join(" ");

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return api.sendMessage("❌ Invalid email format. Please provide a valid email address.", threadID);
        }

        const imagePath = path.join(__dirname, "cache", `fbcover_${senderID}.png`);

        // Construct API URL
        const imageUrl = `https://api.zetsu.xyz/canvas/fbcoverv5?name=${encodeURIComponent(name)}&subname=${encodeURIComponent(subname)}&phone=${encodeURIComponent(phone)}&address=${encodeURIComponent(address)}&email=${encodeURIComponent(email)}&color=${encodeURIComponent(color)}&id=4`;

        try {
            // Notify user about the process
            api.sendMessage("⏳ Generating your Facebook cover, please wait...", threadID);

            // Ensure the cache directory exists
            try {
                fs.mkdirSync(path.dirname(imagePath), { recursive: true });
            } catch (mkdirError) {
                console.error("Error creating cache directory:", mkdirError.message);
                return api.sendMessage("❌ Failed to create cache directory. Please try again later.", threadID);
            }

            // Fetch and save the image
            const response = await axios({
                url: imageUrl,
                method: "GET",
                responseType: "stream",
            });

            const writer = fs.createWriteStream(imagePath);
            response.data.pipe(writer);

            await new Promise((resolve, reject) => {
                writer.on("finish", resolve);
                writer.on("error", reject);
            });

            // Send the generated image
            api.sendMessage({
                body: `✅ Facebook cover for ${name} has been generated!`,
                attachment: fs.createReadStream(imagePath),
            }, threadID, async () => {
                try {
                    await unlinkAsync(imagePath);
                } catch (unlinkError) {
                    console.error("Error deleting image file:", unlinkError.message);
                }
            });

        } catch (error) {
            console.error("Error generating fbcover:", error.message);

            // Cleanup in case of failure
            if (fs.existsSync(imagePath)) {
                try {
                    await unlinkAsync(imagePath);
                } catch (unlinkError) {
                    console.error("Error deleting image file on failure:", unlinkError.message);
                }
            }

            api.sendMessage("❌ Failed to generate the Facebook cover. Please try again later.", threadID);
        }
    }
};