const { zokou } = require("../framework/zokou");
const { getAllSudoNumbers, isSudoTableNotEmpty } = require("../bdd/sudo");
const conf = require("../set");

// ═══════════════════════════════════════════════
//   ⚡ RAHMANI-XMD : OWNER & SUPPORT
// ═══════════════════════════════════════════════

// 1. OWNER COMMAND
zokou({ 
    nomCom: "owner", 
    categorie: "General", 
    reaction: "🚘",
    desc: "Get bot owner contact",
    fromMe: false
}, async (dest, zk, cmd) => {
    const { ms, mybotpic } = cmd;
    
    const thsudo = await isSudoTableNotEmpty();

    if (thsudo) {
        let msg = `👤 *BOT OWNER*\n\n`;
        msg += `🌟 *Main Owner:* @${conf.NUMERO_OWNER}\n\n`;
        msg += `------ *Other Sudos* ------\n`;
        
        let sudos = await getAllSudoNumbers();
        let mentionedJid = [];

        for (const sudo of sudos) {
            if (sudo) {
                const sudonumero = sudo.replace(/[^0-9]/g, '');
                msg += `💼 @${sudonumero}\n`;
                mentionedJid.push(`${sudonumero}@s.whatsapp.net`);
            }
        }

        const ownerJid = conf.NUMERO_OWNER.replace(/[^0-9]/g, '') + "@s.whatsapp.net";
        mentionedJid.push(ownerJid);

        await zk.sendMessage(dest, {
            image: { url: mybotpic() },
            caption: msg,
            mentions: mentionedJid
        }, { quoted: ms });

    } else {
        // Kama hakuna sudo, tuma kadi ya Owner
        const vcard = 'BEGIN:VCARD\n' +
            'VERSION:3.0\n' +
            `FN:${conf.OWNER_NAME}\n` +
            'ORG:RAHMANI-XMD;\n' +
            `TEL;type=CELL;type=VOICE;waid=${conf.NUMERO_OWNER}:+${conf.NUMERO_OWNER}\n` +
            'END:VCARD';

        await zk.sendMessage(dest, {
            contacts: {
                displayName: conf.OWNER_NAME,
                contacts: [{ vcard }],
            },
        }, { quoted: ms });
    }
});

// 2. DEV COMMAND
zokou({ 
    nomCom: "dev", 
    categorie: "General", 
    reaction: "🚘",
    desc: "Get developer contacts",
    fromMe: false
}, async (dest, zk, cmd) => {
    const { ms, mybotpic, repondre } = cmd;

    const devs = [
        { name: "Rahmani", number: "255693629079" },
        // Ongeza developers wengine hapa
    ];

    let message = `👨‍💻 *RAHMANI-XMD DEVELOPERS*\n\nAsk for help from any of the developers below:\n\n`;
    
    for (const dev of devs) {
        message += `----------------\n• *${dev.name}* : https://wa.me/${dev.number}\n`;
    }

    const lien = mybotpic();

    try {
        if (lien.match(/\.(mp4|gif)$/i)) {
            await zk.sendMessage(dest, { video: { url: lien }, caption: message }, { quoted: ms });
        } else if (lien.match(/\.(jpeg|png|jpg)$/i)) {
            await zk.sendMessage(dest, { image: { url: lien }, caption: message }, { quoted: ms });
        } else {
            await repondre(message);
        }
    } catch (e) {
        console.log("Dev Command Error:", e.message);
        await repondre("❌ *Failed to load developer list.*");
    }
});

// 3. SUPPORT COMMAND
zokou({ 
    nomCom: "support", 
    categorie: "General",
    reaction: "🆘",
    desc: "Get support links",
    fromMe: false
}, async (dest, zk, cmd) => {
    const { ms, repondre } = cmd;
    
    const text = `🆘 *RAHMANI-XMD SUPPORT*

Thank you for choosing RAHMANI-XMD. Here are our official links:

┌─────────────────────
│  👥 *Group Link:*
│https://chat.whatsapp.com/DTnrZzULVtP5r0E9rhoFOj?s=cl&p=a&mlu=4&ilr=4
│
│  📦 *GitHub Repo:*
│  https://github.com/Qartde/RAHMANI-XMD
│
│  🌐 *Session Site:*
│  https://rahmani-pair.onrender.com/
│
└─────────────────────

⚡ *Powered by RAHMANI-XMD*`;

    // Tumia ujumbe wa kawaida badala ya kadi ya media
    await zk.sendMessage(dest, { 
        text: text 
    }, { quoted: ms });
});
