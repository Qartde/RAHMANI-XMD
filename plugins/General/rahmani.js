const { bmbtz } = require("../../devbmb/bmbtz");

const OWNER_NUMBER = "255693629079";
const OWNER_NAME = "Rahmani XMD";
const LOCATION = "Mbagala, Dar es Salaam, Tanzania 🇹🇿";

bmbtz({
    nomCom: "rahmani",
    alias: ["ownerinfo", "contact", "mbagala"],
    categorie: "General",
    reaction: "👑",
}, async (dest, client, commandeOptions) => {
    const { ms, repondre } = commandeOptions;

    const react = (emoji) =>
        client.sendMessage(dest, { react: { text: emoji, key: ms.key } }).catch(() => {});

    const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${OWNER_NAME}\nORG:RAHMANI-XMD Bot;\nTEL;type=CELL;type=VOICE;waid=${OWNER_NUMBER}:+${OWNER_NUMBER}\nEND:VCARD`;

    await react("⌛");

    try {
        // ====== INTERACTIVE CARD ======
        await client.relayMessage(dest, {
            interactiveMessage: {
                header: {
                    title: "👑 RAHMANI-XMD OWNER",
                    hasMediaAttachment: false
                },
                body: {
                    text: 
`*╭━━━〔 👤 OWNER DETAILS 〕━━━⬣*
*┃*
*┃ 👑 Name    :* ${OWNER_NAME}
*┃ 📞 Number  :* +${OWNER_NUMBER}
*┃ 📍 Location:* ${LOCATION}
*┃ 🏢 Project :* RAHMANI-XMD Bot
*┃*
*╰━━━━━━━━━━━━━━━━━━⬣*

*╭━━━〔 📌 EXTRA INFO 〕━━━⬣*
*┃*
*┃ 🌍 Country :* Tanzania
*┃ 🏙️ City    :* Dar es Salaam
*┃ 🏘️ Area    :* Mbagala
*┃ 💬 Status  :* Online
*┃*
*╰━━━━━━━━━━━━━━━━━━⬣*

*🥀 Powered by RAHMANI-XMD 🥀*`
                },
                footer: {
                    text: "RAHMANI-XMD"
                },
                nativeFlowMessage: {
                    buttons: [
                        {
                            name: "cta_url",
                            buttonParamsJson: JSON.stringify({
                                display_text: "📞 Chat Owner",
                                url: `https://wa.me/${OWNER_NUMBER}`
                            })
                        },
                        {
                            name: "cta_url",
                            buttonParamsJson: JSON.stringify({
                                display_text: "📢 Join Channel",
                                url: "https://whatsapp.com/channel/0029VatokI45EjxufALmY32X"
                            })
                        }
                    ],
                    messageParamsJson: ""
                },
                contextInfo: {
                    mentionedJid: [`${OWNER_NUMBER}@s.whatsapp.net`]
                }
            }
        }, {});

        await react("✅");

        // ====== TUMA VCARD ======
        await client.sendMessage(dest, {
            contacts: { displayName: OWNER_NAME, contacts: [{ vcard }] }
        });

    } catch (error) {
        console.error("Rahmani command error:", error);
        await react("❌");

        // ====== FALLBACK (KAMA INTERACTIVE IMESHINDWA) ======
        const fallbackText = 
`*╭━━━〔 👑 OWNER DETAILS 〕━━━⬣*
*┃*
*┃ 👑 Name    :* ${OWNER_NAME}
*┃ 📞 Number  :* +${OWNER_NUMBER}
*┃ 📍 Location:* ${LOCATION}
*┃ 🏢 Project :* RAHMANI-XMD Bot
*┃*
*╰━━━━━━━━━━━━━━━━━━⬣*

*📌 Chat Owner:* https://wa.me/${OWNER_NUMBER}
*📢 Join Channel:* https://whatsapp.com/channel/0029VatokI45EjxufALmY32X

*🥀 Powered by RAHMANI-XMD 🥀*`;

        await repondre(fallbackText);

        await client.sendMessage(dest, {
            contacts: { displayName: OWNER_NAME, contacts: [{ vcard }] }
        });
    }
});
