const { zokou } = require("../framework/zokou");
const axios = require("axios");

// Owner name - RAHMANI XMD
const OWNER_NAME = "ʀᴀʜᴍᴀɴɪ xᴍᴅ";

zokou({
    nomCom: "gpt",
    aliases: ["ai", "chatgpt", "openai", "bot"],
    reaction: "🧠",
    categorie: "AI"
}, async (dest, zk, commandeOptions) => {
    const { repondre, arg, ms } = commandeOptions;

    try {
        // Check if question is provided
        if (!arg || arg.length === 0) {
            await zk.sendMessage(dest, {
                text: `🧠 *RAHMANI-XMD AI*\n\nHello! I'm an AI assistant powered by ${OWNER_NAME}.\n\nPlease ask me a question.\n\nExample: \`.gpt What is WhatsApp bot?\`\n\n⚡ *${OWNER_NAME}*`,
                contextInfo: {
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363353854480831@newsletter',
                        newsletterName: 'RAHMANI XMD',
                        serverMessageId: 143
                    },
                    forwardingScore: 999,
                    externalAdReply: {
                        title: 'RAHMANI-XMD AI',
                        body: `🧠 Ask me anything`,
                        thumbnailUrl: 'https://files.catbox.moe/aktbgo.jpg',
                        mediaType: 1,
                        renderSmallThumbnail: true
                    }
                }
            }, { quoted: ms });
            return;
        }

        const question = arg.join(" ");
        
        // Send thinking message
        await zk.sendMessage(dest, {
            text: `🧠 *${OWNER_NAME}* is thinking...\n\nQuestion: ${question}\n\n⏳ Please wait...`,
            contextInfo: {
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363353854480831@newsletter',
                    newsletterName: 'RAHMANI XMD',
                    serverMessageId: 143
                },
                forwardingScore: 999,
                externalAdReply: {
                    title: 'RAHMANI-XMD AI',
                    body: `🤔 Thinking: ${question.substring(0, 25)}...`,
                    thumbnailUrl: 'https://files.catbox.moe/aktbgo.jpg',
                    mediaType: 1,
                    renderSmallThumbnail: true
                }
            }
        }, { quoted: ms });

        // Prepare the prompt with owner recognition
        const prompt = `You are a very polite and intelligent AI assistant. Your owner is ${OWNER_NAME}. Always respond in a helpful, friendly manner. If someone asks who your owner is, say "${OWNER_NAME} created and owns me." Answer the following question: ${question}`;
        
        // Call the API
        const apiUrl = `https://api.deline.web.id/ai/openai?text=${encodeURIComponent(question)}&prompt=${encodeURIComponent(prompt)}`;
        
        const response = await axios.get(apiUrl, { timeout: 30000 });
        
        console.log("GPT Response:", response.data); // For debugging
        
        // Check response format
        if (response.data && response.data.status === true) {
            const answer = response.data.result || "I couldn't generate a response.";
            
            // Send the answer
            await zk.sendMessage(dest, {
                text: `🧠 *${OWNER_NAME} AI*\n\n*Question:* ${question}\n\n*Answer:* ${answer}\n\n⚡ *${OWNER_NAME}*`,
                contextInfo: {
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363353854480831@newsletter',
                        newsletterName: 'RAHMANI XMD',
                        serverMessageId: 143
                    },
                    forwardingScore: 999,
                    externalAdReply: {
                        title: 'RAHMANI-XMD AI',
                        body: `✅ Response generated`,
                        thumbnailUrl: 'https://files.catbox.moe/aktbgo.jpg',
                        mediaType: 1,
                        renderSmallThumbnail: true,
                        sourceUrl: 'https://deline.web.id'
                    }
                }
            }, { quoted: ms });
        } else {
            throw new Error("Invalid API response");
        }

    } catch (error) {
        console.error("GPT Error:", error.message);
        
        // Error message with owner name
        await zk.sendMessage(dest, {
            text: `❌ *Error*\n\nI couldn't process your request at the moment.\n\nPlease try again later.\n\n⚡ *${OWNER_NAME}*`,
            contextInfo: {
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363353854480831@newsletter',
                    newsletterName: 'RAHMANI XMD',
                    serverMessageId: 143
                },
                forwardingScore: 999,
                externalAdReply: {
                    title: 'RAHMANI-XMD AI',
                    body: '❌ Request Failed',
                    thumbnailUrl: 'https://files.catbox.moe/aktbgo.jpg',
                    mediaType: 1,
                    renderSmallThumbnail: true
                }
            }
        }, { quoted: ms });
    }
});
