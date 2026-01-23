const { zokou } = require("../framework/zokou");
const axios = require("axios");
const ytSearch = require("yt-search");
const config = require("../set");

/**
 * Build WhatsApp contextInfo
 */
const buildContextInfo = (
  bodyText = "",
  mentionedJid = "",
  thumbnail = ""
) => ({
  mentionedJid: [mentionedJid],
  forwardingScore: 999999,
  isForwarded: true,
  forwardedNewsletterMessageInfo: {
    newsletterJid: "120363353854480831@newsletter",
    newsletterName: "ʀᴀʜᴍᴀɴ xᴍᴅ",
    serverMessageId: Math.floor(100000 + Math.random() * 900000),
  },
  externalAdReply: {
    showAdAttribution: true,
    title: config.BOT || "YouTube Downloader",
    body: bodyText || "Media Downloader",
    thumbnailUrl: thumbnail || config.URL || "",
    sourceUrl: config.GURL || "",
    mediaType: 1,
    renderLargerThumbnail: false,
  },
});

/**
 * Search YouTube
 */
async function searchYouTube(query) {
  const result = await ytSearch(query);
  if (!result.videos || !result.videos.length) {
    throw new Error("No video found.");
  }
  return result.videos[0];
}

/* ======================
   AUDIO / MP3 COMMAND
====================== */
zokou(
  {
    nomCom: "play",
    aliases: ["song", "playdoc", "audio", "mp3"],
    categorie: "download",
    reaction: "🎸",
  },
  async (chatId, client, data) => {
    const { arg, ms, userJid } = data;

    try {
      if (!arg[0]) {
        return repondre(client, chatId, ms, "Please provide a song name.");
      }

      const query = arg.join(" ");
      const video = await searchYouTube(query);
      const videoUrl = video.url;

      await client.sendMessage(
        chatId,
        {
          text: "🎵 *ʀᴀʜᴍᴀɴ xᴍᴅ ᴅᴏᴡɴʟᴏᴀᴅɪɴɢ ᴀᴜᴅɪᴏ*...",
          contextInfo: buildContextInfo(
            "Downloading audio",
            userJid,
            video.thumbnail
          ),
        },
        { quoted: ms }
      );

      // 🎧 GiftedTech API (ACTIVE)
      const api = `https://ytapi.giftedtech.co.ke/api/ytdla.php?url=${encodeURIComponent(
        videoUrl
      )}&stream=true`;

      const res = await axios.get(api, {
        responseType: "arraybuffer",
        timeout: 60000,
      });

      const audioBuffer = Buffer.from(res.data);

      // 🔊 Send audio
      await client.sendMessage(
        chatId,
        {
          audio: audioBuffer,
          mimetype: "audio/mpeg",
          caption: `🎵 *${video.title}*`,
          contextInfo: buildContextInfo(
            video.title,
            userJid,
            video.thumbnail
          ),
        },
        { quoted: ms }
      );

      // 📁 Send document (mp3)
      await client.sendMessage(
        chatId,
        {
          document: audioBuffer,
          mimetype: "audio/mpeg",
          fileName: `${video.title}.mp3`.replace(/[^\w\s.-]/gi, ""),
          caption: `📁 *${video.title}*`,
          contextInfo: buildContextInfo(
            video.title,
            userJid,
            video.thumbnail
          ),
        },
        { quoted: ms }
      );
    } catch (err) {
      console.error("Audio download error:", err);
      repondre(client, chatId, ms, "❌ Download failed.");
    }
  }
);
