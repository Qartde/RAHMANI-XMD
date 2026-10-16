const { zokou } = require("../framework/zokou");
const conf = require("../set");
const axios = require("axios");

zokou({
    nomCom: "play",
    categorie: "Download",
    reaction: "🎵",
    desc: "Download audio from YouTube",
    fromMe: false
}, async (dest, client, commandeOptions) => {
    const { repondre, arg, ms, auteurMessage } = commandeOptions;

    const query = (arg || []).join(" ").trim();

    // ═══════════════════════════════════════════
    //   ✅ CHECK — Query
    // ═══════════════════════════════════════════
    if (!query) {
        return client.sendMessage(dest, {
            text: `🎵 *${conf.BOT_NAME || "RAHMANI-XMD"} PLAY*

┌─────────────────────
│  📖 *Usage:*
│  ▸ .play <song name>
│  ▸ .play <youtube link>
│
│  💡 *Examples:*
│  ▸ .play Faded Alan Walker
│  ▸ .play https://youtu.be/...
│
└─────────────────────

> *View channel*`,
            mentions: [auteurMessage],
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363353854480831@newsletter",
                    newsletterName: conf.BOT_NAME || "RAHMANI-XMD",
                    serverMessageId: 143
                },
                externalAdReply: {
                    title: `🎵 ${conf.BOT_NAME || "RAHMANI-XMD"} PLAY`,
                    body: "Download any song 🎧",
                    mediaType: 1,
                    mediaUrl: "https://whatsapp.com/channel/0029VatokI45EjxufALmY32X",
                    sourceUrl: "https://whatsapp.com/channel/0029VatokI45EjxufALmY32X",
                    thumbnailUrl: "https://files.catbox.moe/aktbgo.jpg",
                    showAdAttribution: false,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: ms });
    }

    await repondre("⏳ *Searching and downloading...*");

    try {
        // ═══════════════════════════════════════════
        //   🔍 SEARCH — YouTube (kama si URL)
        // ═══════════════════════════════════════════
        let youtubeUrl = query;

        if (!query.startsWith("http")) {
            const searchApi = `https://api.nyxs.pw/search/yt?q=${encodeURIComponent(query)}`;
            const searchRes = await axios.get(searchApi, { timeout: 30000 });
            const firstResult = searchRes.data?.result?.[0] || searchRes.data?.[0];
            
            if (!firstResult) throw new Error("Song not found on YouTube");
            
            youtubeUrl = firstResult.url || firstResult.link;
        }

        // ═══════════════════════════════════════════
        //   📥 DOWNLOAD — Kutumia API yako
        // ═══════════════════════════════════════════
        const apiUrl = `https://yt-dl.officialhectormanuel.workers.dev/?url=${encodeURIComponent(youtubeUrl)}`;
        const response = await axios.get(apiUrl, { timeout: 60000 });
        const data = response.data;

        console.log("PLAY API RESPONSE:", JSON.stringify(data).substring(0, 300));

        // ═══════════════════════════════════════════
        //   🎯 EXTRACT — Audio URL
        // ═══════════════════════════════════════════
        let audioUrl = null;
        let title = query;
        let thumbnail = null;
        let duration = null;

        // Jaribu kila format inayowezekana
        if (data.status && data.result) {
            audioUrl = data.result.audio || 
                       data.result.download || 
                       data.result.url || 
                       data.result.mp3 ||
                       (data.result.links && data.result.links.mp3);
            title = data.result.title || data.result.name || query;
            thumbnail = data.result.thumbnail || data.result.thumb || data.result.image;
            duration = data.result.duration || data.result.durationInSeconds;
        } else if (data.audio) {
            audioUrl = data.audio;
            title = data.title || query;
            thumbnail = data.thumbnail;
            duration = data.duration;
        } else if (data.url) {
            audioUrl = data.url;
            title = data.title || query;
            thumbnail = data.thumbnail;
        } else if (data.link) {
            audioUrl = data.link;
            title = data.title || query;
            thumbnail = data.thumbnail;
        }

        if (!audioUrl) {
            console.error("Full API Response:", JSON.stringify(data));
            throw new Error("No audio link found in API response");
        }

        console.log("AUDIO URL:", audioUrl.substring(0, 100));

        // ═══════════════════════════════════════════
        //   📤 SEND — Audio
        // ═══════════════════════════════════════════
        const caption = `🎵 *${conf.BOT_NAME || "RAHMANI-XMD"} PLAY*

┌─────────────────────
│  📛 *Title:* ${title.substring(0, 50)}
│  ⏱️ *Duration:* ${duration || "N/A"}
│  🎧 *Type:* Audio (MP3)
│
└─────────────────────

⚡ *Powered by ${conf.BOT_NAME || "RAHMANI-XMD"}*

> *View channel*`;

        const audioOptions = {
            audio: { url: audioUrl },
            mimetype: "audio/mpeg",
            fileName: `${title.replace(/[^\w\s.-]/g, "").substring(0, 50)}.mp3`,
            ptt: false,
            mentions: [auteurMessage],
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363353854480831@newsletter",
                    newsletterName: conf.BOT_NAME || "RAHMANI-XMD",
                    serverMessageId: 143
                },
                externalAdReply: {
                    title: `🎵 ${title.substring(0, 40)}`,
                    body: `Downloaded via ${conf.BOT_NAME || "RAHMANI-XMD"}`,
                    mediaType: 1,
                    mediaUrl: youtubeUrl,
                    sourceUrl: youtubeUrl,
                    thumbnailUrl: thumbnail || "https://files.catbox.moe/aktbgo.jpg",
                    showAdAttribution: false,
                    renderLargerThumbnail: true
                }
            }
        };

        await client.sendMessage(dest, audioOptions, { quoted: ms });

        // ═══════════════════════════════════════════
        //   📝 SEND CAPTION (Optional)
        // ═══════════════════════════════════════════
        await client.sendMessage(dest, {
            text: caption,
            mentions: [auteurMessage]
        }, { quoted: ms });

    } catch (error) {
        console.error("❌ Play Error:", error.message);
        
        let errorMsg = "Download failed. Try again.";
        if (error.code === 'ECONNABORTED') errorMsg = "Request timeout. Try again.";
        if (error.message.includes("not found")) errorMsg = "Song not found. Try another name.";
        
        await client.sendMessage(dest, {
            text: `❌ *IMESHINDWA*

┌─────────────────────
│  ⚠️ *Error:*
│  ${errorMsg}
│
└─────────────────────

> *View channel*`,
            mentions: [auteurMessage]
        }, { quoted: ms });
    }
});
