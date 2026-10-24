'use strict';

const { zokou } = require(__dirname + "/../framework/zokou");
const axios = require("axios");
const moment = require("moment-timezone");
const conf = require(__dirname + "/../set");

moment.tz.setDefault(conf.TZ || "Africa/Nairobi");

// ═══════════════════════════════════════════════
//   ⚡ RAHMANI-XMD : APK DOWNLOADER
// ═══════════════════════════════════════════════

const botSettings = {
    name: conf.BOT_NAME || "RAHMANI-XMD",
    channelJid: "120363353854480831@newsletter",
    channelLink: "https://whatsapp.com/channel/0029VatokI45EjxufALmY32X",
    defaultThumbnail: "https://files.catbox.moe/aktbgo.jpg"
};

zokou({ 
    nomCom: "apk", 
    categorie: "Download", 
    reaction: "📱",
    desc: "Download APK from Play Store"
}, async (dest, zk, commandeOptions) => {
    const { ms, arg, auteurMessage } = commandeOptions;

    try {
        // 1. Check if app name is provided
        if (!arg || !arg[0]) {
            return zk.sendMessage(dest, {
                text: `📱 *${botSettings.name} APK*

┌─────────────────────
│  📖 *Usage:*
│  ▸ .apk <app name>
│
│  💡 *Examples:*
│  ▸ .apk facebook
│  ▸ .apk whatsapp
│
└─────────────────────

> *View channel*`,
                mentions: [auteurMessage],
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: botSettings.channelJid,
                        newsletterName: botSettings.name,
                        serverMessageId: 143
                    },
                    externalAdReply: {
                        title: `📱 ${botSettings.name} APK`,
                        body: "Download any Android app 🚀",
                        mediaType: 1,
                        mediaUrl: botSettings.channelLink,
                        sourceUrl: botSettings.channelLink,
                        thumbnailUrl: botSettings.defaultThumbnail,
                        showAdAttribution: false,
                        renderLargerThumbnail: true
                    }
                }
            }, { quoted: ms });
        }

        // 2. Search APK from API
        const query = encodeURIComponent(arg.join(" "));
        const searchUrl = `https://ws75.aptoide.com/api/7/apps/search/query=${query}`;
        const { data } = await axios.get(searchUrl, { timeout: 30000 });

        if (!data?.datalist?.list?.length) {
            return zk.sendMessage(dest, {
                text: `❌ *APP NOT FOUND*

┌─────────────────────
│  ⚠️ *Error:*
│  App not found: ${arg.join(" ")}
│
│  💡 *Tip:* Try another name
│
└─────────────────────

> *View channel*`,
                mentions: [auteurMessage]
            }, { quoted: ms });
        }

        // 3. Extract app details
        const app = data.datalist.list[0];
        const appName = app.name || "Unknown";
        const apkUrl = app.file?.path;
        const version = app.file?.vername || "Unknown";
        const size = app.file?.filesize 
            ? `${Math.round(app.file.filesize / 1048576)} MB` 
            : "Unknown";

        if (!apkUrl) {
            return zk.sendMessage(dest, {
                text: `❌ *DOWNLOAD UNAVAILABLE*

┌─────────────────────
│  ⚠️ *Error:*
│  APK not available for download
│  📱 App: ${appName}
│
└─────────────────────

> *View channel*`,
                mentions: [auteurMessage]
            }, { quoted: ms });
        }

        // 4. Prepare Info
        const time = moment().format("HH:mm:ss");
        const date = moment().format("DD/MM/YYYY");

        const caption = `📱 *${botSettings.name} APK*

┌─────────────────────
│  📦 *App:* ${appName}
│  🏷 *Version:* ${version}
│  📊 *Size:* ${size}
│
│  📆 *Date:* ${date}
│  🕒 *Time:* ${time}
│
└─────────────────────

⚡ *Powered by ${botSettings.name}*

> *View channel*`;

        // 5. Send APK
        await zk.sendMessage(dest, {
            document: { url: apkUrl },
            fileName: `${appName}.apk`,
            mimetype: "application/vnd.android.package-archive",
            caption: caption,
            mentions: [auteurMessage],
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: botSettings.channelJid,
                    newsletterName: botSettings.name,
                    serverMessageId: 143
                },
                externalAdReply: {
                    title: `📱 ${appName}`,
                    body: `Version ${version} • ${size}`,
                    mediaType: 1,
                    mediaUrl: botSettings.channelLink,
                    sourceUrl: botSettings.channelLink,
                    thumbnailUrl: botSettings.defaultThumbnail,
                    showAdAttribution: false,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: ms });

    } catch (error) {
        console.error("❌ APK Command Error:", error.message);

        await zk.sendMessage(dest, {
            text: `❌ *FAILED*

┌─────────────────────
│  ⚠️ *Error:*
│  ${error.message.substring(0, 100)}
│
└─────────────────────

> *View channel*`,
            mentions: [auteurMessage]
        }, { quoted: ms });
    }
});
