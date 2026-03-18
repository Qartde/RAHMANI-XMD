const { zokou } = require("../framework/zokou");
const config = require("../set");

// ==================== AUTO-DELETE TAG MESSAGES ====================
zokou({
  nomCom: "antitag",
  aliases: ["autodelete", "deletetag"],
  reaction: "🚫",
  categorie: "Group"
}, async (dest, zk, commandeOptions) => {
  const { ms, repondre, arg, superUser, etat } = commandeOptions;
  
  // Only group chats
  if (!dest.endsWith("@g.us")) {
    return repondre("❌ This command only works in groups.");
  }
  
  // Check if user is admin or superUser
  const groupMetadata = await zk.groupMetadata(dest);
  const participants = groupMetadata.participants;
  const isAdmin = participants.some(p => p.id === commandeOptions.auteurMessage && (p.admin === 'admin' || p.admin === 'superadmin'));
  
  if (!isAdmin && !superUser) {
    return repondre("❌ Only group admins can use this command.");
  }
  
  // Get current setting or set new one
  const action = arg[0]?.toLowerCase();
  
  // Initialize antitag setting in memory (you can save to file/db later)
  global.antitag = global.antitag || {};
  global.antitag[dest] = global.antitag[dest] || { enabled: false };
  
  if (action === "on") {
    global.antitag[dest].enabled = true;
    return zk.sendMessage(dest, {
      text: `╭━━━〔 *ʀᴀʜᴍᴀɴɪ-xᴍᴅ* 〕━━━╮
┃
┃ 🚫 *ANTI-TAG ACTIVATED*
┃
┃ ✅ Messages that tag members
┃    will be automatically deleted.
┃
┃ ⚠️ *Note:* Only works for non-admins
┃
╰━━━〔 *POWERED BY RAHMANI* 〕━━━╯

⚡ *ʀᴀʜᴍᴀɴɪ-xᴍᴅ*`,
      contextInfo: {
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363353854480831@newsletter",
          newsletterName: "RAHMANI XMD",
          serverMessageId: 143
        },
        externalAdReply: {
          title: "ʀᴀʜᴍᴀɴɪ-xᴍᴅ",
          body: "🚫 Anti-Tag Activated",
          thumbnailUrl: "https://files.catbox.moe/pkp993.jpg",
          mediaType: 1
        }
      }
    }, { quoted: ms });
  } 
  else if (action === "off") {
    global.antitag[dest].enabled = false;
    return zk.sendMessage(dest, {
      text: `╭━━━〔 *ʀᴀʜᴍᴀɴɪ-xᴍᴅ* 〕━━━╮
┃
┃ 🚫 *ANTI-TAG DEACTIVATED*
┃
┃ ❌ Tag messages will no longer
┃    be automatically deleted.
┃
╰━━━〔 *POWERED BY RAHMANI* 〕━━━╯

⚡ *ʀᴀʜᴍᴀɴɪ-xᴍᴅ*`,
      contextInfo: {
        externalAdReply: {
          title: "ʀᴀʜᴍᴀɴɪ-xᴍᴅ",
          body: "🚫 Anti-Tag Deactivated",
          thumbnailUrl: "https://files.catbox.moe/pkp993.jpg"
        }
      }
    }, { quoted: ms });
  }
  else {
    const status = global.antitag[dest]?.enabled ? "✅ *ON*" : "❌ *OFF*";
    return zk.sendMessage(dest, {
      text: `╭━━━〔 *ʀᴀʜᴍᴀɴɪ-xᴍᴅ* 〕━━━╮
┃
┃ 🚫 *ANTI-TAG SETTINGS*
┃
┃ 📊 *Status:* ${status}
┃
┃ 📝 *Commands:*
┃ └─ .antitag on  - Enable
┃ └─ .antitag off - Disable
┃
╰━━━〔 *POWERED BY RAHMANI* 〕━━━╯

⚡ *ʀᴀʜᴍᴀɴɪ-xᴍᴅ*`
    }, { quoted: ms });
  }
});

// ==================== MESSAGE DELETE HANDLER ====================
// This runs automatically for every message
zokou.onMessage(async (zk, message) => {
  try {
    // Only process group messages
    if (!message.key.remoteJid.endsWith("@g.us")) return;
    
    const groupId = message.key.remoteJid;
    
    // Check if anti-tag is enabled for this group
    if (!global.antitag || !global.antitag[groupId] || !global.antitag[groupId].enabled) return;
    
    // Don't delete messages from the bot itself
    if (message.key.fromMe) return;
    
    // Get sender info
    const sender = message.key.participant || message.key.remoteJid;
    
    // Check if sender is admin (don't delete admin messages)
    const groupMetadata = await zk.groupMetadata(groupId).catch(() => null);
    if (!groupMetadata) return;
    
    const isAdmin = groupMetadata.participants.some(p => p.id === sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    if (isAdmin) return;
    
    // Check if message contains any tag/mention
    let hasTag = false;
    
    // Check for mentions
    if (message.message?.extendedTextMessage?.contextInfo?.mentionedJid) {
      const mentioned = message.message.extendedTextMessage.contextInfo.mentionedJid;
      if (mentioned && mentioned.length > 0) {
        hasTag = true;
      }
    }
    
    // Check for quoted/replied message
    if (message.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
      hasTag = true;
    }
    
    // Check for @ symbol in text (simple tag)
    if (message.message?.conversation?.includes('@') || 
        message.message?.extendedTextMessage?.text?.includes('@')) {
      hasTag = true;
    }
    
    // If message contains a tag, delete it
    if (hasTag) {
      console.log(`🚫 Deleting tagged message from ${sender} in ${groupId}`);
      
      // Delete the message
      await zk.sendMessage(groupId, {
        delete: {
          remoteJid: groupId,
          fromMe: false,
          id: message.key.id,
          participant: sender
        }
      });
      
      // Optional: Send warning to user
      await zk.sendMessage(groupId, {
        text: `@${sender.split('@')[0]} 🚫 *Don't tag members!*`,
        mentions: [sender]
      }, { quoted: message });
    }
    
  } catch (error) {
    console.error("Anti-tag error:", error);
  }
});
