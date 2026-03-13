const { zokou } = require("../framework/zokou");
const axios = require("axios");
const yts = require("yt-search");

const BASE_URL = "https://noobs-api.top";

// Newsletter Info
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
  desc: "Search and play MP3 music from YouTube (audio only).",
}, async (dest, zk, { repondre, arg, ms }) => {
  const query = arg.join(" ");
  if (!query) {
    await zk.sendMessage(dest, {
      text: `🎵 *${BOT_NAME} MUSIC DOWNLOADER*\n\nPlease provide a song name.\n\nExample: \`.play nikuone\`\n\n⚡ *${BOT_NAME}*`,
      contextInfo: {
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: NEWSLETTER_JID,
          newsletterName: NEWSLETTER_NAME,
          serverMessageId: 143
        },
        forwardingScore: 999,
        externalAdReply: {
          title: BOT_NAME,
          body: '🎵 Enter song name to download',
          thumbnailUrl: THUMBNAIL_URL,
          mediaType: 1,
          renderSmallThumbnail: true
        }
      }
    }, { quoted: ms });
    return;
  }

  try {
    // Send searching message
    await zk.sendMessage(dest, {
      text: `🔍 *Searching for:* ${query}\n\n⏳ Please wait...`,
      contextInfo: {
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: NEWSLETTER_JID,
          newsletterName: NEWSLETTER_NAME,
          serverMessageId: 143
        },
        forwardingScore: 999,
        externalAdReply: {
          title: BOT_NAME,
          body: `🔍 Searching: ${query.substring(0, 20)}`,
          thumbnailUrl: THUMBNAIL_URL,
          mediaType: 1,
          renderSmallThumbnail: true
        }
      }
    }, { quoted: ms });

    const search = await yts(query);
    const video = search.videos[0];
    if (!video) return repondre("❌ No results found.");

    const safeTitle = video.title.replace(/[\\/:*?\"<>|]/g, "");
    const fileName = `${safeTitle}.mp3`;
    const apiURL = `${BASE_URL}/dipto/ytDl3?link=${encodeURIComponent(video.videoId)}&format=mp3`;

    console.log("Fetching from API:", apiURL);
    
    const response = await axios.get(apiURL, { timeout: 60000 });
    const data = response.data;
    
    console.log("API Response:", data);
    
    let downloadLink = null;
    if (data.downloadLink) downloadLink = data.downloadLink;
    else if (data.download) downloadLink = data.download;
    else if (data.url) downloadLink = data.url;
    else if (data.link) downloadLink = data.link;
    
    if (!downloadLink) return repondre("❌ Failed to retrieve MP3 link.");

    // Info message
    let message = `╭━━━〔 *${BOT_NAME}* 〕━━━╮\n` +
      `┃\n` +
      `┃ 🎵 *Title:* ${video.title}\n` +
      `┃ ⏱️ *Duration:* ${video.timestamp}\n` +
      `┃ 👁️ *Views:* ${video.views.toLocaleString()}\n` +
      `┃ 📅 *Uploaded:* ${video.ago}\n` +
      `┃ 📺 *Channel:* ${video.author.name}\n` +
      `┃\n` +
      `┃ 🔗 ${video.url}\n` +
      `┃\n` +
      `╰━━━〔 *DOWNLOADING* 〕━━━╯`;

    // Send thumbnail + caption
    await zk.sendMessage(dest, {
      image: { url: video.thumbnail },
      caption: message,
      contextInfo: {
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: NEWSLETTER_JID,
          newsletterName: NEWSLETTER_NAME,
          serverMessageId: 143
        },
        forwardingScore: 999,
        externalAdReply: {
          title: BOT_NAME,
          body: `🎵 ${video.title.substring(0, 25)}`,
          thumbnailUrl: video.thumbnail || THUMBNAIL_URL,
          mediaType: 1,
          renderSmallThumbnail: true
        }
      }
    }, { quoted: ms });

    // Send Audio
    await zk.sendMessage(dest, {
      audio: { url: downloadLink },
      mimetype: "audio/mp4",
      fileName: fileName,
      contextInfo: {
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: NEWSLETTER_JID,
          newsletterName: NEWSLETTER_NAME,
          serverMessageId: 143
        },
        forwardingScore: 999,
        externalAdReply: {
          title: BOT_NAME,
          body: `🎵 ${video.title.substring(0, 25)}`,
          thumbnailUrl: video.thumbnail || THUMBNAIL_URL,
          mediaType: 1,
          renderSmallThumbnail: true,
          sourceUrl: downloadLink
        }
      }
    }, { quoted: ms });

  } catch (err) {
    console.error("[PLAY] Error:", err);
    
    let errorMsg = "❌ *Error downloading music.*\n\n";
    if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
      errorMsg += "The server is taking too long to respond.\nTry again later.";
    } else {
      errorMsg += err.message;
    }
    
    await zk.sendMessage(dest, {
      text: `${errorMsg}\n\n⚡ *${BOT_NAME}*`,
      contextInfo: {
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: NEWSLETTER_JID,
          newsletterName: NEWSLETTER_NAME,
          serverMessageId: 143
        },
        forwardingScore: 999,
        externalAdReply: {
          title: BOT_NAME,
          body: '❌ Download Failed',
          thumbnailUrl: THUMBNAIL_URL,
          mediaType: 1,
          renderSmallThumbnail: true
        }
      }
    }, { quoted: ms });
  }
});

