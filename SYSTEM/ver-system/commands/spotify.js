const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  name: "spotify",

  run: async ({ api, event, args }) => {
    const query = args.join(" ");

    if (!query) {
      return api.sendMessage("❌ Please provide a song name.", event.threadID, event.messageID);
    }

    const apiUrl = `https://betadash-search-download.vercel.app/spt?search=${encodeURIComponent(query)}`;

    try {
      const response = await axios.get(apiUrl);
      const data = response.data;

      if (!data || !data.title || !data.url || !data.audio) {
        return api.sendMessage("⚠️ No results found.", event.threadID, event.messageID);
      }

      const audioUrl = data.audio;
      const tempFilePath = path.join(__dirname, "temp_audio.mp3");

      // Download the audio file
      const audioResponse = await axios.get(audioUrl, { responseType: "arraybuffer" });
      
      // Ensure file is written correctly
      try {
        fs.writeFileSync(tempFilePath, Buffer.from(audioResponse.data, "binary"));
      } catch (error) {
        console.error("Error writing audio file:", error);
        return api.sendMessage("❌ Failed to save audio file.", event.threadID, event.messageID);
      }

      const message = `🎵 **Spotify Search Result** 🎵\n\n` +
        `🎶 Title: ${data.title}\n` +
        `👤 Artist: ${data.artist || "Unknown"}\n` +
        `🔗 Link: ${data.url}`;

      // Send the audio attachment
      api.sendMessage(
        {
          body: message,
          attachment: fs.createReadStream(tempFilePath),
        },
        event.threadID,
        () => fs.unlinkSync(tempFilePath), // Delete file after sending
        event.messageID
      );

    } catch (error) {
      console.error("Error fetching Spotify data:", error);
      api.sendMessage("❌ Error fetching data from Spotify.", event.threadID, event.messageID);

      // Ensure file cleanup happens even in case of an error
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
    }
  },
};