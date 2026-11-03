const { bmbtz } = require("../../devbmb/bmbtz");
const os = require("os");
const moment = require("moment-timezone");
const conf = require("../../settings");

bmbtz({
  nomCom: "ping",
  alias: ["speed", "p", "pong"],
  desc: "Check bot speed and status.",
  categorie: "General",
  reaction: "💫"
}, async (dest, client, commandeOptions) => {
  const { ms } = commandeOptions;

  try {
    // Anza kupima muda
    const start = Date.now();
    await client.sendMessage(dest, { text: "⚡ *Checking system latency...*" }, { quoted: ms });
    const ping = Date.now() - start;

    // Pata taarifa za muda
    const time = moment().format("HH:mm:ss");
    const date = moment().format("DD/MM/YYYY");
    const timezone = moment.tz.guess();

    // Pata uptime
    const uptime = process.uptime();
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    
    let uptimeStr = "";
    if (days > 0) uptimeStr += `${days}d `;
    if (hours > 0) uptimeStr += `${hours}h `;
    if (minutes > 0) uptimeStr += `${minutes}m `;
    uptimeStr += `${seconds}s`;

    // Pata RAM usage
    const totalMem = os.totalmem() / (1024 * 1024 * 1024);
    const freeMem = os.freemem() / (1024 * 1024 * 1024);
    const usedMem = (totalMem - freeMem).toFixed(1);
    const ramUsage = `${usedMem} GB / ${totalMem.toFixed(1)} GB`;

    // Pata platform
    const platform = os.platform().toUpperCase();

    // Tengeneza ujumbe mzuri
    const msg = 
`*╭━━━〔 ⚡ RAHMANI-XMD 〕━━━⬣*
*┃*
*┃ 🚀 Bot Status: ONLINE*
*┃ 📡 Latency: ${ping}ms*
*┃*
*╰━━━━━━━━━━━━━━━━━━⬣*

*╭━━━〔 📊 SYSTEM INFO 〕━━━⬣*
*┃*
*┃ 📅 Date: ${date}*
*┃ 🕒 Time: ${time}*
*┃ 🌍 Timezone: ${timezone}*
*┃ ⚡ Uptime: ${uptimeStr}*
*┃ 💾 RAM: ${ramUsage}*
*┃ 🖥️ Platform: ${platform}*
*┃*
*╰━━━━━━━━━━━━━━━━━━⬣*

*🥀 Powered by RAHMANI-XMD & Team 🥀*`;

    // Tuma ujumbe na preview
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
          title: "⚡ RAHMANI-XMD SYSTEM STATUS",
          body: `Latency: ${ping}ms | Bot is running smoothly 🚀`,
          thumbnailUrl: conf.URL,
          sourceUrl: conf.URL,
          mediaType: 1
        }
      }
    }, { quoted: ms });

  } catch (e) {
    console.log("❌ Ping Command Error:", e);
    await client.sendMessage(dest, { text: `❌ *Error:* ${e.message || e}` }, { quoted: ms }).catch(() => {});
  }
});
