const { zokou } = require("../framework/zokou");
const conf = require("../set");

zokou({
    nomCom: "kick",
    categorie: "Group",
    reaction: "🚫",
    desc: "Remove a user from the group",
    fromMe: false
}, async (dest, client, cmd) => {
    const { arg, ms, repondre, verifGroupe, verifAdmin, superUser, msgRepondu, auteurMsgRepondu } = cmd;

    if (!verifGroupe) return repondre("❌ *This command only works in groups!*");
    if (!verifAdmin && !superUser) return repondre("❌ *Only admins or owner can use this command!*");

    let targetJid = null;
    let displayName = "";

    if (msgRepondu) {
        targetJid = auteurMsgRepondu;
        displayName = targetJid.split('@')[0];
    } else if (arg && arg[0]) {
        const number = arg[0].replace(/[^0-9]/g, "");
        if (number.length < 10) return repondre("❌ *Invalid phone number!*");
        targetJid = `${number}@s.whatsapp.net`;
        displayName = number;
    } else {
        return repondre("❌ *Reply to a message or provide a number.*\n\nExample: .kick 255693629079");
    }

    try {
        const response = await client.groupParticipantsUpdate(dest, [targetJid], "remove");
        const status = response[0]?.status;

        if (status === "200") {
            await client.sendMessage(dest, { text: `✅ @${displayName} has been removed from the group.`, mentions: [targetJid] }, { quoted: ms });
        } else {
            await repondre(`❌ Could not remove @${displayName}. Ensure the bot is admin.`);
        }
    } catch (error) {
        console.error("❌ Kick Error:", error.message);
        await repondre(`❌ *Error:* ${error.message}`);
    }
});
