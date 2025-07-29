const { zokou } = require("../framework/zokou");
const moment = require("moment-timezone");
const s = require("../set");

zokou({ 
  nomCom: "deployer", 
  categorie: "General",
  reaction: "👑",
  desc: "Show bot deployer information"
}, async (dest, zk, commandeOptions) => {
  const { repondre, ms, nomAuteurMessage, mybotpic } = commandeOptions;

  // Set timezone and format
  moment.tz.setDefault('Etc/GMT');
  const temps = moment().format('HH:mm:ss');
  const date = moment().format('DD/MM/YYYY');

  // Create information message
  const infoMsg = `*Hello ${nomAuteurMessage || "User"}!*\n\n` +
                 `*Deployer Information:*\n` +
                 `• *Name:* ${s.OWNER_NAME}\n` +
                 `• *Date:* ${date}\n` +
                 `• *Time:* ${temps}\n\n` +
                 `> *Powered by Rahmani Md*`;

  try {
    const mediaUrl = await mybotpic();
    
    if (mediaUrl) {
      // Determine media type and send accordingly
      if (mediaUrl.match(/\.(mp4|gif)$/i)) {
        await zk.sendMessage(dest, {
          video: { url: mediaUrl },
          caption: infoMsg,
          gifPlayback: true,
          contextInfo: {
            externalAdReply: {
              title: `Rahmani-Md Deployer`,
              body: "Premium WhatsApp Bot",
              thumbnailUrl: mediaUrl,
              mediaType: 2,
              mediaUrl: "https://files.catbox.moe/aktbgo.jpg",
              sourceUrl: "https://whatsapp.com/channel/0029VatokI45EjxufALmY32X"
            }
          }
        }, { quoted: ms });
      } 
      else if (mediaUrl.match(/\.(jpeg|png|jpg)$/i)) {
        await zk.sendMessage(dest, {
          image: { url: mediaUrl },
          caption: infoMsg,
          contextInfo: {
            externalAdReply: {
              title: `Rahmani-Md Deployer`,
              body: "Premium WhatsApp Bot",
              thumbnailUrl: mediaUrl,
              mediaType: 1,
              mediaUrl: "https://files.catbox.moe/aktbgo.jpg",
              sourceUrl: "https://whatsapp.com/channel/0029VatokI45EjxufALmY32X"
            }
          }
        }, { quoted: ms });
      } 
      else {
        await repondre(infoMsg);
      }
    } else {
      await repondre(infoMsg);
    }
  } catch (e) {
    console.error("Deployer Command Error:", e);
    await repondre("❌ An error occurred while processing the command");
  }
});
