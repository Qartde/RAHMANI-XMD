const axios = require('axios');
const config = require('../config');
const { cmd, commands } = require('../command');
const { downloadMediaMessage } = require('../lib/msg');
const fs = require("fs");

cmd({
  pattern: "save",
  desc: "Save a status/photo/video and send it to your private chat (Owner only).",
  category: "utility",
  filename: __filename,
}, async (conn, mek, m, { isOwner, reply, quoted }) => {
  if (!isOwner) return reply("❌ You are not the owner!");

  try {
    if (!quoted) {
      return reply("Please reply to a status, photo, or video message to save it.");
    }

    // Extract the mimetype from the quoted message
    let mime = (quoted.msg || quoted).mimetype || "";
    console.log("Extracted mimetype:", mime); // Debugging: Log the mimetype

    let mediaType = "";
    if (mime.startsWith("image")) {
      mediaType = "image";
    } else if (mime.startsWith("video")) {
      mediaType = "video";
    } else if (mime.startsWith("audio")) {
      mediaType = "audio";
    } else {
      console.log("Unsupported mimetype detected:", mime); // Debugging: Log unsupported mimetype
      return reply("❌ Unsupported media type. Please reply to a status, photo, or video message.");
    }

    // Download the media
    const mediaBuffer = await downloadMediaMessage(quoted);
    if (!mediaBuffer) return reply("❌ Failed to download the media.");

    // Prepare the message options based on the media type
    let messageOptions = {};
    if (mediaType === "image") {
      messageOptions = { image: mediaBuffer, mimetype: mime };
    } else if (mediaType === "video") {
      messageOptions = { video: mediaBuffer, mimetype: mime };
    } else if (mediaType === "audio") {
      messageOptions = { audio: mediaBuffer, mimetype: mime };
    }

    // Send the media to the owner's private chat
    await conn.sendMessage(m.sender, messageOptions, { quoted: m });
    reply("✅ Media saved and sent to your private chat!");

  } catch (error) {
    console.error("Error in save command:", error); // Debugging: Log the error
    reply("❌ An error occurred while saving the media.");
  }
});
