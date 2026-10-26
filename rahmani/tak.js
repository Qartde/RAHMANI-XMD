const { zokou } = require("../framework/zokou");
const conf = require("../set");
const { Sticker, StickerTypes } = require('wa-sticker-formatter');
const fs = require("fs-extra");

zokou({
    nomCom: "take",
    categorie: "Tools",
    reaction: "🎨",
    desc: "Take/Change sticker or image pack name and author",
    fromMe: false
}, async (dest, client, cmd) => {
    const { ms, arg, repondre, msgRepondu } = cmd;

    // 1. Hakikisha kuna message iliyoreplywa
    if (!msgRepondu) {
        return repondre("❌ *Please reply to an image or a sticker!*");
    }

    // 2. Chukua maandishi ya jina na mwandishi
    // Mfano: .take MyPack | MyName
    let packName = conf.BOT_NAME || "RAHMANI-XMD";
    let authorName = conf.OWNER_NAME || "Qartde";

    if (arg.length > 0) {
        const text = arg.join(" ");
        if (text.includes("|")) {
            const parts = text.split("|");
            packName = parts[0].trim();
            authorName = parts[1].trim();
        } else {
            packName = text;
        }
    }

    // 3. Angalia aina ya media (Sticker au Image)
    const type = Object.keys(msgRepondu)[0];
    let media = null;

    if (type === "stickerMessage") {
        media = msgRepondu.stickerMessage;
    } else if (type === "imageMessage") {
        media = msgRepondu.imageMessage;
    } else {
        return repondre("❌ *Please reply to a sticker or an image only.*");
    }

    await repondre("⏳ *Processing...*");

    try {
        // 4. Download media
        const mediaPath = await client.downloadAndSaveMediaMessage(media);

        // 5. Convert kuwa Sticker na weka jina jipya
        const sticker = new Sticker(mediaPath, {
            pack: packName,
            author: authorName,
            type: StickerTypes.FULL,
            quality: 70
        });

        const buffer = await sticker.toBuffer();

        // 6. Tuma sticker mpya
        await client.sendMessage(dest, { sticker: buffer }, { quoted: ms });

        // 7. Futa file la muda
        if (fs.existsSync(mediaPath)) fs.unlinkSync(mediaPath);

    } catch (e) {
        console.error("Take Error:", e.message);
        await repondre(`❌ *Error:* ${e.message}`);
    }
});
