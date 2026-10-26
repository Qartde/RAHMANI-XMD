const axios = require("axios");
const yts = require("yt-search");
const { zokou } = require("../framework/zokou");
const conf = require("../set");

// ═══════════════════════════════════════════════
//   ⚡ RAHMANI-XMD : MEDIA DOWNLOADER
// ═══════════════════════════════════════════════

const botUI = {
    channelJid: "120363353854480831@newsletter",
    channelLink: "https://whatsapp.com/channel/0029VatokI45EjxufALmY32X",
    thumbnail: "https://files.catbox.moe/aktbgo.jpg",
    botName: () => conf.BOT_NAME || "RAHMANI-XMD"
};

function buildContextInfo(title, ytUrl, thumb) {
    return {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: botUI.channelJid,
            newsletterName: botUI.botName(),
            serverMessageId: 143
        },
        externalAdReply: {
            title: title.substring(0, 40),
            body: `Downloaded via ${botUI.botName()}`,
            mediaType: 1,
            mediaUrl: ytUrl,
            sourceUrl: ytUrl,
            thumbnailUrl: thumb || botUI.thumbnail,
            showAdAttribution: false,
            renderLargerThumbnail: true
        }
    };
}

// ======================= PLAY (AUDIO) ========================
zokou({
    nomCom: "play",
    categorie: "Download",
    reaction: "🎵",
    desc: "Download audio from YouTube",
    fromMe: false
}, async (dest, client, cmd) => {
    const { arg, ms, repondre, auteurMessage } = cmd;
    const query = (arg || []).join(" ").trim();

    if (!query) {
        return client.sendMessage(dest, {
            text: `🎵 *${botUI.botName()} PLAY*

┌─────────────────────
│  📖 *Usage:*
│  ▸ .play <song name>
│  ▸ .play <youtube link>
│
│  💡 *Example:*
│  ▸ .play Calm Down
│
└─────────────────────

> *View channel*`,
            mentions: [auteurMessage],
            contextInfo: buildContextInfo("PLAY AUDIO", botUI.channelLink, botUI.thumbnail)
        }, { quoted: ms });
    }

    await repondre("⏳ *Searching for your song...*");

    try {
        // Search YouTube
        const search = await yts(query);
        const data = search.videos[0];

        if (!data) throw new Error("No results found on YouTube.");

        // Get audio from API
        const apiRes = await axios.get("https://apiziaul.vercel.app/api/downloader/ytplaymp3", {
            params: { query: query },
            timeout: 45000
        });

        const json = apiRes.data;

        if (!json.status || !json.result || !json.result.downloadUrl) {
            throw new Error("API failed to return a download link.");
        }

        const downloadUrl = json.result.downloadUrl;
        const title = json.result.title || data.title;

        const caption = `🎵 *${botUI.botName()} AUDIO*

┌─────────────────────
│  📛 *Title:* ${title.substring(0, 45)}
│  ⏱️ *Duration:* ${data.timestamp}
│  🎧 *Type:* Audio (MP3)
│
└─────────────────────

⚡ *Powered by ${botUI.botName()}*

> *View channel*`;

        // Send audio
        await client.sendMessage(dest, {
            audio: { url: downloadUrl },
            mimetype: "audio/mpeg",
            fileName: `${title.replace(/[^\w\s.-]/g, "").substring(0, 45)}.mp3`,
            ptt: false,
            mentions: [auteurMessage],
            contextInfo: buildContextInfo(title, data.url, data.thumbnail)
        }, { quoted: ms });

    } catch (e) {
        console.error("❌ Play Error:", e.message);
        await repondre(`❌ *FAILED*\n\n┌─────────────────────\n│  ⚠️ *Error:*\n│  ${e.message.substring(0, 150)}\n│\n└─────────────────────\n\n> *View channel*`);
    }
});

// ====================== VIDEO ========================
zokou({
    nomCom: "video",
    categorie: "Download",
    reaction: "🎥",
    desc: "Download video from YouTube",
    fromMe: false
}, async (dest, client, cmd) => {
    const { arg, ms, repondre, auteurMessage } = cmd;
    const query = (arg || []).join(" ").trim();

    if (!query) {
        return client.sendMessage(dest, {
            text: `🎥 *${botUI.botName()} VIDEO*

┌─────────────────────
│  📖 *Usage:*
│  ▸ .video <video name>
│  ▸ .video <youtube link>
│
│  💡 *Example:*
│  ▸ .video Despacito
│
└─────────────────────

> *View channel*`,
            mentions: [auteurMessage],
            contextInfo: buildContextInfo("PLAY VIDEO", botUI.channelLink, botUI.thumbnail)
        }, { quoted: ms });
    }

    await repondre("⏳ *Searching for your video...*");

    try {
        // Search YouTube
        const search = await yts(query);
        const data = search.videos[0];

        if (!data) throw new Error("No results found on YouTube.");

        // Get video from API
        const apiRes = await axios.get("https://apiziaul.vercel.app/api/downloader/ytmp4", {
            params: { url: data.url },
            timeout: 60000
        });

        const json = apiRes.data;

        if (!json.status || !json.result || !json.result.downloadUrl) {
            throw new Error("API failed to return a download link.");
        }

        const downloadUrl = json.result.downloadUrl;
        const title = json.result.title || json.result.filename || data.title;

        const caption = `🎥 *${botUI.botName()} VIDEO*

┌─────────────────────
│  📛 *Title:* ${title.substring(0, 45)}
│  ⏱️ *Duration:* ${data.timestamp}
│  🎬 *Type:* Video (MP4)
│
└─────────────────────

⚡ *Powered by ${botUI.botName()}*

> *View channel*`;

        // Send video
        await client.sendMessage(dest, {
            video: { url: downloadUrl },
            mimetype: "video/mp4",
            fileName: `${title.replace(/[^\w\s.-]/g, "").substring(0, 45)}.mp4`,
            caption: caption,
            mentions: [auteurMessage],
            contextInfo: buildContextInfo(title, data.url, data.thumbnail)
        }, { quoted: ms });

    } catch (e) {
        console.error("❌ Video Error:", e.message);
        await repondre(`❌ *FAILED*\n\n┌─────────────────────\n│  ⚠️ *Error:*\n│  ${e.message.substring(0, 150)}\n│\n└─────────────────────\n\n> *View channel*`);
    }
});
