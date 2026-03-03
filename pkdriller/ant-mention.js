const { zokou } = require("../framework/zokou");

let deleteTagActive = false; // Hali ya kipengele (washa/zima)

zokou({
  nomCom: "deletetag",
  categorie: "Usimamizi",
  reaction: "🗑️"
}, async (origineMessage, zk, commandeOptions) => {
  const { ms, arg, repondre } = commandeOptions;
  const sender = ms.sender; // Anayetuma amri
  const groupJid = origineMessage.key.remoteJid; // ID ya kikundi
  const botNumber = zk.user.id.split(':')[0] + '@s.whatsapp.net'; // Namba ya bot

  try {
    // ------ SEHEMU YA KUWASHA/ZIMA KIPENGELE ------
    if (arg.length > 0) {
      const action = arg[0].toLowerCase();
      
      if (action === "on") {
        // Angalia kama mtumiaji ni msimamizi
        const groupMetadata = await zk.groupMetadata(groupJid);
        const isAdmin = groupMetadata.participants.find(
          p => p.id === sender
        )?.admin;
        
        if (!isAdmin && sender !== ownerJid) {
          return await repondre("❌ *Watu wanao washa hii feature ni msimamizi pekee!*");
        }
        
        deleteTagActive = true;
        await zk.sendMessage(groupJid, { 
          text: "✅ *DeleteTag imewashwa!* Ujumbe unaonitaja utafutwa moja kwa moja." 
        });
        return;
      } 
      else if (action === "off") {
        deleteTagActive = false;
        await zk.sendMessage(groupJid, { 
          text: "❌ *DeleteTag imezimwa!*" 
        });
        return;
      }
    }

    // Kama kipengele kimezimwa, usifanye chochote
    if (!deleteTagActive) return;

    // ------ SEHEMU YA KUTAMBUA NA KUFUTA UJUMBE ------
    
    // Angalia kama kuna mtajo katika ujumbe
    if (ms.message && 
        ms.message.extendedTextMessage && 
        ms.message.extendedTextMessage.contextInfo && 
        ms.message.extendedTextMessage.contextInfo.mentionedJid) {
      
      const mentionedJids = ms.message.extendedTextMessage.contextInfo.mentionedJid;
      const ownerJid = "255693629079@s.whatsapp.net"; // 🔴 BADILI HII NA NAMBA YAKO HALISI!
      
      // Angalia kama namba yako imetajwa
      if (mentionedJids.includes(ownerJid)) {
        
        // 1. Angalia kama bot ni msimamizi (inaweza kufuta)
        const groupMetadata = await zk.groupMetadata(groupJid);
        const botAdmin = groupMetadata.participants.find(p => p.id === botNumber)?.admin;
        
        if (!botAdmin) {
          // Kama bot si msimamizi, tuma onyo tu
          return await zk.sendMessage(groupJid, {
            text: "⚠️ *Nifanye msimamizi ili niweze kufuta ujumbe unaonitaja!*",
            mentions: [ms.sender]
          });
        }
        
        // 2. Tuma onyo kwa anayemtaja
        await zk.sendMessage(groupJid, {
          text: "🚫 *USINITAJA!* Ujumbe wako utafutwa sasa hivi.",
          mentions: [ms.sender]
        });
        
        // 3. Futa ujumbe uliotaja
        try {
          await zk.sendMessage(groupJid, {
            delete: {
              remoteJid: groupJid,
              fromMe: false,
              id: ms.key.id,
              participant: ms.key.participant || ms.sender
            }
          });
          console.log("✅ Ujumbe umefutwa!");
        } catch (deleteError) {
          console.error("Hitilafu ya kufuta:", deleteError);
          await zk.sendMessage(groupJid, {
            text: "❌ *Nimeshindwa kufuta ujumbe*. Huenda sina ruhusa au ujumbe ni wa zamani."
          });
        }
      }
    }
  } catch (error) {
    console.error("Hitilafu ya DeleteTag:", error);
    await zk.sendMessage(groupJid, {
      text: "❌ *Hitilafu ilitokea. Jaribu tena.*"
    });
  }
});
