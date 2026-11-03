const { bmbtz } = require("../../devbmb/bmbtz");
const mumaker = require("mumaker");

// VCard Contact
const quotedContact = {
  key: {
    fromMe: false,
    participant: `0@s.whatsapp.net`,
    remoteJid: "status@broadcast"
  },
  message: {
    contactMessage: {
      displayName: "RAHMANI VERIFIED ✅",
      vcard: "BEGIN:VCARD\nVERSION:3.0\nFN:RAHMANI VERIFIED ✅\nORG:RAHMANI-XMD BOT;\nTEL;type=CELL;type=VOICE;waid=255693629079:+255693629079\nEND:VCARD"
    }
  }
};

// Newsletter context
const contextInfo = {
  forwardingScore: 999,
  isForwarded: true,
  forwardedNewsletterMessageInfo: {
    newsletterJid: "120363353854480831@newsletter",
    newsletterName: "RAHMANI-XMD",
    serverMessageId: 1
  }
};

const logoCommands = [
  {
    nomCom: "hacker",
    categorie: "Logo",
    reaction: "👨🏿‍💻",
    makerUrl: "https://en.ephoto360.com/create-anonymous-hacker-avatars-cyan-neon-677.html"
  },
  {
    nomCom: "4d",
    categorie: "Logo",
    reaction: "👁️‍🗨️",
    makerUrl: "https://en.ephoto360.com/create-glowing-text-effects-online-706.html"
  },
  {
    nomCom: "boken",
    categorie: "Logo",
    reaction: "🔺",
    makerUrl: "https://en.ephoto360.com/bokeh-text-effect-86.html"
  },
  {
    nomCom: "starnight",
    categorie: "Logo",
    reaction: "🌃",
    makerUrl: "https://en.ephoto360.com/stars-night-online-84.html"
  },
  {
    nomCom: "xmd",
    categorie: "Logo",
    reaction: "🛰",
    makerUrl: "https://en.ephoto360.com/light-text-effect-futuristic-technology-style-648.html"
  },
  {
    nomCom: "3d",
    categorie: "Logo",
    reaction: "🎟",
    makerUrl: "https://en.ephoto360.com/create-3d-gradient-text-effect-online-600.html"
  },
  {
    nomCom: "luxury",
    categorie: "Logo",
    reaction: "🌄",
    makerUrl: "https://en.ephoto360.com/create-a-luxury-gold-text-effect-online-594.html"
  },
  {
    nomCom: "american",
    categorie: "Logo",
    reaction: "🇱🇷",
    makerUrl: "https://en.ephoto360.com/free-online-american-flag-3d-text-effect-generator-725.html"
  },
  {
    nomCom: "matrix",
    categorie: "Logo",
    reaction: "🔳",
    makerUrl: "https://en.ephoto360.com/matrix-text-effect-154.html"
  },
  {
    nomCom: "rah",
    categorie: "Logo",
    reaction: "⚗️",
    makerUrl: "https://en.ephoto360.com/1917-style-text-effect-523.html"
  },
  {
    nomCom: "thunder",
    categorie: "Logo",
    reaction: "🔷",
    makerUrl: "https://en.ephoto360.com/thunder-text-effect-online-97.html"
  }
  
];

// Process each logo command
logoCommands.forEach(({ nomCom, categorie, reaction, makerUrl }) => {
  bmbtz({ nomCom, categorie, reaction }, async (dest, client, commandeOptions) => {
    const { arg, repondre, ms, prefixe } = commandeOptions;

    if (!arg || arg == "") {
      return repondre(`Exemple of using:\n ${prefixe}${nomCom} RAHMANI-XMD`);
    }

    try {
      repondre("Processing...");

      const img = await mumaker.textpro(makerUrl, arg.join(" "));

      await client.sendMessage(dest, {
        image: { url: img.image },
        caption: `
╭──────────━⊷
║ *ʀᴀʜᴍᴀɴɪ-xᴍᴅ*
╰──────────━⊷
╭──────────━⊷
 ʀᴀʜᴍᴀɴɪ-xᴍᴅ ᴄʜᴀɴɴᴇʟ ᴜᴘᴅᴀᴛᴇs
 ᴛᴀᴘ: https://rahmani-xmd-k3nw.onrender.com
╰──────────━⊷

> ʀᴀʜᴍᴀɴɪ-xᴍᴅ
`,
        contextInfo
      }, { quoted: quotedContact });
    } catch (e) {
      repondre(`🥵🥵 ${e}`);
    }
  });
});
