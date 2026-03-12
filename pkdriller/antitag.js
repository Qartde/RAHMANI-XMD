const { zokou } = require("../framework/zokou");

// Store anti-tag state per group (better for multi-group support)
const antiTagStatus = new Map();

zokou({
  nomCom: "antitag",
  categorie: "Group",
  reaction: "⚠️",
  fromMe: true, // Only works when used by admin/owner
  desc: "Protect owner from being tagged in groups"
}, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms, auteurMessage } = commandeOptions;
  const groupId = dest;

  try {
    // Command toggle functionality
    if (arg.length > 0) {
      const action = arg[0].toLowerCase();
      
      if (action === "on") {
        antiTagStatus.set(groupId, true);
        return repondre("🛡️ *Anti-tag protection activated*");
      } 
      else if (action === "off") {
        antiTagStatus.set(groupId, false);
        return repondre("❌ *Anti-tag protection deactivated*");
      }
      else if (action === "status") {
        const status = antiTagStatus.get(groupId) ? "ACTIVE ✅" : "INACTIVE ❌";
        return repondre(`🛡️ Anti-tag Status: ${status}`);
      }
    }

    // Show help if no arguments
    return repondre(
      `🛡️ *Anti-tag Commands:*\n` +
      `• *${s.PREFIXE}antitag on* - Enable protection\n` +
      `• *${s.PREFIXE}antitag off* - Disable protection\n` +
      `• *${s.PREFIXE}antitag status* - Check current status`
    );

  } catch (error) {
    console.error("Anti-tag Command Error:", error);
    repondre("❌ An error occurred while processing the command");
  }
});

// Message handler for detecting tags
module.exports.antiTagHandler = async (message, zk) => {
  try {
    const groupId = message.key.remoteJid;
    if (!groupId || !antiTagStatus.get(groupId)) return;

    // Check for mentions
    if (message?.message?.extendedTextMessage?.contextInfo?.mentionedJid) {
      const mentionedJids = message.message.extendedTextMessage.contextInfo.mentionedJid;
      const ownerJid = s.OWNER_NUMBER + "@s.whatsapp.net"; // Use from config

      if (mentionedJids.includes(ownerJid)) {
        await zk.sendMessage(groupId, { 
          text: `*DON'T TAG MY OWNER!*\n@${message.key.participant.split('@')[0]}`,
          mentions: [message.key.participant]
        });

        // Optional: Add warning level system
        const warnings = warningDB.get(message.key.participant) || 0;
        warningDB.set(message.key.participant, warnings + 1);
        
        if (warnings >= 3) {
          await zk.groupParticipantsUpdate(
            groupId,
            [message.key.participant],
            "remove"
          );
        }
      }
    }
  } catch (error) {
    console.error("Anti-tag Handler Error:", error);
  }
};
