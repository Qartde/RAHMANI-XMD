const { zokou } = require("../framework/zokou");

// ====== ADD COMMAND INFO COMMAND ======
zokou({
  nomCom: "cmdinfo",
  alias: ["cinfo", "commandinfo"],
  desc: "Get info about a specific command",
  categorie: "General",
  reaction: "ℹ️",
}, async (dest, zk, commandeOptions) => {
  const { arg, repondre, prefixe } = commandeOptions;
  const { cm } = require(__dirname + "/../framework/zokou");

  try {
    if (!arg[0]) return repondre(`❌ Please provide a command name!\nExample: ${prefixe}cmdinfo menu`);

    const cmdName = arg[0].toLowerCase();

    const command = cm.find(c => {
      if (!c.nomCom) return false;
      const patterns = c.nomCom.split('|');
      const aliases = c.alias || [];
      return patterns.some(p => p.toLowerCase() === cmdName) ||
             aliases.some(a => a.toLowerCase() === cmdName);
    });

    if (!command) return repondre(`❌ Command "${cmdName}" not found!`);

    let info = `📌 *COMMAND INFO*\n\n`;
    info += `*Command:* ${command.nomCom}\n`;
    info += `*Category:* ${command.categorie || 'General'}\n`;
    info += `*Description:* ${command.desc || 'No description'}\n`;
    if (command.alias && command.alias.length) {
      info += `*Aliases:* ${command.alias.join(', ')}\n`;
    }
    info += `*Filename:* ${command.filename ? command.filename.split('/').pop() : 'unknown'}`;

    await repondre(info);
  } catch (e) {
    console.error(e);
    await repondre(`❌ Error: ${e.message}`);
  }
});
