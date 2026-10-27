const { zokou } = require("../framework/zokou");
const { Sticker, StickerTypes } = require('wa-sticker-formatter');
const fs = require("fs-extra");
const conf = require("../set");

// ═══════════════════════════════════════════════
//   ⚡ RAHMANI-XMD : GROUP MANAGEMENT
// ═══════════════════════════════════════════════

// 1. TAGALL
zokou({ nomCom: "tagall", categorie: 'Group', reaction: "📣" }, async (dest, zk, cmd) => {
    const { ms, repondre, arg, verifGroupe, nomGroupe, infosGroupe, nomAuteurMessage, verifAdmin, superUser } = cmd;

    if (!verifGroupe) return repondre("❌ *This command is for groups only!*");
    if (!verifAdmin && !superUser) return repondre("❌ *Only admins can use this command!*");

    const mess = arg && arg[0] ? arg.join(' ') : 'No Message Provided';
    const membresGroupe = infosGroupe.participants;

    let tag = `📣 *TAG ALL*\n\n`;
    tag += `👥 *Group:* ${nomGroupe}\n`;
    tag += `👤 *Author:* ${nomAuteurMessage}\n`;
    tag += `📜 *Message:* ${mess}\n\n`;

    const emoji = ['🦴', '👀', '😮‍💨', '❌', '✔️', '😇', '⚙️', '🔧', '🎊', '😡', '🙏🏿', '⛔️', '$','😟','🥵','🐅'];
    
    for (const membre of membresGroupe) {
        const randomEmoji = emoji[Math.floor(Math.random() * emoji.length)];
        tag += `${randomEmoji} @${membre.id.split("@")[0]}\n`;
    }

    await zk.sendMessage(dest, { text: tag, mentions: membresGroupe.map((i) => i.id) }, { quoted: ms });
});

// 2. LINK
zokou({ nomCom: "link", categorie: 'Group', reaction: "🙋" }, async (dest, zk, cmd) => {
    const { repondre, nomGroupe, verifGroupe } = cmd;
    
    if (!verifGroupe) return repondre("❌ *This command is for groups only!*");

    try {
        const linkCode = await zk.groupInviteCode(dest);
        await repondre(`🔗 *Group Link*\n\n👥 ${nomGroupe}\n🔗 https://chat.whatsapp.com/${linkCode}`);
    } catch (e) {
        await repondre("❌ *Failed to get group link. Make sure I am an admin.*");
    }
});

// 3. PROMOTE
zokou({ nomCom: "promote", categorie: 'Group', reaction: "👨🏿‍💼" }, async (dest, zk, cmd) => {
    const { repondre, msgRepondu, auteurMsgRepondu, verifAdmin, superUser } = cmd;

    if (!verifAdmin && !superUser) return repondre("❌ *Only admins can use this command!*");
    if (!msgRepondu) return repondre("❌ *Please reply to the person you want to promote.*");

    try {
        await zk.groupParticipantsUpdate(dest, [auteurMsgRepondu], "promote");
        await zk.sendMessage(dest, { text: `👑 @${auteurMsgRepondu.split("@")[0]} is now an admin.`, mentions: [auteurMsgRepondu] });
    } catch (e) {
        await repondre("❌ *Failed to promote. Make sure I am an admin.*");
    }
});

// 4. DEMOTE
zokou({ nomCom: "demote", categorie: 'Group', reaction: "👨🏿‍💼" }, async (dest, zk, cmd) => {
    const { repondre, msgRepondu, auteurMsgRepondu, verifAdmin, superUser } = cmd;

    if (!verifAdmin && !superUser) return repondre("❌ *Only admins can use this command!*");
    if (!msgRepondu) return repondre("❌ *Please reply to the person you want to demote.*");

    try {
        await zk.groupParticipantsUpdate(dest, [auteurMsgRepondu], "demote");
        await zk.sendMessage(dest, { text: `👤 @${auteurMsgRepondu.split("@")[0]} is no longer an admin.`, mentions: [auteurMsgRepondu] });
    } catch (e) {
        await repondre("❌ *Failed to demote. Make sure I am an admin.*");
    }
});

