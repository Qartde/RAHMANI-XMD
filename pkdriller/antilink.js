const { zokou } = require("../framework/zokou");
const { verifierEtatJid, recupererActionJid, mettreAJourAction, ajouterOuMettreAJourJid } = require("../bdd/antilien");
const { getWarnCountByJID, ajouterUtilisateurAvecWarnCount, resetWarnCountByJID } = require("../bdd/warn");

zokou({
  nomCom: "antilink",
  aliases: ["antilien", "antiurl", "antilinkon", "antilinkoff"],
  reaction: "🔗",
  categorie: "Group"
}, async (dest, zk, commandeOptions) => {
  const { ms, repondre, arg, auteurMessage, idBot, msgRepondu, auteurMsgRepondu } = commandeOptions;
  
  // Check if in group
  if (!dest.endsWith("@g.us")) {
    return repondre("❌ This command only works in groups.");
  }
  
  try {
    // Get group metadata
    const groupMetadata = await zk.groupMetadata(dest);
    const participants = groupMetadata.participants;
    
    // Check if user is admin
    const isAdmin = participants.some(p => p.id === auteurMessage && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    // Check if bot is admin (required for deleting messages)
    const isBotAdmin = participants.some(p => p.id === idBot && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    const subCommand = arg[0]?.toLowerCase();
    const actionType = arg[1]?.toLowerCase();
    
    // ========== ENABLE ANTI-LINK ==========
    if (subCommand === "on") {
      await ajouterOuMettreAJourJid(dest, 'oui');
      // Set default action to warn (3 strikes rule)
      await mettreAJourAction(dest, 'warn');
      
      return zk.sendMessage(dest, {
        text: `╭━━━〔 *RAHMANI-XMD* 〕━━━╮
┃
┃ 🔗 *ANTI-LINK ACTIVATED*
┃
┃ ✅ Anti-link protection is now *ENABLED*
┃
┃ ⚙️ *3-Strike Rule:*
┃ ├─ 1st Offense: ⚠️ Warning
┃ ├─ 2nd Offense: ⚠️ Warning
┃ └─ 3rd Offense: 🚫 Removed from group
┃
┃ 📌 *Bot must be admin* to delete messages
┃
╰━━━〔 *POWERED BY RAHMANI-XMD* 〕━━━╯

⚡ *RAHMANI-XMD*`,
        contextInfo: {
          externalAdReply: {
            title: "RAHMANI-XMD",
            body: "🔗 Anti-Link Activated",
            thumbnailUrl: "https://files.catbox.moe/2yarwr.png",
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      }, { quoted: ms });
    }
    
    // ========== DISABLE ANTI-LINK ==========
    else if (subCommand === "off") {
      await ajouterOuMettreAJourJid(dest, 'non');
      
      return zk.sendMessage(dest, {
        text: `╭━━━〔 *RAHMANI-XMD* 〕━━━╮
┃
┃ 🔗 *ANTI-LINK DEACTIVATED*
┃
┃ ❌ Anti-link protection is now *DISABLED*
┃
┃ 📌 Links are now allowed in this group
┃
╰━━━〔 *POWERED BY RAHMANI-XMD* 〕━━━╯

⚡ *RAHMANI-XMD*`,
        contextInfo: {
          externalAdReply: {
            title: "RAHMANI-XMD",
            body: "🔗 Anti-Link Deactivated",
            thumbnailUrl: "https://files.catbox.moe/2yarwr.png",
            mediaType: 1
          }
        }
      }, { quoted: ms });
    }
    
    // ========== CHANGE ACTION ==========
    else if (subCommand === "action") {
      let dbAction = 'warn';
      let actionDisplay = '3-Strike Rule (Warn)';
      let actionDescription = '⚠️ Users get 3 warnings before removal';
      
      if (actionType === 'delete') {
        dbAction = 'supp';
        actionDisplay = 'Delete Only';
        actionDescription = '🗑️ Messages with links will be deleted immediately';
      } else if (actionType === 'warn') {
        dbAction = 'warn';
        actionDisplay = '3-Strike Rule';
        actionDescription = '⚠️ Users get 3 warnings before removal';
      } else if (actionType === 'remove' || actionType === 'kick') {
        dbAction = 'remove';
        actionDisplay = 'Remove Immediately';
        actionDescription = '🚫 Users will be removed immediately when sending links';
      } else {
        return repondre(`❌ Invalid action! Available actions: \`delete\`, \`warn\`, \`remove\`
        
Example: \`.antilink action warn\``);
      }
      
      await mettreAJourAction(dest, dbAction);
      
      return zk.sendMessage(dest, {
        text: `╭━━━〔 *RAHMANI-XMD* 〕━━━╮
┃
┃ 🔗 *ACTION UPDATED*
┃
┃ ✅ Anti-link action set to: *${actionDisplay}*
┃
┃ 📝 *Action Details:*
┃ └─ ${actionDescription}
┃
┃ 📌 Bot must be admin to delete messages
┃
╰━━━〔 *POWERED BY RAHMANI-XMD* 〕━━━╯

⚡ *RAHMANI-XMD*`,
        contextInfo: {
          externalAdReply: {
            title: "RAHMANI-XMD",
            body: `Action: ${actionDisplay}`,
            thumbnailUrl: "https://files.catbox.moe/2yarwr.png",
            mediaType: 1
          }
        }
      }, { quoted: ms });
    }
    
    // ========== RESET WARNINGS ==========
    else if (subCommand === "reset") {
      if (!isBotAdmin) {
        return repondre("❌ Bot must be admin to manage warnings.");
      }
      
      let targetJid = null;
      
      // Check if replying to a message
      if (msgRepondu && auteurMsgRepondu) {
        targetJid = auteurMsgRepondu;
      }
      // Check if mentioning someone
      else if (arg[1] && arg[1].includes('@')) {
        targetJid = arg[1].replace('@', '') + '@s.whatsapp.net';
      }
      // Check if it's a number
      else if (arg[1] && /^\d+$/.test(arg[1])) {
        targetJid = arg[1] + '@s.whatsapp.net';
      }
      
      if (!targetJid) {
        return repondre(`❌ Please reply to a user or mention them to reset warnings.

Example:
\`.antilink reset @user\`
or reply to user's message with \`.antilink reset\``);
      }
      
      await resetWarnCountByJID(targetJid);
      
      return zk.sendMessage(dest, {
        text: `✅ *Warnings reset for* @${targetJid.split('@')[0]}
        
📊 User now has 0/3 warnings.`,
        mentions: [targetJid]
      }, { quoted: ms });
    }
    
    // ========== CHECK STATUS (DEFAULT) ==========
    else {
      const etat = await verifierEtatJid(dest);
      const dbAction = await recupererActionJid(dest);
      
      // Translate action from database
      let actionDisplay = '3-Strike Rule (Warn)';
      let actionEmoji = '⚠️';
      let actionDescription = 'Users get 3 warnings before removal';
      
      if (dbAction === 'supp') {
        actionDisplay = 'Delete Only';
        actionEmoji = '🗑️';
        actionDescription = 'Messages with links are deleted immediately';
      } else if (dbAction === 'remove') {
        actionDisplay = 'Remove Immediately';
        actionEmoji = '🚫';
        actionDescription = 'Users are removed immediately when sending links';
      } else if (dbAction === 'warn') {
        actionDisplay = '3-Strike Rule';
        actionEmoji = '⚠️';
        actionDescription = 'Users get 3 warnings before removal';
      }
      
      const statusText = etat ? "✅ ENABLED" : "❌ DISABLED";
      const statusEmoji = etat ? "🟢" : "🔴";
      
      // Get bot admin status
      const botAdminStatus = isBotAdmin ? "✅ Yes" : "❌ No (Cannot delete messages)";
      
      return zk.sendMessage(dest, {
        text: `╭━━━〔 *RAHMANI-XMD* 〕━━━╮
┃
┃ ${statusEmoji} *ANTI-LINK SETTINGS*
┃
┃ 📊 *Status:* ${statusText}
┃ ${actionEmoji} *Action:* ${actionDisplay}
┃
┃ 📝 *Action Details:*
┃ └─ ${actionDescription}
┃
┃ 🤖 *Bot Admin:* ${botAdminStatus}
┃
┃ ━━━━━━━━━━━━━━━━━━━
┃
┃ 📌 *Available Commands:*
┃
┃ 🔹 ${commandeOptions.prefixe}antilink on
┃    └─ Enable anti-link protection
┃
┃ 🔹 ${commandeOptions.prefixe}antilink off
┃    └─ Disable anti-link protection
┃
┃ 🔹 ${commandeOptions.prefixe}antilink action [delete/warn/remove]
┃    └─ Change how links are handled
┃
┃ 🔹 ${commandeOptions.prefixe}antilink reset @user
┃    └─ Reset user's warnings
┃
┃ ⚠️ *Bot must be admin to delete messages!*
┃
╰━━━〔 *POWERED BY RAHMANI-XMD* 〕━━━╯

⚡ *RAHMANI-XMD*`
      }, { quoted: ms });
    }
    
  } catch (error) {
    console.error("Anti-link command error:", error);
    repondre(`❌ Error: ${error.message}

Please check:
1. Bot is admin in the group
2. Your database files exist
3. Group is valid`);
  }
});
