const { zokou } = require("../framework/zokou");
const conf = require("../set");

zokou({
    nomCom: "add",
    categorie: "Group",
    reaction: "➕",
    desc: "Add a user to the group",
    fromMe: false
}, async (dest, client, cmd) => {
    const { arg, ms, repondre, verifGroupe, verifAdmin, superUser } = cmd;

    // 1. Check if it's a group
    if (!verifGroupe) {
        return repondre("❌ *This command only works in groups!*");
    }

    // 2. Check if sender is admin or owner
    if (!verifAdmin && !superUser) {
        return repondre("❌ *Only admins or owner can use this command!*");
    }

    // 3. Check if number is provided
    if (!arg || !arg[0]) {
        return client.sendMessage(dest, {
            text: `➕ *${conf.BOT_NAME || "RAHMANI-XMD"} ADD*

┌─────────────────────
│  📖 *Usage:*
│  ▸ .add <number>
│
│  💡 *Example:*
│  ▸ .add 255693629079
│
└─────────────────────

> *View channel*`,
            mentions: [cmd.auteurMessage],
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363353854480831@newsletter",
                    newsletterName: conf.BOT_NAME || "RAHMANI-XMD",
                    serverMessageId: 143
                },
                externalAdReply: {
                    title: `➕ ${conf.BOT_NAME || "RAHMANI-XMD"} ADD`,
                    body: "Add users to group 🚀",
                    mediaType: 1,
                    mediaUrl: "https://whatsapp.com/channel/0029VatokI45EjxufALmY32X",
                    sourceUrl: "https://whatsapp.com/channel/0029VatokI45EjxufALmY32X",
                    thumbnailUrl: "https://files.catbox.moe/aktbgo.jpg",
                    showAdAttribution: false,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: ms });
    }

    // 4. Format the number
    let number = arg[0].replace(/[^0-9]/g, "");
    
    if (number.length < 10) {
        return repondre("❌ *Invalid phone number!*");
    }

    const userJid = `${number}@s.whatsapp.net`;

    await repondre(`⏳ *Adding ${number} to group...*`);

    try {
        // 5. Add the user
        const response = await client.groupParticipantsUpdate(dest, [userJid], "add");

        // 6. Check the result
        const status = response[0]?.status;

        if (status === "200") {
            await client.sendMessage(dest, {
                text: `✅ *USER ADDED*

┌─────────────────────
│  👤 *Number:* ${number}
│  📊 *Status:* Success
│
└─────────────────────

⚡ *Powered by ${conf.BOT_NAME || "RAHMANI-XMD"}*

> *View channel*`,
                mentions: [userJid],
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: "120363353854480831@newsletter",
                        newsletterName: conf.BOT_NAME || "RAHMANI-XMD",
                        serverMessageId: 143
                    }
                }
            }, { quoted: ms });

        } else if (status === "403") {
            await repondre(`❌ *Could not add ${number}*

Reason: User's privacy settings prevent being added to groups.

> *View channel*`);

        } else if (status === "408") {
            await repondre(`❌ *Could not add ${number}*

Reason: User has left the group recently. Wait before adding again.

> *View channel*`);

        } else {
            await repondre(`❌ *Could not add ${number}*

Reason: Unknown error. Status: ${status}

> *View channel*`);
        }

    } catch (error) {
        console.error("❌ Add Error:", error.message);
        await repondre(`❌ *FAILED*

┌─────────────────────
│  ⚠️ *Error:*
│  ${error.message.substring(0, 100)}
│
└─────────────────────

> *View channel*`);
    }
});
