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

module.exports = async (zk, message, commandeOptions) => {
  try {
    const { ms, origineMessage, verifGroupe, auteurMessage, texte, superUser, verifAdmin, idBot } = commandeOptions;
    
    // Only process in groups
    if (!verifGroupe) return;
    
    // Don't process bot's own messages
    if (ms.key.fromMe) return;
    
    // Don't process superUser or admin messages
    if (superUser || verifAdmin) return;
    
    // Check if anti-status is enabled for this group
    const antiStatusEnabled = await verifierStatusEtatJid(origineMessage);
    if (!antiStatusEnabled) return;
    
    // Get action for this group
    const action = await recupererStatusActionJid(origineMessage) || 'delete';
    
    // Check for status mentions in ALL message types
    let isStatusMention = false;
    
    // 1. Check quoted message (when someone quotes a status)
    if (ms.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
      const quotedParticipant = ms.message.extendedTextMessage.contextInfo.participant;
      if (quotedParticipant && quotedParticipant.includes('status@broadcast')) {
        isStatusMention = true;
        console.log("📵 Status mention detected: quoted status");
      }
    }
    
    // 2. Check for status mention in text
    if (texte) {
      if (texte.includes('@status') || 
          texte.includes('status@broadcast') ||
          (texte.toLowerCase().includes('status') && texte.includes('@'))) {
        isStatusMention = true;
        console.log("📵 Status mention detected: text mention");
      }
    }
    
    // 3. Check for status mentions in media captions
    if (ms.message?.imageMessage?.caption) {
      const caption = ms.message.imageMessage.caption;
      if (caption.includes('@status') || caption.includes('status@broadcast')) {
        isStatusMention = true;
        console.log("📵 Status mention detected: image caption");
      }
    }
    
    if (ms.message?.videoMessage?.caption) {
      const caption = ms.message.videoMessage.caption;
      if (caption.includes('@status') || caption.includes('status@broadcast')) {
        isStatusMention = true;
        console.log("📵 Status mention detected: video caption");
      }
    }
    
    // If status mention detected
    if (isStatusMention) {
      const sender = auteurMessage;
      const key = {
        remoteJid: origineMessage,
        fromMe: false,
        id: ms.key.id,
        participant: sender
      };
      
      // STEP 1: DELETE THE MESSAGE IMMEDIATELY (ALWAYS)
      await zk.sendMessage(origineMessage, { delete: key });
      console.log("✅ Status mention message deleted");
      
      // STEP 2: TAKE ACTION BASED ON SETTINGS
      if (action === 'remove') {
        // Remove immediately
        await zk.sendMessage(origineMessage, {
          text: `📵 @${sender.split('@')[0]} removed for status mentions.`,
          mentions: [sender]
        });
        await zk.groupParticipantsUpdate(origineMessage, [sender], "remove");
        console.log("User removed for status mention");
      }
      else if (action === 'warn') {
        // 3-strike rule
        const warnCount = await getWarnCountByJID(sender) || 0;
        const warnLimit = conf.WARN_COUNT || 3;
        
        if (warnCount >= warnLimit - 1) { // If this is the 3rd strike
          // Remove on 3rd strike
          await zk.sendMessage(origineMessage, {
            text: `📵 @${sender.split('@')[0]} removed (3 status mentions).`,
            mentions: [sender]
          });
          await zk.groupParticipantsUpdate(origineMessage, [sender], "remove");
          await resetWarnCountByJID(sender);
          console.log("User removed after 3 status mentions");
        } else {
          // Add warning
          await ajouterUtilisateurAvecWarnCount(sender);
          const remaining = warnLimit - (warnCount + 1);
          await zk.sendMessage(origineMessage, {
            text: `📵 *STATUS MENTION* ⚠️\n@${sender.split('@')[0]} warning ${warnCount+1}/${warnLimit}`,
            mentions: [sender]
          });
          console.log(`Warning ${warnCount+1} given`);
        }
      }
      else {
        // Delete only
        await zk.sendMessage(origineMessage, {
          text: `📵 @${sender.split('@')[0]} status mentions not allowed!`,
          mentions: [sender]
        });
      }
    }
    
  } catch (error) {
    console.error("Anti-status event error:", error);
  }
};
