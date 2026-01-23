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
  try {
    const result = await ytSearch(query);
    if (!result?.videos?.length) {
      throw new Error("No video found.");
    }
    return result.videos[0];
  } catch (err) {
    console.error("YouTube search error:", err);
    throw new Error("YouTube search failed: " + err.message);
  }
}

/**
 * Try multiple download APIs
 */
async function fetchFromApis(apiList) {
  for (const api of apiList) {
    try {
      const res = await axios.get(api, { timeout: 15000 });
      if (res.data?.success) {
        return res.data;
      }
    } catch (err) {
      console.warn(`API failed: ${api}`, err.message);
    }
  }
  throw new Error("All download APIs failed.");
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

      await client.sendMessage(
        chatId,
        {
          text: "🎵 *ʀᴀʜᴍᴀɴ xᴍᴅ ᴅᴏᴡɴʟᴏᴀᴅɪɴɢ ᴀᴜᴅɪᴏ*...",
          contextInfo: buildContextInfo(
            "Downloading",
            userJid,
            video.thumbnail
          ),
        },
        { quoted: ms }
      );

      const apis = [
        `https://api.davidcyriltech.my.id/download/ytmp3?url=${encodeURIComponent(video.url)}`,
        `https://www.dark-yasiya-api.site/download/ytmp3?url=${encodeURIComponent(video.url)}`,
        `https://ytapi.giftedtech.co.ke/api/ytdla.php?url=${encodeURIComponent(video.url)}&apikey=gifted-md`,
        `https://api.dreaded.site/api/ytdl/audio?url=${encodeURIComponent(video.url)}`,
      ];

      const response = await fetchFromApis(apis);
      const { download_url, title } = response.result;

      const messages = [
        {
          audio: { url: download_url },
          mimetype: "audio/mp4",
          caption: `🎵 *${title}*`,
          contextInfo: buildContextInfo(title, userJid, video.thumbnail),
        },
        {
          document: { url: download_url },
          mimetype: "audio/mpeg",
          fileName: `${title}.mp3`.replace(/[^\w\s.-]/gi, ""),
          caption: `📁 *${title}* (Document)`,
          contextInfo: buildContextInfo(title, userJid, video.thumbnail),
        },
      ];

      for (const msg of messages) {
        await client.sendMessage(chatId, msg, { quoted: ms });
      }
    } catch (err) {
      console.error("Audio download error:", err);
      repondre(client, chatId, ms, "Download failed: " + err.message);
    }
  }
);

/* ======================
   VIDEO / MP4 COMMAND
====================== */
zokou(
  {
    nomCom: "video",
    aliases: ["videodoc", "film", "mp4"],
    categorie: "download",
    reaction: "🎬",
  },
  async (chatId, client, data) => {
    const { arg, ms, userJid } = data;

    try {
      if (!arg[0]) {
        return repondre(client, chatId, ms, "Please provide a video name.");
      }

      const query = arg.join(" ");
      const video = await searchYouTube(query);

      await client.sendMessage(
        chatId,
        {
          text: "🎬 *ʀᴀʜᴍᴀɴ xᴍᴅ ᴅᴏᴡɴʟᴏᴀᴅɪɴɢ ᴠɪᴅᴇᴏ*...",
          contextInfo: buildContextInfo(
            "Downloading",
            userJid,
            video.thumbnail
          ),
        },
        { quoted: ms }
      );

      const apis = [
        `https://www.dark-yasiya-api.site/download/ytmp4?url=${encodeURIComponent(video.url)}`,
        `https://ytapi.giftedtech.co.ke/api/ytdla.php?url=${encodeURIComponent(video.url)}&apikey=gifted-md`,
        `https://api.dreaded.site/api/ytdl/video?url=${encodeURIComponent(video.url)}`,
      ];

      const response = await fetchFromApis(apis);
      const { download_url, title } = response.result;

      const messages = [
        {
          video: { url: download_url },
          mimetype: "video/mp4",
          caption: `🎥 *${title}*`,
          contextInfo: buildContextInfo(title, userJid, video.thumbnail),
        },
        {
          document: { url: download_url },
          mimetype: "video/mp4",
          fileName: `${title}.mp4`.replace(/[^\w\s.-]/gi, ""),
          caption: `📁 *${title}* (Document)`,
          contextInfo: buildContextInfo(title, userJid, video.thumbnail),
        },
      ];

      for (const msg of messages) {
        await client.sendMessage(chatId, msg, { quoted: ms });
      }
    } catch (err) {
      console.error("Video download error:", err);
      repondre(client, chatId, ms, "Download failed: " + err.message);
    }
  }
);
