const { bmbtz } = require('../../devbmb/bmbtz');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const { Sticker, StickerTypes } = require('wa-sticker-formatter');

bmbtz({
    nomCom: "vv",
    alias: ["view", "keep", "grab"],
    categorie: "General",
    reaction: "👁️"
}, async (dest, client, commandeOptions) => {
    const { repondre, msgRepondu, superUser } = commandeOptions;

    // Kagua kama ni Mods/SuperUser
    if (!superUser) {
        await repondre('❌ Only mods can use this command');
        return;
    }

    // Kagua kama kuna message iliyoreply
    if (!msgRepondu) {
        await repondre('📥 Reply to the View Once message you want to save.');
        return;
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
        // ====== HATUA YA 1: KUFUNGUA KIFUNIKO CHA VIEW ONCE ======
        let innerMsg = msgRepondu;
        
        if (msgRepondu.viewOnceMessage?.message) {
            innerMsg = msgRepondu.viewOnceMessage.message;
        } else if (msgRepondu.viewOnceMessageV2?.message) {
            innerMsg = msgRepondu.viewOnceMessageV2.message;
        } else if (msgRepondu.viewOnceMessageV2Extension?.message) {
            innerMsg = msgRepondu.viewOnceMessageV2Extension.message;
        }

        // ====== HATUA YA 2: TAMBUA AINA YA MEDIA NA VUTA FAILI ======
        if (innerMsg.imageMessage) {
            const stream = await downloadContentFromMessage(innerMsg.imageMessage, 'image');
            let buffer = Buffer.from([]);
            for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
            
            msg = { image: buffer, caption: innerMsg.imageMessage.caption || "👁️ View Once Image", contextInfo };

        } else if (innerMsg.videoMessage) {
            const stream = await downloadContentFromMessage(innerMsg.videoMessage, 'video');
            let buffer = Buffer.from([]);
            for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
            
            msg = { video: buffer, caption: innerMsg.videoMessage.caption || "👁️ View Once Video", contextInfo };

        } else if (innerMsg.audioMessage) {
            const stream = await downloadContentFromMessage(innerMsg.audioMessage, 'audio');
            let buffer = Buffer.from([]);
            for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
            
            msg = { audio: buffer, mimetype: 'audio/mp4', ptt: true, contextInfo };

        } else if (innerMsg.stickerMessage) {
            const stream = await downloadContentFromMessage(innerMsg.stickerMessage, 'sticker');
            let buffer = Buffer.from([]);
            for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
            
            let stickerMess = new Sticker(buffer, {
                pack: 'RAHMANI-XMD',
                type: StickerTypes.CROPPED,
                quality: 70
            });
            const stickerBuffer = await stickerMess.toBuffer();
            msg = { sticker: stickerBuffer, contextInfo };

        } else {
            // Kama ni text tu
            msg = { text: innerMsg.conversation || innerMsg.extendedTextMessage?.text || "📝 Message copied", contextInfo };
        }

        // ====== HATUA YA 3: TUMA ======
        await client.sendMessage(dest, msg);
        await repondre('✅ Message saved successfully!');

    } catch (error) {
        console.error("VV Error:", error);
        
        // Kama ikigoma, toa ujumbe mzuri badala ya ile error ya kiufundi
        if (error.message.includes("media key") || error.message.includes("empty")) {
            await repondre("❌ *Imeshindwa!* Pengine mtandao umecatalika au muda wa View Once umekwisha. Jaribu tena.");
        } else {
            await repondre("❌ *Failed to process the message.* Try again.");
        }
    }
});
