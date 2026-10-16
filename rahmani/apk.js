const { zokou } = require("../framework/zokou");
const fs = require('fs-extra');
const conf = require('../set');
const axios = require("axios");

zokou({
    nomCom: "apk",
    categorie: "Download",
    reaction: "🉑",
    desc: "Download APK from Play Store",
    fromMe: false
}, async (dest, client, commandeOptions) => {
    const { repondre, arg, ms, auteurMessage } = commandeOptions;

    try {
        // ═══════════════════════════════════════════
        //   ✅ CHECK — App name
        // ═══════════════════════════════════════════
        const appName = (arg || []).join(" ").trim();
        if (!appName) {
            return client.sendMessage(dest, {
                text: `🉑 *${conf.BOT_NAME || "RAHMANI-XMD"} APK*

┌─────────────────────
│  📖 *Usage:*
│  ▸ .apk <app name>
│
│  💡 *Examples:*
│  ▸ .apk whatsapp
│  ▸ .apk instagram
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
                        title: `🉑 ${conf.BOT_NAME || "RAHMANI-XMD"} APK`,
                        body: "Download any Android app 🚀",
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

        await repondre(`⏳ *Searching:* ${appName}...`);

        // ═══════════════════════════════════════════
        //   🔍 SEARCH — BK9 API
        // ═══════════════════════════════════════════
        const searchResponse = await axios.get(
            `https://bk9.fun/search/apk?q=${encodeURIComponent(appName)}`,
            { timeout: 30000 }
        );
        const searchData = searchResponse.data;

        if (!searchData.BK9 || searchData.BK9.length === 0) {
            return client.sendMessage(dest, {
                text: `❌ *APP NOT FOUND*

┌─────────────────────
│  ⚠️ *Error:*
│  No app found with that name
│
│  💡 *Try:*
│  ▸ Check spelling
│  ▸ Use different name
│  ▸ Use English name
│
└─────────────────────

> *View channel*`,
                mentions: [auteurMessage]
            }, { quoted: ms });
        }

        // ═══════════════════════════════════════════
        //   📦 GET DETAILS
        // ═══════════════════════════════════════════
        const appDetailsResponse = await axios.get(
            `https://bk9.fun/download/apk?id=${searchData.BK9[0].id}`,
            { timeout: 30000 }
        );
        const appDetails = appDetailsResponse.data;

        if (!appDetails.BK9 || !appDetails.BK9.dllink) {
            return client.sendMessage(dest, {
                text: `❌ *DOWNLOAD LINK NOT AVAILABLE*

┌─────────────────────
│  ⚠️ *Error:*
│  Link not found for this app
│
│  💡 *Try another app*
│
└─────────────────────

> *View channel*`,
                mentions: [auteurMessage]
            }, { quoted: ms });
        }

        // ═══════════════════════════════════════════
        //   📤 SEND APK WITH CARD
        // ═══════════════════════════════════════════
        const appData = appDetails.BK9;
        const caption = `🉑 *${conf.BOT_NAME || "RAHMANI-XMD"} APK*

┌─────────────────────
│  📛 *Name:* ${appData.name}
│  📦 *Package:* ${appData.package || "N/A"}
│  📏 *Size:* ${appData.size || "N/A"}
│  ⭐ *Rating:* ${appData.rating || "N/A"}
│  🔗 *Source:* Play Store
│
└─────────────────────

⚡ *Powered by ${conf.BOT_NAME || "RAHMANI-XMD"}*

> *View channel*`;

        await client.sendMessage(
            dest,
            {
                document: { url: appData.dllink },
                fileName: `${appData.name}.apk`,
                mimetype: "application/vnd.android.package-archive",
                caption: caption,
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
                        title: `🉑 ${appData.name}`,
                        body: `Download from Play Store`,
                        mediaType: 1,
                        mediaUrl: "https://whatsapp.com/channel/0029VatokI45EjxufALmY32X",
                        sourceUrl: "https://whatsapp.com/channel/0029VatokI45EjxufALmY32X",
                        thumbnailUrl: "https://files.catbox.moe/aktbgo.jpg",
                        showAdAttribution: false,
                        renderLargerThumbnail: true
                    }
                }
            },
            { quoted: ms }
        );

    } catch (error) {
        console.error("❌ APK Error:", error.message);
        
        let errorMsg = "APK download failed. Try again later.";
        if (error.code === 'ECONNABORTED') errorMsg = "Request timeout. Try again.";
        if (error.response?.status === 404) errorMsg = "App not found.";
        
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
