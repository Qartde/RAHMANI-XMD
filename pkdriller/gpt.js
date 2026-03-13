const { zokou } = require('../framework/zokou');
const axios = require('axios');

zokou({ 
  nomCom: "gpt", 
  aliases: ["ai", "chatgpt", "openai", "ask"],
  reaction: "🧠", 
  categorie: "AI" 
}, async (dest, zk, commandeOptions) => {
    const { arg, ms } = commandeOptions;
    const from = dest;

    // Your Specific Channel JID and Catbox Image
    const channelJid = "120363353854480831@newsletter";
    const imageUrl = "https://files.catbox.moe/aktbgo.jpg";
    const botName = "ʀᴀʜᴍᴀɴɪ xᴍᴅ";

    if (!arg || arg.length === 0) {
        return await zk.sendMessage(from, { 
            text: `🧠 *${botName} AI Assistant*\n\nPlease ask me a question.\n\nExample: .gpt What is WhatsApp bot?` 
        }, { quoted: ms });
    }

    try {
        const question = arg.join(" ");
        await zk.sendMessage(from, { 
            text: `🧠 *${botName} is thinking...*\n\nQuestion: ${question}` 
        }, { quoted: ms });

        // Using API with proper prompt
        const prompt = `You are a helpful AI assistant. Your name is ${botName}. Your creator and owner is ${botName}. Always respond in a friendly and helpful manner. If someone asks who created you, say you were created by ${botName}. Answer: ${question}`;
        
        const apiUrl = `https://api.deline.web.id/ai/openai?text=${encodeURIComponent(question)}&prompt=${encodeURIComponent(prompt)}`;

        const { data } = await axios.get(apiUrl);

        if (!data.status || !data.result) {
            return await zk.sendMessage(from, { 
                text: "❌ Error fetching response from AI server." 
            }, { quoted: ms });
        }

        const answer = data.result;

        // Send Response with Channel JID Context (Baileys)
        await zk.sendMessage(from, {
            text: `🧠 *${botName} AI*\n\n*Q:* ${question}\n\n*A:* ${answer}\n\n⚡ *${botName}*`,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: channelJid,
                    serverMessageId: 143,
                    newsletterName: "RAHMANI XMD",
                },
                externalAdReply: {
                    title: `${botName} AI`,
                    body: question.substring(0, 50) + (question.length > 50 ? "..." : ""),
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
        await zk.sendMessage(from, { 
            text: "❌ An error occurred: " + err.message 
        }, { quoted: ms });
    }
});
