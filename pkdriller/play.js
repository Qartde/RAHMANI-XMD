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
  aliases: ["music", "audio", "mziki"],
  reaction: "🎵",
  categorie: "Download"
}, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;
  const query = arg.join(" ");

  try {
    // Check if song name is provided
    if (!query) {
      await zk.sendMessage(dest, {
        text: "🎵 *RAHMANI-XMD MUSIC DOWNLOADER*\n\nPlease provide a song name.\n\nExample: `.play nikuone`\n\n⚡ *RAHMANI-XMD*",
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

    // Search YouTube
    const search = await yts(query);
    const video = search.videos[0];
    
    if (!video) {
      return await zk.sendMessage(dest, {
        text: "❌ *No results found for that song.*\n\nPlease try another song name.\n\n⚡ *RAHMANI-XMD*",
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
            body: '❌ No Results',
            thumbnailUrl: THUMBNAIL_URL,
            mediaType: 1,
            renderSmallThumbnail: true
          }
        }
      }, { quoted: ms });
    }

    // Send song found message with thumbnail
    await zk.sendMessage(dest, {
      image: { url: video.thumbnail },
      caption: `╭━━━〔 *${BOT_NAME}* 〕━━━╮
┃
┃ 🎵 *Title:* ${video.title}
┃ ⏱️ *Duration:* ${video.timestamp}
┃ 👁️ *Views:* ${video.views.toLocaleString()}
┃ 📅 *Uploaded:* ${video.ago}
┃ 📺 *Channel:* ${video.author.name}
┃
┃ 🔗 *YouTube Link:* ${video.url}
┃
┃ ⏳ *Downloading audio...*
┃
╰━━━〔 *POWERED BY RAHMANI* 〕━━━╯

⚡ *RAHMANI-XMD*`,
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
          thumbnailUrl: video.thumbnail,
          mediaType: 1,
          renderSmallThumbnail: true
        }
      }
    }, { quoted: ms });

    // Try to download audio
    try {
      const apiURL = `${BASE_URL}/dipto/ytDl3?link=${video.videoId}&format=mp3`;
      const response = await axios.get(apiURL, { timeout: 60000 });
      
      let downloadLink = response.data?.downloadLink || response.data?.download || response.data?.url;
      
      if (downloadLink) {
        await zk.sendMessage(dest, {
          audio: { url: downloadLink },
          mimetype: "audio/mp4",
          fileName: `${video.title.replace(/[^a-zA-Z0-9]/g, '_')}.mp3`,
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
              thumbnailUrl: video.thumbnail,
              mediaType: 1,
              renderSmallThumbnail: true,
              sourceUrl: downloadLink
            }
          }
        }, { quoted: ms });
      }
    } catch (downloadErr) {
      console.log("Download error:", downloadErr.message);
      // Don't show error - user already has YouTube link
    }

  } catch (error) {
    console.error("Music error:", error);
    
    await zk.sendMessage(dest, {
      text: `❌ *Error downloading music.*\n\n${error.message}\n\nPlease try again later.\n\n⚡ *RAHMANI-XMD*`,
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
  aliases: ["mp3", "audiofile"],
  reaction: "🎶",
  categorie: "Download"
}, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;
  const query = arg.join(" ");

  try {
    if (!query) {
      await zk.sendMessage(dest, {
        text: "🎶 *RAHMANI-XMD MUSIC DOWNLOADER*\n\nPlease provide a song name.\n\nExample: `.song nikuone`\n\n⚡ *RAHMANI-XMD*",
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
    
    if (!video) {
      return await zk.sendMessage(dest, {
        text: "❌ *No results found.*\n\n⚡ *RAHMANI-XMD*",
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
            body: '❌ No Results',
            thumbnailUrl: THUMBNAIL_URL,
            mediaType: 1,
            renderSmallThumbnail: true
          }
        }
      }, { quoted: ms });
    }

    // Send song info
    await zk.sendMessage(dest, {
      image: { url: video.thumbnail },
      caption: `╭━━━〔 *${BOT_NAME}* 〕━━━╮
┃
┃ 🎵 *Title:* ${video.title}
┃ ⏱️ *Duration:* ${video.timestamp}
┃ 👁️ *Views:* ${video.views.toLocaleString()}
┃ 📅 *Uploaded:* ${video.ago}
┃ 📺 *Channel:* ${video.author.name}
┃
┃ 🔗 *YouTube Link:* ${video.url}
┃
┃ ⏳ *Downloading MP3...*
┃
╰━━━〔 *POWERED BY RAHMANI* 〕━━━╯

⚡ *RAHMANI-XMD*`,
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
          thumbnailUrl: video.thumbnail,
          mediaType: 1,
          renderSmallThumbnail: true
        }
      }
    }, { quoted: ms });

    // Try to download
    try {
      const apiURL = `${BASE_URL}/dipto/ytDl3?link=${video.videoId}&format=mp3`;
      const response = await axios.get(apiURL, { timeout: 60000 });
      
      let downloadLink = response.data?.downloadLink || response.data?.download || response.data?.url;
      
      if (downloadLink) {
        await zk.sendMessage(dest, {
          document: { url: downloadLink },
          mimetype: "audio/mpeg",
          fileName: `${video.title.replace(/[^a-zA-Z0-9]/g, '_')}.mp3`,
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
              thumbnailUrl: video.thumbnail,
              mediaType: 1,
              renderSmallThumbnail: true,
              sourceUrl: downloadLink
            }
          }
        }, { quoted: ms });
      }
    } catch (downloadErr) {
      console.log("Download error:", downloadErr.message);
    }

  } catch (error) {
    console.error("Song error:", error);
    
    await zk.sendMessage(dest, {
      text: `❌ *Error.*\n\n${error.message}\n\n⚡ *RAHMANI-XMD*`,
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
          body: '❌ Error',
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
  reaction: "🎥",
  categorie: "Download"
}, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;
  const query = arg.join(" ");

  try {
    if (!query) {
      await zk.sendMessage(dest, {
        text: "🎥 *RAHMANI-XMD VIDEO DOWNLOADER*\n\nPlease provide a video name.\n\nExample: `.video nikuone`\n\n⚡ *RAHMANI-XMD*",
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
            body: '🎥 Enter video name',
            thumbnailUrl: THUMBNAIL_URL,
            mediaType: 1,
            renderSmallThumbnail: true
          }
        }
      }, { quoted: ms });
      return;
    }

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
    
    if (!video) {
      return await zk.sendMessage(dest, {
        text: "❌ *No results found.*\n\n⚡ *RAHMANI-XMD*",
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
            body: '❌ No Results',
            thumbnailUrl: THUMBNAIL_URL,
            mediaType: 1,
            renderSmallThumbnail: true
          }
        }
      }, { quoted: ms });
    }

    // Send video info
    await zk.sendMessage(dest, {
      image: { url: video.thumbnail },
      caption: `╭━━━〔 *${BOT_NAME}* 〕━━━╮
┃
┃ 🎥 *Title:* ${video.title}
┃ ⏱️ *Duration:* ${video.timestamp}
┃ 👁️ *Views:* ${video.views.toLocaleString()}
┃ 📅 *Uploaded:* ${video.ago}
┃ 📺 *Channel:* ${video.author.name}
┃
┃ 🔗 *YouTube Link:* ${video.url}
┃
┃ ⏳ *Downloading video...*
┃
╰━━━〔 *POWERED BY RAHMANI* 〕━━━╯

⚡ *RAHMANI-XMD*`,
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
          thumbnailUrl: video.thumbnail,
          mediaType: 1,
          renderSmallThumbnail: true
        }
      }
    }, { quoted: ms });

    // Try to download video
    try {
      const apiURL = `${BASE_URL}/dipto/ytDl3?link=${video.videoId}&format=mp4`;
      const response = await axios.get(apiURL, { timeout: 60000 });
      
      let downloadLink = response.data?.downloadLink || response.data?.download || response.data?.url;
      
      if (downloadLink) {
        await zk.sendMessage(dest, {
          video: { url: downloadLink },
          mimetype: "video/mp4",
          fileName: `${video.title.replace(/[^a-zA-Z0-9]/g, '_')}.mp4`,
          caption: `⚡ *RAHMANI-XMD*`,
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
              thumbnailUrl: video.thumbnail,
              mediaType: 1,
              renderSmallThumbnail: true,
              sourceUrl: downloadLink
            }
          }
        }, { quoted: ms });
      }
    } catch (downloadErr) {
      console.log("Video download error:", downloadErr.message);
    }

  } catch (error) {
    console.error("Video error:", error);
    
    await zk.sendMessage(dest, {
      text: `❌ *Error.*\n\n${error.message}\n\n⚡ *RAHMANI-XMD*`,
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
          body: '❌ Error',
          thumbnailUrl: THUMBNAIL_URL,
          mediaType: 1,
          renderSmallThumbnail: true
        }
      }
    }, { quoted: ms });
  }
});