// 5. REMOVE (KICK)
zokou({ nomCom: "remove", categorie: 'Group', reaction: "🚫" }, async (dest, zk, cmd) => {
    const { repondre, msgRepondu, auteurMsgRepondu, verifAdmin, superUser } = cmd;

    if (!verifAdmin && !superUser) return repondre("❌ *Only admins can use this command!*");
    if (!msgRepondu) return repondre("❌ *Please reply to the person you want to remove.*");

    try {
        await zk.groupParticipantsUpdate(dest, [auteurMsgRepondu], "remove");
        await zk.sendMessage(dest, { text: `🚫 @${auteurMsgRepondu.split("@")[0]} has been removed from the group.`, mentions: [auteurMsgRepondu] });
    } catch (e) {
        await repondre("❌ *Failed to remove. Make sure I am an admin.*");
    }
});

// 6. DEL (Delete Message)
zokou({ nomCom: "del", categorie: 'Group', reaction: "🧹" }, async (dest, zk, cmd) => {
    const { ms, repondre, verifAdmin, superUser, msgRepondu } = cmd;

    if (!verifAdmin && !superUser) return repondre("❌ *Only admins can use this command!*");
    if (!msgRepondu) return repondre("❌ *Please reply to the message you want to delete.*");

    try {
        const key = {
            remoteJid: dest,
            fromMe: false,
            id: ms.message.extendedTextMessage.contextInfo.stanzaId,
            participant: ms.message.extendedTextMessage.contextInfo.participant
        };
        await zk.sendMessage(dest, { delete: key });
    } catch (e) {
        await repondre("❌ *Failed to delete message. I need admin rights.*");
    }
});

// 7. INFO
zokou({ nomCom: "info", categorie: 'Group' }, async (dest, zk, cmd) => {
    const { ms, repondre, verifGroupe } = cmd;
    
    if (!verifGroupe) return repondre("❌ *This command is for groups only!*");

    try { 
        let ppgroup = await zk.profilePictureUrl(dest, 'image'); 
        const info = await zk.groupMetadata(dest);
        let mess = {
            image: { url: ppgroup },
            caption: `📊 *GROUP INFO*\n\n🎐 *Name:* ${info.subject}\n🔩 *ID:* ${dest}\n📝 *Description:*\n${info.desc || "No description"}`
        };
        await zk.sendMessage(dest, mess, { quoted: ms });
    } catch (e) {
        await repondre("❌ *Failed to get group info.*");
    }
});

// 8. ANTIBOT
const { atbajouterOuMettreAJourJid, atbverifierEtatJid } = require("../bdd/antibot");
zokou({ nomCom: "antibot", categorie: 'Group', reaction: "😬" }, async (dest, zk, cmd) => {
    const { repondre, arg, verifGroupe, superUser, verifAdmin } = cmd;

    if (!verifGroupe) return repondre("❌ *This command is for groups only!*");
    if (!superUser && !verifAdmin) return repondre("❌ *Only admins can use this command!*");

    const isEnabled = await atbverifierEtatJid(dest);

    if (!arg || !arg[0]) {
        return repondre(`🛡️ *ANTIBOT SETTINGS*\n\nStatus: ${isEnabled ? "🟢 ON" : "🔴 OFF"}\n\nCommands:\n.antibot on\n.antibot off`);
    }

    if (arg[0] === 'on') {
        if (isEnabled) return repondre("⚠️ *Antibot is already active.*");
        await atbajouterOuMettreAJourJid(dest, "oui");
        return repondre("✅ *Antibot activated successfully.*");
    } else if (arg[0] === "off") {
        if (!isEnabled) return repondre("⚠️ *Antibot is already disabled.*");
        await atbajouterOuMettreAJourJid(dest, "non");
        return repondre("✅ *Antibot deactivated successfully.*");
    } else {
        return repondre("❌ *Invalid option. Use on or off.*");
    }
});

// 9. GROUP OPEN/CLOSE
zokou({ nomCom: "group", categorie: 'Group' }, async (dest, zk, cmd) => {
    const { repondre, verifGroupe, verifAdmin, superUser, arg } = cmd;

    if (!verifGroupe) return repondre("❌ *This command is for groups only!*");
    if (!superUser && !verifAdmin) return repondre("❌ *Only admins can use this command!*");

    if (!arg[0]) return repondre('❌ *Use: .group open or .group close*');
    
    const option = arg.join(' ').toLowerCase();
    if (option === "open") {
        await zk.groupSettingUpdate(dest, 'not_announcement');
        await repondre('🔓 *Group opened.*');
    } else if (option === "close") {
        await zk.groupSettingUpdate(dest, 'announcement');
        await repondre('🔒 *Group closed.*');
    } else {
        await repondre("❌ *Invalid option. Use open or close.*");
    }
});

