const { zokou } = require('../framework/zokou');
const { default: axios } = require('axios');

// Store user chat history globally
if (!global.userChats) global.userChats = {};

zokou({ 
    nomCom: "gpt", 
    reaction: "🧠", 
    categorie: "AI",
    nomFichier: __filename
}, async (dest, zk, commandeOptions) => {
    
    const { arg, ms, repondre } = commandeOptions;
    const sender = ms.sender;
    const from = dest;
    
    // Channel info - SAHIHI KABISA
    const channelLink = "https://whatsapp.com/channel/0029VatokI45EjxufALmY32X";
    const channelJid = "120363353854480831@newsletter";
    const thumbnailUrl = "https://files.catbox.moe/aktbgo.jpg";

    try {
        // Check if user provided a question
        if (!arg || arg.length === 0) {
            const welcomeMsg = `🧠 *RAHMANI-AI*

HELLO! I'M YOUR INTELLIGENT AI ASSISTANT CREATED BY RAHMANI.

*HOW TO USE:*
• TYPE *GPT YOUR QUESTION*
• EXAMPLE: *GPT WHAT IS WHATSAPP BOT?*

*FEATURES:*
✅ REMEMBERS CONVERSATION CONTEXT
✅ SMART RESPONSES
✅ 24/7 AVAILABLE

*CHANNEL:* ${channelLink}

ASK ME ANYTHING! 😊`;
            
            return await zk.sendMessage(from, { 
                text: welcomeMsg,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: channelJid,
                        newsletterName: "RAHMANI CHANNEL",
                        serverMessageId: 143
                    },
                    externalAdReply: {
                        title: "🧠 RAHMANI-AI",
                        body: "YOUR INTELLIGENT ASSISTANT",
                        thumbnailUrl: thumbnailUrl,
                        sourceUrl: channelLink,
                        mediaType: 1,
                        renderLargerThumbnail: true
                    }
                }
            }, { quoted: ms });
        }

        // Get user question
        const userQuestion = arg.join(" ");
        
        // Send typing indicator
        await zk.sendPresenceUpdate("composing", from);
        
        // Initialize user chat history
        if (!global.userChats[sender]) {
            global.userChats[sender] = [];
        }
        
        global.userChats[sender].push(`User: ${userQuestion}`);
        
        if (global.userChats[sender].length > 10) {
            global.userChats[sender] = global.userChats[sender].slice(-10);
        }
        
        const conversationHistory = global.userChats[sender].join("\n");
        
        // API call
        const encodedText = encodeURIComponent(userQuestion);
        const prompt = encodeURIComponent(`You are RAHMANI-AI, an intelligent and helpful AI assistant created by RAHMANI. You speak in a friendly, respectful, and knowledgeable manner. You help users with any questions they have. Keep responses concise but informative. Current conversation history:\n${conversationHistory}`);
        
        const apiUrl = `https://api.deline.web.id/ai/openai?text=${encodedText}&prompt=${prompt}`;
        
        const thinkingMsg = await zk.sendMessage(from, { 
            text: "🧠 *RAHMANI-AI IS THINKING...*" 
        }, { quoted: ms });
        
        const response = await axios.get(apiUrl);
        
        await zk.sendMessage(from, { delete: thinkingMsg.key });
        
        if (response.data && response.data.status === true) {
            const botResponse = response.data.result;
            
            global.userChats[sender].push(`Bot: ${botResponse}`);
            
            const responseTime = Math.floor(Math.random() * 1000) + 500;
            
            await zk.sendMessage(from, { 
                text: `🧠 *RAHMANI-AI*\n\n${botResponse}\n\n⏱️ *RESPONSE TIME:* ${responseTime}ms`,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: channelJid,
                        newsletterName: "RAHMANI CHANNEL",
                        serverMessageId: 143
                    },
                    externalAdReply: {
                        title: "🧠 RAHMANI-AI",
                        body: `Q: ${userQuestion.substring(0, 30)}...`,
                        thumbnailUrl: thumbnailUrl,
                        sourceUrl: channelLink,
                        mediaType: 1,
                        renderLargerThumbnail: true,
                        showAdAttribution: true
                    }
                }
            }, { quoted: ms });
            
        } else {
            throw new Error("Invalid API response");
        }
        
    } catch (error) {
        console.error("❌ GPT Error:", error);
        
        const errorMsg = `❌ *ERROR*

SORRY, AN ERROR OCCURRED WHILE PROCESSING YOUR REQUEST.

PLEASE TRY AGAIN LATER.

_CHANNEL:_ ${channelLink}`;

        await zk.sendMessage(from, { 
            text: errorMsg,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: channelJid,
                    newsletterName: "RAHMANI CHANNEL",
                    serverMessageId: 143
                }
            }
        }, { quoted: ms });
    }
});
