const { bmbtz } = require("../../devbmb/bmbtz");
const util = require("util");
const fs = require("fs-extra");
const path = require("path");
const os = require("os");
const moment = require("moment-timezone");
const { format } = require(__dirname + "/../../devbmb/mesfonctions");
const s = require(__dirname + "/../../settings");

// ====== LOAD RANDOM IMAGE FROM /scs FOLDER ======
function getRandomScsImage() {
    const scsFolder = path.join(__dirname, "../scs");
    if (!fs.existsSync(scsFolder)) return null;
    
    const images = fs.readdirSync(scsFolder).filter(f =>
        /^menu\d+\.(jpg|jpeg|png|mp4|gif)$/i.test(f)
    );
    
    if (images.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * images.length);
    return path.join(scsFolder, images[randomIndex]);
}

// ====== CONTACT QUOTE ======
const quotedContact = {
  key: {
    fromMe: false,
    participant: `0@s.whatsapp.net`,
    remoteJid: "status@broadcast"
  },
  message: {
    contactMessage: {
      displayName: "RAHMANI-XMD ✅",
      vcard:
        "BEGIN:VCARD\n" +
        "VERSION:3.0\n" +
        "FN:RAHMANI-XMD ✅\n" +
        "ORG:RAHMANI-XMD BOT;\n" +
        "TEL;type=CELL;type=VOICE;waid=255693629079:+255693629079\n" +
        "END:VCARD"
    }
  }
};

// ====== CONTEXT INFO ======
const contextInfo = {
  forwardingScore: 999,
  isForwarded: true,
  forwardedNewsletterMessageInfo: {
    newsletterJid: "120363353854480831@newsletter",
    newsletterName: "RAHMANI-XMD",
    serverMessageId: 1
  }
};

// ====== BOT INFO (IMEBORESHWA) ======
function getBotInfo(mode, totalCommands) {
  const usedRAM = format(os.totalmem() - os.freemem());
  const totalRAM = format(os.totalmem());

  return `*╭━━━〔 🤖 RAHMANI-XMD 〕━━━⬣*
*┃*
*┃ ⚙️ Mode    :* ${mode.toUpperCase()}
*┃ 💾 RAM     :* ${usedRAM} / ${totalRAM}
*┃ 📦 Commands:* ${totalCommands}
*┃ 🟢 Status  :* ONLINE
*┃ 👑 Creator :* Rahmani Tech
*┃ 🌐 Website :* bmbtech.online
*┃*
*╰━━━━━━━━━━━━━━━━━━⬣*\n`;
}

// ====== MAIN COMMAND ======
bmbtz({
  nomCom: "menu1",
  categorie: "General",
  reaction: "✨",
}, async (dest, client, commandeOptions) => {
  const { ms, repondre, prefixe } = commandeOptions;
  const { cm } = require(__dirname + "/../../devbmb/bmbtz");

  // ====== GROUP COMMANDS BY CATEGORY ======
  let coms = {};
  let mode = s.MODE.toLowerCase() !== "yes" ? "private" : "public";

  for (const com of cm) {
    if (!coms[com.categorie]) coms[com.categorie] = [];
    coms[com.categorie].push(com.nomCom);
  }

  const categories = Object.keys(coms);
  const totalCommands = cm.length;

  // ====== GET RANDOM IMAGE FROM /scs ======
  const imagePath = getRandomScsImage();
  
  // ====== BUILD OPTIONS TEXT (IMEBORESHWA) ======
  let optionsText = `*╭━━━〔 📂 SELECT CATEGORY 〕━━━⬣*\n\n`;
  
  categories.forEach((cat, index) => {
    optionsText += ` *${index + 1}.* ${cat.toUpperCase()}\n`;
  });
  
  optionsText += `\n*╰━━━━━━━━━━━━━━━━━━⬣*\n`;
  optionsText += `*📝 Reply with a number (1-${categories.length})*`;

  // ====== SEND OPTIONS WITH IMAGE ======
  let sentMessage;
  if (imagePath) {
    try {
      const imageBuffer = fs.readFileSync(imagePath);
      sentMessage = await client.sendMessage(dest, {
        image: imageBuffer,
        caption: optionsText,
        contextInfo,
      }, { quoted: quotedContact });
    } catch (error) {
      sentMessage = await client.sendMessage(dest, {
        text: optionsText,
        contextInfo,
      }, { quoted: quotedContact });
    }
  } else {
    sentMessage = await client.sendMessage(dest, {
      text: optionsText,
      contextInfo,
    }, { quoted: quotedContact });
  }

  // ====== LISTENER ======
  const listener = async (update) => {
    const message = update.messages[0];
    if (!message.message || !message.message.extendedTextMessage) return;

    // Check if replying to menu options
    if (message.message.extendedTextMessage.contextInfo?.stanzaId !== sentMessage.key.id) return;

    const responseText = message.message.extendedTextMessage.text.trim();
    const categoryIndex = parseInt(responseText) - 1;

    // ====== VALIDATE NUMBER ======
    if (isNaN(categoryIndex) || categoryIndex < 0 || categoryIndex >= categories.length) {
      await client.sendMessage(message.key.remoteJid, { 
        text: `❌ *Invalid number!* Please reply with a number between 1 and ${categories.length}.` 
      }, { quoted: message });
      return;
    }

    try {
      // ====== REACT TO USER (PROCESSING) ======
      await client.sendMessage(message.key.remoteJid, {
        react: { text: "⏳", key: message.key }
      });

      const selectedCategory = categories[categoryIndex];
      const commands = coms[selectedCategory];

      // ====== BUILD CATEGORY MENU (IMEBORESHWA) ======
      let menuText = `*╭━━━〔 📂 ${selectedCategory.toUpperCase()} 〕━━━⬣*\n\n`;
      commands.forEach((cmd) => {
        menuText += `  🔹 *${prefixe}${cmd}*\n`;
      });
      menuText += `\n*╰━━━━━━━━━━━━━━━━━━⬣*\n`;

      const infoText = getBotInfo(mode, totalCommands);
      const finalText = infoText + `\n` + menuText;

      // ====== SEND MENU WITH RANDOM IMAGE ======
      const categoryImagePath = getRandomScsImage();
      if (categoryImagePath) {
        try {
          const categoryImageBuffer = fs.readFileSync(categoryImagePath);
          await client.sendMessage(dest, {
            image: categoryImageBuffer,
            caption: finalText,
            contextInfo,
          }, { quoted: ms });
        } catch (error) {
          await client.sendMessage(dest, {
            text: finalText,
            contextInfo,
          }, { quoted: ms });
        }
      } else {
        await client.sendMessage(dest, {
          text: finalText,
          contextInfo,
        }, { quoted: ms });
      }

      // ====== REACT SUCCESS ======
      await client.sendMessage(message.key.remoteJid, {
        react: { text: "✅", key: message.key }
      });

      // ====== REMOVE LISTENER AFTER SUCCESS ======
      client.ev.off('messages.upsert', listener);

    } catch (error) {
      console.error(error);
      await client.sendMessage(message.key.remoteJid, { 
        text: `❌ *Error:* ${error.message}` 
      }, { quoted: message });
    }
  };

  // Attach listener
  client.ev.on('messages.upsert', listener);
});
