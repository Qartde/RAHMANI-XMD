const { zokou } = require("../framework/zokou");

zokou({
  nomCom: "tagonline",
  aliases: ["online", "tagactive", "active"],
  reaction: "🟢",
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
    const groupName = groupMetadata.subject;
    
    // Check if user is admin or owner
    const isAdmin = participants.some(p => p.id === auteurMessage && (p.admin === 'admin' || p.admin === 'superadmin'));
    const isOwner = superUser;
    
    if (!isAdmin && !isOwner) {
      return repondre("❌ Only group admins can use this command!");
    }
    
    // Send initial message
    await repondre("🟢 *Checking online status...*\nPlease wait...");
    
    // Get all participants
    let onlineUsers = [];
    let allUsers = [];
    
    // Get presence for all participants quickly
    const presencePromises = [];
    
    for (let participant of participants) {
      const jid = participant.id;
      // Skip bot itself
      if (jid === idBot) continue;
      
      allUsers.push({
        jid: jid,
        name: participant.name || jid.split('@')[0],
        admin: participant.admin
      });
      
      // Try to get presence
      presencePromises.push(
        zk.presenceSubscribe(jid).catch(() => null)
      );
    }
    
    // Wait for all presence checks with timeout
    const presences = await Promise.allSettled(presencePromises);
    
    // Process results
    for (let i = 0; i < allUsers.length; i++) {
      const user = allUsers[i];
      const presence = presences[i];
      
      if (presence.status === 'fulfilled' && presence.value) {
        // Check if online
        if (presence.value.lastKnownPresence === "available" || 
            presence.value.lastKnownPresence === "composing" ||
            presence.value.lastKnownPresence === "recording") {
          onlineUsers.push(user);
        }
      }
    }
    
    // Format message
    let message = `╭━━━〔 *RAHMANI-XMD* 〕━━━╮\n`;
    message += `┃\n`;
    message += `┃ 🟢 *ONLINE MEMBERS*\n`;
    message += `┃ 📌 *Group:* ${groupName}\n`;
    message += `┃\n`;
    
    if (onlineUsers.length > 0) {
      message += `┃ *Online:* ${onlineUsers.length}/${allUsers.length}\n`;
      message += `┃\n`;
      
      // Show online users (max 30)
      for (let user of onlineUsers.slice(0, 30)) {
        const adminBadge = user.admin ? "👑 " : "";
        message += `┃ ${adminBadge}@${user.jid.split('@')[0]}\n`;
      }
      
      if (onlineUsers.length > 30) {
        message += `┃ ... and ${onlineUsers.length - 30} more online\n`;
      }
    } else {
      message += `┃ ❌ No online members found\n`;
    }
    
    message += `┃\n`;
    message += `┃ 📊 *Total members:* ${allUsers.length}\n`;
    message += `┃\n`;
    message += `╰━━━〔 *BY RAHMANI-XMD* 〕━━━╯`;
    
    // Collect mentions
    const mentions = onlineUsers.map(u => u.jid);
    
    // Send final message
    await zk.sendMessage(dest, {
      text: message,
      mentions: mentions
    });
    
    // Delete the initial message (optional)
    // Uncomment if you want to delete it
    // if (statusMsg && statusMsg.key) {
    //   await zk.sendMessage(dest, { delete: statusMsg.key });
    // }
    
  } catch (error) {
    console.error("Tag online error:", error);
    repondre(`❌ Error: ${error.message}\n\nMake sure bot is admin to see online status.`);
  }
});
