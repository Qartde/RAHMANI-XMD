// antilink.js - Command to enable/disable anti-link in groups
const {
  activerAntiLien,
  desactiverAntiLien,
  definirActionAntiLien,
  verifierEtatJid,
  recupererActionJid
} = require('../bdd/antilien');

module.exports = {
  nomCom: 'antilink',
  categorie: 'Group Settings',
  reaction: '🔗',
  description: 'Manage anti-link settings in groups',
  usage: '{prefix}antilink [on/off/action] [delete/remove/warn]',
  permission: ['admin', 'superUser'],
  execute: async (chatJid, client, args, options) => {
    const { repondre, verifAdmin, superUser, verifGroupe } = options;
    
    if (!verifGroupe) {
      return repondre('❌ This command only works in groups!');
    }
    
    if (!verifAdmin && !superUser) {
      return repondre('❌ Only group admins can use this command!');
    }
    
    const subCommand = args[0]?.toLowerCase();
    const action = args[1]?.toLowerCase();
    
    // Check current status
    const currentStatus = await verifierEtatJid(chatJid);
    const currentAction = await recupererActionJid(chatJid);
    
    // No arguments - show current status
    if (!subCommand) {
      const statusText = currentStatus ? '✅ ENABLED' : '❌ DISABLED';
      const actionText = currentAction ? currentAction.toUpperCase() : 'NONE';
      
      return repondre(
        `🔗 *ANTI-LINK SETTINGS*\n\n` +
        `📊 *Status:* ${statusText}\n` +
        `⚙️ *Action:* ${actionText}\n\n` +
        `📝 *Commands:*\n` +
        `• ${options.prefixe}antilink on - Enable anti-link\n` +
        `• ${options.prefixe}antilink off - Disable anti-link\n` +
        `• ${options.prefixe}antilink action delete - Delete links only\n` +
        `• ${options.prefixe}antilink action remove - Remove user\n` +
        `• ${options.prefixe}antilink action warn - Warn user`
      );
    }
    
    // Handle enable/disable
    if (subCommand === 'on') {
      await activerAntiLien(chatJid);
      return repondre(
        `✅ *ANTI-LINK ENABLED*\n\n` +
        `🔗 The bot will now detect and remove links in this group.\n` +
        `⚙️ Current action: ${currentAction ? currentAction.toUpperCase() : 'DELETE'}\n\n` +
        `Use: ${options.prefixe}antilink action [delete/remove/warn] to change action.`
      );
    }
    
    if (subCommand === 'off') {
      await desactiverAntiLien(chatJid);
      return repondre(
        `❌ *ANTI-LINK DISABLED*\n\n` +
        `🔗 Links are now allowed in this group.`
      );
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
          `Example: ${options.prefixe}antilink action delete`
        );
      }
      
      await definirActionAntiLien(chatJid, action);
      
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
    }
    
    return repondre(
      `❌ *INVALID COMMAND*\n\n` +
      `Usage:\n` +
      `• ${options.prefixe}antilink on\n` +
      `• ${options.prefixe}antilink off\n` +
      `• ${options.prefixe}antilink action [delete/remove/warn]`
    );
  }
};
