const { zokou } = require("../framework/zokou");
const axios = require('axios');
const ytSearch = require('yt-search');
const conf = require(__dirname + '/../set');

// Play command - Audio
zokou({
  nomCom: "play3",
  aliases: ["song", "playdoc", "audio", "mp3"],
  categorie: "Search",
  reaction: "🎵"
}, async (dest, zk, commandOptions) => {
  const { arg, ms, repondre } = commandOptions;

  if (!arg[0]) {
    return repondre(`╭━━━━━━━━━━━━━━━━╮
┃   🎵 *CHUGA PLAY* 🎵
╰━━━━━━━━━━━━━━━━╯

┌─── *USAGE* ───┐
│ Please provide a song name
│ 
│ 📝 *Example:*
│ .play Calm Down
│ .play Love Nwantiti
└────────────────┘

> *CHUGA XMD* 🚀`);
  }

  const query = arg.join(" ");
  const channelUrl = "https://whatsapp.com/channel/0029VatokI45EjxufALmY32X";
  const botName = "𝐂𝐇𝐔𝐆𝐀 𝐗𝐌𝐃";

  try {
    // Send searching message
    await repondre(`🔍 *Searching for:* ${query}`);

    // Search YouTube
    const searchResults = await ytSearch(query);

    if (!searchResults || !searchResults.videos.length) {
      return repondre(`❌ No video found for: ${query}`);
    }

    const firstVideo = searchResults.videos[0];
    const videoUrl = firstVideo.url;
    const songTitle = firstVideo.title;
    const duration = firstVideo.timestamp;
    const thumbnail = firstVideo.thumbnail;

    // APIs for audio download
    const apis = [
      `https://api.davidcyriltech.my.id/ytplay?query=${encodeURIComponent(query)}`,
      `https://api.dreaded.site/api/ytdl/audio?url=${encodeURIComponent(videoUrl)}`,
      `https://api.giftedtech.web.id/api/download/ytmp3?url=${encodeURIComponent(videoUrl)}&apikey=gifted`
    ];

    let downloadUrl = null;
    let videoDetails = null;

    for (const api of apis) {
      try {
        const response = await axios.get(api);
        console.log("API Response:", JSON.stringify(response.data).substring(0, 200)); // Debug log
        
        // Check different response formats
        if (response.data) {
          // Format 1: { status: true, result: { download_url: "url" } }
          if (response.data.status === true && response.data.result?.download_url) {
            downloadUrl = response.data.result.download_url;
            videoDetails = response.data.result;
            break;
          }
          // Format 2: { success: true, download_url: "url" }
          else if (response.data.success === true && response.data.download_url) {
            downloadUrl = response.data.download_url;
            videoDetails = response.data;
            break;
          }
          // Format 3: { result: { downloadUrl: "url" } }
          else if (response.data.result?.downloadUrl) {
            downloadUrl = response.data.result.downloadUrl;
            videoDetails = response.data.result;
            break;
          }
          // Format 4: { url: "url" }
          else if (response.data.url) {
            downloadUrl = response.data.url;
            videoDetails = response.data;
            break;
          }
          // Format 5: Direct string URL
          else if (typeof response.data === 'string' && response.data.startsWith('http')) {
            downloadUrl = response.data;
            videoDetails = { title: songTitle };
            break;
          }
        }
      } catch (e) {
        console.log(`API failed: ${api} - ${e.message}`);
      }
    }

    if (!downloadUrl) {
      return repondre('❌ Failed to get download link. Please try again later.');
    }

    // Ensure downloadUrl is a string
    if (typeof downloadUrl !== 'string') {
      console.log("Download URL is not a string:", downloadUrl);
      downloadUrl = String(downloadUrl);
    }

    // Prepare audio message
    const audioMessage = {
      audio: { url: downloadUrl },
      mimetype: 'audio/mpeg',
      contextInfo: {
        externalAdReply: {
          title: songTitle.substring(0, 30),
          body: `${duration} • ${botName}`,
          mediaType: 1,
          sourceUrl: channelUrl,
          thumbnailUrl: thumbnail,
          renderLargerThumbnail: false,
          showAdAttribution: true,
        },
      },
    };

    // Send audio
    await zk.sendMessage(dest, audioMessage, { quoted: ms });

    // Send success message
    await repondre(`╭━━━━━━━━━━━━━━━━━━━━╮
┃   ✅ *DOWNLOADED* ✅
╰━━━━━━━━━━━━━━━━━━━━╯

┌─── *SONG INFO* ───┐
│ 🎵 *Title:* ${songTitle.substring(0, 30)}
│ ⏱️ *Duration:* ${duration}
│ 📺 *Channel:* ${firstVideo.author?.name || 'Unknown'}
└────────────────────┘

┌─── *LINKS* ───┐
│ 📢 *Channel:* tap below
│ 🔗 *YouTube:* ${videoUrl}
└────────────────┘

> *CHUGA XMD* 🎵`);

  } catch (error) {
    console.error('Play error:', error);
    repondre(`❌ *Error:* ${error.message}`);
  }
});

