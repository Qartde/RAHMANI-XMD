const { zokou } = require("../framework/zokou")
//const { getGroupe } = require("../bdd/groupe")
const { Sticker, StickerTypes } = require('wa-sticker-formatter');
const {ajouterOuMettreAJourJid,mettreAJourAction,verifierEtatJid} = require("../bdd/antilien")
const {atbajouterOuMettreAJourJid,atbverifierEtatJid} = require("../bdd/antibot")
const { search, download } = require("aptoide-scraper");
const fs = require("fs-extra");
const conf = require("../set");
const { default: axios } = require('axios');
//const { uploadImageToImgur } = require('../framework/imgur');

//=====================================================
// TAGALL COMMAND
//=====================================================
zokou({ nomCom: "tagall", categorie: 'Group', reaction: "🐝" }, async (dest, zk, commandeOptions) => {

  const { ms, repondre, arg, verifGroupe, nomGroupe, infosGroupe, nomAuteurMessage, verifAdmin, superUser } = commandeOptions

  if (!verifGroupe) { 
    repondre("✋🏿 ✋🏿this command is reserved for groups ❌"); 
    return; 
  }
  
  if (!arg || arg === ' ') {
    mess = 'Aucun Message'
  } else {
    mess = arg.join(' ')
  };
  
  let membresGroupe = verifGroupe ? await infosGroupe.participants : ""
  var tag = ""; 
  tag +=`
╭─────────────━┈⊷ 
│ RAHMANI-XMD TAG
╰─────────────━┈⊷ \n
│👥 *Group* : ${nomGroupe} 
│👤 *Hey😀* : *${nomAuteurMessage}* 
│📜 *Message* : *${mess}* 
╰─────────────━┈⊷\n
\n
`;

  let emoji = ['🦴', '👀', '😮‍💨', '❌', '✔️', '😇', '⚙️', '🔧', '🎊', '😡', '🙏🏿', '⛔️', '$','😟','🥵','🐅']
  let random = Math.floor(Math.random() * (emoji.length - 1))

  for (const membre of membresGroupe) {
    tag += `${emoji[random]}      @${membre.id.split("@")[0]}\n`
  }

  if (verifAdmin || superUser) {
    zk.sendMessage(dest, { text: tag, mentions: membresGroupe.map((i) => i.id) }, { quoted: ms })
  } else { 
    repondre('command reserved for admins')
  }
});

//=====================================================
// LINK COMMAND
//=====================================================
zokou({ nomCom: "link", categorie: 'Group', reaction: "🙋" }, async (dest, zk, commandeOptions) => {
  const { repondre, nomGroupe, nomAuteurMessage, verifGroupe } = commandeOptions;
  
  if (!verifGroupe) { 
    repondre("wait bro , you want the link to my dm?"); 
    return; 
  }

  var link = await zk.groupInviteCode(dest)
  var lien = `https://chat.whatsapp.com/${link}`;

  let mess = `hello ${nomAuteurMessage} , here is the group link for ${nomGroupe} \n\nGroup link :${lien} \n\n® RAHMANI-XMD`
  repondre(mess)
});

//=====================================================
// PROMOTE COMMAND
//=====================================================
zokou({ nomCom: "promote", categorie: 'Group', reaction: "👨🏿‍💼" }, async (dest, zk, commandeOptions) => {
  let { repondre, msgRepondu, infosGroupe, auteurMsgRepondu, verifGroupe, auteurMessage, superUser, idBot } = commandeOptions;
  let membresGroupe = verifGroupe ? await infosGroupe.participants : ""
  
  if (!verifGroupe) { 
    return repondre("For groups only"); 
  }

  const verifMember = (user) => {
    for (const m of membresGroupe) {
      if (m.id !== user) {
        continue;
      }
      else { return true }
    }
  }

  const memberAdmin = (membresGroupe) => {
    let admin = [];
    for (m of membresGroupe) {
      if (m.admin == null) continue;
      admin.push(m.id);
    }
    return admin;
  }

  const a = verifGroupe ? memberAdmin(membresGroupe) : '';
  let admin = verifGroupe ? a.includes(auteurMsgRepondu) : false;
  let membre = verifMember(auteurMsgRepondu)
  let autAdmin = verifGroupe ? a.includes(auteurMessage) : false;
  let zkad = verifGroupe ? a.includes(idBot) : false;
  
  try {
    if (autAdmin || superUser) {
      if (msgRepondu) {
        if (zkad) {
          if (membre) {
            if (admin == false) {
              var txt = `🎊🎊🎊  @${auteurMsgRepondu.split("@")[0]} rose in rank.\nhe/she has been named group administrator.`
              await zk.groupParticipantsUpdate(dest, [auteurMsgRepondu], "promote");
              zk.sendMessage(dest, { text: txt, mentions: [auteurMsgRepondu] })
            } else { 
              return repondre("This member is already an administrator of the group.") 
            }
          } else { 
            return repondre("This user is not part of the group."); 
          }
        } else { 
          return repondre("Sorry, I cannot perform this action because I am not an administrator of the group.") 
        }
      } else { 
        repondre("please tag the member to be nominated"); 
      }
    } else { 
      return repondre("Sorry I cannot perform this action because you are not an administrator of the group.") 
    }
  } catch (e) { 
    repondre("oups " + e) 
  }
});

