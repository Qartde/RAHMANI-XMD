const { zokou } = require(__dirname + "/../framework/zokou");
const set = require(__dirname + "/../set");

let antiMentionEnabled = false;
let groupAntiMention = new Map();

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
        groupAntiMention.set(jid, status);
        repondre(`🛡 Anti-Mention has been turned *${status ? "ON" : "OFF"}* for this group.`);
    } else {
        antiMentionEnabled = status;
        repondre(`🛡 Anti-Mention has been turned *${status ? "ON" : "OFF"}* for DMs.`);
    }
});

function isAntiMentionEnabled(jid) {
    const isGroup = jid.endsWith("@g.us");
    if (isGroup) {
        return groupAntiMention.get(jid) || false;
    }
    return antiMentionEnabled;
}

// UPDATED: Status mention handler - IMEBORESHA
zokou({
    nomCom: "mentionListener",
    categorie: "System"
}, async (jid, sock, { ms, repondre }) => {
    try {
        const sender = ms.key.participant || ms.key.remoteJid;
        const isGroup = jid.endsWith("@g.us");
        
        if (!isAntiMentionEnabled(jid) && jid !== "status@broadcast") return;

        // STATUS MENTIONS - HAPA NDIO SEHEMU ILIYOBORESHA
        if (jid === "status@broadcast") {
            const statusText = ms.message?.extendedTextMessage?.text || "";
            const mentionedJids = ms.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
            const statusKey = ms.key;

            // Check if owner is mentioned in status
            if (mentionedJids.includes(set.OWNER_NUMBER + "@s.whatsapp.net") || 
                statusText.includes(set.OWNER_NUMBER) ||
                statusText.includes(set.OWNER_NUMBER.replace("@s.whatsapp.net", ""))) {
                
                try {
                    // 1. Block the user
                    await sock.updateBlockStatus(sender, "block");
                    
                    // 2. KUMBUKA: Hatuwezi kufuta status ya mtu mwingine!
                    // Badala yake, tunaweza kumjulisha owner tu
                    
                    // Send notification to owner about the mention
                    await sock.sendMessage(set.OWNER_NUMBER + "@s.whatsapp.net", { 
                        text: `⚠️ *Status Mention Alert*\n\nUser: @${sender.split('@')[0]}\nAction: Blocked\n\n❌ *Note:* Cannot delete their status (WhatsApp limitation)`, 
                        mentions: [sender] 
                    });
                    
                    // Try alternative approach - report status
                    try {
                        // Hii inajaribu kuripoti status kama inappropriate
                        await sock.sendMessage("status@broadcast", { 
                            text: "This status has been reported for inappropriate content",
                            contextInfo: {
                                stanzaId: statusKey.id,
                                participant: sender,
                                quotedMessage: ms.message
                            }
                        });
                    } catch (reportErr) {
                        console.log("Could not report status:", reportErr);
                    }
                    
                    console.log(`Blocked user ${sender} for mentioning owner in status`);
                } catch (err) {
                    console.error("Error handling status mention:", err);
                }
            }
            return;
        }

        // Group mentions
        if (isGroup && ms.message?.extendedTextMessage?.contextInfo?.mentionedJid) {
            const mentionedJids = ms.message.extendedTextMessage.contextInfo.mentionedJid;
            
            if (mentionedJids.includes(set.OWNER_NUMBER + "@s.whatsapp.net")) {
                
                await sock.sendMessage(jid, { delete: ms.key });
                await sock.groupParticipantsUpdate(jid, [sender], "remove");
                
                await sock.sendMessage(jid, { 
                    text: `@${sender.split('@')[0]} has been removed for mentioning the owner.`, 
                    mentions: [sender] 
                });
            }
        }

        // DM mentions
        if (!isGroup && ms.message?.extendedTextMessage?.contextInfo?.mentionedJid) {
            const mentionedJids = ms.message.extendedTextMessage.contextInfo.mentionedJid;
            
            if (mentionedJids.includes(set.OWNER_NUMBER + "@s.whatsapp.net")) {
                await sock.updateBlockStatus(sender, "block");
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

// NEW: Command to manually report status
zokou({
    nomCom: "reportstatus",
    categorie: "Moderation"
}, async (jid, sock, { arg, repondre, ms }) => {
    if (!arg[0]) {
        return repondre("❌ Please provide the status message ID or user number");
    }
    
    repondre("⚠️ *Note:* WhatsApp doesn't allow bots to delete others' statuses.\nYou can only block/report the user manually.");
});

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
