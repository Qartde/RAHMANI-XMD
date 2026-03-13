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

        // Using the API from play3 - apiziaul.vercel.app
        const apiUrl = `https://apiziaul.vercel.app/api/downloader/ytplaymp3?query=${encodeURIComponent(query)}`;

        const { data } = await axios.get(apiUrl);

        if (!data.status || !data.result.downloadUrl) {
            return await zk.sendMessage(from, { 
                text: "❌ Error fetching audio from the server." 
            }, { quoted: ms });
        }

        const downloadUrl = data.result.downloadUrl;

        // Send video info first (optional)
        await zk.sendMessage(from, {
            image: { url: video.thumbnail },
            caption: `╭━━━〔 *${botName}* 〕━━━╮
┃
┃ 🎵 *${video.title}*
┃ ⏱️ ${video.timestamp}
┃ 👁️ ${video.views.toLocaleString()}
┃ 📺 ${video.author.name}
┃
╰━━━〔 *DOWNLOADING* 〕━━━╯`,
            contextInfo: {
                forwardedNewsletterMessageInfo: {
                    newsletterJid: channelJid,
                    newsletterName: "RAHMANI XMD",
                }
            }
        }, { quoted: ms });

        // Send Audio with Channel JID Context (Baileys)
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
                    body: "🎵 Music from RAHMANI-XMD",
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
        
        // Fallback to YouTube link if API fails
        try {
            const search = await yts(arg.join(" "));
            const video = search.videos[0];
            if (video) {
                await zk.sendMessage(from, { 
                    text: `⚠️ *Could not download audio*\n\nHere's the YouTube link:\n${video.url}\n\n⚡ *${botName}*` 
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
