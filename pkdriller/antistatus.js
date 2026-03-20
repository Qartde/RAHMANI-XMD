const { zokou } = require("../framework/zokou");
const { 
  ajouterOuMettreAJourStatusJid, 
  mettreAJourStatusAction, 
  verifierStatusEtatJid, 
  recupererStatusActionJid 
} = require("../bdd/antistatus");
const { getWarnCountByJID, ajouterUtilisateurAvecWarnCount, resetWarnCountByJID } = require("../bdd/warn");
const conf = require("../set");

// Helper function to decode JID
const decodeJid = (jid) => {
  if (!jid) return jid;
  if (/:\d+@/gi.test(jid)) {
    return jid.split(':')[0] + '@s.whatsapp.net';
  }
  return jid;
};

zokou({
  nomCom: "antistatus",
  aliases: ["as", "antistatusmention"],
  reaction: "📵",
  categorie: "Group"
}, async (dest, zk, commandeOptions) => {
  const { ms, repondre, arg, auteurMessage, idBot } = commandeOptions;
  
  if (!dest.endsWith("@g.us")) {
    return repondre("❌ This command only works in groups.");
  }
  
  try {
    const groupMetadata = await zk.groupMetadata(dest);
    const participants = groupMetadata.participants;
    
    const senderClean = decodeJid(auteurMessage);
    const botClean = decodeJid(idBot);
    
    const isAdmin = participants.some(p => {
      const pid = decodeJid(p.id);
      return pid === senderClean && (p.admin === 'admin' || p.admin === 'superadmin');
    });
    
    const isBotAdmin = participants.some(p => {
      const pid = decodeJid(p.id);
      return pid === botClean && (p.admin === 'admin' || p.admin === 'superadmin');
    });
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    if (!isBotAdmin) {
      return repondre("❌ Bot must be admin to delete messages.");
    }
    
    const subCommand = arg[0]?.toLowerCase();
    
    if (subCommand === "on") {
      await ajouterOuMettreAJourStatusJid(dest, 'oui');
      return repondre("✅ *Anti-status activated!* Status mentions will be deleted.");
    }
    
    else if (subCommand === "off") {
      await ajouterOuMettreAJourStatusJid(dest, 'non');
      return repondre("❌ *Anti-status deactivated!*");
    }
    
    else if (subCommand === "action") {
      const action = arg[1]?.toLowerCase();
      let dbAction, actionDisplay;
      
      switch(action) {
        case 'delete':
          dbAction = 'delete';
          actionDisplay = 'delete only';
          break;
        case 'warn':
          dbAction = 'warn';
          actionDisplay = 'warn (1st & 2nd) + remove (3rd)';
          break;
        case 'remove':
        case 'kick':
          dbAction = 'remove';
          actionDisplay = 'remove immediately';
          break;
        default:
          return repondre("❌ Use: `delete`, `warn`, or `remove`\nExample: `.antistatus action warn`");
      }
      
      await mettreAJourStatusAction(dest, dbAction);
      return repondre(`✅ Anti-status action set to: *${actionDisplay}*`);
    }
    
    else {
      const enabled = await verifierStatusEtatJid(dest);
      const action = await recupererStatusActionJid(dest);
      
      let actionDisplay = 'delete only';
      if (action === 'warn') actionDisplay = 'warn + remove (3 strikes)';
      else if (action === 'remove') actionDisplay = 'remove immediately';
      
      return repondre(`📵 *ANTI-STATUS*\n\n📊 Status: ${enabled ? "✅ ON" : "❌ OFF"}\n⚙️ Action: ${actionDisplay}\n\nCommands:\n.on - Enable\n.off - Disable\n.action [delete|warn|remove]`);
    }
    
  } catch (error) {
    console.error("Anti-status command error:", error);
    repondre("❌ Error: " + error.message);
  }
});
