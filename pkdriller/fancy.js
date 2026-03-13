const { zokou } = require("../framework/zokou");
const fancy = require("../pkdriller/style");

zokou({ 
    nomCom: "fancy", 
    aliases: ["f", "style", "fancytext"],
    categorie: "Fun", 
    reaction: "💫" 
}, async (dest, zk, commandeOptions) => {
    const { arg, repondre, prefixe, ms } = commandeOptions;
    
    try {
        // Check if no arguments provided
        if (!arg || arg.length === 0) {
            // Generate style list
            let styleList = "*✨ AVAILABLE FANCY STYLES:*\n\n";
            for (let i = 0; i < fancy.length; i++) {
                styleList += `*${i + 1}.* ${fancy.apply(fancy[i], "RAHMANI")}\n`;
            }
            styleList += `\n*Usage:* ${prefixe}fancy [number] [text]\n*Example:* ${prefixe}fancy 29 RAHMANI-XMD`;
            
            await zk.sendMessage(dest, {
                text: styleList,
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

        // Extract number and text
        const id = arg[0];
        const text = arg.slice(1).join(" ");

        // Check if we have both number and text
        if (!id || !text) {
            await zk.sendMessage(dest, {
                text: `❌ *Invalid format!*\n\nUsage: ${prefixe}fancy [number] [text]\nExample: ${prefixe}fancy 29 RAHMANI-XMD`,
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

        // Convert id to number
        const styleNumber = parseInt(id);
        
        // Check if it's a valid number
        if (isNaN(styleNumber)) {
            await zk.sendMessage(dest, {
                text: `❌ *Invalid number!*\n\nPlease use a valid number between 1 and ${fancy.length}.`,
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
                        body: '❌ Invalid Number',
                        thumbnailUrl: 'https://files.catbox.moe/aktbgo.jpg',
                        mediaType: 1,
                        renderSmallThumbnail: true
                    }
                }
            }, { quoted: ms });
            return;
        }

        // Check if style exists (fancy array might be 1-indexed or 0-indexed)
        let selectedStyle;
        
        // Try both possibilities
        if (styleNumber <= fancy.length && styleNumber >= 1) {
            // If array is 1-indexed (starts at 1)
            selectedStyle = fancy[styleNumber];
        } else if (styleNumber - 1 <= fancy.length && styleNumber - 1 >= 0) {
            // If array is 0-indexed (starts at 0)
            selectedStyle = fancy[styleNumber - 1];
        }

        if (selectedStyle) {
            // Generate fancy text
            const fancyText = fancy.apply(selectedStyle, text);
            
            // Send the fancy text
            await zk.sendMessage(dest, {
                text: `✨ *FANCY TEXT GENERATED*\n\n${fancyText}\n\n⚡ *RAHMANI-XMD*`,
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
                        body: `✨ Style #${styleNumber}: ${text.substring(0, 20)}`,
                        thumbnailUrl: 'https://files.catbox.moe/aktbgo.jpg',
                        mediaType: 1,
                        renderSmallThumbnail: true
                    }
                }
            }, { quoted: ms });
            
        } else {
            // Style not found - show available styles
            let styleList = "*✨ AVAILABLE FANCY STYLES:*\n\n";
            for (let i = 0; i < Math.min(fancy.length, 50); i++) {
                styleList += `*${i + 1}.* ${fancy.apply(fancy[i], "RAHMANI")}\n`;
            }
            styleList += `\n*Total styles:* ${fancy.length}`;
            
            await zk.sendMessage(dest, {
                text: `❌ *Style #${styleNumber} not found!*\n\nPlease use a number between 1 and ${fancy.length}.\n\n${styleList}`,
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
