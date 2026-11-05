const { bmbtz } = require("../../devbmb/bmbtz");

/**
 * owner
 *
 * Sends an interactive card (title/body/footer + buttons) via
 * relayMessage, followed by a vCard contact.
 * Falls back to a plain text card + vCard if the interactive
 * message fails to send (e.g. unsupported on the recipient's client).
 */

const DEV_NUMBER = "255693629079";
const DEV_NAME = "Rahmani xmd | Rahmani Dev";
const DEV_ORG = "RAHMANI-XMD Bot";

bmbtz({
    nomCom: "owner",
    alias: ["developer", "dev", "creator", "devcontact"],
    categorie: "General",
    reaction: "👑",
}, async (dest, client, commandeOptions) => {
    const { ms, repondre } = commandeOptions;

    const react = (emoji) =>
        client.sendMessage(dest, { react: { text: emoji, key: ms.key } }).catch(() => {});

    const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${DEV_NAME}\nORG:${DEV_ORG};\nTEL;type=CELL;type=VOICE;waid=${DEV_NUMBER}:+${DEV_NUMBER}\nEND:VCARD`;

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
`*╭━━━〔 👤 OWNER INFO 〕━━━⬣*
*┃*
*┃ 🏷️ Tag     :* @${DEV_NUMBER} 🇹🇿
*┃ 👑 Name    :* Rahmani
*┃ 🏢 Project :* RAHMANI-XMD
*┃ 🌍 Country :* Tanzania
*┃*
*╰━━━━━━━━━━━━━━━━━━⬣*

*╭━━━〔 ⚠️ RULES 〕━━━⬣*
*┃*
*┃ 🚫 Don't call the owner*
*┃ 🚫 Don't talk shit*
*┃ 🚫 Don't spam*
*┃ 🚫 Don't goon 😡*
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
                            name: "booking_confirmation",
                            buttonParamsJson: JSON.stringify({
                                icon: "default",
                                start_datetime: "2026-06-10T10:37:10.967Z",
                                end_datetime: "2026-06-10T10:47:10.967Z",
                                location: "tech",
                                booking_url: `https://wa.me/${DEV_NUMBER}`,
                                phone_number: DEV_NUMBER,
                                booking_management_url: "https://whatsapp.com/channel/0029VatokI45EjxufALmY32X",
                                description: 
`*◦ 👤 Name    :* Rahmani
*◦ 📞 Number  :* +${DEV_NUMBER}
*◦ 💭 Bio     :* xmd
*◦ ⚡ Status  :* Developer
*◦ 🌍 Country :* Tanzania`,
                                email: "R",
                                display_text: "👑 More Owner Info",
                                display_content: {
                                    display_language: "en",
                                    display_meeting_type: "Info",
                                    display_bottom_sheet_header: "👑 OWNER PROFILE",
                                    display_add_to_calendar_cta_text: "CALENDAR",
                                    display_view_on_maps_cta_text: "OWNER COUNTRY",
                                    display_manage_booking_cta_text: "🔥 Follow",
                                    display_manage_booking_not_supported_text: "OWNER NOT REGISTERED",
                                    display_read_more: "READ MORE"
                                }
                            })
                        },
                        {
                            name: "cta_url",
                            buttonParamsJson: JSON.stringify({
                                display_text: "📞 Owner Number",
                                url: `https://wa.me/${DEV_NUMBER}`
                            })
                        }
                    ],
                    messageParamsJson: ""
                },
                contextInfo: {
                    mentionedJid: [`${DEV_NUMBER}@s.whatsapp.net`]
                }
            }
        }, {});

        await react("✅");

        // ====== SEND VCARD ======
        await client.sendMessage(dest, {
            contacts: { displayName: DEV_NAME, contacts: [{ vcard }] }
        });

    } catch (error) {
        console.error("Owner command error:", error);
        await react("❌");

        // ====== FALLBACK TEXT (KAMA INTERACTIVE IMESHINDWA) ======
        const fallbackText = 
`*╭━━━〔 👑 OWNER INFO 〕━━━⬣*
*┃*
*┃ 👤 Name    :* ${DEV_NAME}
*┃ 🏢 Project :* ${DEV_ORG}
*┃ 📞 Contact :* +${DEV_NUMBER}
*┃ 🌍 Country :* Tanzania
*┃*
*╰━━━━━━━━━━━━━━━━━━⬣*

*╭━━━〔 ⚠️ RULES 〕━━━⬣*
*┃*
*┃ 🚫 Don't spam the dev*
*┃ 🚫 Serious bugs only*
*┃ 🚫 No "how do I use this" questions*
*┃*
*╰━━━━━━━━━━━━━━━━━━⬣*

*🥀 Powered by RAHMANI-XMD 🥀*`;

        await repondre(fallbackText);

        await client.sendMessage(dest, {
            contacts: { displayName: DEV_NAME, contacts: [{ vcard }] }
        });
    }
});
