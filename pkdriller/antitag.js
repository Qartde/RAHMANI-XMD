const { zokou } = require("../framework/zokou");

// Store anti-tag settings for each group
let settings = new Map();

zokou({
  nomCom: "antitag",
  categorie: "Usalama",
  reaction: "🛡️"
}, async (origineMessage, zk, commandeOptions) => {
  const { ms, arg, repondu, sender } = commandeOptions;
  const groupId = origineMessage.key.remoteJid;
  
  // Check if in group
  if (!groupId.endsWith('@g.us')) {
    return repondu("❌ Command hii inafanya kazi kwenye *groups* pekee!");
  }
  
  try {
    // Initialize settings for new groups
    if (!settings.has(groupId)) {
      settings.set(groupId, {
        active: false,
        action: 'warn', // 'warn' or 'kick'
        ownerNumber: null
      });
    }
    
    const groupSettings = settings.get(groupId);
    
    // Handle commands
    if (arg.length > 0) {
      const command = arg[0].toLowerCase();
      
      // Turn ON
      if (command === "on") {
        groupSettings.active = true;
        settings.set(groupId, groupSettings);
        return repondu("✅ *Anti-tag imewashwa!*\n\nMtu atakayemtag owner atapata onyo.");
      }
      
      // Turn OFF
      if (command === "off") {
        groupSettings.active = false;
        settings.set(groupId, groupSettings);
        return repondu("❌ *Anti-tag imezimwa!*");
      }
      
      // Set action (warn or kick)
      if (command === "action") {
        if (arg[1] === "warn") {
          groupSettings.action = "warn";
          settings.set(groupId, groupSettings);
          return repondu("⚡ Mode: *Warning* - wanaotag owner watapewa onyo tu.");
        } else if (arg[1] === "kick") {
          groupSettings.action = "kick";
          settings.set(groupId, groupSettings);
          return repondu("👢 Mode: *Kick* - wanaotag owner watatolewa kwenye group.");
        } else {
          return repondu("Tumia: *antitag action warn* au *antitag action kick*");
        }
      }
      
      // Set owner number
      if (command === "setowner") {
        if (!arg[1]) return repondu("Tafadhali weka namba ya owner.\nMfano: *.antitag setowner 255693629079*");
        
        let ownerNum = arg[1].replace(/[^0-9]/g, '');
        if (ownerNum.length < 10) return repondu("❌ Namba si sahihi!");
        
        ownerNum = ownerNum + "@s.whatsapp.net";
        groupSettings.ownerNumber = ownerNum;
        settings.set(groupId, groupSettings);
        
        return repondu(`✅ Owner number imewekwa: *${arg[1]}*`);
      }
      
      // Check status
      if (command === "status") {
        const status = groupSettings.active ? "🟢 IMEWASHWA" : "🔴 IMEZIMWA";
        const action = groupSettings.action === "warn" ? "⚠️ Warning" : "👢 Kick";
        const owner = groupSettings.ownerNumber ? groupSettings.ownerNumber.split('@')[0] : "Haijawekwa";
        
        return repondu(`*📊 ANTI-TAG STATUS*\n\n` +
          `Hali: ${status}\n` +
          `Action: ${action}\n` +
          `Owner: ${owner}\n\n` +
          `*Commands:*\n` +
          `.antitag on - Washa\n` +
          `.antitag off - Zima\n` +
          `.antitag action warn/kick - Chagua action\n` +
          `.antitag setowner [namba] - Weka owner`);
      }
    }
    
    // Check if anti-tag is active
    if (!groupSettings.active) return;
    
    // Get mentioned JIDs
    let mentionedJids = [];
    
    // Check extended text message mentions
    if (ms.message?.extendedTextMessage?.contextInfo?.mentionedJid) {
      mentionedJids = ms.message.extendedTextMessage.contextInfo.mentionedJid;
    }
    
    // Check caption mentions (for media messages)
    if (ms.message?.imageMessage?.caption?.includes('@')) {
      const groupMetadata = await zk.groupMetadata(groupId);
      mentionedJids = groupMetadata.participants
        .filter(p => ms.message.imageMessage.caption.includes(`@${p.id.split('@')[0]}`))
        .map(p => p.id);
    }
    
    // If no mentions, return
    if (mentionedJids.length === 0) return;
    
    // Get owner number
    let ownerNumber = groupSettings.ownerNumber;
    if (!ownerNumber) {
      // Try to get from bot config
      const config = require("../config");
      ownerNumber = config.OWNER_NUMBER + "@s.whatsapp.net";
    }
    
    // Check if owner is mentioned
    if (mentionedJids.includes(ownerNumber)) {
      const tagger = ms.key.participant;
      const taggerName = sender?.pushName || "Mtu";
      
      // Take action based on settings
      if (groupSettings.action === "kick") {
        try {
          await zk.groupParticipantsUpdate(groupId, [tagger], "remove");
          
          await zk.sendMessage(groupId, {
            text: `👢 *${taggerName}* ametolewa kwenye group kwa kumtag owner!`
          });
        } catch (e) {
          // If cannot kick, send warning instead
          await zk.sendMessage(groupId, {
            text: `⚠️ *${taggerName}* USIMTAGE OWNER!`,
            mentions: [tagger]
          });
        }
      } else {
        // Send warning
        await zk.sendMessage(groupId, {
          text: `⚠️ *${taggerName}*, USIMTAGE MWENYEWE WA GROUP!`,
          mentions: [tagger]
        });
      }
    }
    
  } catch (error) {
    console.error("Error in anti-tag:", error);
    await repondu("❌ Kuna error imetokea. Tafadhali jaribu tena.");
  }
});
