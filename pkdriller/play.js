const { zokou } = require("../framework/zokou");
const axios = require("axios");
const yts = require("yt-search");

zokou({
    nomCom: "song",
    aliases: ["play", "music", "mp3", "ytmp3"],
    reaction: "🎧",
    categorie: "Download"
}, async (dest, zk, commandeOptions) => {
    const { repondre, arg, ms } = commandeOptions;

    if (!arg || arg.length === 0) {
        return await repondre("*Usage:* .play [song name]\n*Example:* .play nikuone");
    }

    const query = arg.join(" ");
    
    try {
        await repondre(`🔍 *Searching:* ${query}`);

        // Search YouTube
        const search = await yts(query);
        const video = search.videos[0];
        
        if (!video) return repondre("❌ No results found");

        // Download audio using your API
        const apiURL = `https://api.siputzx.my.id/dipto/ytDl3?link=${encodeURIComponent(video.videoId)}&format=mp3`;
        
        const response = await axios.get(apiURL);
        
        if (response.data?.download) {
            // Send audio with context info
            await zk.sendMessage(dest, {
                audio: { url: response.data.download },
                mimetype: "audio/mp4",
                fileName: `${video.title}.mp3`,
                caption: `🎧 *${video.title}*\n⏱️ ${video.timestamp}\n\n⚡ RAHMANI-XMD`,
                contextInfo: {
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363353854480831@newsletter',
                        newsletterName: 'RAHMANI XMD',
                        serverMessageId: 143
                    },
                    externalAdReply: {
                        title: video.title.substring(0, 30),
                        body: `Duration: ${video.timestamp}`,
                        thumbnailUrl: video.thumbnail,
                        mediaType: 1
                    }
                }
            }, { quoted: ms });
        } else {
            repondre("❌ Failed to get audio");
        }
        
    } catch (error) {
        console.error(error);
        repondre("❌ Error: " + error.message);
    }
});
