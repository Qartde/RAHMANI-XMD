const { zokou } = require("../framework/zokou");
const conf = require("../set");

zokou({
    nomCom: "uptime",
    categorie: "General",
    reaction: "⏱️",
    desc: "Check bot uptime",
    fromMe: false
}, async (dest, zk, commandeOptions) => {
    const { ms, auteurMessage } = commandeOptions;

    // Uptime
    const uptime = process.uptime();
    const d = Math.floor(uptime / 86400);
    const h = Math.floor((uptime % 86400) / 3600);
    const m = Math.floor((uptime % 3600) / 60);
    const s = Math.floor(uptime % 60);

    // Date & Time
    const now = new Date();
    const date = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
    const time = now.toLocaleTimeString('en-GB');

    const text = `⏱️ *${conf.BOT_NAME || "RAHMANI-XMD"} UPTIME*

┌─────────────────────
│  ⚡ *UPTIME*
│
│  📅 Days: *${d}d*
│  🕐 Hours: *${h}h*
│  ⏳ Minutes: *${m}m*
│  ⏰ Seconds: *${s}s*
│
├─────────────────────
│  📆 Date: *${date}*
│  🕐 Time: *${time}*
│
└─────────────────────

> *View channel*`;

    await zk.sendMessage(dest, {
        text: text,
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
                title: `⏱️ ${conf.BOT_NAME || "RAHMANI-XMD"} UPTIME`,
                body: "Bot is running smoothly 🚀",
                mediaType: 1,
                mediaUrl: "https://whatsapp.com/channel/0029VatokI45EjxufALmY32X",
                sourceUrl: "https://whatsapp.com/channel/0029VatokI45EjxufALmY32X",
                thumbnailUrl: "https://files.catbox.moe/aktbgo.jpg",
                showAdAttribution: false,
                renderLargerThumbnail: true
            }
        }
    }, { quoted: ms });
});
