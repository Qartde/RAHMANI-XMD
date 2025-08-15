const { zokou } = require(__dirname + "/../framework/zokou");
const set = require(__dirname + "/../set");

let antiMentionEnabled = false;

zokou({
    nomCom: "antimention",
    categorie: "Moderation"
}, async (jid, sock, args) => {
    let text = args.ms.body.split(" ")[1]; // on/off

    if (!text || !["on", "off"].includes(text.toLowerCase())) {
        return sock.sendMessage(jid, { text: "✅ Usage: .antimention on / off" });
    }

    antiMentionEnabled = text.toLowerCase() === "on";
    sock.sendMessage(jid, { text: `🛡 Anti-Mention has been turned *${antiMentionEnabled ? "ON" : "OFF"}*.` });
});

// Anti-Mention Handler
zokou({
    nomCom: "mentionListener",
    categorie: "System"
}, async (jid, sock, msg) => {
    if (!antiMentionEnabled) return;

    const sender = msg.key.participant || msg.key.remoteJid;
    const isGroup = jid.endsWith("@g.us");

    // Check if the message mentions the owner
    if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.includes(set.OWNER_NUMBER + "@s.whatsapp.net")) {
        
        if (isGroup) {
            // Delete the mention message
            await sock.sendMessage(jid, { delete: msg.key });
            // Remove the member from the group
            await sock.groupParticipantsUpdate(jid, [sender], "remove");
        } else {
            // Delete chat & block user
            await sock.updateBlockStatus(sender, "block");
            await sock.chatModify({ clear: { messages: [{ id: msg.key.id, fromMe: false, timestamp: Date.now() / 1000 }] } }, jid);
        }
    }
});
