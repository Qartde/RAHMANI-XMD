const { zokou } = require("../framework/zokou");
const conf = require("../set");
const { Sticker, StickerTypes } = require('wa-sticker-formatter');
const fs = require("fs-extra");

zokou({
    nomCom: "sticker",
    categorie: "Tools",
    reaction: "🎨",
    desc: "Convert image or short video to sticker",
    fromMe: false
}, async (dest, client, cmd) => {
    const { ms, repondre, msgRepondu } = cmd;

    // 1. Check if replying to a message
    if (!msgRepondu) {
        return repondre("❌ *Please reply to an image or a short video!*");
    }

    // 2. Check media type
    const type = Object.keys(msgRepondu)[0];
    let media = null;

    if (type === "imageMessage") {
        media = msgRepondu.imageMessage;
    } else if (type === "videoMessage") {
        media = msgRepondu.videoMessage;
    } else {
        return repondre("❌ *Please reply to an image or a short video only.*");
    }

    await repondre("⏳ *Creating sticker...*");

    try {
        // 3. Download the media
        const mediaPath = await client.downloadAndSaveMediaMessage(media);

        // 4. Create sticker
        const sticker = new Sticker(mediaPath, {
            pack: conf.BOT_NAME || "RAHMANI-XMD",
            author: conf.OWNER_NAME || "Qartde",
            type: StickerTypes.FULL,
            quality: 70
        });

        // 5. Convert to buffer
        const buffer = await sticker.toBuffer();

        // 6. Send the sticker
        await client.sendMessage(dest, { sticker: buffer }, { quoted: ms });

        // 7. Delete temporary file
        if (fs.existsSync(mediaPath)) fs.unlinkSync(mediaPath);

    } catch (e) {
        console.error("Sticker Error:", e.message);
        await repondre(`❌ *Error:* ${e.message}`);
    }
});