//=====================================================
// DEMOTE COMMAND
//=====================================================
zokou({ nomCom: "demote", categorie: 'Group', reaction: "👨🏿‍💼" }, async (dest, zk, commandeOptions) => {
  let { repondre, msgRepondu, infosGroupe, auteurMsgRepondu, verifGroupe, auteurMessage, superUser, idBot } = commandeOptions;
  let membresGroupe = verifGroupe ? await infosGroupe.participants : ""
  
  if (!verifGroupe) { 
    return repondre("For groups only"); 
  }

  const verifMember = (user) => {
    for (const m of membresGroupe) {
      if (m.id !== user) {
        continue;
      }
      else { return true }
    }
  }

  const memberAdmin = (membresGroupe) => {
    let admin = [];
    for (m of membresGroupe) {
      if (m.admin == null) continue;
      admin.push(m.id);
    }
    return admin;
  }

  const a = verifGroupe ? memberAdmin(membresGroupe) : '';
  let admin = verifGroupe ? a.includes(auteurMsgRepondu) : false;
  let membre = verifMember(auteurMsgRepondu)
  let autAdmin = verifGroupe ? a.includes(auteurMessage) : false;
  let zkad = verifGroupe ? a.includes(idBot) : false;
  
  try {
    if (autAdmin || superUser) {
      if (msgRepondu) {
        if (zkad) {
          if (membre) {
            if (admin == false) {
              repondre("This member is not a group administrator.")
            } else {
              var txt = `@${auteurMsgRepondu.split("@")[0]} was removed from his position as a group administrator\n`
              await zk.groupParticipantsUpdate(dest, [auteurMsgRepondu], "demote");
              zk.sendMessage(dest, { text: txt, mentions: [auteurMsgRepondu] })
            }
          } else { 
            return repondre("This user is not part of the group."); 
          }
        } else { 
          return repondre("Sorry I cannot perform this action because I am not an administrator of the group.") 
        }
      } else { 
        repondre("please tag the member to be removed"); 
      }
    } else { 
      return repondre("Sorry I cannot perform this action because you are not an administrator of the group.") 
    }
  } catch (e) { 
    repondre("oups " + e) 
  }
});

