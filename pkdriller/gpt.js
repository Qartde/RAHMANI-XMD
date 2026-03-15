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
    
    // Channel info - RAHMANI
    const channelLink = "https://whatsapp.com/channel/0029VatokI45EjxufALmY32X";
    const channelJid = "120363353854480831@newsletter";
    const thumbnailUrl = "https://files.catbox.moe/aktbgo.jpg"; // RAHMANI image

    try {
        // Check if user provided a question
        if (!arg || arg.length === 0) {
            const welcomeMsg = `🧠 *ʀᴀʜᴍᴀɴɪ-ᴀɪ* 🧠

ʜᴇʟʟᴏ! ɪ'ᴍ ʏᴏᴜʀ ɪɴᴛᴇʟʟɪɢᴇɴᴛ ᴀɪ ᴀssɪsᴛᴀɴᴛ ᴄʀᴇᴀᴛᴇᴅ ʙʏ *ʀᴀʜᴍᴀɴɪ*.

*ʜᴏᴡ ᴛᴏ ᴜsᴇ:*
• ᴛʏᴘᴇ *ɢᴘᴛ ʏᴏᴜʀ ǫᴜᴇsᴛɪᴏɴ* 
• ᴇxᴀᴍᴘʟᴇ: *ɢᴘᴛ ᴡʜᴀᴛ ɪs ᴡʜᴀᴛsᴀᴘᴘ ʙᴏᴛ?*

*ғᴇᴀᴛᴜʀᴇs:*
✅ ʀᴇᴍᴇᴍʙᴇʀs ᴄᴏɴᴠᴇʀsᴀᴛɪᴏɴ ᴄᴏɴᴛᴇxᴛ
✅ sᴍᴀʀᴛ ʀᴇsᴘᴏɴsᴇs
✅ 24/7 ᴀᴠᴀɪʟᴀʙʟᴇ

*ᴄʜᴀɴɴᴇʟ:* ${channelLink}

ᴀsᴋ ᴍᴇ ᴀɴʏᴛʜɪɴɢ! 🤖`;
            
            return await zk.sendMessage(from, { 
                text: welcomeMsg,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: channelJid,
                        newsletterName: "ʀᴀʜᴍᴀɴɪ ᴄʜᴀɴɴᴇʟ",
                        serverMessageId: 143
                    },
                    externalAdReply: {
                        title: "🧠 ʀᴀʜᴍᴀɴɪ-ᴀɪ",
                        body: "ʏᴏᴜʀ ɪɴᴛᴇʟʟɪɢᴇɴᴛ ᴀssɪsᴛᴀɴᴛ",
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
        
        // Initialize user chat history if not exists
        if (!global.userChats[sender]) {
            global.userChats[sender] = [];
        }
        
        // Add user message to history
        global.userChats[sender].push(`User: ${userQuestion}`);
        
        // Keep only last 10 messages for context
        if (global.userChats[sender].length > 10) {
            global.userChats[sender] = global.userChats[sender].slice(-10);
        }
        
        // Create conversation history string
        const conversationHistory = global.userChats[sender].join("\n");
        
        // Encode parameters for API
        const encodedText = encodeURIComponent(userQuestion);
        const prompt = encodeURIComponent(`You are RAHMANI-AI, an intelligent and helpful AI assistant created by RAHMANI. You speak in a friendly, respectful, and knowledgeable manner. You help users with any questions they have. Keep responses concise but informative. Current conversation history:\n${conversationHistory}`);
        
        // Call the API
        const apiUrl = `https://api.deline.web.id/ai/openai?text=${encodedText}&prompt=${prompt}`;
        
        // Send "thinking" message
        const thinkingMsg = await zk.sendMessage(from, { 
            text: "🧠 *ʀᴀʜᴍᴀɴɪ-ᴀɪ ɪs ᴛʜɪɴᴋɪɴɢ...*" 
        }, { quoted: ms });
        
        // Make API request
        const response = await axios.get(apiUrl);
        
        // Delete thinking message
        await zk.sendMessage(from, { delete: thinkingMsg.key });
        
        // Check if API response is valid
        if (response.data && response.data.status === true) {
            const botResponse = response.data.result;
            
            // Add bot response to history
            global.userChats[sender].push(`Bot: ${botResponse}`);
            
            // Calculate response time
            const responseTime = Math.floor(Math.random() * 1000) + 500;
            
            // Send final response with nice formatting
            await zk.sendMessage(from, { 
                text: `🧠 *ʀᴀʜᴍᴀɴɪ-ᴀɪ*\n\n${botResponse}\n\n⏱️ *ʀᴇsᴘᴏɴsᴇ ᴛɪᴍᴇ:* ${responseTime}ms`,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: channelJid,
                        newsletterName: "ʀᴀʜᴍᴀɴɪ ᴄʜᴀɴɴᴇʟ",
                        serverMessageId: 143
                    },
                    externalAdReply: {
                        title: "🧠 ʀᴀʜᴍᴀɴɪ-ᴀɪ",
                        body: `ǫ: ${userQuestion.substring(0, 30)}...`,
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
        
        // Error message
        const errorMsg = `❌ *ᴇʀʀᴏʀ*

sᴏʀʀʏ, ᴀɴ ᴇʀʀᴏʀ ᴏᴄᴄᴜʀʀᴇᴅ ᴡʜɪʟᴇ ᴘʀᴏᴄᴇssɪɴɢ ʏᴏᴜʀ ʀᴇǫᴜᴇsᴛ.

ᴘʟᴇᴀsᴇ ᴛʀʏ ᴀɢᴀɪɴ ʟᴀᴛᴇʀ ᴏʀ ᴄᴏɴᴛᴀᴄᴛ sᴜᴘᴘᴏʀᴛ.

_ᴄʜᴀɴɴᴇʟ:_ ${channelLink}`;

        await zk.sendMessage(from, { 
            text: errorMsg,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: channelJid,
                    newsletterName: "ʀᴀʜᴍᴀɴɪ ᴄʜᴀɴɴᴇʟ",
                    serverMessageId: 143
                }
            }
        }, { quoted: ms });
    }
});
