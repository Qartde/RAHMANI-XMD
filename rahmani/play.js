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
        // ==========================================
        // 🔍 1. TAFUTA YOUTUBE KAMA SI LINK
        // ==========================================
        let youtubeUrl = query;

        if (!query.startsWith("http")) {
            console.log("🔍 Searching YouTube for:", query);
            const searchApi = `https://api.nyxs.pw/search/yt?q=${encodeURIComponent(query)}`;
            const searchRes = await axios.get(searchApi, { timeout: 30000 });
            const firstResult = searchRes.data?.result?.[0] || searchRes.data?.[0];

            if (!firstResult) throw new Error("Song not found on YouTube");
            youtubeUrl = firstResult.url || firstResult.link;
            console.log("🎯 Found YouTube URL:", youtubeUrl);
        }

        // ==========================================
        // 📥 2. CALL API YAKO
        // ==========================================
        const apiUrl = `https://yt-dl.officialhectormanuel.workers.dev/?url=${encodeURIComponent(youtubeUrl)}`;
        console.log("📥 Calling Music API:", apiUrl);
        
        const response = await axios.get(apiUrl, { timeout: 60000 });
        const data = response.data;

        // Logs za kuona API imerudisha nini hasa
        console.log("═══════════════════════════════════");
        console.log("PLAY API RESPONSE:");
        console.log(JSON.stringify(data, null, 2).substring(0, 1500));
        console.log("═══════════════════════════════════");

        // ==========================================
        // 🎯 3. EXTRACT DATA (Smart Way)
        // ==========================================
        let audioUrl = null;
        let title = query;
        let thumbnail = null;

        // Njia A: Tafuta link moja kwa moja
        audioUrl = data.audio || data.url || data.link || data.download;
        
        // Njia B: Kama ipo ndani ya "result"
        if (!audioUrl && data.result) {
            audioUrl = data.result.audio || data.result.url || data.result.link || data.result.download || data.result.mp3;
            title = data.result.title || data.result.name || query;
            thumbnail = data.result.thumbnail || data.result.thumb || data.result.image;
        }

        // Njia C: Kama API inarudisha "data" ndani ya "data"
        if (!audioUrl && data.data) {
            audioUrl = data.data.audio || data.data.url || data.data.link || data.data.download;
        }

        // Njia D: Tafuta URL yoyote inayoishia na .mp3 au .m4a
        if (!audioUrl) {
            const jsonStr = JSON.stringify(data);
            const match = jsonStr.match(/https?:\/\/[^"\s]+\.(mp3|m4a|webm|opus)/i);
            if (match) audioUrl = match[0];
        }

        // Kama bado haipo
        if (!audioUrl) {
            console.error("❌ API HAINA AUDIO LINK!");
            return repondre(`❌ *FAILED TO GET AUDIO*

┌─────────────────────
│  ⚠️ API imerudisha data isiyo na link ya mziki.
│
│  💡 *Jaribu:*
│  ▸ Tuma YouTube link moja kwa moja
│  ▸ .play https://youtu.be/...
│
└─────────────────────

> *View channel*`);
        }

        console.log("🎵 Audio URL:", audioUrl.substring(0, 100));
        
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
        
        // Kama API yako imekataa kwa sababu ya URL
        let errorMsg = error.message;
        if (error.code === 'ECONNABORTED') errorMsg = "API imechukua muda mrefu (timeout). Jaribu tena.";

        await client.sendMessage(dest, {
            text: `❌ *FAILED*

┌─────────────────────
│  ⚠️ *Error:*
│  ${errorMsg.substring(0, 100)}
│
│  💡 *Tip:* Weka YouTube link moja kwa moja
│
└─────────────────────

> *View channel*`,
            mentions: [auteurMessage]
        }, { quoted: ms });
    }
});
