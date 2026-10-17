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
        let youtubeUrl = query;
        let title = query;
        let thumbnail = null;

        // ==========================================
        // 🔍 1. TAFUTA YOUTUBE (Kama si link)
        // ==========================================
        if (!query.startsWith("http")) {
            console.log("🔍 Searching YouTube for:", query);
            
            // Tumia API ya David Cyril kutafuta
            const searchApi = `https://apis.davidcyril.name.ng/search/youtube?q=${encodeURIComponent(query)}`;
            const searchRes = await axios.get(searchApi, { timeout: 20000 });
            
            const firstResult = searchRes.data?.result?.[0] || searchRes.data?.[0];

            if (!firstResult) throw new Error("Song not found on YouTube");

            youtubeUrl = firstResult.url || firstResult.link;
            title = firstResult.title || firstResult.name || query;
            thumbnail = firstResult.thumbnail || firstResult.image;
            
            console.log("🎯 Found YouTube URL:", youtubeUrl);
        }

        // ==========================================
        // 📥 2. DOWNLOAD AUDIO (API 1: Yako)
        // ==========================================
        let audioUrl = null;
        
        try {
            const api1 = `https://yt-dl.officialhectormanuel.workers.dev/?url=${encodeURIComponent(youtubeUrl)}`;
            console.log("📥 Trying API 1 (Yako):", api1);
            
            const res1 = await axios.get(api1, { timeout: 30000 });
            const data1 = res1.data;

            if (typeof data1 === 'string' && data1.startsWith('http')) {
                audioUrl = data1;
            } else if (data1.audio) audioUrl = data1.audio;
            else if (data1.url) audioUrl = data1.url;
            else if (data1.link) audioUrl = data1.link;
            else if (data1.result?.audio) audioUrl = data1.result.audio;
            else if (data1.result?.url) audioUrl = data1.result.url;
            else if (data1.result?.download) audioUrl = data1.result.download;
            
            // Fallback Regex kama haipo
            if (!audioUrl) {
                const match = JSON.stringify(data1).match(/https?:\/\/[^"\s]+\.(mp3|m4a|webm|opus)/i);
                if (match) audioUrl = match[0];
            }

            if (audioUrl) console.log("✅ API 1 imefanikiwa kupata link!");

        } catch (e) {
            console.log("⚠️ API 1 imeshindwa au imegoma. Trying API 2 (David Cyril)...");
        }

        // ==========================================
        // 📥 3. DOWNLOAD AUDIO (API 2: David Cyril - Fallback)
        // ==========================================
        if (!audioUrl) {
            try {
                const api2 = `https://apis.davidcyril.name.ng/download/ytmp3?url=${encodeURIComponent(youtubeUrl)}`;
                console.log("📥 Trying API 2 (David Cyril):", api2);
                
                const res2 = await axios.get(api2, { timeout: 30000 });
                const data2 = res2.data;

                if (data2.status === true && data2.result) {
                    audioUrl = data2.result.download_url || data2.result.url || data2.result.audio;
                    if (!title || title === query) title = data2.result.title || query;
                    if (!thumbnail) thumbnail = data2.result.thumbnail;
                } else {
                    audioUrl = data2.url || data2.link || data2.audio;
                }

                if (audioUrl) console.log("✅ API 2 (David Cyril) imefanikiwa kupata link!");
            } catch (e) {
                console.log("❌ API 2 pia imeshindwa.");
            }
        }

        // Kama zote zimeshindwa
        if (!audioUrl) {
            throw new Error("API zote mbili zimeshindwa kupata mziki. Jaribu tena baadae.");
        }

        // ==========================================
        // 📤 4. TUMA AUDIO
        // ==========================================
        const caption = `🎵 *${conf.BOT_NAME || "RAHMANI-XMD"} PLAY*

┌─────────────────────
│  📛 *Title:* ${title.substring(0, 50)}
│  🎧 *Type:* Audio (MP3)
│
└─────────────────────

⚡ *Powered by ${conf.BOT_NAME || "RAHMANI-XMD"}*

> *View channel*`;

        await client.sendMessage(dest, {
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
        }, { quoted: ms });

        console.log("✅ Audio sent successfully!");

    } catch (error) {
        console.error("❌ Play Error:", error.message);
        
        let errorMsg = error.message;
        if (error.code === 'ECONNABORTED') errorMsg = "Request timeout. Jaribu tena.";
        if (error.message.includes("ENOTFOUND")) errorMsg = "Mtandao umegoma. Jaribu tena.";

        await client.sendMessage(dest, {
            text: `❌ *FAILED*

┌─────────────────────
│  ⚠️ *Error:*
│  ${errorMsg.substring(0, 100)}
│
│  💡 *Tip:* Weka YouTube link moja kwa moja.
│  ▸ .play https://youtu.be/...
│
└─────────────────────

> *View channel*`,
            mentions: [auteurMessage]
        }, { quoted: ms });
    }
});
