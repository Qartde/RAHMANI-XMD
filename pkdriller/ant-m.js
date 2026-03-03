const { zokou } = require(__dirname + "/../framework/zokou");
const set = require(__dirname + "/../set");

let antiMentionEnabled = false;
let groupAntiMention = new Map(); // Store group-specific settings

// Command to toggle anti-mention
zokou({
    nomCom: "antimention",
    categorie: "Moderation"
}, async (jid, sock, { arg, repondre, ms }) => {
    const isGroup = jid.endsWith("@g.us");
    
    if (!arg[0] || !["on", "off"].includes(arg[0].toLowerCase())) {
        return repondre("✅ Usage: .antimention on / off");
    }

    const status = arg[0].toLowerCase() === "on";
    
    if (isGroup) {
        // Group-specific setting
        groupAntiMention.set(jid, status);
        repondre(`🛡 Anti-Mention has been turned *${status ? "ON" : "OFF"}* for this group.`);
    } else {
        // Global setting for DMs
        antiMentionEnabled = status;
        repondre(`🛡 Anti-Mention has been turned *${status ? "ON" : "OFF"}* for DMs.`);
    }
});

// Check if anti-mention is enabled for a specific chat
function isAntiMentionEnabled(jid) {
    const isGroup = jid.endsWith("@g.us");
    if (isGroup) {
        return groupAntiMention.get(jid) || false;
    }
    return antiMentionEnabled;
}

// Listener for mentions in chats
zokou({
    nomCom: "mentionListener",
    categorie: "System"
}, async (jid, sock, { ms }) => {
    try {
        const sender = ms.key.participant || ms.key.remoteJid;
        const isGroup = jid.endsWith("@g.us");
        
        // Check if anti-mention is enabled for this chat
        if (!isAntiMentionEnabled(jid) && jid !== "status@broadcast") return;

        // Handle status mentions first (priority)
        if (jid === "status@broadcast") {
            const statusText = ms.message?.extendedTextMessage?.text || "";
            const mentionedJids = ms.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];

            // Check if owner is mentioned in status
            if (mentionedJids.includes(set.OWNER_NUMBER + "@s.whatsapp.net") || 
                statusText.includes(set.OWNER_NUMBER) ||
                statusText.includes(set.OWNER_NUMBER.replace("@s.whatsapp.net", ""))) {
                
                try {
                    // Block the user who mentioned owner in status
                    await sock.updateBlockStatus(sender, "block");
                    
                    // Delete the status message
                    await sock.chatModify({ 
                        clear: { 
                            messages: [{ 
                                id: ms.key.id, 
                                fromMe: false, 
                                timestamp: Date.now() / 1000 
                            }] 
                        } 
                    }, jid);
                    
                    console.log(`Blocked user ${sender} for mentioning owner in status`);
                } catch (err) {
                    console.error("Error handling status mention:", err);
                }
            }
            return;
        }

        // Handle group mentions
        if (isGroup && ms.message?.extendedTextMessage?.contextInfo?.mentionedJid) {
            const mentionedJids = ms.message.extendedTextMessage.contextInfo.mentionedJid;
            
            // Check if owner is mentioned
            if (mentionedJids.includes(set.OWNER_NUMBER + "@s.whatsapp.net")) {
                
                // Delete the message
                await sock.sendMessage(jid, { delete: ms.key });
                
                // Remove user from group
                await sock.groupParticipantsUpdate(jid, [sender], "remove");
                
                // Optional: Send warning to group
                await sock.sendMessage(jid, { 
                    text: `@${sender.split('@')[0]} has been removed for mentioning the owner.`, 
                    mentions: [sender] 
                });
            }
        }

        // Handle DM mentions
        if (!isGroup && ms.message?.extendedTextMessage?.contextInfo?.mentionedJid) {
            const mentionedJids = ms.message.extendedTextMessage.contextInfo.mentionedJid;
            
            if (mentionedJids.includes(set.OWNER_NUMBER + "@s.whatsapp.net")) {
                // Block the sender
                await sock.updateBlockStatus(sender, "block");
                
                // Clear the chat
                await sock.chatModify({ 
                    clear: { 
                        messages: [{ 
                            id: ms.key.id, 
                            fromMe: false, 
                            timestamp: Date.now() / 1000 
                        }] 
                    } 
                }, jid);
            }
        }

    } catch (error) {
        console.error("Error in mentionListener:", error);
    }
});

// Command to check anti-mention status
zokou({
    nomCom: "antimentionstatus",
    categorie: "Moderation"
}, async (jid, sock, { repondre }) => {
    const isGroup = jid.endsWith("@g.us");
    
    if (isGroup) {
        const status = groupAntiMention.get(jid) ? "ON" : "OFF";
        repondre(`📊 Anti-Mention status for this group: *${status}*`);
    } else {
        repondre(`📊 Anti-Mention status for DMs: *${antiMentionEnabled ? "ON" : "OFF"}*`);
    }
});
