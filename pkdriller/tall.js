const { zokou } = require('../framework/zokou');
const { default: axios } = require('axios');

if (!global.userChats) global.userChats = {};

zokou({ nomCom: "gpt", reaction: "🤖", categorie: "ai" }, async (dest, zk, commandeOptions) => {
    const { arg, ms } = commandeOptions;
    const sender = ms.sender;
    const from = dest;

    try {
        if (!arg || arg.length === 0) {
            return await zk.sendMessage(from, { text: "🚫 Please provide a question or message.🚫" }, { quoted: ms });
        }

        const text = arg.join(" ");

        // Initialize user chat history
        if (!global.userChats[sender]) global.userChats[sender] = [];
        global.userChats[sender].push(`User: ${text}`);

      
        if (global.userChats[sender].length > 15) global.userChats[sender].shift();

        const history = global.userChats[sender].join("\n");

        const prompt = `
You are Rahmany Ai,your creator, a friendly and intelligent WhatsApp bot. Chat naturally without asking repetitive questions.

### Chat History:
${history}
`;

       
        const { data } = await axios.get("https://omegatech-api.dixonomega.tech/api/ai/Claude", {
            params: { text: text }
        });

      
        const botResponse = data?.result?.text || "⚠️ Sorry, I couldn't understand your question.";

        // Save bot reply in history
        global.userChats[sender].push(`Bot: ${botResponse}`);

        // Send plain reply
        await zk.sendMessage(from, { text: botResponse }, { quoted: ms });

    } catch (err) {
        console.error("❌ GPT Error:", err);
        await zk.sendMessage(from, { text: "❌ An error occurred: " + err.message }, { quoted: ms });
    }
});
image: { url: image },
//     gifPlayback: true,
     caption: teks,
     buttons: buttons,
     contextInfo: {
       forwardingScore: 999,
         isForwarded: true,
         forwardedNewsletterMessageInfo: {
           newsletterJid: "120363353854480831@newsletter",
             newsletterName: "ʀᴀʜᴍᴀɴɪ xᴍᴅ"
            }
        },
        footer: "ʀᴀʜᴍᴀɴɪ",
        viewOnce: true,
        headerType: 6
   }