//=====================================================
// REMOVE COMMAND
//=====================================================
zokou({ nomCom: "remove", categorie: 'Group', reaction: "👨🏿‍💼" }, async (dest, zk, commandeOptions) => {
  let { ms, repondre, msgRepondu, infosGroupe, auteurMsgRepondu, verifGroupe, nomAuteurMessage, auteurMessage, superUser, idBot } = commandeOptions;
  let membresGroupe = verifGroupe ? await infosGroupe.participants : ""
  
  if (!verifGroupe) { 
    return repondre("for groups only"); 
  }

  const verifMember = (user) => {
    for (const m of membresGroupe) {
      if (m.id !== user) {
        continue;
      }
      else { return true }
    }
  }

  const memberAdmin = (membresGroupe) => {
    let admin = [];
    for (m of membresGroupe) {
      if (m.admin == null) continue;
      admin.push(m.id);
    }
    return admin;
  }

  const a = verifGroupe ? memberAdmin(membresGroupe) : '';
  let admin = verifGroupe ? a.includes(auteurMsgRepondu) : false;
  let membre = verifMember(auteurMsgRepondu)
  let autAdmin = verifGroupe ? a.includes(auteurMessage) : false;
  let zkad = verifGroupe ? a.includes(idBot) : false;
  
  try {
    if (autAdmin || superUser) {
      if (msgRepondu) {
        if (zkad) {
          if (membre) {
            if (admin == false) {
              const gifLink = "https://raw.githubusercontent.com/djalega8000/Zokou-MD/main/media/remover.gif"
              var sticker = new Sticker(gifLink, {
                pack: 'Zokou-Md',
                author: nomAuteurMessage,
                type: StickerTypes.FULL,
                categories: ['🤩', '🎉'],
                id: '12345',
                quality: 50,
                background: '#000000'
              });

              await sticker.toFile("st.webp")
              var txt = `@${auteurMsgRepondu.split("@")[0]} was removed from the group.\n`
              await zk.groupParticipantsUpdate(dest, [auteurMsgRepondu], "remove");
              zk.sendMessage(dest, { text: txt, mentions: [auteurMsgRepondu] })
              fs.unlinkSync("st.webp");
            } else { 
              repondre("This member cannot be removed because he is an administrator of the group.") 
            }
          } else { 
            return repondre("This user is not part of the group."); 
          }
        } else { 
          return repondre("Sorry, I cannot perform this action because I am not an administrator of the group.") 
        }
      } else { 
        repondre("please tag the member to be removed"); 
      }
    } else { 
      return repondre("Sorry I cannot perform this action because you are not an administrator of the group.") 
    }
  } catch (e) { 
    repondre("oups " + e) 
  }
});

//=====================================================
// DELETE COMMAND
//=====================================================
zokou({ nomCom: "del", categorie: 'Group', reaction: "🧹" }, async (dest, zk, commandeOptions) => {
  const { ms, repondre, verifGroupe, auteurMsgRepondu, idBot, msgRepondu, verifAdmin, superUser } = commandeOptions;
  
  if (!msgRepondu) {
    repondre("Please mention the message to delete.");
    return;
  }
  
  if(superUser && auteurMsgRepondu == idBot) {
    if(auteurMsgRepondu == idBot) {
      const key = {
        remoteJid: dest,
        fromMe: true,
        id: ms.message.extendedTextMessage.contextInfo.stanzaId,
      }
      await zk.sendMessage(dest, { delete: key });
      return;
    } 
  }

  if(verifGroupe) {
    if(verifAdmin || superUser) {
      try {
        const key = {
          remoteJid: dest,
          id: ms.message.extendedTextMessage.contextInfo.stanzaId,
          fromMe: false,
          participant: ms.message.extendedTextMessage.contextInfo.participant
        }        
        await zk.sendMessage(dest, { delete: key });
        return;
      } catch(e) {
        repondre("I need admin rights.")
      }
    } else {
      repondre("Sorry, you are not an administrator of the group.")
    }
  }
});

//=====================================================
// GROUP INFO COMMAND
//=====================================================
zokou({ nomCom: "info", categorie: 'Group' }, async (dest, zk, commandeOptions) => {
  const { ms, repondre, verifGroupe } = commandeOptions;
  
  if (!verifGroupe) { 
    repondre("order reserved for the group only"); 
    return 
  }

  let ppgroup;
  try { 
    ppgroup = await zk.profilePictureUrl(dest, 'image'); 
  } catch { 
    ppgroup = conf.IMAGE_MENU || "https://files.catbox.moe/aktbgo.jpg";
  }

  const info = await zk.groupMetadata(dest)

  let mess = {
    image: { url: ppgroup },
    caption: `*━━━━『Group Info』━━━━*\n\n*🎐Name:* ${info.subject}\n\n*🔩Group's ID:* ${dest}\n\n*🔍Desc:* \n\n${info.desc || "No description"}`
  }

  zk.sendMessage(dest, mess, { quoted: ms })
});

