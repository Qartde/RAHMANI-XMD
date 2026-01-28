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
        return await zk.sendMessage(from, { text: "Please provide a song name. Example: .play Calm Down" }, { quoted: ms });
    }

    try {
        const query = arg.join(" ");
        await zk.sendMessage(from, { text: `🔎 Searching for: *${query}*...` }, { quoted: ms });

        // Search YouTube for the video
        const search = await yts(query);
        const video = search.videos[0];

        if (!video) {
            return await zk.sendMessage(from, { text: "❌ Song not found." }, { quoted: ms });
        }

        const videoUrl = video.url;
        // Using your requested David Cyril API
        const apiUrl = `https://apiziaul.vercel.app/api/downloader/ytplaymp3?query=Alone${encodeURIComponent(videoUrl)}`;

        const { data } = await axios.get(apiUrl);

        if (!data.success || !data.result.download_url) {
            return await zk.sendMessage(from, { text: "❌ Error fetching audio from the server." }, { quoted: ms });
        }

        const downloadUrl = data.result.download_url;

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
                    serverMessageId: 100,
                    newsletterName: "ʀᴀʜᴍᴀɴ-ᴀɪ ᴍᴜsɪᴄ",
                },
                externalAdReply: {
                    title: video.title,
                    body: "Tap to follow our channel for more music",
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
