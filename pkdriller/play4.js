const { zokou } = require("../framework/zokou");
const axios = require("axios");
const yts = require("yt-search");

// ============ GIFTEDTECH API ============
const API_KEY = "gifted"; // API key yako
const API_MP3 = (url) => `https://api.giftedtech.co.ke/api/download/ytmp3?apikey=${API_KEY}&url=${encodeURIComponent(url)}`;
const API_MP4 = (url) => `https://api.giftedtech.co.ke/api/download/ytmp4?apikey=${API_KEY}&url=${encodeURIComponent(url)}`;

const BOT_NAME = "RAHMANI-XMD";
const NEWSLETTER_JID = "120363353854480831@newsletter";
const THUMBNAIL = "https://files.catbox.moe/aktbgo.jpg";

// ============ PLAY COMMAND (AUDIO) ============
zokou({
  nomCom: "play4",
  aliases: ["music", "audio", "song", "mp3"],
  reaction: "🎵",
  categorie: "Download"
}, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;
  const query = arg.join(" ");

  if (!query) {
    return await zk.sendMessage(dest, {
      text: `╭━━━〔 *${BOT_NAME} PLAY* 〕━━━╮
┃
┃ 🎵 *HOW TO USE*
┃
┃ 📝 *Example:*
┃ └─ .play nikuone
┃
┃ 🔍 *Searches YouTube*
┃ ⬇️ *Downloads MP3*
┃
╰━━━〔 *POWERED BY RAHMANI* 〕━━━╯

⚡ *${BOT_NAME}*`,
      contextInfo: {
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: NEWSLETTER_JID,
          newsletterName: "RAHMANI XMD",
          serverMessageId: 143
        },
        externalAdReply: {
          title: BOT_NAME,
          body: "🎵 Enter song name",
          thumbnailUrl: THUMBNAIL,
          mediaType: 1,
          renderSmallThumbnail: true
        }
      }
    }, { quoted: ms });
  }

  try {
    // Step 1: Searching message
    await zk.sendMessage(dest, {
      text: `🔍 *Searching:* ${query}\n\n⏳ Please wait...`,
      contextInfo: {
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: NEWSLETTER_JID,
          newsletterName: "RAHMANI XMD",
          serverMessageId: 143
        },
        externalAdReply: {
          title: BOT_NAME,
          body: "🔍 Searching YouTube...",
          thumbnailUrl: THUMBNAIL,
          mediaType: 1
        }
      }
    }, { quoted: ms });

    // Step 2: Search YouTube
    const search = await yts(query);
    const video = search.videos[0];
    
    if (!video) {
      return await zk.sendMessage(dest, {
        text: `❌ *No Results Found*\n\nCould not find: "${query}"\n\nTry another song name.`,
        contextInfo: {
          externalAdReply: {
            title: BOT_NAME,
            body: "❌ No results",
            thumbnailUrl: THUMBNAIL
          }
        }
      }, { quoted: ms });
    }

    // Step 3: Send video info with thumbnail
    await zk.sendMessage(dest, {
      image: { url: video.thumbnail },
      caption: `╭━━━〔 *${BOT_NAME}* 〕━━━╮
┃
┃ 🎵 *Title:* ${video.title}
┃ ⏱️ *Duration:* ${video.timestamp}
┃ 👁️ *Views:* ${video.views.toLocaleString()}
┃ 📺 *Channel:* ${video.author.name}
┃
┃ 🔗 *YouTube:* ${video.url}
┃
┃ ⏳ *Downloading from GiftedTech...*
┃
╰━━━〔 *POWERED BY RAHMANI* 〕━━━╯

⚡ *${BOT_NAME}*`,
      contextInfo: {
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: NEWSLETTER_JID,
          newsletterName: "RAHMANI XMD",
          serverMessageId: 143
        },
        forwardingScore: 999,
        externalAdReply: {
          title: BOT_NAME,
          body: video.title.substring(0, 30),
          thumbnailUrl: video.thumbnail,
          mediaType: 1,
          renderSmallThumbnail: true
        }
      }
    }, { quoted: ms });

    // Step 4: Download from GiftedTech API
    try {
      const apiUrl = API_MP3(video.url);
      console.log("GiftedTech API URL:", apiUrl);
      
      const response = await axios.get(apiUrl, { 
        timeout: 60000,
        headers: { 'Accept': 'application/json' }
      });
      
      console.log("GiftedTech Response:", response.data);
      
      // Check response format (adjust based on actual API response)
      let audioUrl = null;
      
      if (response.data) {
        if (response.data.download_url) {
          audioUrl = response.data.download_url;
        } else if (response.data.download) {
          audioUrl = response.data.download;
        } else if (response.data.url) {
          audioUrl = response.data.url;
        } else if (response.data.result) {
          audioUrl = response.data.result;
        } else if (response.data.link) {
          audioUrl = response.data.link;
        } else if (response.data.data && response.data.data.url) {
          audioUrl = response.data.data.url;
        }
      }
      
      if (audioUrl) {
        // Send the audio file
        await zk.sendMessage(dest, {
          audio: { url: audioUrl },
          mimetype: "audio/mp4",
          fileName: `${video.title.replace(/[^a-zA-Z0-9]/g, '_')}.mp3`,
          contextInfo: {
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: NEWSLETTER_JID,
              newsletterName: "RAHMANI XMD",
              serverMessageId: 143
            },
            forwardingScore: 999,
            externalAdReply: {
              title: BOT_NAME,
              body: `✅ Downloaded from GiftedTech`,
              thumbnailUrl: video.thumbnail,
              mediaType: 1,
              renderSmallThumbnail: true,
              sourceUrl: audioUrl
            }
          }
        }, { quoted: ms });
      } else {
        // If no download URL, send YouTube link as fallback
        await zk.sendMessage(dest, {
          text: `⚠️ *Could not get audio from GiftedTech*\n\nHere's the YouTube link instead:\n${video.url}`,
          contextInfo: {
            externalAdReply: {
              title: BOT_NAME,
              body: "⚠️ Using YouTube link",
              thumbnailUrl: video.thumbnail
            }
          }
        }, { quoted: ms });
      }
      
    } catch (downloadError) {
      console.error("GiftedTech download error:", downloadError.message);
      
      // Send YouTube link if GiftedTech fails
      await zk.sendMessage(dest, {
        text: `⚠️ *GiftedTech API is currently unavailable*\n\nHere's the YouTube link:\n${video.url}`,
        contextInfo: {
          externalAdReply: {
            title: BOT_NAME,
            body: "⚠️ API unavailable",
            thumbnailUrl: video.thumbnail
          }
        }
      }, { quoted: ms });
    }

  } catch (error) {
    console.error("Play command error:", error);
    
    await zk.sendMessage(dest, {
      text: `❌ *Error*\n\n${error.message}\n\nPlease try again later.`,
      contextInfo: {
        externalAdReply: {
          title: BOT_NAME,
          body: "❌ Error occurred",
          thumbnailUrl: THUMBNAIL
        }
      }
    }, { quoted: ms });
  }
});

