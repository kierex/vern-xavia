const axios = require('axios');

module.exports = {
  config: {
    name: "redroom",
    aliases: ["rr", "blood"],
    version: "1.1",
    author: "Vern",
    countDown: 5,
    role: 0,
    shortDescription: {
      vi: "Gửi hình ảnh kinh dị đỏ rực",
      en: "Send creepy Red Room images"
    },
    longDescription: {
      vi: "Lệnh gửi hình ảnh phong cách Red Room, tối tăm và rùng rợn",
      en: "Sends Red Room style horror images - dark and creepy"
    },
    category: "image",
    guide: {
      vi: "{pn}",
      en: "{pn}"
    }
  },

  getImageUrl: function () {
    const images = [
      "https://cdn.pixabay.com/photo/2017/01/30/13/50/ghost-2029670_1280.jpg",
      "https://cdn.pixabay.com/photo/2020/10/12/13/45/ghost-5648530_1280.jpg",
      "https://cdn.pixabay.com/photo/2016/11/19/14/00/horror-1833837_1280.jpg",
      "https://cdn.pixabay.com/photo/2016/11/29/09/32/horror-1863372_1280.jpg",
      "https://cdn.pixabay.com/photo/2018/10/30/20/30/horror-3785685_1280.jpg",
      "https://cdn.pixabay.com/photo/2018/10/30/20/30/horror-3785684_1280.jpg",
      "https://cdn.pixabay.com/photo/2018/10/30/20/30/horror-3785683_1280.jpg",
      "https://cdn.pixabay.com/photo/2018/10/30/20/30/horror-3785682_1280.jpg",
      "https://cdn.pixabay.com/photo/2018/10/30/20/30/horror-3785681_1280.jpg",
      "https://cdn.pixabay.com/photo/2018/10/30/20/30/horror-3785680_1280.jpg",
      "https://cdn.pixabay.com/photo/2018/10/30/20/30/horror-3785679_1280.jpg",
      "https://cdn.pixabay.com/photo/2018/10/30/20/30/horror-3785678_1280.jpg",
      "https://cdn.pixabay.com/photo/2018/10/30/20/30/horror-3785677_1280.jpg",
      "https://cdn.pixabay.com/photo/2018/10/30/20/30/horror-3785676_1280.jpg",
      "https://cdn.pixabay.com/photo/2018/10/30/20/30/horror-3785675_1280.jpg"
    ];
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
  },

  getCreepyMessage: function () {
    const messages = [
      "The shadows whisper your name...",
      "You can't escape the gaze from the abyss.",
      "Behind you, something stirs.",
      "The walls have eyes, and they're watching.",
      "A chill runs down your spine... it's not the wind.",
      "The silence is deafening, and it's about to break.",
      "Every step you take echoes in the void.",
      "Your reflection doesn't mimic your moves anymore.",
      "The darkness is not empty; it's waiting.",
      "Whispers grow louder when you're alone.",
      "The air feels thick, as if breathing isn't yours.",
      "Something unseen brushes past you.",
      "Your heartbeat isn't the only rhythm in the room.",
      "The floorboards creak, but no one's there.",
      "A distant scream pierces the silence."
    ];
    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
  },

  onStart: async function ({ message }) {
    try {
      const imageUrl = this.getImageUrl();
      const creepyMessage = this.getCreepyMessage();
      return message.reply({
        body: creepyMessage,
        attachment: await global.utils.getStreamFromURL(imageUrl)
      });
    } catch (error) {
      console.error("Error while retrieving RedRoom image:", error);
      return message.reply("Something went wrong while summoning the Red Room...");
    }
  }
};