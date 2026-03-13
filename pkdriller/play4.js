const { zokou } = require('../framework/zokou');
const axios = require('axios');
const yts = require('yt-search');

zokou({ 
  nomCom: "play", 
  aliases: ["music", "song", "audio", "mziki"],
  reaction: "🎵", 
  categorie: "Download" 
}, async (dest, zk, commandeOptions) => {
    const { arg, ms } = commandeOptions;
    const from = dest;

    // Your Specific Channel JID and Catbox Image
    const channelJid = "120363353854480831@newsletter";
    const imageUrl = "https://files.catbox.moe/aktbgo.jpg";
    const botName = "ʀᴀʜᴍᴀɴɪ xᴍᴅ";
    const giftedApiKey = "gifted"; // Your Gifted API key

    if (!arg || arg.length === 0) {
        return await zk.sendMessage(from, { 
            text: `🎵 *${botName} MUSIC DOWNLOADER*\n\nPlease provide a song name.\n\nExample: .play nikuone` 
        }, { quoted: ms });
    }

    try {
        const query = arg.join(" ");
        await zk.sendMessage(from, { 
            text: `🔎 Searching for: *${query}*...` 
        }, { quoted: ms });

        // Search YouTube for the video
        const search = await yts(query);
        const video = search.videos[0];

        if (!video) {
            return await zk.sendMessage(from, { 
                text: "❌ Song not found." 
            }, { quoted: ms });
        }

        // Send video info first
        await zk.sendMessage(from, {
            image: { url: video.thumbnail },
            caption: `╭━━━〔 *${botName}* 〕━━━╮
┃
┃ 🎵 *${video.title}*
┃ ⏱️ ${video.timestamp}
┃ 👁️ ${video.views.toLocaleString()}
┃ 📺 ${video.author.name}
┃
┃ ⏳ *Downloading from Gifted API...*
┃
╰━━━〔 *POWERED BY RAHMANI* 〕━━━╯`,
            contextInfo: {
                forwardedNewsletterMessageInfo: {
                    newsletterJid: channelJid,
                    newsletterName: "RAHMANI XMD",
                }
            }
        }, { quoted: ms });

        // USING GIFTED TECH API FOR MP3
        const giftedApiUrl = `https://api.giftedtech.co.ke/api/download/ytmp3?apikey=${giftedApiKey}&url=${encodeURIComponent(video.url)}`;
        
        console.log("Gifted API URL:", giftedApiUrl);
        
        const response = await axios.get(giftedApiUrl, { timeout: 30000 });
        
        console.log("Gifted Response:", JSON.stringify(response.data, null, 2));

        // Check different possible response formats
        let downloadUrl = null;
        
        if (response.data) {
            if (response.data.download_url) {
                downloadUrl = response.data.download_url;
            } else if (response.data.download) {
                downloadUrl = response.data.download;
            } else if (response.data.url) {
                downloadUrl = response.data.url;
            } else if (response.data.result) {
                if (typeof response.data.result === 'string') {
                    downloadUrl = response.data.result;
                } else if (response.data.result.download_url) {
                    downloadUrl = response.data.result.download_url;
                } else if (response.data.result.url) {
                    downloadUrl = response.data.result.url;
                }
            } else if (response.data.link) {
                downloadUrl = response.data.link;
            } else if (response.data.data && response.data.data.url) {
                downloadUrl = response.data.data.url;
            }
        }

        if (!downloadUrl) {
            // If Gifted API fails, try alternative
            throw new Error("No download URL from Gifted API");
        }

        // Send Audio with Channel JID Context
        await zk.sendMessage(from, {
            audio: { url: downloadUrl },
            mimetype: 'audio/mp4',
            ptt: false,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: channelJid,
                    serverMessageId: 143,
                    newsletterName: "RAHMANI XMD",
                },
                externalAdReply: {
                    title: video.title,
                    body: "🎵 Music from Gifted API",
                    thumbnailUrl: video.thumbnail || imageUrl,
                    mediaType: 1,
                    sourceUrl: `https://whatsapp.com/channel/${channelJid.split('@')[0]}`,
                    renderLargerThumbnail: false,
                    showAdAttribution: true
                }
            }
        }, { quoted: ms });

    } catch (err) {
        console.error("❌ Play Error:", err);
        
        // Fallback to YouTube link
        try {
            const search = await yts(arg.join(" "));
            const video = search.videos[0];
            if (video) {
                await zk.sendMessage(from, { 
                    text: `⚠️ *Gifted API is currently unavailable*\n\nHere's the YouTube link:\n${video.url}\n\n⚡ *${botName}*` 
                }, { quoted: ms });
            } else {
                await zk.sendMessage(from, { 
                    text: "❌ An error occurred: " + err.message 
                }, { quoted: ms });
            }
        } catch (e) {
            await zk.sendMessage(from, { 
                text: "❌ An error occurred: " + err.message 
            }, { quoted: ms });
        }
    }
});
