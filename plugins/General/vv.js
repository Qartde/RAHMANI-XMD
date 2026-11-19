const { bmbtz } = require('../../devbmb/bmbtz');
const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const fs = require('fs-extra');

bmbtz({
    nomCom: "vv",
    alias: ["viewonce", "save", "keep"],
    categorie: "General",
    reaction: "👁️"
}, async (dest, client, commandeOptions) => {
    const { repondre, msgRepondu, auteurMessage } = commandeOptions;

    if (!msgRepondu) {
        return await repondre('📥 *Reply to the View Once message you want to save.*');
    }

    try {
        // 1. Unwrap the View Once message container
        let innerMsg = msgRepondu;
        
        if (msgRepondu.viewOnceMessage?.message) {
            innerMsg = msgRepondu.viewOnceMessage.message;
        } else if (msgRepondu.viewOnceMessageV2?.message) {
            innerMsg = msgRepondu.viewOnceMessageV2.message;
        } else if (msgRepondu.viewOnceMessageV2Extension?.message) {
            innerMsg = msgRepondu.viewOnceMessageV2Extension.message;
        }

        // 2. Identify media type
        let mediaType = '';
        if (innerMsg.imageMessage) mediaType = 'image';
        else if (innerMsg.videoMessage) mediaType = 'video';
        else if (innerMsg.audioMessage) mediaType = 'audio';

        if (!mediaType) {
            return await repondre('❌ *This is not a View Once image, video, or audio.*');
        }

        await repondre('⏳ *Processing media, please wait...*');

        // 3. Download the media stream
        const stream = await downloadMediaMessage(
            { message: innerMsg, key: msgRepondu.key },
            'stream',
            {},
            { logger: console, reuploadRequest: client.updateMediaMessage }
        );

        // 4. Convert stream to Buffer safely
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }

        if (!buffer || buffer.length === 0) {
            return await repondre('❌ *Failed to download. The media might have expired.*');
        }

        const contextInfo = {
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: "120363353854480831@newsletter",
                newsletterName: "RAHMANI-XMD",
                serverMessageId: 1
            }
        };

        let msgToSend;
        if (mediaType === 'image') {
            msgToSend = {
                image: buffer,
                caption: innerMsg.imageMessage.caption || "👁️ *View Once Image Saved*",
                contextInfo
            };
        } else if (mediaType === 'video') {
            msgToSend = {
                video: buffer,
                caption: innerMsg.videoMessage.caption || "👁️ *View Once Video Saved*",
                contextInfo
            };
        } else if (mediaType === 'audio') {
            msgToSend = {
                audio: buffer,
                mimetype: 'audio/mp4',
                ptt: true, // Send as voice note
                contextInfo
            };
        }

        // 5. Send the saved media back to the chat
        await client.sendMessage(dest, msgToSend);
        await repondre('✅ *Success!* Media saved permanently.');

    } catch (error) {
        console.error("VV Error Details:", error);
        
        // Custom error handler to give useful feedback
        if (error.message.includes("decrypt")) {
            await repondre("❌ *Decryption failed.* The media key is invalid or expired.");
        } else {
            await repondre("❌ *Failed to process.* Ensure you are replying to a fresh View Once message and your Baileys is updated.");
        }
    }
});
