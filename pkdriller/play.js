const { zokou } = require("../framework/zokou");
const axios = require("axios");
const yts = require("yt-search");

const BASE_URL = "https://noobs-api.top";

// === Command: .play (Audio Play - send as voice) ===
zokou({
  nomCom: "play",
  alias: ["music"],
  categorie: "Search",
  reaction: "🎵",
  desc: "Search and play MP3 music from YouTube (audio only).",
}, async (dest, zk, { repondre, arg, ms }) => {
  const query = arg.join(" ");
  if (!query) return repondre("❌ Please provide a song name or keyword.");

  try {
    const search = await yts(query);
    const video = search.videos[0];
    if (!video) return repondre("❌ No results found.");

    const safeTitle = video.title.replace(/[\\/:*?\"<>|]/g, "");
    const fileName = `${safeTitle}.mp3`;
    const apiURL = `${BASE_URL}/dipto/ytDl3?link=${encodeURIComponent(video.videoId)}&format=mp3`;

    const response = await axios.get(apiURL);
    const data = response.data;
    if (!data.downloadLink) return repondre("❌ Failed to retrieve MP3 link.");

    // Info message
    let message = `*DULLAH-XMD|Speed & Quality*\n\n` +
      `╭───────────────◆\n` +
      `│⿻ *Title:* ${video.title}\n` +
      `│⿻ *Duration:* ${video.timestamp}\n` +
      `│⿻ *Views:* ${video.views.toLocaleString()}\n` +
      `│⿻ *Uploaded:* ${video.ago}\n` +
      `│⿻ *Channel:* ${video.author.name}\n` +
      `╰────────────────◆\n\n` +
      `🔗 ${video.url}`;

    // Send thumbnail + caption + channel info
    await zk.sendMessage(dest, {
      image: { url: video.thumbnail },
      caption: message,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363402252728845@newsletter",
          newsletterName: "DULLAH-XMD",
          serverMessageId: -1
        }
      }
    }, { quoted: ms });

    // Send Audio
    await zk.sendMessage(dest, {
      audio: { url: data.downloadLink },
      mimetype: "audio/mpeg",
      fileName,
      caption: "> Dullahxmd is Speed🔥"
    }, { quoted: ms });

  } catch (err) {
    console.error("[PLAY] Error:", err);
    repondre("❌ Error occurred while fetching audio.");
  }
});

// === Command: .song (Audio as Document) ===
zokou({
  nomCom: "song",
  alias: ["audiofile", "mp3doc"],
  categorie: "Search",
  reaction: "🎶",
  desc: "Search and send MP3 music as document from YouTube.",
}, async (dest, zk, { repondre, arg, ms }) => {
  const query = arg.join(" ");
  if (!query) return repondre("❌ Please provide a song name or keyword.");

  try {
    const search = await yts(query);
    const video = search.videos[0];
    if (!video) return repondre("❌ No results found.");

    const safeTitle = video.title.replace(/[\\/:*?\"<>|]/g, "");
    const fileName = `${safeTitle}.mp3`;
    const apiURL = `${BASE_URL}/dipto/ytDl3?link=${encodeURIComponent(video.videoId)}&format=mp3`;

    const response = await axios.get(apiURL);
    const data = response.data;
    if (!data.downloadLink) return repondre("❌ Failed to retrieve MP3 link.");

    let message = `*DULLAH-XMD|Speed & Quality*\n\n` +
      `╭───────────────◆\n` +
      `│⿻ *Title:* ${video.title}\n` +
      `│⿻ *Duration:* ${video.timestamp}\n` +
      `│⿻ *Views:* ${video.views.toLocaleString()}\n` +
      `│⿻ *Uploaded:* ${video.ago}\n` +
      `│⿻ *Channel:* ${video.author.name}\n` +
      `╰────────────────◆\n\n` +
      `🔗 ${video.url}`;

    // Send thumbnail + caption + channel info
    await zk.sendMessage(dest, {
      image: { url: video.thumbnail },
      caption: message,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363402252728845@newsletter",
          newsletterName: "DULLAH-XMD",
          serverMessageId: -1
        }
      }
    }, { quoted: ms });

    // Send Document
    await zk.sendMessage(dest, {
      document: { url: data.downloadLink },
      mimetype: "audio/mpeg",
      fileName,
      caption: "> Dullahxmd is Speed🔥"
    }, { quoted: ms });

  } catch (err) {
    console.error("[SONG] Error:", err);
    repondre("❌ Error occurred while fetching MP3 document.");
  }
});

// === Command: .video (YouTube Video MP4) ===
zokou({
  nomCom: "video",
  alias: ["vid", "mp4", "movie"],
  categorie: "Search",
  reaction: "🎥",
  desc: "Search and send video from YouTube as MP4.",
}, async (dest, zk, { repondre, arg, ms }) => {
  const query = arg.join(" ");
  if (!query) return repondre("❌ Please provide a video name or keyword.");

  try {
    const search = await yts(query);
    const video = search.videos[0];
    if (!video) return repondre("❌ No results found.");

    const safeTitle = video.title.replace(/[\\/:*?\"<>|]/g, "");
    const fileName = `${safeTitle}.mp4`;
    const apiURL = `${BASE_URL}/dipto/ytDl3?link=${encodeURIComponent(video.videoId)}&format=mp4`;

    const response = await axios.get(apiURL);
    const data = response.data;
    if (!data.downloadLink) return repondre("❌ Failed to retrieve MP4 link.");

    let message = `*DULLAH-XMD|Speed & Quality*\n\n` +
      `╭───────────────◆\n` +
      `│⿻ *Title:* ${video.title}\n` +
      `│⿻ *Duration:* ${video.timestamp}\n` +
      `│⿻ *Views:* ${video.views.toLocaleString()}\n` +
      `│⿻ *Uploaded:* ${video.ago}\n` +
      `│⿻ *Channel:* ${video.author.name}\n` +
      `╰────────────────◆\n\n` +
      `🔗 ${video.url}`;

    // Send thumbnail + caption + channel info
    await zk.sendMessage(dest, {
      image: { url: video.thumbnail },
      caption: message,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363402252728845@newsletter",
          newsletterName: "DULLAH-XMD",
          serverMessageId: -1
        }
      }
    }, { quoted: ms });

    // Send Video
    await zk.sendMessage(dest, {
      video: { url: data.downloadLink },
      mimetype: "video/mp4",
      fileName,
      caption: "> Dullahxmd is Speed🔥"
    }, { quoted: ms });

  } catch (err) {
    console.error("[VIDEO] Error:", err);
    repondre("❌ Error occurred while fetching video.");
  }
});
