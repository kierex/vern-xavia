const { recognizeImage } = require("./imageRecognition");

async function handleReplies(api, event) {

    const { threadID, senderID, messageReply, attachments } = event;

    if (messageReply?.attachments?.length > 0 && messageReply.attachments[1].type === "photo") {

        // If user replies with an image, process it

        const imageUrl = messageReply.attachments[0].url;

        const recognitionResult = await recognizeImage(imageUrl, senderID);

        return api.sendMessage(recognitionResult, threadID, event.messageID);

    }

    // Handle other types of replies if needed in the future

    return null;

}

module.exports = { handleReplies };