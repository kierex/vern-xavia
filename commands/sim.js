const axios = require("axios");

module.exports = {

    name: "sim",

    description: "Chat with SimSimi AI",

    usage: "simsimi <message>",

    category: "fun",

    async run({ api, event, args }) {

        if (args.length === 0) {

            return api.sendMessage("Please provide a message to chat with SimSimi!", event.threadID, event.messageID);

        }

        const userMessage = encodeURIComponent(args.join(" "));

        const apiUrl = `https://markdevs-last-api-p2y6.onrender.com/sim?q=${userMessage}`;

        try {

            const response = await axios.get(apiUrl);

            const reply = response.data.response || "I don't understand what you're saying!";

            api.sendMessage(reply, event.threadID, event.messageID);

        } catch (error) {

            console.error("SimSimi API Error:", error);

            api.sendMessage("⚠️ Failed to fetch a response from SimSimi!", event.threadID, event.messageID);

        }

    }

};