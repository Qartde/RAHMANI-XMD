const util = require('util');
const fs = require('fs-extra');
const { zokou } = require(__dirname + "/../framework/zokou");
const { format } = require(__dirname + "/../framework/mesfonctions");
const os = require("os");
const moment = require("moment-timezone");
const s = require(__dirname + "/../set");
const more = String.fromCharCode(8206);
const readmore = more.repeat(4001);

zokou({ 
    nomCom: "repo", 
    aliases: ["info", "botinfo", "sc", "script"],
    categorie: "General",
    reaction: "📁"
}, async (dest, zk, commandeOptions) => {
    let { ms, repondre, prefixe, nomAuteurMessage, mybotpic, arg } = commandeOptions;
    let { cm } = require(__dirname + "/../framework/zokou");
    var coms = {};
    var mode = "public";
    
    if ((s.MODE).toLocaleLowerCase() != "yes") {
        mode = "private";
    }

    cm.map(async (com, index) => {
        if (!coms[com.categorie])
            coms[com.categorie] = [];
        coms[com.categorie].push(com.nomCom);
    });

    moment.tz.setDefault('Etc/GMT');

    // Get time and date in GMT
    const temps = moment().format('HH:mm:ss');
    const date = moment().format('DD/MM/YYYY');

    // System info
    const usedMemory = format(os.totalmem() - os.freemem());
    const totalMemory = format(os.totalmem());
    const cpu = os.cpus()[0].model;
    const platform = os.platform();
    const uptime = format(os.uptime() * 1000);

    // Bot info message
    let infoMsg = `
╭━━━〔 *RAHMANI-XMD* 〕━━━╮
┃
┃ 🤖 *Bot Name:* RAHMANI-XMD
┃ 📌 *Version:* 1.0.0
┃ 👑 *Owner:* RAHMANI
┃ 🌐 *Mode:* ${mode}
┃ 📊 *Prefix:* ${prefixe}
┃
┃ ⚙️ *System Info*
┃ ┌──────────────
┃ │ 💾 *RAM:* ${usedMemory}/${totalMemory}
┃ │ 🖥️ *CPU:* ${cpu.substring(0, 30)}...
┃ │ 📱 *Platform:* ${platform}
┃ │ ⏱️ *Uptime:* ${uptime}
┃ │ 🕐 *Time:* ${temps}
┃ │ 📅 *Date:* ${date}
┃ └──────────────
┃
┃ 🔗 *Important Links*
┃ ┌──────────────
┃ │ 📁 *GitHub:* https://github.com/Qartde/RAHMANI-XMD
┃ │ 🔐 *Pair Session:* https://session-id-site-fycn.onrender.com
┃ │ 📞 *Owner:* https://wa.me/255693629079
┃ │ 📢 *Channel:* https://whatsapp.com/channel/0029VatokI45EjxufALmY32X
┃ └──────────────
┃
┃ ✨ *Commands:* ${Object.keys(coms).length} categories
┃ ⚡ *Total Cmds:* ${cm.length} commands
┃
╰━━━〔 *POWERED BY RAHMANI* 〕━━━╯

> *RAHMANI-XMD Multi-Device WhatsApp Bot*
`;

    let menuMsg = `
╭━━━〔 *AVAILABLE CATEGORIES* 〕━━━╮
┃`;

    // Add categories and commands
    for (let cat in coms) {
        menuMsg += `\n┃ 📁 *${cat}:* ${coms[cat].length} commands`;
    }

    menuMsg += `\n┃
╰━━━〔 *THANK YOU* 〕━━━╯

> Use ${prefixe}help to see all commands
`;

    // Get bot picture
    var lien = mybotpic();

    // Send based on media type
    if (lien.match(/\.(mp4|gif)$/i)) {
        try {
            await zk.sendMessage(dest, { 
                video: { url: lien }, 
                caption: infoMsg + menuMsg, 
                gifPlayback: true,
                contextInfo: {
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: s.NEWSLETTER_JID || '120363353854480831@newsletter',
                        newsletterName: s.NEWSLETTER_NAME || 'RAHMANI XMD',
                        serverMessageId: s.NEWSLETTER_ID || 143
                    },
                    forwardingScore: 999,
                    externalAdReply: {
                        title: 'RAHMANI-XMD BOT INFO',
                        body: `📁 Repository Information`,
                        thumbnailUrl: lien,
                        mediaType: 1,
                        renderSmallThumbnail: true,
                        sourceUrl: 'https://github.com/Qartde/RAHMANI-XMD'
                    }
                }
            }, { quoted: ms });
        }
        catch (e) {
            console.log("Menu error: " + e);
            await repondre(infoMsg + menuMsg);
        }
    } 
    // Check for .jpeg or .png
    else if (lien.match(/\.(jpeg|png|jpg)$/i)) {
        try {
            await zk.sendMessage(dest, { 
                image: { url: lien }, 
                caption: infoMsg + menuMsg,
                contextInfo: {
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: s.NEWSLETTER_JID || '120363353854480831@newsletter',
                        newsletterName: s.NEWSLETTER_NAME || 'RAHMANI XMD',
                        serverMessageId: s.NEWSLETTER_ID || 143
                    },
                    forwardingScore: 999,
                    externalAdReply: {
                        title: 'RAHMANI-XMD BOT INFO',
                        body: `📁 Repository Information`,
                        thumbnailUrl: lien,
                        mediaType: 1,
                        renderSmallThumbnail: true,
                        sourceUrl: 'https://github.com/Qartde/RAHMANI-XMD'
                    }
                }
            }, { quoted: ms });
        }
        catch (e) {
            console.log("Menu error: " + e);
            await repondre(infoMsg + menuMsg);
        }
    } 
    else {
        await zk.sendMessage(dest, {
            text: infoMsg + menuMsg,
            contextInfo: {
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: s.NEWSLETTER_JID || '120363353854480831@newsletter',
                    newsletterName: s.NEWSLETTER_NAME || 'RAHMANI XMD',
                    serverMessageId: s.NEWSLETTER_ID || 143
                },
                forwardingScore: 999,
                externalAdReply: {
                    title: 'RAHMANI-XMD BOT INFO',
                    body: `📁 Repository Information`,
                    thumbnailUrl: s.THUMBNAIL || 'https://files.catbox.moe/aktbgo.jpg',
                    mediaType: 1,
                    renderSmallThumbnail: true,
                    sourceUrl: 'https://github.com/Qartde/RAHMANI-XMD'
                }
            }
        }, { quoted: ms });
    }
});