// 10. LEFT
zokou({ nomCom: "left", categorie: "Group" }, async (dest, zk, cmd) => {
    const { repondre, verifGroupe, superUser } = cmd;

    if (!verifGroupe) return repondre("❌ *This command is for groups only!*");
    if (!superUser) return repondre("❌ *This command is for the bot owner only!*");

    await repondre('👋 *Goodbye!*');
    await zk.groupLeave(dest);
});

// 11. GNAME
zokou({ nomCom: "gname", categorie: 'Group' }, async (dest, zk, cmd) => {
    const { arg, repondre, verifAdmin } = cmd;

    if (!verifAdmin) return repondre("❌ *Only admins can use this command!*");
    if (!arg[0]) return repondre("❌ *Please provide a new group name.*");

    const nom = arg.join(' ');
    await zk.groupUpdateSubject(dest, nom);
    await repondre(`✅ *Group name updated to:* ${nom}`);
});

// 12. GDESC
zokou({ nomCom: "gdesc", categorie: 'Group' }, async (dest, zk, cmd) => {
    const { arg, repondre, verifAdmin } = cmd;

    if (!verifAdmin) return repondre("❌ *Only admins can use this command!*");
    if (!arg[0]) return repondre("❌ *Please provide a new group description.*");

    const nom = arg.join(' ');
    await zk.groupUpdateDescription(dest, nom);
    await repondre(`✅ *Group description updated.*`);
});

// 13. GPP
zokou({ nomCom: "gpp", categorie: 'Group' }, async (dest, zk, cmd) => {
    const { repondre, msgRepondu, verifAdmin } = cmd;

    if (!verifAdmin) return repondre("❌ *Only admins can use this command!*");
    if (!msgRepondu || !msgRepondu.imageMessage) return repondre("❌ *Please reply to an image.*");

    try {
        const pp = await zk.downloadAndSaveMediaMessage(msgRepondu.imageMessage);
        await zk.updateProfilePicture(dest, { url: pp });
        fs.unlinkSync(pp);
        await zk.sendMessage(dest, { text: "✅ *Group profile picture changed.*" });
    } catch (e) {
        await repondre("❌ *Failed to change group picture.*");
    }
});

// 14. HIDETAG
zokou({ nomCom: "hidetag", categorie: 'Group', reaction: "🎤" }, async (dest, zk, cmd) => {
    const { repondre, msgRepondu, verifGroupe, arg, verifAdmin, superUser } = cmd;

    if (!verifGroupe) return repondre('❌ *This command is for groups only!*');
    if (!verifAdmin && !superUser) return repondre('❌ *Only admins can use this command!*');

    const metadata = await zk.groupMetadata(dest);
    const tag = metadata.participants.map(p => p.id);

    if (msgRepondu) {
        let msg;
        if (msgRepondu.imageMessage) {
            const media = await zk.downloadAndSaveMediaMessage(msgRepondu.imageMessage);
            msg = { image: { url: media }, caption: msgRepondu.imageMessage.caption, mentions: tag };
        } else if (msgRepondu.videoMessage) {
            const media = await zk.downloadAndSaveMediaMessage(msgRepondu.videoMessage);
            msg = { video: { url: media }, caption: msgRepondu.videoMessage.caption, mentions: tag };
        } else if (msgRepondu.audioMessage) {
            const media = await zk.downloadAndSaveMediaMessage(msgRepondu.audioMessage);
            msg = { audio: { url: media }, mimetype: 'audio/mp4', mentions: tag };
        } else if (msgRepondu.stickerMessage) {
            const media = await zk.downloadAndSaveMediaMessage(msgRepondu.stickerMessage);
            let stickerMess = new Sticker(media, { pack: 'RAHMANI-XMD', type: StickerTypes.CROPPED, quality: 70 });
            const stickerBuffer = await stickerMess.toBuffer();
            msg = { sticker: stickerBuffer, mentions: tag };
        } else {
            msg = { text: msgRepondu.conversation, mentions: tag };
        }
        await zk.sendMessage(dest, msg);
    } else {
        if (!arg || !arg[0]) return repondre('❌ *Please provide text or reply to a message.*');
        await zk.sendMessage(dest, { text: arg.join(' '), mentions: tag });
    }
});
