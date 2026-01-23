const { zokou } = require('../framework/zokou');
const axios = require('axios');
const yts = require('yt-search');

zokou({ nomCom: "play", reaction: "🎶", categorie: "search" }, async (dest, zk, commandeOptions) => {
    const { arg, ms } = commandeOptions;
    const from = dest;

    // Your Specific Channel JID and Catbox Image
    const channelJid = "120363353854480831@newsletter";
    const imageUrl = "https://files.catbox.moe/aktbgo.jpg";

    if (!arg || arg.length === 0) {
        return await zk.sendMessage(from, { text: "Please provide a song name. Example: .play Burna Boy City Boys" }, { quoted: ms });
    }

    try {
        const query = arg.join(" ");
        await zk.sendMessage(from, { text: `🔎 Searching for: *${query}*...` }, { quoted: ms });

        // Search YouTube for the video info
        const search = await yts(query);
        const video = search.videos[0];

        if (!video) {
            return await zk.sendMessage(from, { text: "❌ Song not found." }, { quoted: ms });
        }

        const videoUrl = video.url;
        // Using the Gifted Tech API you provided
        const apiUrl = `https://ytapi.giftedtech.co.ke/api/ytdla.php?url=${encodeURIComponent(videoUrl)}`;

        const { data } = await axios.get(apiUrl);

        // Gifted Tech API typically returns the link in 'download_url'
        const downloadUrl = data.download_url || data.result?.url;

        if (!downloadUrl) {
            return await zk.sendMessage(from, { text: "❌ API Error: Could not retrieve the download link." }, { quoted: ms });
        }

        // Send Audio with Channel JID Context (View Channel header)
        await zk.sendMessage(from, {
            audio: { url: downloadUrl },
            mimetype: 'audio/mp4',
            ptt: false,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: channelJid,
                    serverMessageId: 100,
                    newsletterName: "RAHMAN-AI MUSIC 🎶",
                },
                externalAdReply: {
                    title: video.title,
                    body: "Tap 'View' to join our official channel",
                    thumbnailUrl: imageUrl, // Your catbox image
                    mediaType: 1,
                    sourceUrl: `https://whatsapp.com/channel/${channelJid.split('@')[0]}`,
                    renderLargerThumbnail: false,
                    showAdAttribution: true
                }
            }
        }, { quoted: ms });

    } catch (err) {
        console.error("❌ Play Error:", err);
        await zk.sendMessage(from, { text: "❌ An error occurred: " + err.message }, { quoted: ms });
    }
});