//=====================================================
// ANTILINK COMMAND
//=====================================================
zokou({ nomCom: "antilink", categorie: 'Group', reaction: "🔗" }, async (dest, zk, commandeOptions) => {
  var { repondre, arg, verifGroupe, superUser, verifAdmin } = commandeOptions;
  
  if (!verifGroupe) {
    return repondre("*for groups only*");
  }
  
  if(superUser || verifAdmin) {
    const enetatoui = await verifierEtatJid(dest)
    try {
      if (!arg || !arg[0] || arg === ' ') { 
        repondre("antilink on to activate the anti-link feature\nantilink off to deactivate the anti-link feature\nantilink action/remove to directly remove the link without notice\nantilink action/warn to give warnings\nantilink action/delete to remove the link without any sanctions\n\nPlease note that by default, the anti-link feature is set to delete."); 
        return;
      }
     
      if(arg[0] === 'on') {
        if(enetatoui) { 
          repondre("the antilink is already activated for this group")
        } else {
          await ajouterOuMettreAJourJid(dest,"oui");
          repondre("the antilink is activated successfully") 
        }
      } else if (arg[0] === "off") {
        if (enetatoui) { 
          await ajouterOuMettreAJourJid(dest, "non");
          repondre("The antilink has been successfully deactivated");
        } else {
          repondre("antilink is not activated for this group");
        }
      } else if (arg.join('').split("/")[0] === 'action') {
        let action = (arg.join('').split("/")[1]).toLowerCase();

        if (action == 'remove' || action == 'warn' || action == 'delete') {
          await mettreAJourAction(dest,action);
          repondre(`The anti-link action has been updated to ${arg.join('').split("/")[1]}`);
        } else {
          repondre("The only actions available are warn, remove, and delete");
        }
      } else {
        repondre("antilink on to activate the anti-link feature\nantilink off to deactivate the anti-link feature\nantilink action/remove to directly remove the link without notice\nantilink action/warn to give warnings\nantilink action/delete to remove the link without any sanctions\n\nPlease note that by default, the anti-link feature is set to delete.")
      }
    } catch (error) {
      repondre(error.toString())
    }
  } else { 
    repondre('Not entitled to this order');
  }
});

//=====================================================
// ANTIBOT COMMAND
//=====================================================
zokou({ nomCom: "antibot", categorie: 'Group', reaction: "😬" }, async (dest, zk, commandeOptions) => {
  var { repondre, arg, verifGroupe, superUser, verifAdmin } = commandeOptions;
  
  if (!verifGroupe) {
    return repondre("*for groups only*");
  }
  
  if(superUser || verifAdmin) {
    const enetatoui = await atbverifierEtatJid(dest)
    try {
      if (!arg || !arg[0] || arg === ' ') { 
        repondre('antibot on to activate the anti-bot feature\nantibot off to deactivate the antibot feature\nantibot action/remove to directly remove the bot without notice\nantibot action/warn to give warnings\nantibot action/delete to remove the bot message without any sanctions\n\nPlease note that by default, the anti-bot feature is set to delete.'); 
        return;
      }
     
      if(arg[0] === 'on') {
        if(enetatoui) { 
          repondre("the antibot is already activated for this group")
        } else {
          await atbajouterOuMettreAJourJid(dest,"oui");
          repondre("the antibot is successfully activated") 
        }
      } else if (arg[0] === "off") {
        if (enetatoui) { 
          await atbajouterOuMettreAJourJid(dest, "non");
          repondre("The antibot has been successfully deactivated");
        } else {
          repondre("antibot is not activated for this group");
        }
      } else if (arg.join('').split("/")[0] === 'action') {
        let action = (arg.join('').split("/")[1]).toLowerCase();

        if (action == 'remove' || action == 'warn' || action == 'delete') {
          await mettreAJourAction(dest,action);
          repondre(`The anti-bot action has been updated to ${arg.join('').split("/")[1]}`);
        } else {
          repondre("The only actions available are warn, remove, and delete");
        }
      } else {  
        repondre('antibot on to activate the anti-bot feature\nantibot off to deactivate the antibot feature\nantibot action/remove to directly remove the bot without notice\nantibot action/warn to give warnings\nantibot action/delete to remove the bot message without any sanctions\n\nPlease note that by default, the anti-bot feature is set to delete.');
      }
    } catch (error) {
      repondre(error.toString())
    }
  } else { 
    repondre('You are not entitled to this order');
  }
});