// === Command: .song (Audio as Document) ===
zokou({
  nomCom: "song",
  aliases: ["audiofile", "mp3doc"],
  categorie: "Download",
  reaction: "🎶",
  desc: "Search and send MP3 music as document from YouTube.",
}, async (dest, zk, { repondre, arg, ms }) => {
  const query = arg.join(" ");
  if (!query) {
    await zk.sendMessage(dest, {
      text: `🎶 *${BOT_NAME} MUSIC DOWNLOADER*\n\nPlease provide a song name.\n\nExample: \`.song nikuone\`\n\n⚡ *${BOT_NAME}*`,
      contextInfo: {
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: NEWSLETTER_JID,
          newsletterName: NEWSLETTER_NAME,
          serverMessageId: 143
        },
        forwardingScore: 999,
        externalAdReply: {
          title: BOT_NAME,
          body: '🎶 Enter song name to download',
          thumbnailUrl: THUMBNAIL_URL,
          mediaType: 1,
          renderSmallThumbnail: true
        }
      }
    }, { quoted: ms });
    return;
  }

  try {
    // Send searching message
    await zk.sendMessage(dest, {
      text: `🔍 *Searching for:* ${query}\n\n⏳ Please wait...`,
      contextInfo: {
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: NEWSLETTER_JID,
          newsletterName: NEWSLETTER_NAME,
          serverMessageId: 143
        },
        forwardingScore: 999,
        externalAdReply: {
          title: BOT_NAME,
          body: `🔍 Searching: ${query.substring(0, 20)}`,
          thumbnailUrl: THUMBNAIL_URL,
          mediaType: 1,
          renderSmallThumbnail: true
        }
      }
    }, { quoted: ms });

    const search = await yts(query);
    const video = search.videos[0];
    if (!video) return repondre("❌ No results found.");

    const safeTitle = video.title.replace(/[\\/:*?\"<>|]/g, "");
    const fileName = `${safeTitle}.mp3`;
    const apiURL = `${BASE_URL}/dipto/ytDl3?link=${encodeURIComponent(video.videoId)}&format=mp3`;

    const response = await axios.get(apiURL, { timeout: 60000 });
    const data = response.data;
    
    let downloadLink = null;
    if (data.downloadLink) downloadLink = data.downloadLink;
    else if (data.download) downloadLink = data.download;
    else if (data.url) downloadLink = data.url;
    else if (data.link) downloadLink = data.link;
    
    if (!downloadLink) return repondre("❌ Failed to retrieve MP3 link.");

    let message = `╭━━━〔 *${BOT_NAME}* 〕━━━╮\n` +
      `┃\n` +
      `┃ 🎵 *Title:* ${video.title}\n` +
      `┃ ⏱️ *Duration:* ${video.timestamp}\n` +
      `┃ 👁️ *Views:* ${video.views.toLocaleString()}\n` +
      `┃ 📅 *Uploaded:* ${video.ago}\n` +
      `┃ 📺 *Channel:* ${video.author.name}\n` +
      `┃\n` +
      `┃ 🔗 ${video.url}\n` +
      `┃\n` +
      `╰━━━〔 *DOWNLOADING* 〕━━━╯`;

    // Send thumbnail + caption
    await zk.sendMessage(dest, {
      image: { url: video.thumbnail },
      caption: message,
      contextInfo: {
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: NEWSLETTER_JID,
          newsletterName: NEWSLETTER_NAME,
          serverMessageId: 143
        },
        forwardingScore: 999,
        externalAdReply: {
          title: BOT_NAME,
          body: `🎶 ${video.title.substring(0, 25)}`,
          thumbnailUrl: video.thumbnail || THUMBNAIL_URL,
          mediaType: 1,
          renderSmallThumbnail: true
        }
      }
    }, { quoted: ms });

    // Send Document
    await zk.sendMessage(dest, {
      document: { url: downloadLink },
      mimetype: "audio/mpeg",
      fileName: fileName,
      caption: `⚡ *${BOT_NAME}*`,
      contextInfo: {
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: NEWSLETTER_JID,
          newsletterName: NEWSLETTER_NAME,
          serverMessageId: 143
        },
        forwardingScore: 999,
        externalAdReply: {
          title: BOT_NAME,
          body: `🎶 ${video.title.substring(0, 25)}`,
          thumbnailUrl: video.thumbnail || THUMBNAIL_URL,
          mediaType: 1,
          renderSmallThumbnail: true,
          sourceUrl: downloadLink
        }
      }
    }, { quoted: ms });

  } catch (err) {
    console.error("[SONG] Error:", err);
    
    await zk.sendMessage(dest, {
      text: `❌ *Error downloading music.*\n\n${err.message}\n\n⚡ *${BOT_NAME}*`,
      contextInfo: {
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: NEWSLETTER_JID,
          newsletterName: NEWSLETTER_NAME,
          serverMessageId: 143
        },
        forwardingScore: 999,
        externalAdReply: {
          title: BOT_NAME,
          body: '❌ Download Failed',
          thumbnailUrl: THUMBNAIL_URL,
          mediaType: 1,
          renderSmallThumbnail: true
        }
      }
    }, { quoted: ms });
  }
});

