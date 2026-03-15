const { zokou } = require("../framework/zokou");
const fancy = require("../pkdriller/style");

zokou({
  nomCom: "fancy",
  categorie: "Fun",
  reaction: "💫",
  desc: "Convert text to fancy styles"
}, async (dest, zk, commandeOptions) => {
  
  const { arg, repondre, prefixe, ms } = commandeOptions;
  const id = arg[0]?.match(/\d+/)?.join('');
  const text = arg.slice(1).join(" ");

  try {
    // Show style list if no arguments
    if (id === undefined || text === undefined) {
      const styleList = fancy.list('RAHMANI-XMD', fancy);
      
      const fancyMenu = `
╭━━━━━━━━━━━━━━━━━━━━╮
┃   💫 *FANCY TEXT* 💫
╰━━━━━━━━━━━━━━━━━━━━╯

┌─── *AVAILABLE STYLES* ───┐
${styleList.split('\n').map(line => `│ ${line}`).join('\n')}
└──────────────────────────┘

┌─── *USAGE* ───┐
│ 📝 *Example:* ${prefixe}fancy 10 RAHMANI-XMD
│ 🔢 *Styles:* 1-${Object.keys(fancy).length}
└────────────────┘

> *RAHMANI-XMD* 💫
      `;

      await zk.sendMessage(dest, {
        text: fancyMenu
      }, { quoted: ms });
      
      return;
    }

    // Check if style exists
    const selectedStyle = fancy[parseInt(id) - 1];
    
    if (!selectedStyle) {
      return await repondre(`╭━━━━━━━━━━━━━━╮
┃   ❌ *ERROR* ❌
╰━━━━━━━━━━━━━━╯

┌─── *STYLE NOT FOUND* ───┐
│ Style number ${id} doesn't exist
│ Use styles 1-${Object.keys(fancy).length}
└────────────────────────┘

> *RAHMANI-XMD* 💫`);
    }

    // Apply fancy style
    const fancyText = fancy.apply(selectedStyle, text);
    
    // Send result
    await repondre(`╭━━━━━━━━━━━━━━╮
┃   💫 *RESULT* 💫
╰━━━━━━━━━━━━━━╯

┌─── *FANCY TEXT* ───┐
│ ${fancyText}
└────────────────────┘

┌─── *INFO* ───┐
│ 🎨 *Style:* ${id}
│ 📝 *Original:* ${text.substring(0, 30)}
└────────────────┘

> *RAHMANI-XMD* 💫`);

  } catch (error) {
    console.error("Fancy command error:", error);
    await repondre(`❌ Error: ${error.message}`);
  }
});
