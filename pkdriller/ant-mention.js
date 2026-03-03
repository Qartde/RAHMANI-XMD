const { zokou } = require("../framework/zokou");

let deleteTagActive = false; // Hali ya kipengele
let ownerNumber = "255693629079@s.whatsapp.net"; // 🔴 BADILI HII NA NAMBA YAKO!

zokou({
  nomCom: "deletetag",
  categorie: "Usimamizi",
  reaction: "🗑️"
}, async (origineMessage, zk, commandeOptions) => {
  const { ms, arg, repondre } = commandeOptions;
  
  // ANZA: Tafuta namba ya mtumaji na kikundi
  const sender = ms.sender || ms.key?.participant; // Anayetuma ujumbe
  const groupJid = origineMessage.key?.remoteJid; // ID ya kikundi
  const botNumber = zk.user.id.split(':')[0] + '@s.whatsapp.net'; // Namba ya bot
  
  // Hakikisha tunafanya kazi kwenye kikundi pekee
  if (!groupJid.endsWith('@g.us')) {
    return; // Usifanye chochote kama si kikundi
  }

  try {
    // ------ SEHEMU YA KUSHUGHULIKIA COMMAND (kuwasha/zima) ------
    if (arg && arg.length > 0) {
      const action = arg[0].toLowerCase();
      
      if (action === "on") {
        // Angalia kama mtumaji ni msimamizi wa kikundi
        const groupMetadata = await zk.groupMetadata(groupJid);
        const isAdmin = groupMetadata.participants.find(
          p => p.id === sender
        )?.admin;
        
        if (!isAdmin) {
          await repondre("❌ *Watu wanao washa feature hii ni msimamizi pekee!*");
          return;
        }
        
        deleteTagActive = true;
        await zk.sendMessage(groupJid, { 
          text: "✅ *DeleteTag imewashwa!* Ujumbe unaonitaja utafutwa moja kwa moja.",
          mentions: [sender]
        });
        return;
      } 
      else if (action === "off") {
        deleteTagActive = false;
        await zk.sendMessage(groupJid, { 
          text: "❌ *DeleteTag imezimwa!*",
          mentions: [sender]
        });
        return;
      }
    }

    // Kama kipengele kimezimwa, usifanye chochote
    if (!deleteTagActive) return;

    // ------ SEHEMU YA KUTAFUTA MAJAJI KWENYE UJUMBE ------
    
    // NJA MPYA: Angalia kwa undani zaidi majaji
    let mentionedJids = [];
    
    // Njia 1: Kwenye extendedTextMessage
    if (ms.message?.extendedTextMessage?.contextInfo?.mentionedJid) {
      mentionedJids = ms.message.extendedTextMessage.contextInfo.mentionedJid;
    }
    // Njia 2: Kwenye conversation (ujumbe wa kawaida)
    else if (ms.message?.conversation && ms.message.conversation.includes('@')) {
      // Tafuta namba zote kwenye ujumbe
      const words = ms.message.conversation.split(' ');
      for (const word of words) {
        if (word.startsWith('@') && word.includes('s.whatsapp.net')) {
          mentionedJids.push(word.replace('@', ''));
        }
      }
    }
    // Njia 3: Kwenye extendedTextMessage bila contextInfo
    else if (ms.message?.extendedTextMessage?.text && ms.message.extendedTextMessage.text.includes('@')) {
      const words = ms.message.extendedTextMessage.text.split(' ');
      for (const word of words) {
        if (word.startsWith('@') && word.includes('s.whatsapp.net')) {
          mentionedJids.push(word.replace('@', ''));
        }
      }
    }

    // DEBUG: Angalia kama tunapata majaji
    console.log("Majaji yaliyopatikana:", mentionedJids);
    console.log("Namba ya owner:", ownerNumber);

    // Kama hakuna majaji, acha tu
    if (mentionedJids.length === 0) return;

    // Angalia kama owner ametajwa
    if (mentionedJids.includes(ownerNumber)) {
      console.log("🚨 OWNER AMETAJWA! Tuchukue hatua...");
      
      // 1. Angalia kama bot ni msimamizi
      const groupMetadata = await zk.groupMetadata(groupJid);
      const botAdmin = groupMetadata.participants.find(p => p.id === botNumber)?.admin;
      
      if (!botAdmin) {
        // Tuma onyo la kumfanya bot msimamizi
        await zk.sendMessage(groupJid, {
          text: "⚠️ *Nifanye msimamizi ili niweze kufuta ujumbe unaonitaja!*",
          mentions: [sender]
        });
        return;
      }
      
      // 2. Tuma onyo kwa anayemtaja
      await zk.sendMessage(groupJid, {
        text: "🚫 *USINITAJA BWANA!* Ujumbe wako utafutwa sasa hivi.",
        mentions: [sender]
      });
      
      // 3. Futa ujumbe uliotaja (kwa nguvu zote!)
      try {
        // Unda key ya ujumbe kwa usahihi
        const messageKey = {
          remoteJid: groupJid,
          fromMe: false,
          id: ms.key.id,
          participant: ms.key.participant || sender
        };
        
        console.log("Jaribu kufuta ujumbe:", messageKey);
        
        await zk.sendMessage(groupJid, {
          delete: messageKey
        });
        
        console.log("✅ Ujumbe umefutwa!");
        
        // Tumia ujumbe wa kuthibitisha (utafutwa baada ya sekunde chache)
        const confirmMsg = await zk.sendMessage(groupJid, {
          text: "🗑️ *Ujumbe umefutwa kikamilifu!*"
        });
        
        // Futa ujumbe huo wa uthibitisho baada ya sekunde 5
        setTimeout(async () => {
          try {
            await zk.sendMessage(groupJid, {
              delete: confirmMsg.key
            });
          } catch (e) {}
        }, 5000);
        
      } catch (deleteError) {
        console.error("Hitilafu ya kufuta:", deleteError);
        await zk.sendMessage(groupJid, {
          text: "❌ *Nimeshindwa kufuta ujumbe*. Huenda sina ruhusa au ujumbe ni wa zamani.",
          mentions: [sender]
        });
      }
    }
  } catch (error) {
    console.error("❌ Hitilafu kubwa ya DeleteTag:", error);
    // Usitume ujumbe wa hitilafu kwenye kikundi ili kuepuka spam
  }
});
