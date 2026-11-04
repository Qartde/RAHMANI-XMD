const { bmbtz } = require("../../devbmb/bmbtz");
const os = require("os");
const moment = require("moment-timezone");

bmbtz({
  nomCom: "uptime",
  alias: ["runtime", "up"],
  desc: "Check how long the bot has been running.",
  categorie: "General",
  reaction: "⏱️"
}, async (dest, client, commandeOptions) => {
  const { ms } = commandeOptions;

  try {
    // ====== HESABU UPTIME ======
    const uptimeSeconds = process.uptime();
    const days = Math.floor(uptimeSeconds / 86400);
    const hours = Math.floor((uptimeSeconds % 86400) / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const seconds = Math.floor(uptimeSeconds % 60);

    let uptimeStr = "";
    if (days > 0) uptimeStr += `${days}d `;
    if (hours > 0) uptimeStr += `${hours}h `;
    if (minutes > 0) uptimeStr += `${minutes}m `;
    uptimeStr += `${seconds}s`;

    // ====== TAARIFA ZA SYSTEM ======
    const totalMem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(1);
    const freeMem = (os.freemem() / 1024 / 1024 / 1024).toFixed(1);
    const usedMem = (totalMem - freeMem).toFixed(1);
    const platform = os.platform().toUpperCase();
    const time = moment().format("HH:mm:ss");
    const date = moment().format("DD/MM/YYYY");

    // ====== MUUNDO WA UJUMBE ======
    const msg = 
`*╭━━━〔 ⏱️ UPTIME 〕━━━⬣*
*┃*
*┃ 🟢 Runtime :* ${uptimeStr}
*┃ 📅 Date    :* ${date}
*┃ 🕒 Time    :* ${time}
*┃*
*┃ 💾 RAM     :* ${usedMem} GB / ${totalMem} GB
*┃ 🖥️ Platform:* ${platform}
*┃*
*╰━━━━━━━━━━━━━━━━━━⬣*

*🥀 Powered by RAHMANI-XMD 🥀*`;

    // ====== TUMA ======
    await client.sendMessage(dest, {
      text: msg,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363353854480831@newsletter",
          newsletterName: "RAHMANI-XMD",
          serverMessageId: 1
        }
      }
    }, { quoted: ms });

  } catch (e) {
    console.log("❌ Uptime Error:", e);
    await client.sendMessage(dest, { text: `❌ *Error:* ${e.message}` }, { quoted: ms });
  }
});
