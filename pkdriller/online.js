const { zokou } = require("../framework/zokou");

zokou({
  nomCom: "tagonline",
  aliases: ["online", "tagactive", "active", "tagonline"],
  reaction: "🙄",
  categorie: "Group"
}, async (dest, zk, commandeOptions) => {
  const { ms, repondre, verifGroupe, verifAdmin, superUser, auteurMessage, idBot } = commandeOptions;
  
  // Check if in group
  if (!verifGroupe) {
    return repondre("❌ This command only works in groups!");
  }
  
  try {
    // Get group metadata
    const groupMetadata = await zk.groupMetadata(dest);
    const participants = groupMetadata.participants;
    
    // Check if user is admin or owner
    const isAdmin = participants.some(p => p.id === auteurMessage && (p.admin === 'admin' || p.admin === 'superadmin'));
    const isOwner = superUser;
    
    if (!isAdmin && !isOwner) {
      return repondre("❌ Only group admins can use this command!");
    }
    
    // Send typing indicator
    await zk.sendPresenceUpdate("composing", dest);
    
    // Get online status for all participants
    let onlineUsers = [];
    let offlineUsers = [];
    let unknownUsers = [];
    
    // Send initial message
    const statusMsg = await repondre("🙄 *Checking online status...*\n\nPlease wait...");
    
    // Get presence for each participant (limited to avoid rate limit)
    for (let i = 0; i < participants.length; i++) {
      const participant = participants[i];
      const jid = participant.id;
      
      // Skip bot itself
      if (jid === idBot) continue;
      
      try {
        // Get presence status
        const presence = await zk.presenceSubscribe(jid);
        
        // Wait a bit to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Check if user is online
        if (presence && presence.lastKnownPresence === "available") {
          onlineUsers.push({
            jid: jid,
            name: participant.name || jid.split('@')[0],
            admin: participant.admin
          });
        } else {
          offlineUsers.push({
            jid: jid,
            name: participant.name || jid.split('@')[0],
            admin: participant.admin
          });
        }
      } catch (err) {
        // If can't get presence, add to unknown
        unknownUsers.push({
          jid: jid,
          name: participant.name || jid.split('@')[0],
          admin: participant.admin
        });
      }
    }
    
    // Format the message
    let message = `╭━━━〔 *RAHMANI-XMD* 〕━━━╮\n`;
    message += `┃\n`;
    message += `┃ 🟢 *ONLINE MEMBERS*\n`;
    message += `┃\n`;
    
    if (onlineUsers.length > 0) {
      message += `┃ *Online:* ${onlineUsers.length} members\n`;
      message += `┃\n`;
      for (let user of onlineUsers) {
        const adminBadge = user.admin ? "👑 " : "";
        message += `┃ ${adminBadge}@${user.jid.split('@')[0]}\n`;
      }
    } else {
      message += `┃ ❌ No online members found\n`;
    }
    
    message += `┃\n`;
    message += `┃ ━━━━━━━━━━━━━━━━━━━\n`;
    message += `┃\n`;
    message += `┃ ⚫ *Offline:* ${offlineUsers.length} members\n`;
    message += `┃\n`;
    
    if (offlineUsers.length > 0 && offlineUsers.length <= 10) {
      for (let user of offlineUsers.slice(0, 5)) {
        message += `┃ • @${user.jid.split('@')[0]}\n`;
      }
      if (offlineUsers.length > 5) {
        message += `┃ • ... and ${offlineUsers.length - 5} more\n`;
      }
    }
    
    message += `┃\n`;
    message += `┃ ❓ *Unknown:* ${unknownUsers.length} members\n`;
    message += `┃\n`;
    message += `╰━━━〔 *BY RAHMANI-XMD* 〕━━━╯`;
    
    // Collect all mentions
    const mentions = [...onlineUsers, ...offlineUsers.slice(0, 5), ...unknownUsers.slice(0, 5)]
      .map(u => u.jid);
    
    // Delete status message and send final
    await zk.sendMessage(dest, {
      text: message,
      mentions: mentions
    });
    
    // Delete the status message
    if (statusMsg && statusMsg.key) {
      await zk.sendMessage(dest, { delete: statusMsg.key });
    }
    
  } catch (error) {
    console.error("Tag online error:", error);
    repondre(`❌ Error: ${error.message}\n\nMake sure bot has admin rights to see online status.`);
  }
});
