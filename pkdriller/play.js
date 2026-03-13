const { zokou } = require("../framework/zokou");
const axios = require("axios");
const yts = require("yt-search");

const BASE_URL = "https://noobs-api.top";
const NEWSLETTER_JID = "120363353854480831@newsletter";
const NEWSLETTER_NAME = "RAHMANI XMD";
const BOT_NAME = "RAHMANI-XMD";
const THUMBNAIL_URL = "https://files.catbox.moe/aktbgo.jpg";

// === Command: .play (Audio Play - send as voice) ===
zokou({
  nomCom: "play",
  aliases: ["music", "audio"],
  categorie: "Download",
  reaction: "🎵",
}, async (dest, zk, { repondre, arg, ms }) => {
  const query = arg.join(" ");
  if (!query) {
    return repondre(`🎵 *${BOT_NAME} MUSIC DOWNLOADER*\n\nExample: .play nikuone`);
  }

  try {
    await repondre(`🔍 Searching for: ${query}`);

    const search = await yts(query);
    const video = search.videos[0];
    if (!video) return repondre("❌ No results found.");

    // Send just the YouTube link first (quick response)
    await zk.sendMessage(dest, {
      text: `🎵 *${video.title}*\n⏱️ ${video.timestamp}\n🔗 ${video.url}\n\n⚡ *${BOT_NAME}*`,
      contextInfo: {
        externalAdReply: {
          title: video.title.substring(0, 30),
          body: `Duration: ${video.timestamp}`,
          thumbnailUrl: video.thumbnail,
          mediaType: 1
        }
      }
    }, { quoted: ms });

    // Try to download in background (don't wait for response)
    try {
      const apiURL = `${BASE_URL}/dipto/ytDl3?link=${video.videoId}&format=mp3`;
      const response = await axios.get(apiURL, { timeout: 30000 });
      
      let downloadLink = response.data?.downloadLink || response.data?.download || response.data?.url;
      
      if (downloadLink) {
        await zk.sendMessage(dest, {
          audio: { url: downloadLink },
          mimetype: "audio/mp4",
        }, { quoted: ms });
      }
    } catch (e) {
      console.log("Background download failed:", e.message);
      // Don't show error - user already has YouTube link
    }

  } catch (err) {
    console.error("[PLAY] Error:", err);
    repondre(`❌ Error: ${err.message}`);
  }
});

// === Command: .song (Audio as Document) ===
zokou({
  nomCom: "song",
  aliases: ["mp3"],
  categorie: "Download",
  reaction: "🎶",
}, async (dest, zk, { repondre, arg, ms }) => {
  const query = arg.join(" ");
  if (!query) return repondre(`🎶 *Example:* .song nikuone`);

  try {
    await repondre(`🔍 Searching: ${query}`);

    const search = await yts(query);
    const video = search.videos[0];
    if (!video) return repondre("❌ No results found.");

    // Send YouTube link first
    await zk.sendMessage(dest, {
      text: `🎶 *${video.title}*\n⏱️ ${video.timestamp}\n🔗 ${video.url}\n\n⚡ *${BOT_NAME}*`,
      contextInfo: {
        externalAdReply: {
          title: video.title.substring(0, 30),
          body: `Duration: ${video.timestamp}`,
          thumbnailUrl: video.thumbnail,
          mediaType: 1
        }
      }
    }, { quoted: ms });

    // Try alternative API for download
    try {
      const apiURL = `https://pajansen.com/api/ytdl?url=${video.url}&type=mp3`;
      const response = await axios.get(apiURL, { timeout: 30000 });
      
      if (response.data?.result?.url) {
        await zk.sendMessage(dest, {
          document: { url: response.data.result.url },
          mimetype: "audio/mpeg",
          fileName: `${video.title}.mp3`,
        }, { quoted: ms });
      }
    } catch (e) {
      console.log("Download failed:", e.message);
    }

  } catch (err) {
    console.error("[SONG] Error:", err);
    repondre(`❌ Error: ${err.message}`);
  }
});

// === Command: .video (YouTube Video MP4) ===
zokou({
  nomCom: "video",
  aliases: ["vid", "mp4"],
  categorie: "Download",
  reaction: "🎥",
}, async (dest, zk, { repondre, arg, ms }) => {
  const query = arg.join(" ");
  if (!query) return repondre(`🎥 *Example:* .video nikuone`);

  try {
    await repondre(`🔍 Searching: ${query}`);

    const search = await yts(query);
    const video = search.videos[0];
    if (!video) return repondre("❌ No results found.");

    // Send YouTube link first
    await zk.sendMessage(dest, {
      text: `🎥 *${video.title}*\n⏱️ ${video.timestamp}\n🔗 ${video.url}\n\n⚡ *${BOT_NAME}*`,
      contextInfo: {
        externalAdReply: {
          title: video.title.substring(0, 30),
          body: `Duration: ${video.timestamp}`,
          thumbnailUrl: video.thumbnail,
          mediaType: 1
        }
      }
    }, { quoted: ms });

    // Try to download video
    try {
      const apiURL = `https://pajansen.com/api/ytdl?url=${video.url}&type=mp4`;
      const response = await axios.get(apiURL, { timeout: 30000 });
      
      if (response.data?.result?.url) {
        await zk.sendMessage(dest, {
          video: { url: response.data.result.url },
          mimetype: "video/mp4",
          caption: `⚡ *${BOT_NAME}*`,
        }, { quoted: ms });
      }
    } catch (e) {
      console.log("Video download failed:", e.message);
    }

  } catch (err) {
    console.error("[VIDEO] Error:", err);
    repondre(`❌ Error: ${err.message}`);
  }
});
