const { bmbtz } = require('../../devbmb/bmbtz');
const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const { Sticker, StickerTypes } = require('wa-sticker-formatter');

bmbtz({
    nomCom: "vv",
    alias: ["view", "keep", "grab"],
    categorie: "General",
    reaction: "👁️"
}, async (dest, client, commandeOptions) => {
    const { repondre, msgRepondu } = commandeOptions;

    if (!msgRepondu) {
        return await repondre('📥 Reply to the View Once message you want to save.');
    }

    let msg;
    const contextInfo = {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: "120363353854480831@newsletter",
            newsletterName: "RAHMANI-XMD",
            serverMessageId: 1
        }
    };

    try {
        // 1. Unwrap View Once messages
        let innerMsg = msgRepondu;
        
        if (msgRepondu.viewOnceMessage?.message) {
            innerMsg = msgRepondu.viewOnceMessage.message;
        } else if (msgRepondu.viewOnceMessageV2?.message) {
            innerMsg = msgRepondu.viewOnceMessageV2.message;
        } else if (msgRepondu.viewOnceMessageV2Extension?.message) {
            innerMsg = msgRepondu.viewOnceMessageV2Extension.message;
        } else if (msgRepondu.documentWithCaptionMessage?.message) {
            innerMsg = msgRepondu.documentWithCaptionMessage.message;
        }

        // 2. Detect media type
        let mediaType = '';
        if (innerMsg.imageMessage) mediaType = 'image';
        else if (innerMsg.videoMessage) mediaType = 'video';
        else if (innerMsg.audioMessage) mediaType = 'audio';
        else if (innerMsg.stickerMessage) mediaType = 'sticker';

        if (!mediaType) {
            return await repondre('❌ Not a view once media or unsupported type!');
        }

        // 3. Download media using official Baileys downloader with reupload request
        // This handles missing media keys by requesting a re-upload from WhatsApp servers.
        const buffer = await downloadMediaMessage(
            { message: innerMsg },
            'buffer',
            {},
            { 
                logger: console, 
                reuploadRequest: client.updateMediaMessage 
            }
        );

        if (!buffer || buffer.length === 0) {
            return await repondre('❌ Failed to download media. The media might have expired.');
        }

        // 4. Prepare the message object
        if (mediaType === 'image') {
            msg = { image: buffer, caption: innerMsg.imageMessage.caption || "👁️ View Once Image", contextInfo };
        } else if (mediaType === 'video') {
            msg = { video: buffer, caption: innerMsg.videoMessage.caption || "👁️ View Once Video", contextInfo };
        } else if (mediaType === 'audio') {
            msg = { audio: buffer, mimetype: 'audio/mp4', ptt: true, contextInfo };
        } else if (mediaType === 'sticker') {
            let stickerMess = new Sticker(buffer, {
                pack: 'RAHMANI-XMD',
                type: StickerTypes.CROPPED,
                quality: 70
            });
            const stickerBuffer = await stickerMess.toBuffer();
            msg = { sticker: stickerBuffer, contextInfo };
        }

        // 5. Send the message to the chat
        await client.sendMessage(dest, msg);
        await repondre('✅ Message saved successfully!');

    } catch (error) {
        console.error("VV Error:", error);
        await repondre("❌ Failed to process the message. Please ensure you reply quickly before the media expires.");
    }
});
