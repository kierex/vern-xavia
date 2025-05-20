const axios = require("axios");

module.exports = {
    name: "flux",
    author: "Aljur Pogoy",
    description: "Generate image with flux, don't try neyga ",

    async run({ api, event, args }) {
        if (!args.length) return api.sendMessage(" Please provide a prompt!\nUsage: /flux <prompt>", event.threadID, event.messageID);

        const prompt = args.join(" ");
        const url = `https://kaiz-apis.gleeze.com/api/flux`;

        try {
            const { data } = await axios.get(url, { responseType: "stream", params: { prompt } });

            api.sendMessage({
                body: ` Here is your generated image for: "${args.join(" ")}"`,
                attachment: data
            }, event.threadID, event.messageID);
        } catch (error) {
            api.sendMessage("" + error.stack, event.threadID, event.messageID);
        }
    }
};