//=====================================================
// GROUP OPEN/CLOSE COMMAND
//=====================================================
zokou({ nomCom: "group", categorie: 'Group' }, async (dest, zk, commandeOptions) => {
  const { repondre, verifGroupe, verifAdmin, superUser, arg } = commandeOptions;

  if (!verifGroupe) { 
    repondre("order reserved for group only"); 
    return 
  };
  
  if (superUser || verifAdmin) {
    if (!arg[0]) { 
      repondre('Instructions:\n\nType group open or close'); 
      return; 
    }
    
    const option = arg.join(' ')
    switch (option) {
      case "open":
        await zk.groupSettingUpdate(dest, 'not_announcement')
        repondre('group open')
        break;
      case "close":
        await zk.groupSettingUpdate(dest, 'announcement');
        repondre('Group close successfully');
        break;
      default: 
        repondre("Please don't invent an option")
    }
  } else {
    repondre("order reserved for the administrator");
    return;
  }
});

//=====================================================
// LEAVE GROUP COMMAND
//=====================================================
zokou({ nomCom: "left", categorie: "Mods" }, async (dest, zk, commandeOptions) => {
  const { repondre, verifGroupe, superUser } = commandeOptions;
  
  if (!verifGroupe) { 
    repondre("order reserved for group only"); 
    return 
  };
  
  if (!superUser) {
    repondre("command reserved for the bot owner");
    return;
  }
  
  await repondre('sayonnara') ;
  zk.groupLeave(dest)
});

//=====================================================
// GROUP NAME CHANGE COMMAND
//=====================================================
zokou({ nomCom: "gname", categorie: 'Group' }, async (dest, zk, commandeOptions) => {
  const { arg, repondre, verifAdmin } = commandeOptions;

  if (!verifAdmin) {
    repondre("order reserved for administrators of the group");
    return;
  };
  
  if (!arg[0]) {
    repondre("Please enter the group name");
    return;
  };
  
  const nom = arg.join(' ')
  await zk.groupUpdateSubject(dest, nom);
  repondre(`group name refresh: *${nom}*`)
});

//=====================================================
// GROUP DESCRIPTION CHANGE COMMAND
//=====================================================
zokou({ nomCom: "gdesc", categorie: 'Group' }, async (dest, zk, commandeOptions) => {
  const { arg, repondre, verifAdmin } = commandeOptions;

  if (!verifAdmin) {
    repondre("order reserved for administrators of the group");
    return;
  };
  
  if (!arg[0]) {
    repondre("Please enter the group description");
    return;
  };
  
  const nom = arg.join(' ')
  await zk.groupUpdateDescription(dest, nom);
  repondre(`group description update: *${nom}*`)
});

//=====================================================
// GROUP PROFILE PICTURE CHANGE COMMAND
//=====================================================
zokou({ nomCom: "gpp", categorie: 'Group' }, async (dest, zk, commandeOptions) => {
  const { repondre, msgRepondu, verifAdmin } = commandeOptions;

  if (!verifAdmin) {
    repondre("order reserved for administrators of the group");
    return;
  }; 
  
  if (msgRepondu && msgRepondu.imageMessage) {
    try {
      const pp = await zk.downloadAndSaveMediaMessage(msgRepondu.imageMessage);
      await zk.updateProfilePicture(dest, { url: pp });
      zk.sendMessage(dest, { text: "Group pfp changed" });
      fs.unlinkSync(pp);
    } catch (err) {
      zk.sendMessage(dest, { text: err.toString() });
    }
  } else {
    repondre('Please mention an image')
  }
});

//=====================================================
// HIDETAG COMMAND (FIXED COMPLETE VERSION)
//=====================================================
zokou({ nomCom: "hidetag", categorie: 'Group', reaction: "🎤" }, async (dest, zk, commandeOptions) => {
  const { repondre, msgRepondu, verifGroupe, arg, verifAdmin, superUser } = commandeOptions;

  if (!verifGroupe) { 
    repondre('This command is only allowed in groups.');
    return;
  }
  
  if (verifAdmin || superUser) { 
    let metadata = await zk.groupMetadata(dest);
    let participants = metadata.participants;
    let message = arg.join(' ') || ' ';
    
    let mentions = [];
    for (let participant of participants) {
      mentions.push(participant.id);
    }
    
    await zk.sendMessage(dest, {
      text: message,
      mentions: mentions
    });
  } else {
    repondre('This command is only for group admins');
  }
});