// ============ VIDEO COMMAND ============
zokou({
  nomCom: "video",
  aliases: ["mp4", "vid"],
  reaction: "🎥",
  categorie: "Download"
}, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;
  const query = arg.join(" ");

  if (!query) {
    return await zk.sendMessage(dest, {
      text: `╭━━━〔 *${BOT_NAME} VIDEO* 〕━━━╮
┃
┃ 🎥 *HOW TO USE*
┃
┃ 📝 *Example:*
┃ └─ .video nikuone
┃
╰━━━〔 *POWERED BY RAHMANI* 〕━━━╯`,
      contextInfo: { externalAdReply: { title: BOT_NAME, body: "🎥 Enter video name" } }
    }, { quoted: ms });
  }

  try {
    await zk.sendMessage(dest, {
      text: `🔍 *Searching:* ${query}`,
      contextInfo: { externalAdReply: { title: BOT_NAME, body: "Searching..." } }
    }, { quoted: ms });

    const search = await yts(query);
    const video = search.videos[0];
    
    if (!video) {
      return await repondre("❌ No results found.");
    }

    // Send video info
    await zk.sendMessage(dest, {
      image: { url: video.thumbnail },
      caption: `╭━━━〔 *${BOT_NAME}* 〕━━━╮
┃
┃ 🎥 *${video.title}*
┃ ⏱️ ${video.timestamp}
┃ 🔗 ${video.url}
┃
╰━━━〔 *POWERED BY RAHMANI* 〕━━━╯

⚡ *${BOT_NAME}*`,
      contextInfo: {
        forwardedNewsletterMessageInfo: {
          newsletterJid: NEWSLETTER_JID,
          newsletterName: "RAHMANI XMD"
        },
        externalAdReply: {
          title: BOT_NAME,
          body: video.title.substring(0, 30),
          thumbnailUrl: video.thumbnail
        }
      }
    }, { quoted: ms });

    // Download from GiftedTech
    try {
      const apiUrl = API_MP4(video.url);
      const response = await axios.get(apiUrl, { timeout: 60000 });
      
      let videoUrl = response.data?.download_url || 
                     response.data?.download || 
                     response.data?.url;
      
      if (videoUrl) {
        await zk.sendMessage(dest, {
          video: { url: videoUrl },
          mimetype: "video/mp4",
          caption: `⚡ *${BOT_NAME}*`
        }, { quoted: ms });
      } else {
        await repondre(`⚠️ Video link: ${video.url}`);
      }
      
    } catch (downloadError) {
      await repondre(`⚠️ YouTube link: ${video.url}`);
    }

  } catch (error) {
    repondre(`❌ Error: ${error.message}`);
  }
});
