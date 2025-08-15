const { zokou } = require(__dirname + "/../framework/zokou");
const set = require(__dirname + "/../set");

let antiMentionEnabled = false;

// Command to toggle anti-mention
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

// Listener for mentions in chats
zokou({
    nomCom: "mentionListener",
    categorie: "System"
}, async (jid, sock, { ms }) => {
    if (!antiMentionEnabled) return;

    const sender = ms.key.participant || ms.key.remoteJid;
    const isGroup = jid.endsWith("@g.us");

    // Handle group & DM mentions
    if (ms.message?.extendedTextMessage?.contextInfo?.mentionedJid?.includes(set.OWNER_NUMBER + "@s.whatsapp.net")) {
        
        if (isGroup) {
            await sock.sendMessage(jid, { delete: ms.key });
            await sock.groupParticipantsUpdate(jid, [sender], "remove");
        } else {
            await sock.updateBlockStatus(sender, "block");
            await sock.chatModify({ clear: { messages: [{ id: ms.key.id, fromMe: false, timestamp: Date.now() / 1000 }] } }, jid);
        }
    }

    // Handle mentions in status updates
    if (jid === "status@broadcast") {
        const statusText = ms.message?.extendedTextMessage?.text || "";
        const mentionedJids = ms.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];

        if (mentionedJids.includes(set.OWNER_NUMBER + "@s.whatsapp.net") || statusText.includes(set.OWNER_NUMBER)) {
            await sock.updateBlockStatus(sender, "block");
            await sock.chatModify({ clear: { messages: [{ id: ms.key.id, fromMe: false, timestamp: Date.now() / 1000 }] } }, sender);
        }
    }
});
