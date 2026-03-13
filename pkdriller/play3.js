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
    const videoId = firstVideo.videoId;

    // EXPANDED APIs for audio download - 15+ APIs
    const apis = [
      // API Group 1 - Direct search
      `https://api.davidcyriltech.my.id/ytplay?query=${encodeURIComponent(query)}`,
      `https://api.dreaded.site/api/ytdl/audio?url=${encodeURIComponent(videoUrl)}`,
      `https://api.giftedtech.web.id/api/download/ytmp3?url=${encodeURIComponent(videoUrl)}&apikey=gifted`,
      `https://api.alyachan.my.id/api/ytplay?q=${encodeURIComponent(query)}`,
      `https://api.zenkey.my.id/api/ytplay?query=${encodeURIComponent(query)}&apikey=zenkey`,
      
      // API Group 2 - By video ID
      `https://pajegreenbot-md.vercel.app/yt?url=${encodeURIComponent(videoUrl)}&type=mp3`,
      `https://vihangayt.me/download/ytmp3?url=${encodeURIComponent(videoUrl)}`,
      `https://api.agatz.xyz/api/ytmp3?url=${encodeURIComponent(videoUrl)}`,
      `https://api.agungny.my.id/api/ytmp3?url=${encodeURIComponent(videoUrl)}`,
      `https://api.alandikasaputra.my.id/api/yt/ytmp3?url=${encodeURIComponent(videoUrl)}`,
      
      // API Group 3 - Alternative formats
      `https://api.maher-zubair.tech/download/ytmp3?url=${encodeURIComponent(videoUrl)}`,
      `https://api.xyroinee.xyz/api/download/ytmp3?url=${encodeURIComponent(videoUrl)}&apikey=kenz`,
      `https://api.nyxs.pw/dl/ytmp3?url=${encodeURIComponent(videoUrl)}`,
      `https://api.siputzx.my.id/api/d/ytmp3?url=${encodeURIComponent(videoUrl)}`,
      `https://api.izzynabot.biz.id/download/ytmp3?url=${encodeURIComponent(videoUrl)}`,
      
      // API Group 4 - Backup
      `https://api.botcahx.live/api/download/ytmp3?url=${encodeURIComponent(videoUrl)}&apikey=admin`,
      `https://api.fgmods.xyz/api/downloader/ytmp3?url=${encodeURIComponent(videoUrl)}&apikey=fg-dl`,
      `https://api.ryzendesu.vip/api/downloader/ytmp3?url=${encodeURIComponent(videoUrl)}`,
      `https://api.neoxr.my.id/api/ytmp3?url=${encodeURIComponent(videoUrl)}&apikey=neoxr`,
      `https://api.sanzy.biz.id/api/ytmp3?url=${encodeURIComponent(videoUrl)}`
    ];

    let downloadUrl = null;
    let videoDetails = null;

    for (const api of apis) {
      try {
        console.log(`Trying API: ${api.substring(0, 50)}...`);
        const response = await axios.get(api, { timeout: 8000 });
        
        // Check different response formats
        if (response.data) {
          // Format 1: David API
          if (response.data.status === true && response.data.result?.download_url) {
            downloadUrl = response.data.result.download_url;
            break;
          }
          // Format 2: Gifted API
          else if (response.data.success === true && response.data.result?.download_url) {
            downloadUrl = response.data.result.download_url;
            break;
          }
          // Format 3: Dreaded API
          else if (response.data.status === 200 && response.data.result?.download_url) {
            downloadUrl = response.data.result.download_url;
            break;
          }
          // Format 4: Vihanga
          else if (response.data.status && response.data.data?.mp3) {
            downloadUrl = response.data.data.mp3;
            break;
          }
          // Format 5: Agatz
          else if (response.data.status && response.data.data?.url) {
            downloadUrl = response.data.data.url;
            break;
          }
          // Format 6: Direct URL in result
          else if (response.data.result?.url) {
            downloadUrl = response.data.result.url;
            break;
          }
          // Format 7: Simple format
          else if (response.data.url) {
            downloadUrl = response.data.url;
            break;
          }
          // Format 8: Download string
          else if (response.data.download) {
            downloadUrl = response.data.download;
            break;
          }
          // Format 9: Audio array
          else if (response.data.audio && response.data.audio[0]?.url) {
            downloadUrl = response.data.audio[0].url;
            break;
          }
          // Format 10: Direct string
          else if (typeof response.data === 'string' && response.data.includes('http')) {
            const match = response.data.match(/https?:\/\/[^\s"']+/);
            if (match) downloadUrl = match[0];
            break;
          }
        }
      } catch (e) {
        // Silent fail - try next API
      }
    }

    // If all APIs fail, try direct conversion
    if (!downloadUrl) {
      try {
        console.log("Trying direct conversion...");
        const directApi = `https://y2mate.nxr4.my.id/api/convert?url=${encodeURIComponent(videoUrl)}&type=mp3`;
        const response = await axios.get(directApi);
        if (response.data?.download_url) {
          downloadUrl = response.data.download_url;
        }
      } catch (e) {
        console.log("Direct conversion failed");
      }
    }

    if (!downloadUrl) {
      return repondre(`❌ *Download Failed*

┌─── *ERROR* ───┐
│ Could not get download link
│ 
│ 🔗 *Watch on YouTube:*
│ ${videoUrl}
│
│ 📢 *Channel:* tap below
└────────────────┘

> *CHUGA XMD* 🚀`);
    }

    // Ensure downloadUrl is a string
    if (typeof downloadUrl !== 'string') {
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
    
    // Even if download fails, provide YouTube link
    try {
      const searchResults = await ytSearch(query);
      if (searchResults?.videos?.length > 0) {
        const video = searchResults.videos[0];
        await repondre(`❌ *Download Failed*

┌─── *WATCH ON YOUTUBE* ───┐
│ 🎵 *Title:* ${video.title}
│ ⏱️ *Duration:* ${video.timestamp}
│ 🔗 *Link:* ${video.url}
└─────────────────────────┘

> *CHUGA XMD* 🚀`);
      } else {
        repondre(`❌ *Error:* ${error.message}`);
      }
    } catch (e) {
      repondre(`❌ *Error:* ${error.message}`);
    }
  }
});
