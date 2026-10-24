const { zokou } = require("../framework/zokou");
const conf = require("../set");

// ═══════════════════════════════════════════════
//   ⚡ RAHMANI-XMD : GROUP MANAGEMENT
// ═══════════════════════════════════════════════

// Helper function ya kupata Target JID (Reply au Number)
function getTargetJid(arg, msgRepondu, auteurMsgRepondu) {
    if (msgRepondu) {
        return { jid: auteurMsgRepondu, name: auteurMsgRepondu.split('@')[0] };
    }
    if (arg && arg[0]) {
        const number = arg[0].replace(/[^0-9]/g, "");
        if (number.length >= 10) {
            return { jid: `${number}@s.whatsapp.net`, name: number };
        }
    }
    return null;
}

// ═══════════════════════════════════════════════
//   1. ADD USER
// ═══════════════════════════════════════════════
zokou({
    nomCom: "add",
    categorie: "Group",
    reaction: "➕",
    desc: "Add a user to the group",
    fromMe: false
}, async (dest, client, cmd) => {
    const { arg, ms, repondre, verifGroupe, verifAdmin, superUser } = cmd;

    if (!verifGroupe) return repondre("❌ *This command only works in groups!*");
    if (!verifAdmin && !superUser) return repondre("❌ *Only admins can use this command!*");

    let number = arg && arg[0] ? arg[0].replace(/[^0-9]/g, "") : "";
    if (number.length < 10) return repondre("❌ *Provide a valid number!*\nExample: .add 255693629079");

    try {
        const res = await client.groupParticipantsUpdate(dest, [`${number}@s.whatsapp.net`], "add");
        if (res[0]?.status === "200") {
            await client.sendMessage(dest, { text: `✅ Added +${number} to the group.`, mentions: [`${number}@s.whatsapp.net`] }, { quoted: ms });
        } else {
            await repondre(`❌ Could not add +${number}. They might have privacy settings enabled.`);
        }
    } catch (e) {
        await repondre(`❌ Error: ${e.message}`);
    }
});

// ═══════════════════════════════════════════════
//   2. KICK USER
// ═══════════════════════════════════════════════
zokou({
    nomCom: "kick",
    categorie: "Group",
    reaction: "🚫",
    desc: "Remove a user from the group",
    fromMe: false
}, async (dest, client, cmd) => {
    const { arg, ms, repondre, verifGroupe, verifAdmin, superUser, msgRepondu, auteurMsgRepondu } = cmd;

    if (!verifGroupe) return repondre("❌ *This command only works in groups!*");
    if (!verifAdmin && !superUser) return repondre("❌ *Only admins can use this command!*");

    const target = getTargetJid(arg, msgRepondu, auteurMsgRepondu);
    if (!target) return repondre("❌ *Reply to a message or provide a number!*\nExample: .kick 255693629079");

    try {
        const res = await client.groupParticipantsUpdate(dest, [target.jid], "remove");
        if (res[0]?.status === "200") {
            await client.sendMessage(dest, { text: `✅ @${target.name} has been kicked.`, mentions: [target.jid] }, { quoted: ms });
        } else {
            await repondre(`❌ Could not kick @${target.name}.`);
        }
    } catch (e) {
        await repondre(`❌ Error: ${e.message}`);
    }
});

// ═══════════════════════════════════════════════
//   3. PROMOTE USER (Make Admin)
// ═══════════════════════════════════════════════
zokou({
    nomCom: "promote",
    categorie: "Group",
    reaction: "👑",
    desc: "Promote a user to admin",
    fromMe: false
}, async (dest, client, cmd) => {
    const { arg, ms, repondre, verifGroupe, verifAdmin, superUser, msgRepondu, auteurMsgRepondu } = cmd;

    if (!verifGroupe) return repondre("❌ *This command only works in groups!*");
    if (!verifAdmin && !superUser) return repondre("❌ *Only admins can use this command!*");

    const target = getTargetJid(arg, msgRepondu, auteurMsgRepondu);
    if (!target) return repondre("❌ *Reply to a message or provide a number!*\nExample: .promote 255693629079");

    try {
        const res = await client.groupParticipantsUpdate(dest, [target.jid], "promote");
        if (res[0]?.status === "200") {
            await client.sendMessage(dest, { text: `👑 @${target.name} is now an admin.`, mentions: [target.jid] }, { quoted: ms });
        } else {
            await repondre(`❌ Could not promote @${target.name}.`);
        }
    } catch (e) {
        await repondre(`❌ Error: ${e.message}`);
    }
});