// Video command
zokou({
  nomCom: "video",
  aliases: ["videodoc", "film", "mp4"],
  categorie: "Search",
  reaction: "🎥"
}, async (dest, zk, commandOptions) => {
  const { arg, ms, repondre } = commandOptions;

  if (!arg[0]) {
    return repondre(`╭━━━━━━━━━━━━━━━━╮
┃   🎥 *CHUGA VIDEO* 🎥
╰━━━━━━━━━━━━━━━━╯

┌─── *USAGE* ───┐
│ Please provide a video name
│ 
│ 📝 *Example:*
│ .video Tutorial
│ .video Music Video
└────────────────┘

> *CHUGA XMD* 🚀`);
  }

  const query = arg.join(" ");
  const channelUrl = "https://whatsapp.com/channel/0029VatokI45EjxufALmY32X";
  const botName = "𝐂𝐇𝐔𝐆𝐀 𝐗𝐌𝐃";

  try {
    // Send searching message
    await repondre(`🔍 *Searching for:* ${query}`);

    // Search YouTube
    const searchResults = await ytSearch(query);

    if (!searchResults || !searchResults.videos.length) {
      return repondre(`❌ No video found for: ${query}`);
    }

    const firstVideo = searchResults.videos[0];
    const videoUrl = firstVideo.url;
    const videoTitle = firstVideo.title;
    const duration = firstVideo.timestamp;
    const thumbnail = firstVideo.thumbnail;

    // APIs for video download
    const apis = [
      `https://api.davidcyriltech.my.id/ytmp4?url=${encodeURIComponent(videoUrl)}`,
      `https://api.dreaded.site/api/ytdl/video?url=${encodeURIComponent(videoUrl)}`,
      `https://api.giftedtech.web.id/api/download/ytmp4?url=${encodeURIComponent(videoUrl)}&apikey=gifted`
    ];

    let downloadUrl = null;
    let videoDetails = null;

    for (const api of apis) {
      try {
        const response = await axios.get(api);
        console.log("Video API Response:", JSON.stringify(response.data).substring(0, 200)); // Debug log
        
        // Check different response formats
        if (response.data) {
          // Format 1: { status: true, result: { download_url: "url" } }
          if (response.data.status === true && response.data.result?.download_url) {
            downloadUrl = response.data.result.download_url;
            videoDetails = response.data.result;
            break;
          }
          // Format 2: { success: true, download_url: "url" }
          else if (response.data.success === true && response.data.download_url) {
            downloadUrl = response.data.download_url;
            videoDetails = response.data;
            break;
          }
          // Format 3: { result: { downloadUrl: "url" } }
          else if (response.data.result?.downloadUrl) {
            downloadUrl = response.data.result.downloadUrl;
            videoDetails = response.data.result;
            break;
          }
          // Format 4: { url: "url" }
          else if (response.data.url) {
            downloadUrl = response.data.url;
            videoDetails = response.data;
            break;
          }
          // Format 5: Direct string URL
          else if (typeof response.data === 'string' && response.data.startsWith('http')) {
            downloadUrl = response.data;
            videoDetails = { title: videoTitle };
            break;
          }
        }
      } catch (e) {
        console.log(`API failed: ${api} - ${e.message}`);
      }
    }

    if (!downloadUrl) {
      return repondre('❌ Failed to get download link. Please try again later.');
    }

    // Ensure downloadUrl is a string
    if (typeof downloadUrl !== 'string') {
      console.log("Download URL is not a string:", downloadUrl);
      downloadUrl = String(downloadUrl);
    }

    // Prepare video message
    const videoMessage = {
      video: { url: downloadUrl },
      mimetype: 'video/mp4',
      caption: `╭━━━━━━━━━━━━━━━━━━━━╮
┃   🎥 *${botName}* 🎥
╰━━━━━━━━━━━━━━━━━━━━╯

┌─── *VIDEO INFO* ───┐
│ 📹 *Title:* ${videoTitle.substring(0, 30)}
│ ⏱️ *Duration:* ${duration}
│ 📺 *Channel:* ${firstVideo.author?.name || 'Unknown'}
└─────────────────────┘

> *CHUGA XMD* 🚀`,
      contextInfo: {
        externalAdReply: {
          title: videoTitle.substring(0, 30),
          body: `${duration} • ${botName}`,
          mediaType: 1,
          sourceUrl: channelUrl,
          thumbnailUrl: thumbnail,
          renderLargerThumbnail: false,
          showAdAttribution: true,
        },
      },
    };

    // Send video
    await zk.sendMessage(dest, videoMessage, { quoted: ms });

  } catch (error) {
    console.error('Video error:', error);
    repondre(`❌ *Error:* ${error.message}`);
  }
});
