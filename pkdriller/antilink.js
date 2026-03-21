// antilien.js - Command to enable/disable anti-link in groups
const {
  ajouterOuMettreAJourJid,
  mettreAJourAction,
  verifierEtatJid,
  recupererActionJid
} = require('../bdd/antilien');

module.exports = {
  nomCom: 'antilink',
  aliases: ['antilink', 'antilinkon', 'antilinkoff'],
  categorie: 'Group Settings',
  reaction: '🔗',
  description: 'Manage anti-link settings in groups',
  usage: '{prefix}antilien [on/off/action] [delete/remove/warn]',
  permission: ['admin', 'superUser'],
  execute: async (chatJid, client, args, options) => {
    const { repondre, verifAdmin, superUser, verifGroupe } = options;
    
    console.log('📝 Anti-link command executed');
    console.log('Chat JID:', chatJid);
    console.log('Args:', args);
    
    if (!verifGroupe) {
      return repondre('❌ This command only works in groups!');
    }
    
    if (!verifAdmin && !superUser) {
      return repondre('❌ Only group admins can use this command!');
    }
    
    const subCommand = args[0]?.toLowerCase();
    const action = args[1]?.toLowerCase();
    
    // Check current status
    let currentStatus = false;
    let currentAction = 'supp';
    
    try {
      currentStatus = await verifierEtatJid(chatJid);
      currentAction = await recupererActionJid(chatJid);
      console.log('Current status:', currentStatus, 'Action:', currentAction);
    } catch (error) {
      console.log('Error checking status:', error);
    }
    
    // Map actions for display
    const actionMap = {
      'supp': 'DELETE',
      'delete': 'DELETE',
      'remove': 'REMOVE',
      'warn': 'WARN'
    };
    
    const displayAction = actionMap[currentAction] || 'DELETE';
    
    // No arguments - show current status
    if (!subCommand) {
      const statusText = currentStatus ? '✅ ENABLED' : '❌ DISABLED';
      
      return repondre(
        `🔗 *ANTI-LINK SETTINGS*\n\n` +
        `📊 *Status:* ${statusText}\n` +
        `⚙️ *Action:* ${displayAction}\n\n` +
        `📝 *Commands:*\n` +
        `• ${options.prefixe}antilien on - Enable anti-link\n` +
        `• ${options.prefixe}antilien off - Disable anti-link\n` +
        `• ${options.prefixe}antilien action delete - Delete links only\n` +
        `• ${options.prefixe}antilien action remove - Remove user\n` +
        `• ${options.prefixe}antilien action warn - Warn user`
      );
    }
    
    // Handle enable/disable
    if (subCommand === 'on') {
      try {
        await ajouterOuMettreAJourJid(chatJid, 'oui');
        console.log('Anti-link enabled for:', chatJid);
        return repondre(
          `✅ *ANTI-LINK ENABLED*\n\n` +
          `🔗 The bot will now detect and remove links in this group.\n` +
          `⚙️ Current action: ${displayAction}\n\n` +
          `Use: ${options.prefixe}antilien action [delete/remove/warn] to change action.`
        );
      } catch (error) {
        console.log('Error enabling anti-link:', error);
        return repondre(`❌ Error enabling anti-link: ${error.message}`);
      }
    }
    
    if (subCommand === 'off') {
      try {
        await ajouterOuMettreAJourJid(chatJid, 'non');
        console.log('Anti-link disabled for:', chatJid);
        return repondre(
          `❌ *ANTI-LINK DISABLED*\n\n` +
          `🔗 Links are now allowed in this group.`
        );
      } catch (error) {
        console.log('Error disabling anti-link:', error);
        return repondre(`❌ Error disabling anti-link: ${error.message}`);
      }
    }
    
    // Handle action change
    if (subCommand === 'action') {
      if (!action || !['delete', 'remove', 'warn'].includes(action)) {
        return repondre(
          `⚠️ *INVALID ACTION*\n\n` +
          `Available actions:\n` +
          `• delete - Delete messages with links only\n` +
          `• remove - Remove user from group\n` +
          `• warn - Warn user (with warning count)\n\n` +
          `Example: ${options.prefixe}antilien action delete`
        );
      }
      
      try {
        // Convert action to match your database format
        const dbAction = action === 'delete' ? 'supp' : action;
        await mettreAJourAction(chatJid, dbAction);
        console.log('Action updated to:', dbAction, 'for:', chatJid);
        
        const actionEmoji = {
          delete: '🗑️',
          remove: '🚫',
          warn: '⚠️'
        };
        
        return repondre(
          `${actionEmoji[action]} *ANTI-LINK ACTION UPDATED*\n\n` +
          `Action changed to: *${action.toUpperCase()}*\n\n` +
          `• Delete: Message will be deleted\n` +
          `• Remove: User will be removed from group\n` +
          `• Warn: User will receive a warning`
        );
      } catch (error) {
        console.log('Error updating action:', error);
        return repondre(`❌ Error updating action: ${error.message}`);
      }
    }
    
    return repondre(
      `❌ *INVALID COMMAND*\n\n` +
      `Usage:\n` +
      `• ${options.prefixe}antilien on\n` +
      `• ${options.prefixe}antilien off\n` +
      `• ${options.prefixe}antilien action [delete/remove/warn]`
    );
  }
};
