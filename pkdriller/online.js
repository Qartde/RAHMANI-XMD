const { zokou } = require("../framework/zokou");
const { delay } = require("@whiskeysockets/baileys");

zokou({
  nomCom: "listonline",
  aliases: ["tagonline", "online", "tagonline", "active"],
  reaction: "🟢",
  categorie: "Group"
}, async (origineMessage, zk, commandeOptions) => {
  const { repondre, verifGroupe, superUser, verifAdmin, ms } = commandeOptions;

  try {
    // Check if it's a group
    if (!verifGroupe) {
      return repondre("❌ *This command only works in groups!*");
    }

    // Check if user is admin or superuser (optional - remove if you want everyone to use)
    if (!verifAdmin && !superUser) {
      return repondre("❌ *Admin only!*");
    }

    await repondre("🟢 *Fetching online members...*\n\n_Please wait_");

    // Get group metadata
    const groupMetadata = await zk.groupMetadata(origineMessage);
    const groupName = groupMetadata.subject;
    const participants = groupMetadata.participants;
    
    // Get presence data for all participants
    const presence = {};
    const onlineMembers = [];
    const offlineMembers = [];
    const recentMembers = []; // Was online recently (within last 5 min)

    // Request presence for all participants (in batches to avoid rate limits)
    for (let i = 0; i < participants.length; i += 10) {
      const batch = participants.slice(i, i + 10);
      for (const participant of batch) {
        try {
          // Request presence update
          await zk.presenceSubscribe(participant.id);
          await delay(500);
          
          // Get presence data from store
          const presenceData = zk.presences?.[participant.id];
          
          if (presenceData) {
            const lastSeen = presenceData.lastKnownPresence;
            const lastActive = presenceData.lastSeen ? new Date(presenceData.lastSeen) : null;
            const now = new Date();
            
            // Check if online now
            if (lastSeen === 'available') {
              onlineMembers.push(participant.id);
            }
            // Check if was online recently (within last 5 minutes)
            else if (lastActive && (now - lastActive) < 300000) { // 5 minutes in ms
              recentMembers.push(participant.id);
            }
            else {
              offlineMembers.push(participant.id);
            }
          } else {
            offlineMembers.push(participant.id);
          }
        } catch (e) {
          console.log(`Error getting presence for ${participant.id}:`, e);
          offlineMembers.push(participant.id);
        }
      }
      await delay(1000); // Delay between batches
    }

    // Prepare the message
    let message = `╭━━━「 *ONLINE MEMBERS* 」━━━╮\n`;
    message += `┃\n`;
    message += `┃ 👥 *Group:* ${groupName}\n`;
    message += `┃ 📊 *Total:* ${participants.length}\n`;
    message += `┃\n`;
    
    // Online members
    message += `┃ 🟢 *ONLINE NOW:* ${onlineMembers.length}\n`;
    if (onlineMembers.length > 0) {
      message += `┃\n`;
      onlineMembers.forEach((jid, index) => {
        const number = jid.split('@')[0];
        message += `┃ ${index + 1}. @${number}\n`;
      });
    } else {
      message += `┃ No members online\n`;
    }
    
    // Recently online
    if (recentMembers.length > 0) {
      message += `┃\n`;
      message += `┃ 🟡 *RECENTLY ONLINE:* ${recentMembers.length}\n`;
      message += `┃ (last 5 minutes)\n`;
      recentMembers.forEach((jid, index) => {
        const number = jid.split('@')[0];
        message += `┃ ${index + 1}. @${number}\n`;
      });
    }
    
    // Offline members (show only count, not list to avoid spam)
    message += `┃\n`;
    message += `┃ ⚫ *Offline:* ${offlineMembers.length}\n`;
    message += `┃\n`;
    message += `╰━━━━━━━━━━━━━━━━━╯\n\n`;
    message += `> Powered by Rahmani`;

    // Combine all mentions
    const allMentions = [...onlineMembers, ...recentMembers];

    await zk.sendMessage(origineMessage, {
      text: message,
      mentions: allMentions
    }, { quoted: ms });

  } catch (error) {
    console.error("List online error:", error);
    repondre("❌ *Error fetching online members!*\n\n> Powered by Rahmani");
  }
});
