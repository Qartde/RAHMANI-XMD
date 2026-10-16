const { zokou } = require("../framework/zokou");
const conf = require("../set");
const fs = require("fs");
const path = require("path");

zokou({
    nomCom: "menu",
    categorie: "General",
    reaction: "📋",
    desc: "Show bot menu with all commands",
    fromMe: false
}, async (dest, zk, commandeOptions) => {
    const { ms, auteurMessage, nomAuteurMessage } = commandeOptions;

    // 📂 LOAD COMMANDS
    const commandsDir = path.join(__dirname, "../commandes");
    let categories = {};
    let totalCommands = 0;

    try {
        const files = fs.readdirSync(commandsDir);
        for (const file of files) {
            if (!file.endsWith(".js")) continue;
            try {
                const content = fs.readFileSync(path.join(commandsDir, file), "utf8");
                const nomMatch = content.match(/nomCom:\s*["']([^"']+)["']/);
                const catMatch = content.match(/categorie:\s*["']([^"']+)["']/);
                if (nomMatch) {
                    const category = catMatch ? catMatch[1] : "General";
                    if (!categories[category]) categories[category] = [];
                    categories[category].push(nomMatch[1]);
                    totalCommands++;
                }
            } catch (e) {}
        }
    } catch (e) {
        console.log("Menu error:", e.message);
    }

    // ⏱️ UPTIME
    const uptime = process.uptime();
    const d = Math.floor(uptime / 86400);
    const h = Math.floor((uptime % 86400) / 3600);
    const m = Math.floor((uptime % 3600) / 60);

    const now = new Date();
    const date = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
    const time = now.toLocaleTimeString('en-GB');

    // 📦 MENU TEXT (fupi)
    let menuText = `╭━━━〔 *${(conf.BOT_NAME || "RAHMANI-XMD").toUpperCase()}* 〕━━━╮

  🤖 *Online:* ✅
  📦 *Commands:* ${totalCommands}
  ⚡ *Uptime:* ${d}d ${h}h ${m}m
  📅 ${date} | 🕐 ${time}
  👤 ${nomAuteurMessage || "User"}

`;

    for (const [cat, cmds] of Object.entries(categories)) {
        menuText += `┣━━❰ *${cat.toUpperCase()}* ❱\n`;
        cmds.forEach(cmd => {
            menuText += `┃ ▸ ${conf.PREFIXE || "."}${cmd}\n`;
        });
        menuText += `┃\n`;
    }

    menuText += `╰━━━━━━━━━━━━━━━╯

> *View channel*`;

    // 📤 SEND
    await zk.sendMessage(dest, {
        text: menuText,
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
                title: `📋 ${conf.BOT_NAME || "RAHMANI-XMD"} MENU`,
                body: `${totalCommands} commands available 🚀`,
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
