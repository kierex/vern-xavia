const axios = require("axios");

async function recognizeImage(imageUrl, senderID) {

    try {

        const { data } = await axios.get(`https://kaiz-apis.gleeze.com/api/gemini-vision`, {

            params: { uid: senderID, imageUrl }

        });

        return data.result || "⚠ Unable to recognize the image.";

    } catch (error) {

        console.error("Image recognition error:", error);

        return "❌ Error processing the image.";

    }

}

module.exports = { recognizeImage };