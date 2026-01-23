const { zokou } = require('../framework/zokou');
const { default: axios } = require('axios');

if (!global.userChats) global.userChats = {};

zokou({ nomCom: "rahman", reaction: "🤖", categorie: "ai" }, async (dest, zk, commandeOptions) => {
    const { arg, ms } = commandeOptions;
    const sender = ms.sender;
    const from = dest;
    
    // Your specific JID and Image URL
    const channelJid = "120363353854480831@newsletter";
    const imageUrl = "https://files.catbox.moe/aktbgo.jpg";

    try {
        if (!arg || arg.length === 0) {
            return await zk.sendMessage(from, { text: "ʏᴇs ʙᴏss ᴀᴍ ʟɪsᴛᴇʀɴɪɴɢ ᴛᴏ ʏᴏᴜ. 🤠" }, { quoted: ms });
        }

        const text = arg.join(" ");

        if (!global.userChats[sender]) global.userChats[sender] = [];
        global.userChats[sender].push(`User: ${text}`);

        if (global.userChats[sender].length > 15) global.userChats[sender].shift();

        const { data } = await axios.get("https://omegatech-api.dixonomega.tech/api/ai/Claude", {
            params: { text: text }
        });

        const botResponse = data?.result?.text || "⚠️ Sorry, I couldn't understand your question.";
        global.userChats[sender].push(`Bot: ${botResponse}`);

        // Baileys specific logic for Channel Context
        await zk.sendMessage(from, {
            text: botResponse,
            contextInfo: {
                // This creates the "View Channel" link at the top
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: channelJid,
                    serverMessageId: 144, // Arbitrary ID to trigger the UI
                    newsletterName: "RAHMAN-AI CHANNEL",
                },
                externalAdReply: {
                    title: "RAHMAN-AI",
                    body: "Tap to view our official updates",
                    thumbnailUrl: imageUrl,
                    mediaType: 1,
                    sourceUrl: `https://whatsapp.com/channel/${channelJid.split('@')[0]}`,
                    renderLargerThumbnail: false,
                    showAdAttribution: true
                }
            }
        }, { quoted: ms });

    } catch (err) {
        console.error("❌ GPT Error:", err);
        await zk.sendMessage(from, { text: "❌ An error occurred: " + err.message }, { quoted: ms });
    }
});
