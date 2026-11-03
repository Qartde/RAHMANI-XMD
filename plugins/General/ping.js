const { bmbtz } = require("../../devbmb/bmbtz");
const os = require("os");
const moment = require("moment-timezone");
const conf = require("../../settings");

bmbtz({
  nomCom: "ping",
  alias: ["speed", "p", "pong"],
  desc: "Check bot speed and status.",
  categorie: "General",
  reaction: "⚡"
}, async (dest, client, commandeOptions) => {
  const { ms } = commandeOptions;

  try {
    const start = Date.now();
    await client.sendMessage(dest, { text: "⚡ *Pinging...*" }, { quoted: ms });
    const ping = Date.now() - start;

    const time = moment().format("HH:mm:ss");
    const date = moment().format("DD/MM/YYYY");
    
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    const uptimeStr = `${hours}h ${minutes}m ${seconds}s`;

    const msg = 
`*🚀 RAHMANI-XMD | ONLINE* ⚡
━━━━━━━━━━━━━━
⏱️ *Speed:* ${ping}ms
📅 *Date:* ${date}
🕒 *Time:* ${time}
⚡ *Uptime:* ${uptimeStr}
━━━━━━━━━━━━━━
*🥀 Powered by Rahmani Team*`;

    await client.sendMessage(dest, {
      text: msg,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363353854480831@newsletter",
          newsletterName: "RAHMANI-XMD",
          serverMessageId: 143
        },
        externalAdReply: {
          title: "⚡ RAHMANI-XMD SYSTEM",
          body: `Bot is active and running smoothly 🚀`,
          thumbnailUrl: conf.URL,
          sourceUrl: conf.URL,
          mediaType: 1
        }
      }
    }, { quoted: ms });

  } catch (e) {
    console.log("❌ Ping Error:", e);
    await client.sendMessage(dest, { text: `❌ *Error:* ${e.message || e}` }, { quoted: ms }).catch(() => {});
  }
});