// === Command: .video (YouTube Video MP4) ===
zokou({
  nomCom: "video",
  aliases: ["vid", "mp4"],
  categorie: "Download",
  reaction: "🎥",
  desc: "Search and send video from YouTube as MP4.",
}, async (dest, zk, { repondre, arg, ms }) => {
  const query = arg.join(" ");
  if (!query) {
    await zk.sendMessage(dest, {
      text: `🎥 *${BOT_NAME} VIDEO DOWNLOADER*\n\nPlease provide a video name.\n\nExample: \`.video nikuone\`\n\n⚡ *${BOT_NAME}*`,
      contextInfo: {
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: NEWSLETTER_JID,
          newsletterName: NEWSLETTER_NAME,
          serverMessageId: 143
        },
        forwardingScore: 999,
        externalAdReply: {
          title: BOT_NAME,
          body: '🎥 Enter video name to download',
          thumbnailUrl: THUMBNAIL_URL,
          mediaType: 1,
          renderSmallThumbnail: true
        }
      }
    }, { quoted: ms });
    return;
  }

  try {
    // Send searching message
    await zk.sendMessage(dest, {
      text: `🔍 *Searching for:* ${query}\n\n⏳ Please wait...`,
      contextInfo: {
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: NEWSLETTER_JID,
          newsletterName: NEWSLETTER_NAME,
          serverMessageId: 143
        },
        forwardingScore: 999,
        externalAdReply: {
          title: BOT_NAME,
          body: `🔍 Searching: ${query.substring(0, 20)}`,
          thumbnailUrl: THUMBNAIL_URL,
          mediaType: 1,
          renderSmallThumbnail: true
        }
      }
    }, { quoted: ms });

    const search = await yts(query);
    const video = search.videos[0];
    if (!video) return repondre("❌ No results found.");

    const safeTitle = video.title.replace(/[\\/:*?\"<>|]/g, "");
    const fileName = `${safeTitle}.mp4`;
    const apiURL = `${BASE_URL}/dipto/ytDl3?link=${encodeURIComponent(video.videoId)}&format=mp4`;

    const response = await axios.get(apiURL, { timeout: 60000 });
    const data = response.data;
    
    let downloadLink = null;
    if (data.downloadLink) downloadLink = data.downloadLink;
    else if (data.download) downloadLink = data.download;
    else if (data.url) downloadLink = data.url;
    else if (data.link) downloadLink = data.link;
    
    if (!downloadLink) return repondre("❌ Failed to retrieve MP4 link.");

    let message = `╭━━━〔 *${BOT_NAME}* 〕━━━╮\n` +
      `┃\n` +
      `┃ 🎥 *Title:* ${video.title}\n` +
      `┃ ⏱️ *Duration:* ${video.timestamp}\n` +
      `┃ 👁️ *Views:* ${video.views.toLocaleString()}\n` +
      `┃ 📅 *Uploaded:* ${video.ago}\n` +
      `┃ 📺 *Channel:* ${video.author.name}\n` +
      `┃\n` +
      `┃ 🔗 ${video.url}\n` +
      `┃\n` +
      `╰━━━〔 *DOWNLOADING* 〕━━━╯`;

    // Send thumbnail + caption
    await zk.sendMessage(dest, {
      image: { url: video.thumbnail },
      caption: message,
      contextInfo: {
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: NEWSLETTER_JID,
          newsletterName: NEWSLETTER_NAME,
          serverMessageId: 143
        },
        forwardingScore: 999,
        externalAdReply: {
          title: BOT_NAME,
          body: `🎥 ${video.title.substring(0, 25)}`,
          thumbnailUrl: video.thumbnail || THUMBNAIL_URL,
          mediaType: 1,
          renderSmallThumbnail: true
        }
      }
    }, { quoted: ms });

    // Send Video
    await zk.sendMessage(dest, {
      video: { url: downloadLink },
      mimetype: "video/mp4",
      fileName: fileName,
      caption: `⚡ *${BOT_NAME}*`,
      contextInfo: {
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: NEWSLETTER_JID,
          newsletterName: NEWSLETTER_NAME,
          serverMessageId: 143
        },
        forwardingScore: 999,
        externalAdReply: {
          title: BOT_NAME,
          body: `🎥 ${video.title.substring(0, 25)}`,
          thumbnailUrl: video.thumbnail || THUMBNAIL_URL,
          mediaType: 1,
          renderSmallThumbnail: true,
          sourceUrl: downloadLink
        }
      }
    }, { quoted: ms });

  } catch (err) {
    console.error("[VIDEO] Error:", err);
    
    await zk.sendMessage(dest, {
      text: `❌ *Error downloading video.*\n\n${err.message}\n\n⚡ *${BOT_NAME}*`,
      contextInfo: {
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: NEWSLETTER_JID,
          newsletterName: NEWSLETTER_NAME,
          serverMessageId: 143
        },
        forwardingScore: 999,
        externalAdReply: {
          title: BOT_NAME,
          body: '❌ Download Failed',
          thumbnailUrl: THUMBNAIL_URL,
          mediaType: 1,
          renderSmallThumbnail: true
        }
      }
    }, { quoted: ms });
  }
});
