const { zokou } = require("../framework/zokou");
const conf = require("../set");

zokou({
    nomCom: "owner",
    categorie: "General",
    reaction: "👤",
    desc: "Get bot owner contact",
    fromMe: false
}, async (dest, client, cmd) => {
    const { ms, repondre } = cmd;

    // Inachukua namba kutoka kwenye set.js au Heroku Environment Variable
    const ownerNumber = process.env.NUMERO_OWNER || conf.NUMERO_OWNER;
    const ownerName = process.env.OWNER_NAME || conf.OWNER_NAME || "Owner";

    if (!ownerNumber) {
        return repondre("❌ *Owner number is not set in the config.*");
    }

    // Inatengeneza Link ya WhatsApp
    const waLink = `https://wa.me/${ownerNumber.replace(/[^0-9]/g, '')}`;
    const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${ownerName}\nTEL;type=CELL;type=VOICE;waid=${ownerNumber.replace(/[^0-9]/g, '')}:+${ownerNumber.replace(/[^0-9]/g, '')}\nEND:VCARD`;

    const text = `👤 *BOT OWNER*

┌─────────────────────
│  📛 *Name:* ${ownerName}
│  📱 *Number:* +${ownerNumber.replace(/[^0-9]/g, '')}
│
│  🔗 *Contact Link:*
│  ${waLink}
│
└─────────────────────

⚡ *Powered by ${conf.BOT_NAME || "RAHMANI-XMD"}*`;

    // Inatuma ujumbe na Contact Card (VCard)
    await client.sendMessage(dest, { 
        text: text,
        mentions: [`${ownerNumber.replace(/[^0-9]/g, '')}@s.whatsapp.net`]
    }, { quoted: ms });

    // Inatuma Contact Card (Ili mtu aweze kubonyeza na kumsave)
    await client.sendMessage(dest, {
        contacts: {
            displayName: ownerName,
            contacts: [{ vcard: vcard }]
        }
    }, { quoted: ms });
});