// ═══════════════════════════════════════════════
//   4. DEMOTE USER (Remove Admin)
// ═══════════════════════════════════════════════
zokou({
    nomCom: "demote",
    categorie: "Group",
    reaction: "👤",
    desc: "Demote an admin to normal user",
    fromMe: false
}, async (dest, client, cmd) => {
    const { arg, ms, repondre, verifGroupe, verifAdmin, superUser, msgRepondu, auteurMsgRepondu } = cmd;

    if (!verifGroupe) return repondre("❌ *This command only works in groups!*");
    if (!verifAdmin && !superUser) return repondre("❌ *Only admins can use this command!*");

    const target = getTargetJid(arg, msgRepondu, auteurMsgRepondu);
    if (!target) return repondre("❌ *Reply to a message or provide a number!*\nExample: .demote 255693629079");

    try {
        const res = await client.groupParticipantsUpdate(dest, [target.jid], "demote");
        if (res[0]?.status === "200") {
            await client.sendMessage(dest, { text: `👤 @${target.name} is no longer an admin.`, mentions: [target.jid] }, { quoted: ms });
        } else {
            await repondre(`❌ Could not demote @${target.name}.`);
        }
    } catch (e) {
        await repondre(`❌ Error: ${e.message}`);
    }
});

// ═══════════════════════════════════════════════
//   5. LINK (Get Group Invite Link)
// ═══════════════════════════════════════════════
zokou({
    nomCom: "link",
    categorie: "Group",
    reaction: "🔗",
    desc: "Get group invite link",
    fromMe: false
}, async (dest, client, cmd) => {
    const { repondre, verifGroupe, verifAdmin, superUser } = cmd;

    if (!verifGroupe) return repondre("❌ *This command only works in groups!*");
    if (!verifAdmin && !superUser) return repondre("❌ *Only admins can use this command!*");

    try {
        const code = await client.groupInviteCode(dest);
        await repondre(`🔗 *Group Link:*\nhttps://chat.whatsapp.com/${code}`);
    } catch (e) {
        await repondre(`❌ Error: Failed to get link.`);
    }
});

// ═══════════════════════════════════════════════
//   6. REVOKE (Reset Group Invite Link)
// ═══════════════════════════════════════════════
zokou({
    nomCom: "revoke",
    categorie: "Group",
    reaction: "🔄",
    desc: "Reset group invite link",
    fromMe: false
}, async (dest, client, cmd) => {
    const { repondre, verifGroupe, verifAdmin, superUser } = cmd;

    if (!verifGroupe) return repondre("❌ *This command only works in groups!*");
    if (!verifAdmin && !superUser) return repondre("❌ *Only admins can use this command!*");

    try {
        await client.groupRevokeInvite(dest);
        const newCode = await client.groupInviteCode(dest);
        await repondre(`✅ *Link Reset!*\n\n🔗 *New Link:*\nhttps://chat.whatsapp.com/${newCode}`);
    } catch (e) {
        await repondre(`❌ Error: Failed to reset link.`);
    }
});

// ═══════════════════════════════════════════════
//   7. GROUP INFO
// ═══════════════════════════════════════════════
zokou({
    nomCom: "groupinfo",
    categorie: "Group",
    reaction: "📊",
    desc: "Show group information",
    fromMe: false
}, async (dest, client, cmd) => {
    const { repondre, verifGroupe } = cmd;

    if (!verifGroupe) return repondre("❌ *This command only works in groups!*");

    try {
        const metadata = await client.groupMetadata(dest);
        const admins = metadata.participants.filter(p => p.admin !== null).length;
        
        let text = `📊 *GROUP INFO*\n\n`;
        text += `📛 *Name:* ${metadata.subject}\n`;
        text += `👥 *Members:* ${metadata.participants.length}\n`;
        text += `👑 *Admins:* ${admins}\n`;
        text += `🆔 *ID:* ${metadata.id}\n`;
        if (metadata.owner) text += `👤 *Owner:* @${metadata.owner.split('@')[0]}\n`;
        if (metadata.desc) text += `\n📝 *Description:*\n${metadata.desc}`;

        await client.sendMessage(dest, { 
            text: text, 
            mentions: metadata.owner ? [metadata.owner] : [] 
        }, { quoted: cmd.ms });
    } catch (e) {
        await repondre(`❌ Error: Failed to fetch group info.`);
    }
});
