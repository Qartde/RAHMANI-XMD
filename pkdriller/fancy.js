const { zokou } = require("../framework/zokou");
const fancy = require("../pkdriller/style");

zokou({ 
    nomCom: "fancy", 
    aliases: ["f", "style", "fancytext"],
    categorie: "Fun", 
    reaction: "💫" 
}, async (dest, zk, commandeOptions) => {
    const { arg, repondre, prefixe, ms } = commandeOptions;
    const id = arg[0]?.match(/\d+/)?.join('');
    const text = arg.slice(1).join(" ");

    try {
        // Check if no arguments provided
        if (!arg || arg.length === 0) {
            await zk.sendMessage(dest, {
                text: `✨ *FANCY TEXT GENERATOR*\n\nUsage: ${prefixe}fancy [number] [text]\nExample: ${prefixe}fancy 10 RAHMANI-XMD\n\n📋 *Available styles:*\n${fancy.list('RAHMANI-XMD', fancy)}`,
                contextInfo: {
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363353854480831@newsletter',
                        newsletterName: 'RAHMANI XMD',
                        serverMessageId: 143
                    },
                    forwardingScore: 999,
                    externalAdReply: {
                        title: 'RAHMANI-XMD',
                        body: '✨ Fancy Text Generator',
                        thumbnailUrl: 'https://files.catbox.moe/aktbgo.jpg',
                        mediaType: 1,
                        renderSmallThumbnail: true
                    }
                }
            }, { quoted: ms });
            return;
        }

        // Check if id or text is missing
        if (id === undefined || text === undefined || text === '') {
            await zk.sendMessage(dest, {
                text: `❌ *Invalid format!*\n\nUsage: ${prefixe}fancy [number] [text]\nExample: ${prefixe}fancy 10 RAHMANI-XMD\n\n📋 *Available styles:*\n${fancy.list('RAHMANI-XMD', fancy)}`,
                contextInfo: {
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363353854480831@newsletter',
                        newsletterName: 'RAHMANI XMD',
                        serverMessageId: 143
                    },
                    forwardingScore: 999,
                    externalAdReply: {
                        title: 'RAHMANI-XMD',
                        body: '❌ Invalid Format',
                        thumbnailUrl: 'https://files.catbox.moe/aktbgo.jpg',
                        mediaType: 1,
                        renderSmallThumbnail: true
                    }
                }
            }, { quoted: ms });
            return;
        }

        // Convert id to number and check if valid
        const styleIndex = parseInt(id) - 1;
        
        // Check if style exists
        if (styleIndex >= 0 && styleIndex < fancy.length) {
            const selectedStyle = fancy[styleIndex];
            const fancyText = fancy.apply(selectedStyle, text);
            
            // Send the fancy text
            await zk.sendMessage(dest, {
                text: `✨ *Fancy Text Generated*\n\n${fancyText}\n\n⚡ *RAHMANI-XMD*`,
                contextInfo: {
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363353854480831@newsletter',
                        newsletterName: 'RAHMANI XMD',
                        serverMessageId: 143
                    },
                    forwardingScore: 999,
                    externalAdReply: {
                        title: 'RAHMANI-XMD',
                        body: `✨ Style #${parseInt(id)}: ${text.substring(0, 20)}`,
                        thumbnailUrl: 'https://files.catbox.moe/aktbgo.jpg',
                        mediaType: 1,
                        renderSmallThumbnail: true
                    }
                }
            }, { quoted: ms });
            
        } else {
            // Style not found
            await zk.sendMessage(dest, {
                text: `❌ *Style #${id} not found!*\n\nPlease use a number between 1 and ${fancy.length}.\n\n📋 *Available styles:*\n${fancy.list('RAHMANI-XMD', fancy)}`,
                contextInfo: {
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363353854480831@newsletter',
                        newsletterName: 'RAHMANI XMD',
                        serverMessageId: 143
                    },
                    forwardingScore: 999,
                    externalAdReply: {
                        title: 'RAHMANI-XMD',
                        body: '❌ Style Not Found',
                        thumbnailUrl: 'https://files.catbox.moe/aktbgo.jpg',
                        mediaType: 1,
                        renderSmallThumbnail: true
                    }
                }
            }, { quoted: ms });
        }

    } catch (error) {
        console.error("Fancy error:", error);
        
        // Error message
        await zk.sendMessage(dest, {
            text: "❌ *An error occurred while generating fancy text.*\nPlease try again.\n\n⚡ *RAHMANI-XMD*",
            contextInfo: {
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363353854480831@newsletter',
                    newsletterName: 'RAHMANI XMD',
                    serverMessageId: 143
                },
                forwardingScore: 999,
                externalAdReply: {
                    title: 'RAHMANI-XMD',
                    body: '❌ Error Occurred',
                    thumbnailUrl: 'https://files.catbox.moe/aktbgo.jpg',
                    mediaType: 1,
                    renderSmallThumbnail: true
                }
            }
        }, { quoted: ms });
    }
});
