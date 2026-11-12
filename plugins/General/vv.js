const { bmbtz } = require("../../devbmb/bmbtz");
const conf = require("../../settings");
const fs = require("fs-extra");
const { downloadMediaMessage } = require("@whiskeysockets/baileys");

bmbtz({
    nomCom: "vv",
    categorie: "General",
    reaction: "👁️",
    desc: "Save view once media (sends to chat)",
    fromMe: false 
}, async (dest, client, commandeOptions) => {
    const { ms, msgRepondu, repondre, auteurMessage } = commandeOptions;

    if (!msgRepondu) {
        return repondre("❌ *Reply to a view once message!*");
    }

    try {
        // ====== HATUA MUHIMU: Kufungua View Once Message ======
        // Hii inahakikisha tunapata ujumbe halisi wa media ndani ya "kifuniko" cha view once
        let messageContent = msgRepondu;
        if (msgRepondu.viewOnceMessage?.message) {
            messageContent = msgRepondu.viewOnceMessage.message;
        } else if (msgRepondu.viewOnceMessageV2?.message) {
            messageContent = msgRepondu.viewOnceMessageV2.message;
        } else if (msgRepondu.viewOnceMessageV2Extension?.message) {
            messageContent = msgRepondu.viewOnceMessageV2Extension.message;
        }

        // ====== TAMBUA AINA YA MEDIA ======
        let type = '';
        if (messageContent.imageMessage) {
            type = 'image';
        } else if (messageContent.videoMessage) {
            type = 'video';
        } else if (messageContent.audioMessage) {
            type = 'audio';
        } else {
            return repondre("❌ *Not a view once media or unsupported type!*");
        }

        await repondre(`⏳ *Downloading ${type}...*`);

        // ====== TUMIA downloadMediaMessage BADALA YA downloadContentFromMessage ======
        // Hii ni imara zaidi na inashughulikia changamoto za media key
        const buffer = await downloadMediaMessage(
            { message: messageContent }, // Tunatuma ujumbe uliofunguliwa
            'buffer',
            {},
            { 
                logger: console, 
                reuploadRequest: client.updateMediaMessage 
            }
        );

        if (!buffer || buffer.length === 0) {
            return repondre("❌ *Download failed!*");
        }

        const fileSizeMB = (buffer.length / 1024 / 1024).toFixed(2);

        // ====== TAARIFA ZA MTUMIAJI ======
        const contextInfo = ms.message?.extendedTextMessage?.contextInfo;
        const senderJid = contextInfo?.participant || auteurMessage || "";
        const sender = senderJid ? senderJid.split('@')[0] : "Unknown";

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

        // ====== TUMA KWA CHAT YA SASA ======
        if (type === 'image') {
            await client.sendMessage(dest, {
                image: buffer,
                caption,
                mentions: [senderJid],
                contextInfo: contextInfoPreview
            });
        } else if (type === 'video') {
            await client.sendMessage(dest, {
                video: buffer,
                caption,
                mentions: [senderJid],
                contextInfo: contextInfoPreview
            });
        } else if (type === 'audio') {
            await client.sendMessage(dest, {
                audio: buffer,
                mimetype: 'audio/mpeg',
                ptt: false
            });
            await client.sendMessage(dest, {
                text: caption,
                mentions: [senderJid],
                contextInfo: contextInfoPreview
            });
        }

        await repondre(`✅ *Success!* ${type} sent.`);

    } catch (error) {
        console.error("❌ VV Error:", error);
        await repondre(`❌ *Error:* ${error.message}`);
    }
});
