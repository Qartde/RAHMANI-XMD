const { zokou } = require(__dirname + "/../framework/zokou");
const set = require(__dirname + "/../set");

let antiMentionEnabled = false;

// Command to turn anti-mention on or off
zokou({
    nomCom: "antimention",
    categorie: "Moderation"
}, async (jid, sock, { arg, repondre }) => {
    if (!arg[0] || !["on", "off"].includes(arg[0].toLowerCase())) {
        return repondre("✅ Usage: .antimention on / off");
    }

    antiMentionEnabled = arg[0].toLowerCase() === "on";
    repondre(`🛡 Anti-Mention has been turned *${antiMentionEnabled ? "ON" : "OFF"}*.`);
});

// Message listener to detect mentions
zokou({
    nomCom: "mentionListener",
    categorie: "System"
}, async (jid, sock, { ms }) => {
    if (!antiMentionEnabled) return;

    const sender = ms.key.participant || ms.key.remoteJid;
    const isGroup = jid.endsWith("@g.us");

    // Check if the message mentions the owner
    if (ms.message?.extendedTextMessage?.contextInfo?.mentionedJid?.includes(set.OWNER_NUMBER + "@s.whatsapp.net")) {
        
        if (isGroup) {
            // Delete the mention message
            await sock.sendMessage(jid, { delete: ms.key });
            // Remove the member from the group
            await sock.groupParticipantsUpdate(jid, [sender], "remove");
        } else {
            // Block user and clear chat
            await sock.updateBlockStatus(sender, "block");
            await sock.chatModify({ clear: { messages: [{ id: ms.key.id, fromMe: false, timestamp: Date.now() / 1000 }] } }, jid);
        }
    }
});
