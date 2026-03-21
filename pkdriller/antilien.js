// antilien.js - Simple version first
const {
  ajouterOuMettreAJourJid,
  mettreAJourAction,
  verifierEtatJid,
  recupererActionJid
} = require('../bdd/antilien');

module.exports = {
  nomCom: 'antilien',
  categorie: 'Group Settings',
  reaction: '🔗',
  description: 'Anti-link command',
  usage: '{prefix}antilien',
  permission: ['admin', 'superUser'],
  execute: async (chatJid, client, args, options) => {
    const { repondre, verifAdmin, superUser, verifGroupe } = options;
    
    console.log('🔥 ANTILIEN COMMAND TRIGGERED!');
    console.log('Chat Jid:', chatJid);
    console.log('Args:', args);
    console.log('Is Group:', verifGroupe);
    console.log('Is Admin:', verifAdmin);
    
    if (!verifGroupe) {
      return repondre('❌ This command only works in groups!');
    }
    
    if (!verifAdmin && !superUser) {
      return repondre('❌ Only group admins can use this command!');
    }
    
    try {
      const currentStatus = await verifierEtatJid(chatJid);
      const currentAction = await recupererActionJid(chatJid);
      
      console.log('Current Status:', currentStatus);
      console.log('Current Action:', currentAction);
      
      const subCommand = args[0]?.toLowerCase();
      
      if (subCommand === 'on') {
        await ajouterOuMettreAJourJid(chatJid, 'oui');
        return repondre('✅ ANTI-LINK ENABLED!');
      }
      
      if (subCommand === 'off') {
        await ajouterOuMettreAJourJid(chatJid, 'non');
        return repondre('❌ ANTI-LINK DISABLED!');
      }
      
      const statusText = currentStatus ? 'ENABLED' : 'DISABLED';
      const actionText = currentAction === 'supp' ? 'DELETE' : currentAction.toUpperCase();
      
      return repondre(
        `🔗 *ANTI-LINK STATUS*\n\n` +
        `Status: ${statusText}\n` +
        `Action: ${actionText}\n\n` +
        `Commands:\n` +
        `• ${options.prefixe}antilien on\n` +
        `• ${options.prefixe}antilien off`
      );
      
    } catch (error) {
      console.log('Error in antilien command:', error);
      return repondre(`❌ Error: ${error.message}`);
    }
  }
};
