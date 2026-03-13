const { zokou } = require("../framework/zokou");
const conf = require("../set");
const { jidDecode } = require("@whiskeysockets/baileys");

zokou({
    nomCom: "profile",
    categorie: "Fun",
    reaction: "👤"
}, async (dest, zk, commandeOptions) => {
    const { ms, arg, repondre, auteurMessage, nomAuteurMessage, msgRepondu, auteurMsgRepondu } = commandeOptions;
    let jid = null;
    let nom = null;

    if (!msgRepondu) {
        jid = auteurMessage;
        nom = nomAuteurMessage;

        try {
            ppUrl = await zk.profilePictureUrl(jid, 'image');
        } catch {
            ppUrl = conf.IMAGE_MENU;
        }
        
        const status = await zk.fetchStatus(jid);
        const statusText = status.status || "No status set";

        await zk.sendMessage(dest, {
            image: { url: ppUrl },
            caption: '👤 *USER PROFILE*\n\n*Name:* ' + nom + '\n*Status:*\n_' + statusText + '_',
            contextInfo: {
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363353854480831@newsletter',
                    newsletterName: 'RAHMANI XMD',
                    serverMessageId: 143
                },
                forwardingScore: 999,
                externalAdReply: {
                    title: 'RAHMANI XMD',
                    body: '👤 Profile Information\n⚪ Name: ' + nom.substring(0, 20) + (nom.length > 20 ? '...' : ''),
                    thumbnailUrl: ppUrl,
                    mediaType: 1,
                    renderSmallThumbnail: true
                }
            }
        }, { quoted: ms });

    } else {
        jid = auteurMsgRepondu;
        nom = "@" + auteurMsgRepondu.split("@")[0];

        try {
            ppUrl = await zk.profilePictureUrl(jid, 'image');
        } catch {
            ppUrl = conf.IMAGE_MENU;
        }
        
        const status = await zk.fetchStatus(jid);
        const statusText = status.status || "No status set";

        await zk.sendMessage(dest, {
            image: { url: ppUrl },
            caption: '👤 *USER PROFILE*\n\n*Name:* ' + nom + '\n*Status:*\n_' + statusText + '_',
            mentions: [auteurMsgRepondu],
            contextInfo: {
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363353854480831@newsletter',
                    newsletterName: 'RAHMANI XMD',
                    serverMessageId: 143
                },
                forwardingScore: 999,
                externalAdReply: {
                    title: 'RAHMANI XMD',
                    body: '👤 Profile Information\n⚪ Name: ' + nom.replace('@', '') + (nom.length > 20 ? '...' : ''),
                    thumbnailUrl: ppUrl,
                    mediaType: 1,
                    renderSmallThumbnail: true
                }
            }
        }, { quoted: ms });
    }
});
