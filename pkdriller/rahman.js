"use strict";

const { zokou } = require("../framework/zokou");
const moment = require("moment-timezone");
const conf = require("../set");

moment.tz.setDefault(conf.TZ || "Africa/Nairobi");

const more = String.fromCharCode(8206);
const readmore = more.repeat(4001);

zokou(
    { 
        nomCom: "menu", 
        reaction: "📋", 
        nomFichier: __filename,
        categorie: "General"
    },
    async (dest, zk, commandeOptions) => {
        
        let { ms: quotedMessage, repondre, prefixe, mybotpic } = commandeOptions;
        let { cm } = require("../framework/zokou");
        
        var categories = {};
        var mode = "private";
        
        const s = require("../set");
        if (s.MODE.toLowerCase() != "yes") {
            mode = "public";
        }
        
        cm.map((command) => {
            if (!categories[command.categorie]) {
                categories[command.categorie] = [];
            }
            categories[command.categorie].push(command.nomCom);
        });
        
        const time = moment().format("HH:mm:ss");
        const date = moment().format("DD/MM/YYYY");
        
        let headerMessage = `
*╭─❖*
*┋ɴᴀᴍᴇ : ʀᴀʜᴍᴀɴɪ*
*┋ᴅᴀᴛᴇ:* ${date}
*┋ᴛɪᴍᴇ:* ${time}
*┋ᴘʀᴇғɪx:* [ ${prefixe} ]
*┋ᴘʟᴜɢɪɴs ᴄᴍᴅ:* ${cm.length}
*╰─❖*
        ` + readmore;
        
        let menuText = "*ᴘʟᴜɢɪɴs ᴄᴍᴅ: " + cm.length + "*";
        
        for (const category in categories) {
            menuText += "\n*" + category + "*";
            for (const command of categories[category]) {
                menuText += "\n*┋* " + command;
            }
            menuText += "\n*╰─❖*";
        }
        
        menuText += "\n\n> sir Rahman";
        
        var botpic = mybotpic ? mybotpic() : "";
        
        // Send menu
        try {
            await zk.sendMessage(dest, { 
                text: headerMessage + menuText,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: "120363353854480831@newsletter",
                        newsletterName: "ʀᴀʜᴍᴀɴɪ",
                        serverMessageId: 143
                    },
                    externalAdReply: {
                        title: "ʀᴀʜᴍᴀɴɪ",
                        body: "Follow my channel for more updates",
                        thumbnailUrl: "https://files.catbox.moe/aktbgo.jpg",
                        sourceUrl: conf.GURL || "https://github.com/Qartde/RAHMANI-XMD",
                        mediaType: 1,
                        renderLargerThumbnail: true,
                        showAdAttribution: true
                    }
                }
            }, { quoted: quotedMessage });
            
        } catch (error) {
            console.log("Menu error:", error);
        }
        
        // Send audio
        const audioUrls = ["https://files.catbox.moe/2wonzj.mp3"];
        const randomAudio = audioUrls[Math.floor(Math.random() * audioUrls.length)];
        
        try {
            await zk.sendMessage(dest, {
                audio: { url: randomAudio },
                mimetype: "audio/mpeg",
                ptt: true,
                contextInfo: {
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: "120363353854480831@newsletter",
                        newsletterName: "ʀᴀʜᴍᴀɴɪ",
                        serverMessageId: 143
                    },
                    forwardingScore: 999,
                    externalAdReply: {
                        title: "ʀᴀʜᴍᴀɴɪ",
                        body: "Little Montagem",
                        mediaType: 1,
                        thumbnailUrl: "https://files.catbox.moe/aktbgo.jpg",
                        sourceUrl: "https://github.com/Qartde/RAHMANI-XMD",
                        showAdAttribution: true
                    }
                }
            }, { quoted: quotedMessage });
            
        } catch (error) {
            console.log("Audio error:", error);
        }
    }
);
