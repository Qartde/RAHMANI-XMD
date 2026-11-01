'use strict';

const conf = require('../set');
const {
  activerAntiLien,
  desactiverAntiLien,
  ajouterJid,
  verifierEtatJid,
  recupererActionJid
} = require('../bdd/antilien');

module.exports = {
  nomCom: 'antilink',
  categorie: 'Group',
  reaction: '🛡️',
  
  // Function hii ndio inayotekeleza amri
  fonction: async (dest, zk, commandeOptions) => {
    const { ms, arg, verifGroupe, verifAdmin, superUser, repondre } = commandeOptions;

    // 1. Kagua kama ni group
    if (!verifGroupe) {
      return repondre("❌ Amri hii inafanya kazi kwenye magroup tu.");
    }

    // 2. Kagua kama mtumiaji ni Admin au Owner
    if (!verifAdmin && !superUser) {
      return repondre("❌ Unahitaji kuwa Admin wa group au Owner wa Bot kutumia amri hii.");
    }

    const action = arg[0] ? arg[0].toLowerCase() : '';

    try {
      if (action === 'on') {
        // Tunajaribu kutumia functions zilizopo kwenye bdd yako
        if (typeof activerAntiLien === 'function') {
          await activerAntiLien(dest);
        } else if (typeof ajouterJid === 'function') {
          await ajouterJid(dest, 'oui', 'remove'); // Default ni kufuta ujumbe
        } else {
          return repondre("❌ Kuna tatizo kwenye mfumo wa database ya antilink (bdd/antilien).");
        }

        return repondre(`┏━━━━━━━━━━━━━━━━━━━━━┓\n┃ 🛡️ *ANTILINK IMEWASHWA* 🛡️\n┗━━━━━━━━━━━━━━━━━━━━━┛\n\n✅ Bot sasa itafuta link zote zinazotumwa na watu wasio Admin.\n\n🤖 *RAHMANI-XMD*`);

      } else if (action === 'off') {
        // Tunajaribu kutumia functions zilizopo kwenye bdd yako
        if (typeof desactiverAntiLien === 'function') {
          await desactiverAntiLien(dest);
        } else if (typeof ajouterJid === 'function') {
          await ajouterJid(dest, 'non', 'remove');
        } else {
          return repondre("❌ Kuna tatizo kwenye mfumo wa database ya antilink (bdd/antilien).");
        }

        return repondre(`┏━━━━━━━━━━━━━━━━━━━━━┓\n┃ 🛡️ *ANTILINK IMEZIMWA* 🛡️\n┗━━━━━━━━━━━━━━━━━━━━━┛\n\n❌ Bot haitafuta link tena kwenye group hili.\n\n🤖 *RAHMANI-XMD*`);

      } else {
        // Msaada kama hakuandika on/off
        return repondre(`⚙️ *Matumizi ya Antilink:*\n\n.antilink on  ➔ Kuwasha\n.antilink off ➔ Kuzima\n\n🤖 *RAHMANI-XMD*`);
      }
    } catch (error) {
      console.error("Antilink Command Error:", error);
      return repondre("❌ Kuna hitilafu imetokea wakati wa kuwasha/kuzima antilink.");
    }
  }
};
