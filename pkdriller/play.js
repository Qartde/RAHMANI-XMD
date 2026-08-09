const axios = require("axios");
const yts = require("yt-search");
const { zokou } = require("../framework/zokou");

const BOT_NAME = "RAHMANI-XMD";
const NEWSLETTER_JID = "120363353854480831@newsletter";
const THUMBNAIL = "https://files.catbox.moe/aktbgo.jpg";

// ==================== CONTEXT INFO ====================
const getContext = (title, body, thumbnail) => ({
  contextInfo: {
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: NEWSLETTER_JID,
      newsletterName: BOT_NAME,
      serverMessageId: 143
    },
    forwardingScore: 999,
    externalAdReply: {
      title: BOT_NAME,
      body: body || "🎵 Music Downloader",
      thumbnailUrl: thumbnail || THUMBNAIL,
      mediaType: 1,
      renderSmallThumbnail: true
    }
  }
});

// ==================== PLAY COMMAND (AUDIO) ====================
zokou({
  nomCom: "play",
  aliases: ["music", "song", "audio", "mziki"],
  categorie: "Download",
  reaction: "🎵"
}, async (dest, zk, { arg, ms, repondre }) => {
  try {
    // Check if song name is provided
    if (!arg || arg.length === 0) {
      return await zk.sendMessage(dest, {
        text: `╭━━━〔 *${BOT_NAME}* 〕━━━╮
┃
┃ 🎵 *MUSIC DOWNLOADER*
┃
┃ 📝 *Usage:*
┃ └─ .play [song name]
┃
┃ 📌 *Example:*
┃ └─ .play nikuone
┃
┃ ⚡️ *Fast & High Quality*
┃
╰━━━〔 *POWERED BY RAHMANI* 〕━━━╯

⚡ *${BOT_NAME}*`,
        ...getContext("🎵 Music Downloader", "Enter song name to download")
      }, { quoted: ms });
    }

    const query = arg.join(" ");
    
    // Send searching message
    await zk.sendMessage(dest, {
      text: `🔍 *Searching for:* ${query}\n\n⏳ Please wait...`,
      ...getContext("🔍 Searching", `Looking for: ${query.substring(0, 25)}...`)
    }, { quoted: ms });

    // Search YouTube
    const search = await yts(query);
    const data = search.videos[0];

    if (!data) {
      return await zk.sendMessage(dest, {
        text: `❌ *No results found*\n\nCould not find: "${query}"\n\nPlease try another song name.`,
        ...getContext("❌ Not Found", "Try another song")
      }, { quoted: ms });
    }

    // Send song info with thumbnail
    await zk.sendMessage(dest, {
      image: { url: data.thumbnail },
      caption: `╭━━━〔 *${BOT_NAME}* 〕━━━╮
┃
┃ 🎵 *${data.title}*
┃
┃ ⏱️ *Duration:* ${data.timestamp}
┃ 👁️ *Views:* ${data.views.toLocaleString()}
┃ 📅 *Uploaded:* ${data.ago}
┃ 📺 *Channel:* ${data.author.name}
┃
┃ 🔗 *YouTube:* ${data.url}
┃
┃ ⏳ *Downloading audio...*
┃
╰━━━〔 *POWERED BY RAHMANI* 〕━━━╯

⚡ *${BOT_NAME}*`,
      ...getContext("🎵 Song Found", data.title.substring(0, 30), data.thumbnail)
    }, { quoted: ms });

    // Try API with timeout
    try {
      const apiRes = await axios.get(`https://apiziaul.vercel.app/api/downloader/ytplaymp3`, {
        params: { query },
        timeout: 30000
      });
      
      const json = apiRes.data;

      if (!json.status || !json.result || !json.result.downloadUrl) {
        // Send YouTube link as fallback
        await zk.sendMessage(dest, {
          text: `⚠️ *Could not download audio*\n\nHere's the YouTube link:\n${data.url}\n\n⚡ *${BOT_NAME}*`,
          ...getContext("⚠️ Download Failed", "YouTube link provided")
        }, { quoted: ms });
        return;
      }

      const downloadUrl = json.result.downloadUrl;
      const title = json.result.title || data.title;

      // Send audio with newsletter context
      await zk.sendMessage(dest, {
        audio: { url: downloadUrl },
        mimetype: "audio/mpeg",
        ...getContext("🎵 Audio Ready", title.substring(0, 30), data.thumbnail)
      }, { quoted: ms });

      // Send as document (optional)
      await zk.sendMessage(dest, {
        document: { url: downloadUrl },
        mimetype: "audio/mpeg",
        fileName: `${title.replace(/[^a-zA-Z0-9]/g, '_')}.mp3`,
        caption: `🎵 *${title}*\n\n⚡ *${BOT_NAME}*`,
        ...getContext("📁 MP3 File", title.substring(0, 30), data.thumbnail)
      }, { quoted: ms });

    } catch (apiError) {
      console.error("API Error:", apiError.message);
      
      // Send YouTube link as fallback
      await zk.sendMessage(dest, {
        text: `⚠️ *API is currently unavailable*\n\nHere's the YouTube link:\n${data.url}\n\n⚡ *${BOT_NAME}*`,
        ...getContext("⚠️ API Unavailable", "YouTube link provided")
      }, { quoted: ms });
    }

  } catch (error) {
    console.error("Play error:", error);
    await zk.sendMessage(dest, {
      text: `❌ *Error downloading music*\n\n${error.message}\n\nPlease try again later.\n\n⚡ *${BOT_NAME}*`,
      ...getContext("❌ Error", "Download failed")
    }, { quoted: ms });
  }
});

