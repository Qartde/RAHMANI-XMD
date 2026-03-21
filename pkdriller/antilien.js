const { zokou } = require("../framework/zokou");
const { verifierEtatJid, recupererActionJid, mettreAJourAction, ajouterOuMettreAJourJid } = require("../bdd/antilien");
const { getWarnCountByJID, ajouterUtilisateurAvecWarnCount, resetWarnCountByJID } = require("../bdd/warn");

zokou({
  nomCom: "antilink",
  aliases: ["antilien", "antiurl"],
  reaction: "🔗",
  categorie: "Group"
}, async (dest, zk, commandeOptions) => {
  const { ms, repondre, arg, auteurMessage, idBot } = commandeOptions;
  
  if (!dest.endsWith("@g.us")) {
    return repondre("❌ This command only works in groups.");
  }
  
  try {
    const groupMetadata = await zk.groupMetadata(dest);
    const participants = groupMetadata.participants;
    const isAdmin = participants.some(p => p.id === auteurMessage && (p.admin === 'admin' || p.admin === 'superadmin'));
    const isBotAdmin = participants.some(p => p.id === idBot && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    if (!isBotAdmin) {
      return repondre("❌ Bot must be admin to delete messages.");
    }
    
    const subCommand = arg[0]?.toLowerCase();
    
    // KUWASHA ANTI-LINK
    if (subCommand === "on") {
      await ajouterOuMettreAJourJid(dest, 'oui');
      // Set default action to warn (3 strikes rule)
      await mettreAJourAction(dest, 'warn');
      return zk.sendMessage(dest, {
        text: `╭━━━〔 *SEBASTIAN MD* 〕━━━╮
┃
┃ 🔗 *ANTI-LINK ACTIVATED*
┃
┃ ✅ Links will be monitored
┃
┃ ⚙️ *3-Strike Rule:*
┃ └─ 1st & 2nd: Warning
┃ └─ 3rd: Remove from group
┃
╰━━━〔 *POWERED BY RAHMANI* 〕━━━╯

⚡ *SEBASTIAN MD*`,
        contextInfo: {
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: "120363406436673870@newsletter",
            newsletterName: "SEBASTIAN MD",
            serverMessageId: 143
          },
          externalAdReply: {
            title: "SEBASTIAN MD",
            body: "🔗 3-Strike Anti-Link",
            thumbnailUrl: "https://files.catbox.moe/2yarwr.png",
            mediaType: 1
          }
        }
      }, { quoted: ms });
    }
    
    // KUZIMA ANTI-LINK
    else if (subCommand === "off") {
      await ajouterOuMettreAJourJid(dest, 'non');
      return zk.sendMessage(dest, {
        text: `╭━━━〔 *SEBASTIAN MD* 〕━━━╮
┃
┃ 🔗 *ANTI-LINK DEACTIVATED*
┃
┃ ❌ Links will no longer be monitored.
┃
╰━━━〔 *POWERED BY RAHMANI* 〕━━━╯

⚡ *SEBASTIAN MD*`,
        contextInfo: {
          externalAdReply: {
            title: "SEBASTIAN MD",
            body: "🔗 Anti-Link Deactivated",
            thumbnailUrl: "https://files.catbox.moe/2yarwr.png"
          }
        }
      }, { quoted: ms });
    }
    
    // KUBADILISHA ACTION (kama unataka custom)
    else if (subCommand === "action") {
      const action = arg[1]?.toLowerCase();
      
      let dbAction = 'warn'; // default
      let actionDisplay = '3-strike rule';
      
      if (action === 'delete') {
        dbAction = 'supp';
        actionDisplay = 'delete only';
      } else if (action === 'warn') {
        dbAction = 'warn';
        actionDisplay = '3-strike rule';
      } else if (action === 'remove' || action === 'kick') {
        dbAction = 'remove';
        actionDisplay = 'remove immediately';
      } else {
        return repondre("❌ Please specify action: `delete`, `warn`, or `remove`\nExample: `.antilink action warn`");
      }
      
      await mettreAJourAction(dest, dbAction);
      
      return zk.sendMessage(dest, {
        text: `╭━━━〔 *SEBASTIAN MD* 〕━━━╮
┃
┃ 🔗 *ACTION UPDATED*
┃
┃ ✅ Anti-link action set to: *${actionDisplay}*
┃
╰━━━〔 *POWERED BY RAHMANI* 〕━━━╯

⚡ *SEBASTIAN MD*`,
        contextInfo: {
          externalAdReply: {
            title: "SEBASTIAN MD",
            body: `Action: ${actionDisplay}`,
            thumbnailUrl: "https://files.catbox.moe/2yarwr.png"
          }
        }
      }, { quoted: ms });
    }
    
    // KURESET WARNINGS ZA MTU
    else if (subCommand === "reset") {
      let targetJid = null;
      
      // Check if replying to someone
      if (commandeOptions.msgRepondu && commandeOptions.auteurMsgRepondu) {
        targetJid = commandeOptions.auteurMsgRepondu;
      } else if (arg[1] && arg[1].includes('@')) {
        targetJid = arg[1].replace('@', '') + '@s.whatsapp.net';
      } else {
        return repondre("❌ Please reply to a user or mention them to reset warnings.\nExample: `.antilink reset @user`");
      }
      
      await resetWarnCountByJID(targetJid);
      
      return zk.sendMessage(dest, {
        text: `✅ *Warnings reset for* @${targetJid.split('@')[0]}`,
        mentions: [targetJid]
      }, { quoted: ms });
    }
    
    // KUANGALIA HALI (default)
    else {
      const etat = await verifierEtatJid(dest);
      const dbAction = await recupererActionJid(dest);
      
      // Tafsiri action kutoka database
      let actionDisplay = '3-strike rule';
      if (dbAction === 'supp') actionDisplay = 'delete only';
      else if (dbAction === 'remove') actionDisplay = 'remove immediately';
      
      const statusText = etat ? "✅ *ON*" : "❌ *OFF*";
      
      return zk.sendMessage(dest, {
        text: `╭━━━〔 *SEBASTIAN MD* 〕━━━╮
┃
┃ 🔗 *ANTI-LINK SETTINGS*
┃
┃ 📊 *Status:* ${statusText}
┃ ⚙️ *Action:* ${actionDisplay}
┃
┃ 📝 *Commands:*
┃ └─ .antilink on           - Enable
┃ └─ .antilink off          - Disable
┃ └─ .antilink action [delete/warn/remove]
┃ └─ .antilink reset @user  - Reset warnings
┃
┃ ⚠️ *Bot must be admin*
┃
╰━━━〔 *POWERED BY RAHMANI* 〕━━━╯

⚡ *SEBASTIAN MD*`
      }, { quoted: ms });
    }
    
  } catch (error) {
    console.error("Anti-link command error:", error);
    repondre("❌ Error: " + error.message);
  }
});
