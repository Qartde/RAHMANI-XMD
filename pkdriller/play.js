const { zokou } = require("../framework/zokou");
const axios = require("axios");
const fs = require("fs-extra");
const yts = require("yt-search");

// Base URL for your API
const BASE_URL = "https://api.siputzx.my.id"; // Badilisha na BASE_URL yako

zokou({
    nomCom: "play",
    aliases: ["music", "song", "ytmp3", "audio"],
    reaction: "🎵",
    categorie: "Download"
}, async (dest, zk, commandeOptions) => {
    const { repondre, arg, ms } = commandeOptions;

    try {
        // Check if song name is provided
        if (!arg || arg.length === 0) {
            await zk.sendMessage(dest, {
                text: "🎵 *MUSIC DOWNLOADER*\n\nPlease provide a song name.\n\nExample: `.play nikuone`\n\n⚡ *RAHMANI-XMD*",
                contextInfo: {
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363353854480831@newsletter',
                        newsletterName: 'RAHMANI XMD',
                        serverMessageId: 143
                    },
                    forwardingScore: 999,
                    externalAdReply: {
                        title: 'RAHMANI-XMD',
                        body: '🎵 Enter song name to download',
                        thumbnailUrl: 'https://files.catbox.moe/aktbgo.jpg',
                        mediaType: 1,
                        renderSmallThumbnail: true
                    }
                }
            }, { quoted: ms });
            return;
        }

        const songName = arg.join(" ");
        
        // Send searching message
        await zk.sendMessage(dest, {
            text: `🔍 *Searching for:* ${songName}\n\n⏳ Please wait...\n\n⚡ *RAHMANI-XMD*`,
            contextInfo: {
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363353854480831@newsletter',
                    newsletterName: 'RAHMANI XMD',
                    serverMessageId: 143
                },
                forwardingScore: 999,
                externalAdReply: {
                    title: 'RAHMANI-XMD',
                    body: `🔍 Searching: ${songName.substring(0, 20)}`,
                    thumbnailUrl: 'https://files.catbox.moe/aktbgo.jpg',
                    mediaType: 1,
                    renderSmallThumbnail: true
                }
            }
        }, { quoted: ms });

        // Search for the song on YouTube
        const searchResults = await yts(songName);
        const videos = searchResults.videos;
        
        if (!videos || videos.length === 0) {
            return await repondre("❌ No results found for that song.");
        }

        // Get the first video
        const video = videos[0];
        
        // Prepare API URL for MP3 download
        const apiURL = `${BASE_URL}/dipto/ytDl3?link=${encodeURIComponent(video.videoId)}&format=mp3`;
        
        // Send found message
        await zk.sendMessage(dest, {
            text: `✅ *SONG FOUND*\n\n*Title:* ${video.title}\n*Duration:* ${video.timestamp}\n*Uploaded:* ${video.ago}\n\n⏳ *Downloading audio...*`,
            contextInfo: {
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363353854480831@newsletter',
                    newsletterName: 'RAHMANI XMD',
                    serverMessageId: 143
                },
                forwardingScore: 999,
                externalAdReply: {
                    title: 'RAHMANI-XMD',
                    body: `🎵 ${video.title.substring(0, 25)}`,
                    thumbnailUrl: video.thumbnail || 'https://files.catbox.moe/aktbgo.jpg',
                    mediaType: 1,
                    renderSmallThumbnail: true
                }
            }
        }, { quoted: ms });

        // Download from API
        const response = await axios.get(apiURL, { timeout: 60000 });
        
        if (!response.data || !response.data.download) {
            return await repondre("❌ Failed to get download link.");
        }

        const audioUrl = response.data.download;
        
        // Send the audio file
        await zk.sendMessage(dest, {
            audio: { url: audioUrl },
            mimetype: "audio/mp4",
            fileName: `${video.title}.mp3`,
            contextInfo: {
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363353854480831@newsletter',
                    newsletterName: 'RAHMANI XMD',
                    serverMessageId: 143
                },
                forwardingScore: 999,
                externalAdReply: {
                    title: 'RAHMANI-XMD',
                    body: `🎵 ${video.title.substring(0, 25)}`,
                    thumbnailUrl: video.thumbnail || 'https://files.catbox.moe/aktbgo.jpg',
                    mediaType: 1,
                    renderSmallThumbnail: true,
                    sourceUrl: audioUrl
                }
            }
        }, { quoted: ms });

    } catch (error) {
        console.error("Music download error:", error.message);
        
        await zk.sendMessage(dest, {
            text: "❌ *Error downloading music.*\nPlease try again later.\n\n⚡ *RAHMANI-XMD*",
            contextInfo: {
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363353854480831@newsletter',
                    newsletterName: 'RAHMANI XMD',
                    serverMessageId: 143
                },
                forwardingScore: 999,
                externalAdReply: {
                    title: 'RAHMANI-XMD',
                    body: '❌ Download Failed',
                    thumbnailUrl: 'https://files.catbox.moe/aktbgo.jpg',
                    mediaType: 1,
                    renderSmallThumbnail: true
                }
            }
        }, { quoted: ms });
    }
});
