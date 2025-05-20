module.exports = {

    name: "ping",

    run: async ({ api, event }) => {

        api.sendMessage("Pong!", event.threadID);

    }

};