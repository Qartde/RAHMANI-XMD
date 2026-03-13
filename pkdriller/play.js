const { zokou } = require("../framework/zokou");
const axios = require("axios");
const yts = require("yt-search");

// YOUR BASE URL - NOOBS API
const BASE_URL = "https://noobs-api.top";

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
                text: "🎵 *RAHMANI-XMD MUSIC DOWNLOADER*\n\nPlease provide a song name.\n\nExample: `.play nikuone`\n\n⚡ *RAHMANI-XMD*",
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
            text: `🔍 *Searching for:* ${songName}\n\n⏳ Please wait...`,
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
        
        // Send found message with song info
        await zk.sendMessage(dest, {
            text: `✅ *SONG FOUND*\n\n*Title:* ${video.title}\n*Duration:* ${video.timestamp}\n*Uploaded:* ${video.ago}\n*Views:* ${video.views.toLocaleString()}\n\n⏳ *Downloading audio...*`,
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

        // USE YOUR API FROM NOOBS-API.TOP
        const apiURL = `${BASE_URL}/dipto/ytDl3?link=${encodeURIComponent(video.videoId)}&format=mp3`;
        
        console.log("Fetching from your API:", apiURL);
        
        // Download from your Noobs API
        const response = await axios.get(apiURL, { 
            timeout: 30000,
            headers: { 
                'Accept': 'application/json',
                'User-Agent': 'RAHMANI-XMD Bot'
            } 
        });
        
        console.log("API Response:", response.data);
        
        // Check response from your API
        let audioUrl = null;
        
        if (response.data) {
            // Check different possible formats
            if (response.data.download) {
                audioUrl = response.data.download;
            } else if (response.data.url) {
                audioUrl = response.data.url;
            } else if (response.data.link) {
                audioUrl = response.data.link;
            } else if (response.data.result && response.data.result.download) {
                audioUrl = response.data.result.download;
            } else if (response.data.data && response.data.data.download) {
                audioUrl = response.data.data.download;
            } else if (typeof response.data === 'string' && response.data.startsWith('http')) {
                audioUrl = response.data;
            } else if (response.data.status && response.data.result) {
                audioUrl = response.data.result;
            }
        }
        
        // If no audio URL found
        if (!audioUrl) {
            console.log("Your API did not return a download link. Response:", JSON.stringify(response.data, null, 2));
            return await repondre("❌ Your API did not return a download link. Please check the console.");
        }

        // Send the audio file
        await zk.sendMessage(dest, {
            audio: { url: audioUrl },
            mimetype: "audio/mp4",
            fileName: `${video.title.replace(/[^a-zA-Z0-9]/g, '_')}.mp3`,
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
        console.error("Full error:", error);
        
        await zk.sendMessage(dest, {
            text: `❌ *Error downloading music.*\n\n${error.message}\n\nPlease try again later.\n\n⚡ *RAHMANI-XMD*`,
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
