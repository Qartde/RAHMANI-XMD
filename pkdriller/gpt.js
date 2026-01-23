const { zokou } = require('../framework/zokou');
const { default: axios } = require('axios');

if (!global.userChats) global.userChats = {};

zokou({ nomCom: "gpt", reaction: "🤖", categorie: "ai" }, async (dest, zk, commandeOptions) => {
    const { arg, ms } = commandeOptions;
    const sender = ms.sender;
    const from = dest;
    
    // Replace this with your actual WhatsApp Channel link
    const channelLink = "https://whatsapp.com/channel/0029VatokI45EjxufALmY32X";
    const channelJid = "120363353854480831@newsletter";

    try {
        if (!arg || arg.length === 0) {
            return await zk.sendMessage(from, { text: "ʏᴇs ʙᴏss ᴀᴍ ʟɪsᴛᴇʀɴɪɴɢ ᴛᴏ ʏᴏᴜ. 🤠" }, { quoted: ms });
        }

        const text = arg.join(" ");

        // Initialize user chat history
        if (!global.userChats[sender]) global.userChats[sender] = [];
        global.userChats[sender].push(`User: ${text}`);

        if (global.userChats[sender].length > 15) global.userChats[sender].shift();

        const history = global.userChats[sender].join("\n");

        const { data } = await axios.get("https://omegatech-api.dixonomega.tech/api/ai/Claude", {
            params: { text: text }
        });

        const botResponse = data?.result?.text || "⚠️ Sorry, I couldn't understand your question.";

        // Save bot reply in history
        global.userChats[sender].push(`Bot: ${botResponse}`);

        // Send reply with a "View Channel" link/button
        await zk.sendMessage(from, {
            text: botResponse,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                externalAdReply: {
                    title: "ʀᴀʜᴍᴀɴɪ-ᴀɪ",
                    body: "Click here to view our channel",
                    thumbnailUrl: "https://files.catbox.moe/aktbgo.jpg", // You can put your image URL here
                    sourceUrl: channelLink,
                    mediaType: 1,
                    renderLargerThumbnail: false
                }
            }
        }, { quoted: ms });

    } catch (err) {
        console.error("❌ GPT Error:", err);
        await zk.sendMessage(from, { text: "❌ An error occurred: " + err.message }, { quoted: ms });
    }
});
