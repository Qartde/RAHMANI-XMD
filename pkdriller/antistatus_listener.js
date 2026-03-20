const { zokou } = require("../framework/zokou");
const { verifierStatusEtatJid, recupererStatusActionJid } = require("../bdd/antistatus");
const { getWarnCountByJID, ajouterUtilisateurAvecWarnCount, resetWarnCountByJID } = require("../bdd/warn");
const conf = require("../set");

const decodeJid = (jid) => {
  if (!jid) return jid;
  if (/:\d+@/gi.test(jid)) {
    return jid.split(':')[0] + '@s.whatsapp.net';
  }
  return jid;
};

// This command will run for EVERY message (like a listener)
zokou({
  nomCom: "antistatus_listener",
  fromMe: false, // Runs for all messages
  dontAddCommandList: true, // Hide from help menu
  categorie: "system"
}, async (dest, zk, commandeOptions) => {
  const { ms, origineMessage, verifGroupe, auteurMessage, texte, superUser, verifAdmin } = commandeOptions;
  
  // Only process in groups and non-bot messages
  if (!verifGroupe || ms.key.fromMe || superUser || verifAdmin) return;
  
  try {
    // Check if anti-status is enabled
    const antiStatusEnabled = await verifierStatusEtatJid(origineMessage);
    if (!antiStatusEnabled) return;
    
    // Get action
    const action = await recupererStatusActionJid(origineMessage) || 'delete';
    
    // Check for status mentions
    let isStatusMention = false;
    
    // Check quoted status
    if (ms.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
      const quotedParticipant = ms.message.extendedTextMessage.contextInfo.participant;
      if (quotedParticipant && quotedParticipant.includes('status@broadcast')) {
        isStatusMention = true;
      }
    }
    
    // Check text
    if (texte) {
      if (texte.includes('@status') || texte.includes('status@broadcast')) {
        isStatusMention = true;
      }
    }
    
    // Check captions
    if (ms.message?.imageMessage?.caption) {
      const caption = ms.message.imageMessage.caption;
      if (caption.includes('@status') || caption.includes('status@broadcast')) {
        isStatusMention = true;
      }
    }
    
    if (ms.message?.videoMessage?.caption) {
      const caption = ms.message.videoMessage.caption;
      if (caption.includes('@status') || caption.includes('status@broadcast')) {
        isStatusMention = true;
      }
    }
    
    if (isStatusMention) {
      console.log("📵 Anti-status triggered!");
      
      // Delete message
      await zk.sendMessage(origineMessage, {
        delete: {
          remoteJid: origineMessage,
          fromMe: false,
          id: ms.key.id,
          participant: auteurMessage
        }
      });
      
      // Take action
      if (action === 'remove') {
        await zk.sendMessage(origineMessage, {
          text: `📵 @${auteurMessage.split('@')[0]} removed for status mentions.`,
          mentions: [auteurMessage]
        });
        await zk.groupParticipantsUpdate(origineMessage, [auteurMessage], "remove");
      }
      else if (action === 'warn') {
        const warnCount = await getWarnCountByJID(auteurMessage) || 0;
        const warnLimit = conf.WARN_COUNT || 3;
        
        if (warnCount >= warnLimit - 1) {
          await zk.sendMessage(origineMessage, {
            text: `📵 @${auteurMessage.split('@')[0]} removed (3 status mentions).`,
            mentions: [auteurMessage]
          });
          await zk.groupParticipantsUpdate(origineMessage, [auteurMessage], "remove");
          await resetWarnCountByJID(auteurMessage);
        } else {
          await ajouterUtilisateurAvecWarnCount(auteurMessage);
          await zk.sendMessage(origineMessage, {
            text: `📵 *STATUS MENTION* ⚠️\n@${auteurMessage.split('@')[0]} warning ${warnCount+1}/${warnLimit}`,
            mentions: [auteurMessage]
          });
        }
      }
      else {
        await zk.sendMessage(origineMessage, {
          text: `📵 @${auteurMessage.split('@')[0]} status mentions not allowed!`,
          mentions: [auteurMessage]
        });
      }
    }
    
  } catch (error) {
    console.error("Anti-status listener error:", error);
  }
});
