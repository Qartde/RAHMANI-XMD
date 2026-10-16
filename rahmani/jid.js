const { zokou } = require("../framework/zokou");
const conf = require("../set");

zokou({
    nomCom: "jid",
    categorie: "General",
    reaction: "🆔",
    desc: "Get JID of group, channel or user",
    fromMe: false
}, async (dest, zk, commandeOptions) => {
    const { ms, msgRepondu, repondre, auteurMessage } = commandeOptions;

    let jid = auteurMessage;
    let type = "👤 USER";
    let extraInfo = "";

    // ============================================
    //   🧠 SMART DETECT — Inatambua kila kitu
    // ============================================

    // 1) Kama ni reply kwa message
    if (msgRepondu) {
        // Check kama ni channel message (forwarded)
        const forwardedChannel = ms.message?.extendedTextMessage?.contextInfo?.forwardedNewsletterMessageInfo;
        
        if (forwardedChannel) {
            jid = forwardedChannel.newsletterJid;
            type = "📢 CHANNEL";
            extraInfo = `
│  📛 *Name:* ${forwardedChannel.newsletterName || "N/A"}
│  🔗 *Link:* https://whatsapp.com/channel/${jid.split('@')[0]}`;
        } else {
            // Reply kwa mtu
            jid = msgRepondu.key?.participant || msgRepondu.sender || auteurMessage;
            type = "👤 USER";
        }
    }

    // 2) Kama ni group
    else if (dest.endsWith("@g.us")) {
        jid = dest;
        type = "👥 GROUP";
        try {
            const meta = await zk.groupMetadata(dest);
            extraInfo = `
│  📛 *Name:* ${meta.subject}
│  👥 *Members:* ${meta.participants.length}
│  📝 *Desc:* ${meta.desc ? meta.desc.substring(0, 50) + "..." : "N/A"}`;
        } catch (e) {
            extraInfo = `
│  ⚠️ *Could not fetch group info*`;
        }
    }

    // 3) Kama ni channel
    else if (dest.endsWith("@newsletter")) {
        jid = dest;
        type = "📢 CHANNEL";
        extraInfo = `
│  🔗 *Link:* https://whatsapp.com/channel/${jid.split('@')[0]}`;
    }

    // 4) Kama ni user (DM)
    else {
        jid = auteurMessage;
        type = "👤 USER";
        const number = jid.split('@')[0];
        extraInfo = `
│  📱 *Number:* +${number}
│  📞 *Format:* ${number}`;
    }

    // Date & Time
    const now = new Date();
    const date = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
    const time = now.toLocaleTimeString('en-GB');

    const text = `🆔 *${conf.BOT_NAME || "RAHMANI-XMD"} JID*

┌─────────────────────
│  🏷️ *Type:* ${type}
│
│  🆔 *JID:*
│  \`${jid}\`
│
${extraInfo}
│
├─────────────────────
│  📆 Date: *${date}*
│  🕐 Time: *${time}*
│
└─────────────────────

> *View channel*`;

    await zk.sendMessage(dest, {
        text: text,
        mentions: [auteurMessage],
        contextInfo: {
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: "120363353854480831@newsletter",
                newsletterName: conf.BOT_NAME || "RAHMANI-XMD",
                serverMessageId: 143
            },
            externalAdReply: {
                title: `🆔 ${conf.BOT_NAME || "RAHMANI-XMD"} JID FINDER`,
                body: "Get any JID easily",
                mediaType: 1,
                mediaUrl: "https://whatsapp.com/channel/0029VatokI45EjxufALmY32X",
                sourceUrl: "https://whatsapp.com/channel/0029VatokI45EjxufALmY32X",
                thumbnailUrl: "https://files.catbox.moe/aktbgo.jpg",
                showAdAttribution: false,
                renderLargerThumbnail: true
            }
        }
    }, { quoted: ms });
});
