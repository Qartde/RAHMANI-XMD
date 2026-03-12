const { zokou } = require("../framework/zokou"); const {getAllSudoNumbers,isSudoTableNotEmpty} = require("../luckydatabase/sudo") const conf = require("../set");

zokou({ nomCom: "owner", categorie: "Devs", reaction: "🚜" }, async (dest, zk, commandeOptions) => { const { ms , mybotpic } = commandeOptions;

const thsudo = await isSudoTableNotEmpty()

if (thsudo) { let msg = `My Super-User\n Owner Number\n :

😎 @${conf.NUMERO_OWNER}


------ other sudos -----\n`

let sudos = await getAllSudoNumbers()

for ( const sudo of sudos) { if (sudo) { sudonumero = sudo.replace(/[^0-9]/g, ''); msg += - 💼 @${sudonumero}\n; } else {return}

}   const ownerjid = conf.NUMERO_OWNER.replace(/[^0-9]/g) + "@s.whatsapp.net"; const mentionedJid = sudos.concat([ownerjid]) console.log(sudos); console.log(mentionedJid) zk.sendMessage( dest, { image : { url : mybotpic() }, caption : msg, mentions : mentionedJid } ) } else { const vcard = 'BEGIN:VCARD\n' + 'VERSION:3.0\n' + 'FN:' + conf.OWNER_NAME + '\n' + 'ORG:undefined;\n' + 'TEL;type=CELL;type=VOICE;waid=' + conf.NUMERO_OWNER + ':+' + conf.NUMERO_OWNER + '\n' + 'END:VCARD'; zk.sendMessage(dest, { contacts: { displayName: conf.OWNER_NAME, contacts: [{ vcard }], }, },{quoted:ms}); } });

zokou({ nomCom: "dev", categorie: "Devs", reaction: "🚜" }, async (dest, zk, commandeOptions) => { const { ms, mybotpic } = commandeOptions;

const devs = [
  { nom: "Rahmani", numero: "255693629079" },
  { nom: "Qart", numero: "255613300056" },
];

let message = "Uuhh Hellow These are the Dev's Contacts:\n\n";
for (const dev of devs) {
  message += `----------------\n• ${dev.nom} : https://wa.me/${dev.numero}\n`;
}

var lien = mybotpic() if (lien.match(/.(mp4|gif)$/i)) { try { zk.sendMessage(dest, { video: { url: lien }, caption:message }, { quoted: ms }); } catch (e) { console.log("🥵🥵 Menu erreur " + e); repondre("🥵🥵 Menu erreur " + e); } } else if (lien.match(/.(jpeg|png|jpg)$/i)) { try { zk.sendMessage(dest, { image: { url: lien }, caption:message }, { quoted: ms }); } catch (e) { console.log("🥵🥵 Menu erreur " + e); repondre("🥵🥵 Menu erreur " + e); } } else { repondre(lien) repondre("link error");

} });

zokou({ nomCom: "support", categorie: "Devs" }, async (dest, zk, commandeOptions) => { const { ms, repondre, auteurMessage, } = commandeOptions;

repondre("look on pm sir ") await zk.sendMessage(auteurMessage,{text :https://whatsapp.com/channel/0029VaihcQv84Om8LP59fO3f},{quoted :ms})

})

zokou({ nomCom: "developer", categorie: "General", reaction: "🚜" }, async (dest, zk, commandeOptions) => { const { ms, mybotpic } = commandeOptions;

const devs = [
  { nom: "Rahmani", numero: "255693629079" },
  { nom: "Qart", numero: "255613300056" },
];

let message = "*Holla Welcome to Rahmani-Md here is the developer numbers:*\n\n";
for (const dev of devs) {
  message += `----------------\n• ${dev.nom} : https://wa.me/${dev.numero}\n`;
}

var lien = mybotpic() if (lien.match(/.(mp4|gif)$/i)) { try { zk.sendMessage(dest, { video: { url: lien }, caption:message }, { quoted: ms }); } catch (e) { console.log("🥵🥵 Menu erreur " + e); repondre("🥵🥵 Menu erreur " + e); } } else if (lien.match(/.(jpeg|png|jpg)$/i)) { try { zk.sendMessage(dest, { image: { url: lien }, caption:message }, { quoted: ms }); } catch (e) { console.log("🥵🥵 Menu erreur " + e); repondre("🥵🥵 Menu erreur " + e); } } else { repondre(lien) repondre("link error");

} });

                                                                                                         
