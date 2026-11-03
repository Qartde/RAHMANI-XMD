const { bmbtz } = require('../../devbmb/bmbtz');
const { addOrUpdateDataInAlive, getDataFromAlive } = require('../../lib/alive');
const moment = require("moment-timezone");
const s = require(__dirname + "/../../settings");
const path = require("path");
const fs = require("fs");

// ====== VCARD CONTACT ======
const quotedContact = {
  key: {
    fromMe: false,
    participant: `0@s.whatsapp.net`,
    remoteJid: "status@broadcast"
  },
  message: {
    contactMessage: {
      displayName: "RAHMANI VERIFIED ✅",
      vcard: "BEGIN:VCARD\nVERSION:3.0\nFN:RAHMANI VERIFIED ✅\nORG:RAHMANI-XMD BOT;\nTEL;type=CELL;type=VOICE;waid=255693629079:+255693629079\nEND:VCARD"
    }
  }
};

// ====== NEWSLETTER CONTEXT ======
const newsletterContext = {
  contextInfo: {
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: "120363353854480831@newsletter",
      newsletterName: "RAHMANI-XMD",
      serverMessageId: 1
    }
  }
};

// ====== RANDOM IMAGE FROM /scs ======
async function sendAliveImage(client, dest, caption, repondre) {
    const scsFolder = path.join(__dirname, "../scs");
    
    if (!fs.existsSync(scsFolder)) {
        return repondre("📁 `/scs` folder not found.");
    }
    
    const images = fs.readdirSync(scsFolder).filter(f => /^menu\d+\.(jpg|jpeg|png)$/i.test(f));
    if (images.length === 0) {
        return repondre("📁 No images found in `/scs` folder.");
    }

    const randomImage = images[Math.floor(Math.random() * images.length)];
    const imagePath = path.join(scsFolder, randomImage);

    await client.sendMessage(dest, {
        image: fs.readFileSync(imagePath),
        caption: caption,
        externalAdReply: {
            title: "🟢 RAHMANI-XMD STATUS",
            body: "Bot is alive and running smoothly 🚀",
            thumbnailUrl: s.URL || "",
            sourceUrl: s.URL || "",
            mediaType: 1
        },
        ...newsletterContext
    }, { quoted: quotedContact });
}

// ====== MAIN COMMAND ======
bmbtz(
    {
        nomCom: 'alive',
        categorie: 'General',
        reaction: "🟢"
    },
    async (dest, client, { ms, arg, repondre, superUser }) => {
        const data = await getDataFromAlive();
        const time = moment().tz('Etc/GMT').format('HH:mm:ss');
        const date = moment().format('DD/MM/YYYY');

        // ====== DISPLAY ALIVE MESSAGE ======
        if (!arg || !arg[0]) {
            const aliveMsg = 
`*╭━━━〔 🟢 RAHMANI-XMD ALIVE 〕━━━⬣*
*┃*
*┃ 📅 Date     :* ${date}
*┃ 🕒 Time     :* ${time}
*┃ 👑 Owner    :* ${s.OWNER_NAME}
*┃ 🔵 Platform :* VPS
*┃ 🟢 Status   :* ONLINE
*┃*
*╰━━━━━━━━━━━━━━━━━━⬣*

*🥀 Powered by RAHMANI-XMD & Team 🥀*`;

            try {
                if (data && data.lien) {
                    const lien = data.lien;
                    if (lien.match(/\.(mp4|gif)$/i)) {
                        await client.sendMessage(dest, {
                            video: { url: lien },
                            caption: aliveMsg,
                            externalAdReply: {
                                title: "🟢 RAHMANI-XMD STATUS",
                                body: "Bot is alive and running smoothly 🚀",
                                thumbnailUrl: s.URL || "",
                                sourceUrl: s.URL || "",
                                mediaType: 1
                            },
                            ...newsletterContext
                        }, { quoted: quotedContact });
                    } else if (lien.match(/\.(jpeg|png|jpg)$/i)) {
                        await client.sendMessage(dest, {
                            image: { url: lien },
                            caption: aliveMsg,
                            externalAdReply: {
                                title: "🟢 RAHMANI-XMD STATUS",
                                body: "Bot is alive and running smoothly 🚀",
                                thumbnailUrl: s.URL || "",
                                sourceUrl: s.URL || "",
                                mediaType: 1
                            },
                            ...newsletterContext
                        }, { quoted: quotedContact });
                    } else {
                        await sendAliveImage(client, dest, aliveMsg, repondre);
                    }
                } else {
                    await sendAliveImage(client, dest, aliveMsg, repondre);
                }
            } catch (e) {
                console.error("❌ Alive Error:", e);
                repondre(`❌ Failed to show Alive Message: ${e.message}`);
            }
        } 
        // ====== UPDATE ALIVE MESSAGE (OWNER ONLY) ======
        else {
            if (!superUser) {
                repondre("❌ Only the owner can update the Alive message.");
                return;
            }

            const [texte, tlien] = arg.join(' ').split(';');
            await addOrUpdateDataInAlive(texte, tlien);
            repondre(`✅ *Alive message updated successfully!*`);
        }
    }
);
