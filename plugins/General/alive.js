const { bmbtz } = require("../../devbmb/bmbtz");
const conf = require("../../settings");
const fs = require("fs-extra");
const { downloadContentFromMessage } = require("@whiskeysockets/baileys");

bmbtz({
    nomCom: "vv2",
    categorie: "General",
    reaction: "👁️",
    desc: "Save view once media (sends to owner DM)",
    fromMe: true
}, async (dest, client, commandeOptions) => {
    const { ms, msgRepondu, repondre, auteurMessage } = commandeOptions;

    if (!msgRepondu) {
        return repondre("❌ *Reply to a view once message!*");
    }

    try {
        let inner = msgRepondu;
        if (msgRepondu.viewOnceMessage?.message) {
            inner = msgRepondu.viewOnceMessage.message;
        } else if (msgRepondu.viewOnceMessageV2?.message) {
            inner = msgRepondu.viewOnceMessageV2.message;
        } else if (msgRepondu.viewOnceMessageV2Extension?.message) {
            inner = msgRepondu.viewOnceMessageV2Extension.message;
        }

        let type = '';
        let mediaMsg = null;

        if (inner.imageMessage) {
            type = 'image';
            mediaMsg = inner.imageMessage;
        } else if (inner.videoMessage) {
            type = 'video';
            mediaMsg = inner.videoMessage;
        } else if (inner.audioMessage) {
            type = 'audio';
            mediaMsg = inner.audioMessage;
        } else {
            return repondre("❌ *Not a view once media or unsupported type!*");
        }

        await repondre(`⏳ *Downloading ${type}...*`);

        const stream = await downloadContentFromMessage(mediaMsg, type);
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }

        if (!buffer || buffer.length === 0) {
            return repondre("❌ *Download failed!*");
        }

        const fileSizeMB = (buffer.length / 1024 / 1024).toFixed(2);

        const contextInfo = ms.message?.extendedTextMessage?.contextInfo;
        const senderJid = contextInfo?.participant || auteurMessage || "";
        const sender = senderJid ? senderJid.split('@')[0] : "Unknown";

        let ownerNumber = conf.NUMERO_OWNER || "255693629079";
        ownerNumber = String(ownerNumber).replace(/[^0-9]/g, '');
        const ownerJid = ownerNumber + "@s.whatsapp.net";

        // ====== CAPTION FUPI ======
        const caption = `👁️ *View Once ${type.toUpperCase()}*\n👤 @${sender} | 💾 ${fileSizeMB} MB`;

        const contextInfoPreview = {
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: "120363353854480831@newsletter",
                newsletterName: "RAHMANI-XMD",
                serverMessageId: 1
            }
        };

        if (type === 'image') {
            await client.sendMessage(ownerJid, {
                image: buffer,
                caption,
                mentions: [senderJid],
                contextInfo: contextInfoPreview
            });
        } else if (type === 'video') {
            await client.sendMessage(ownerJid, {
                video: buffer,
                caption,
                mimetype: mediaMsg.mimetype || 'video/mp4',
                mentions: [senderJid],
                contextInfo: contextInfoPreview
            });
        } else if (type === 'audio') {
            await client.sendMessage(ownerJid, {
                audio: buffer,
                mimetype: mediaMsg.mimetype || 'audio/mpeg',
                ptt: false
            });
            await client.sendMessage(ownerJid, {
                text: caption,
                mentions: [senderJid],
                contextInfo: contextInfoPreview
            });
        }

        // ====== SUCCESS MESSAGE FUPI SANA ======
        await repondre(`✅ *Success!* ${type} sent to owner DM.`);

    } catch (error) {
        console.error("❌ VV Error:", error);
        await repondre(`❌ *Error:* ${error.message}`);
    }
});