// ==================== VIDEO COMMAND ====================
zokou({
  nomCom: "video",
  aliases: ["darama", "vid", "mp4"],
  categorie: "Download",
  reaction: "🎥"
}, async (dest, zk, { arg, ms, repondre }) => {
  try {
    // Check if video name is provided
    if (!arg || arg.length === 0) {
      return await zk.sendMessage(dest, {
        text: `╭━━━〔 *${BOT_NAME}* 〕━━━╮
┃
┃ 🎥 *VIDEO DOWNLOADER*
┃
┃ 📝 *Usage:*
┃ └─ .video [video name]
┃
┃ 📌 *Example:*
┃ └─ .video nikuone
┃
┃ ⚡️ *Fast & High Quality*
┃
╰━━━〔 *POWERED BY RAHMANI* 〕━━━╯

⚡ *${BOT_NAME}*`,
        ...getContext("🎥 Video Downloader", "Enter video name to download")
      }, { quoted: ms });
    }

    const query = arg.join(" ");
    
    // Send searching message
    await zk.sendMessage(dest, {
      text: `🔍 *Searching for:* ${query}\n\n⏳ Please wait...`,
      ...getContext("🔍 Searching", `Looking for: ${query.substring(0, 25)}...`)
    }, { quoted: ms });

    // Search YouTube
    const search = await yts(query);
    const data = search.videos[0];

    if (!data) {
      return await zk.sendMessage(dest, {
        text: `❌ *No results found*\n\nCould not find: "${query}"\n\nPlease try another video name.`,
        ...getContext("❌ Not Found", "Try another video")
      }, { quoted: ms });
    }

    // Send video info with thumbnail
    await zk.sendMessage(dest, {
      image: { url: data.thumbnail },
      caption: `╭━━━〔 *${BOT_NAME}* 〕━━━╮
┃
┃ 🎥 *${data.title}*
┃
┃ ⏱️ *Duration:* ${data.timestamp}
┃ 👁️ *Views:* ${data.views.toLocaleString()}
┃ 📅 *Uploaded:* ${data.ago}
┃ 📺 *Channel:* ${data.author.name}
┃
┃ 🔗 *YouTube:* ${data.url}
┃
┃ ⏳ *Downloading video...*
┃
╰━━━〔 *POWERED BY RAHMANI* 〕━━━╯

⚡ *${BOT_NAME}*`,
      ...getContext("🎥 Video Found", data.title.substring(0, 30), data.thumbnail)
    }, { quoted: ms });

    // Try API with timeout
    try {
      const apiRes = await axios.get(`https://apiziaul.vercel.app/api/downloader/ytmp4`, {
        params: { url: data.url },
        timeout: 30000
      });
      
      const json = apiRes.data;

      if (!json.status || !json.result || !json.result.downloadUrl) {
        // Send YouTube link as fallback
        await zk.sendMessage(dest, {
          text: `⚠️ *Could not download video*\n\nHere's the YouTube link:\n${data.url}\n\n⚡ *${BOT_NAME}*`,
          ...getContext("⚠️ Download Failed", "YouTube link provided")
        }, { quoted: ms });
        return;
      }

      const downloadUrl = json.result.downloadUrl;
      const title = json.result.title || json.result.filename || data.title;

      // Send video with newsletter context
      await zk.sendMessage(dest, {
        video: { url: downloadUrl },
        mimetype: "video/mp4",
        caption: `🎥 *${title}*\n\n⚡ *${BOT_NAME}*`,
        ...getContext("🎥 Video Ready", title.substring(0, 30), data.thumbnail)
      }, { quoted: ms });

      // Send as document (optional)
      await zk.sendMessage(dest, {
        document: { url: downloadUrl },
        mimetype: "video/mp4",
        fileName: `${title.replace(/[^a-zA-Z0-9]/g, '_')}.mp4`,
        caption: `🎥 *${title}*\n\n⚡ *${BOT_NAME}*`,
        ...getContext("📁 MP4 File", title.substring(0, 30), data.thumbnail)
      }, { quoted: ms });

    } catch (apiError) {
      console.error("API Error:", apiError.message);
      
      // Send YouTube link as fallback
      await zk.sendMessage(dest, {
        text: `⚠️ *API is currently unavailable*\n\nHere's the YouTube link:\n${data.url}\n\n⚡ *${BOT_NAME}*`,
        ...getContext("⚠️ API Unavailable", "YouTube link provided")
      }, { quoted: ms });
    }

  } catch (error) {
    console.error("Video error:", error);
    await zk.sendMessage(dest, {
      text: `❌ *Error downloading video*\n\n${error.message}\n\nPlease try again later.\n\n⚡ *${BOT_NAME}*`,
      ...getContext("❌ Error", "Download failed")
    }, { quoted: ms });
  }
});
