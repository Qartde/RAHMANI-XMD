const { zokou } = require("../framework/zokou");
const conf = require("../set");

zokou({
    nomCom: "vv4",
    categorie: "General",
    reaction: "👁️",
    desc: "Save view once media (sends to owner DM)",
    fromMe: true
}, async (dest, zk, commandeOptions) => {
    const { ms, msgRepondu, repondre, auteurMessage } = commandeOptions;

    if (!msgRepondu) {
        return repondre("❌ *Reply to a view once message!*");
    }

    try {
        // Get the actual message content
        let content = msgRepondu;
        
        // Unwrap view once if present
        if (msgRepondu.viewOnceMessageV2) {
            content = msgRepondu.viewOnceMessageV2.message;
        } else if (msgRepondu.viewOnceMessage) {
            content = msgRepondu.viewOnceMessage.message;
        }

        // Check for media
        let mediaMsg = null;
        let type = '';
        
        if (content.imageMessage) {
            mediaMsg = content.imageMessage;
            type = 'image';
        } else if (content.videoMessage) {
            mediaMsg = content.videoMessage;
            type = 'video';
        } else if (content.audioMessage) {
            mediaMsg = content.audioMessage;
            type = 'audio';
        } else if (content.stickerMessage) {
            mediaMsg = content.stickerMessage;
            type = 'sticker';
        }

        if (!mediaMsg) {
            return repondre("❌ *Not a view once message!*");
        }

        // Download
        await repondre(`⏳ *Downloading ${type}...*`);
        const mediaPath = await zk.downloadAndSaveMediaMessage(mediaMsg);

        // Owner DM
        const ownerJid = conf.NUMERO_OWNER + "@s.whatsapp.net";
        const sender = auteurMessage.split('@')[0];

        // Prepare caption
        const caption = `🗑️ *VIEW ONCE ${type.toUpperCase()}*\n👤 *From:* @${sender}`;

        // Send based on type
        if (type === 'image') {
            await zk.sendMessage(ownerJid, {
                image: { url: mediaPath },
                caption: caption,
                mentions: [auteurMessage]
            });
        } 
        else if (type === 'video') {
            await zk.sendMessage(ownerJid, {
                video: { url: mediaPath },
                caption: caption,
                mentions: [auteurMessage]
            });
        } 
        else if (type === 'audio') {
            await zk.sendMessage(ownerJid, {
                audio: { url: mediaPath },
                mimetype: 'audio/mp4'
            });
            await zk.sendMessage(ownerJid, {
                text: caption,
                mentions: [auteurMessage]
            });
        } 
        else if (type === 'sticker') {
            await zk.sendMessage(ownerJid, {
                sticker: { url: mediaPath }
            });
            await zk.sendMessage(ownerJid, {
                text: caption,
                mentions: [auteurMessage]
            });
        }

        // Clean up
        const fs = require("fs-extra");
        if (fs.existsSync(mediaPath)) fs.unlinkSync(mediaPath);

        await repondre(`✅ *View once ${type} sent to owner DM!*`);

    } catch (error) {
        console.error("❌ Error:", error);
        await repondre(`❌ *Error:* ${error.message}`);
    }
});
