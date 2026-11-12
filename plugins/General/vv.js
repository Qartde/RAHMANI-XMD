const { bmbtz } = require('../../devbmb/bmbtz');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
let { Sticker, StickerTypes } = require('wa-sticker-formatter');

bmbtz({
    nomCom: "vv",
    alias: ["view", "keep", "grab"],
    categorie: "General"
}, async (dest, client, commandeOptions) => {
    const { repondre, msgRepondu, superUser } = commandeOptions;

    // Check kama ni superUser
    if (!superUser) {
        await repondre('❌ Only mods can use this command');
        return;
    }

    // Check kama kuna message iliyoreply
    if (!msgRepondu) {
        await repondre('📥 Reply to the message you want to save');
        return;
    }

    let msg;
    const contextInfo = {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: "120363353854480831@newsletter", // Nimebadilisha kuwa yako
            newsletterName: "RAHMANI-XMD",
            serverMessageId: 1
        }
    };

    // quoted contact
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

    try {
        // ====== HATUA MUHIMU: KUFUNGUA KIFUNIKO CHA VIEW ONCE ======
        let innerMsg = msgRepondu;
        if (msgRepondu.viewOnceMessage?.message) {
            innerMsg = msgRepondu.viewOnceMessage.message;
        } else if (msgRepondu.viewOnceMessageV2?.message) {
            innerMsg = msgRepondu.viewOnceMessageV2.message;
        } else if (msgRepondu.viewOnceMessageV2Extension?.message) {
            innerMsg = msgRepondu.viewOnceMessageV2Extension.message;
        }

        // Handle image message
        if (innerMsg.imageMessage) {
            const stream = await downloadContentFromMessage(innerMsg.imageMessage, 'image');
            let buffer = Buffer.from([]);
            for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

            msg = {
                image: buffer,
                caption: innerMsg.imageMessage.caption || "",
                contextInfo
            };

        // Handle video message
        } else if (innerMsg.videoMessage) {
            const stream = await downloadContentFromMessage(innerMsg.videoMessage, 'video');
            let buffer = Buffer.from([]);
            for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

            msg = {
                video: buffer,
                caption: innerMsg.videoMessage.caption || "",
                mimetype: 'video/mp4',
                contextInfo
            };

        // Handle audio message
        } else if (innerMsg.audioMessage) {
            const stream = await downloadContentFromMessage(innerMsg.audioMessage, 'audio');
            let buffer = Buffer.from([]);
            for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

            msg = {
                audio: buffer,
                mimetype: 'audio/mp4',
                contextInfo
            };

        // Handle sticker message
        } else if (innerMsg.stickerMessage) {
            const stream = await downloadContentFromMessage(innerMsg.stickerMessage, 'sticker');
            let buffer = Buffer.from([]);
            for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

            let stickerMess = new Sticker(buffer, {
                pack: 'RAHMANI-XMD',
                type: StickerTypes.CROPPED,
                categories: ["🤩", "🎉"],
                id: "12345",
                quality: 70,
                background: "transparent"
            });
            const stickerBuffer2 = await stickerMess.toBuffer();
            msg = { sticker: stickerBuffer2, contextInfo };

        // Handle text message
        } else {
            msg = { 
                text: innerMsg.conversation || innerMsg.extendedTextMessage?.text || "📝 Message copied",
                contextInfo 
            };
        }

        // Tuma hapo hapo kwenye chat
        await client.sendMessage(dest, msg, { quoted: quotedContact });
        
        await repondre('✅ Message saved successfully!');

    } catch (error) {
        console.error("Error processing the message:", error);
        await repondre("❌ Failed to process the message. Try again.");
    }
});
