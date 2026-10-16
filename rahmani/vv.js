const { zokou } = require("../framework/zokou");
const conf = require("../set");
const fs = require("fs-extra");

zokou({
    nomCom: "vv",
    categorie: "General",
    reaction: "👁️",
    desc: "Save view once media (sends to owner DM)",
    fromMe: false
}, async (dest, zk, commandeOptions) => {
    const { ms, msgRepondu, repondre, auteurMessage } = commandeOptions;

    if (!msgRepondu) {
        return repondre("❌ *Reply to a view once message!*");
    }

    await zk.sendMessage(dest, { react: { text: "👁️", key: ms.key } }).catch(() => {});

    try {
        // ============================================
        //   🧠 SMART UNWRAP — Inatambua kila aina
        // ============================================
        let content = msgRepondu;

        // 1) viewOnceMessageV2
        if (content?.viewOnceMessageV2) {
            content = content.viewOnceMessageV2.message;
        }

        // 2) viewOnceMessageV2Extension (mpya ya WhatsApp)
        if (content?.viewOnceMessageV2Extension) {
            content = content.viewOnceMessageV2Extension.message;
        }

        // 3) viewOnceMessage (version ya zamani)
        if (content?.viewOnceMessage) {
            content = content.viewOnceMessage.message;
        }

        // 4) ephemeralMessage (inayotoweka)
        if (content?.ephemeralMessage) {
            content = content.ephemeralMessage.message;
        }

        // 5) documentWithCaptionMessage
        if (content?.documentWithCaptionMessage) {
            content = content.documentWithCaptionMessage.message;
        }

        // 6) message wrapper (kama ipo)
        if (content?.message) {
            content = content.message;
        }

        // 7) Rekebisha mara moja tena — kwa nested
        if (content?.viewOnceMessageV2) {
            content = content.viewOnceMessageV2.message;
        }
        if (content?.viewOnceMessage) {
            content = content.viewOnceMessage.message;
        }

        // ============================================
        //   📦 CHECK ALL MEDIA TYPES
        // ============================================
        let mediaMsg = null;
        let type = '';

        if (content?.imageMessage) {
            mediaMsg = content.imageMessage;
            type = 'image';
        } else if (content?.videoMessage) {
            mediaMsg = content.videoMessage;
            type = 'video';
        } else if (content?.audioMessage) {
            mediaMsg = content.audioMessage;
            type = 'audio';
        } else if (content?.stickerMessage) {
            mediaMsg = content.stickerMessage;
            type = 'sticker';
        } else if (content?.documentMessage) {
            mediaMsg = content.documentMessage;
            type = 'document';
        } else if (content?.ptvMessage) {
            // Video note (video ya duara)
            mediaMsg = content.ptvMessage;
            type = 'video';
        }

        if (!mediaMsg) {
            await zk.sendMessage(dest, { react: { text: "❌", key: ms.key } }).catch(() => {});
            return repondre("❌ *Not a supported view once message!*");
        }

        await repondre(`⏳ *Downloading ${type}...*`);

        // ============================================
        //   📥 DOWNLOAD MEDIA
        // ============================================
        let mediaPath;
        try {
            mediaPath = await zk.downloadAndSaveMediaMessage(mediaMsg);
            if (!mediaPath || !fs.existsSync(mediaPath)) {
                throw new Error("Download failed");
            }
        } catch (e) {
            await zk.sendMessage(dest, { react: { text: "❌", key: ms.key } }).catch(() => {});
            return repondre("❌ *Failed to download media!*");
        }

        // ============================================
        //   📤 SEND TO OWNER DM
        // ============================================
        const ownerJid = conf.NUMERO_OWNER + "@s.whatsapp.net";
        const sender = auteurMessage.split('@')[0];
        const timestamp = new Date().toLocaleString();

        const caption = `👁️ *VIEW ONCE ${type.toUpperCase()}*\n\n👤 *From:* @${sender}\n📱 *JID:* ${auteurMessage}\n🕐 *Time:* ${timestamp}`;

        const mediaBuffer = fs.readFileSync(mediaPath);

        if (type === 'image') {
            await zk.sendMessage(ownerJid, {
                image: mediaBuffer,
                caption: caption,
                mentions: [auteurMessage]
            });
        } else if (type === 'video') {
            await zk.sendMessage(ownerJid, {
                video: mediaBuffer,
                caption: caption,
                mentions: [auteurMessage]
            });
        } else if (type === 'audio') {
            await zk.sendMessage(ownerJid, {
                audio: mediaBuffer,
                mimetype: 'audio/mp4',
                ptt: false
            });
            await zk.sendMessage(ownerJid, {
                text: caption,
                mentions: [auteurMessage]
            });
        } else if (type === 'sticker') {
            await zk.sendMessage(ownerJid, {
                sticker: mediaBuffer
            });
            await zk.sendMessage(ownerJid, {
                text: caption,
                mentions: [auteurMessage]
            });
        } else if (type === 'document') {
            await zk.sendMessage(ownerJid, {
                document: mediaBuffer,
                mimetype: mediaMsg.mimetype || 'application/octet-stream',
                fileName: mediaMsg.fileName || `view_once_${Date.now()}`,
                caption: caption,
                mentions: [auteurMessage]
            });
        }

        // ============================================
        //   🗑️ CLEANUP
        // ============================================
        if (fs.existsSync(mediaPath)) fs.unlinkSync(mediaPath);

        await zk.sendMessage(dest, { react: { text: "✅", key: ms.key } }).catch(() => {});
        await repondre(`✅ *View once ${type} sent to owner DM!*`);

    } catch (error) {
        console.error("❌ VV Error:", error);
        await zk.sendMessage(dest, { react: { text: "❌", key: ms.key } }).catch(() => {});
        await repondre(`❌ *Error:* ${error.message}`);
    }
});
