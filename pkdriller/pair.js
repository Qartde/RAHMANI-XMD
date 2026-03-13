const { zokou } = require("../framework/zokou");
const { default: axios } = require("axios");

zokou({
    nomCom: "pair",
    aliases: ["session", "paircode", "qrcode", "getcode"],
    reaction: "💫",
    categorie: "General"
}, async (dest, origine, msg) => {
    const { repondre, arg, ms } = msg;

    try {
        // Check if number is provided
        if (!arg || arg.length === 0) {
            await origine.sendMessage(dest, {
                text: "🔐 *PAIR CODE GENERATOR*\n\nPlease provide your WhatsApp number with country code.\n\nExample: `.pair 25569362xxxx`\n\n⚡ *RAHMANI-XMD*",
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
                        body: '🔐 Enter your number to get pair code',
                        thumbnailUrl: 'https://files.catbox.moe/aktbgo.jpg',
                        mediaType: 1,
                        renderSmallThumbnail: true
                    }
                }
            }, { quoted: ms });
            return;
        }

        // Clean the phone number
        let phoneNumber = arg.join(" ").replace(/[^0-9]/g, '');
        
        // Send waiting message
        await origine.sendMessage(dest, {
            text: `⏳ *Generating pair code for:*\n${phoneNumber}\n\nPlease wait...\n\n⚡ *RAHMANI-XMD*`,
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
                    body: `⏳ Generating code for ${phoneNumber.substring(0, 8)}...`,
                    thumbnailUrl: 'https://files.catbox.moe/aktbgo.jpg',
                    mediaType: 1,
                    renderSmallThumbnail: true
                }
            }
        }, { quoted: ms });

        // Encode number for API
        const encodedNumber = encodeURIComponent(phoneNumber);
        
        // Try multiple APIs for reliability
        let pairCode = null;
        
        // API 1: Main API
        try {
            const apiUrl = `https://session-id-site-fycn.onrender.com/code?number=${encodedNumber}`;
            const response = await axios.get(apiUrl, { timeout: 15000 });
            
            if (response.data && response.data.code) {
                pairCode = response.data.code;
            }
        } catch (e) {
            console.log("Main API failed:", e.message);
        }
        
        // API 2: Backup API
        if (!pairCode) {
            try {
                const backupUrl = `https://session-id-site-fycn.onrender.com/code?number=${encodedNumber}`;
                const response = await axios.get(backupUrl, { timeout: 15000 });
                
                if (response.data && response.data.code) {
                    pairCode = response.data.code;
                }
            } catch (e) {
                console.log("Backup API failed:", e.message);
            }
        }
        
        // API 3: Alternative
        if (!pairCode) {
            try {
                const altUrl = `https://session-id-site-fycn.onrender.com/pair?number=${encodedNumber}`;
                const response = await axios.get(altUrl, { timeout: 15000 });
                
                if (response.data && response.data.pairCode) {
                    pairCode = response.data.pairCode;
                } else if (response.data && response.data.code) {
                    pairCode = response.data.code;
                }
            } catch (e) {
                console.log("Alt API failed:", e.message);
            }
        }

        // Check if we got the code
        if (pairCode) {
            // Get just the code without any formatting
            const cleanCode = pairCode.toString().trim();
            
            // Send ONLY THE CODE - no words, no symbols, just the code
            await origine.sendMessage(dest, {
                text: cleanCode
            }, { quoted: ms });
            
        } else {
            // If all APIs failed
            await origine.sendMessage(dest, {
                text: `❌ *Failed to generate pair code*\n\nPlease check:\n• Number format (include country code)\n• Try again in a few minutes\n• Use a different number\n\n⚡ *RAHMANI-XMD*`,
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
                        body: '❌ Pair Code Failed',
                        thumbnailUrl: 'https://files.catbox.moe/aktbgo.jpg',
                        mediaType: 1,
                        renderSmallThumbnail: true
                    }
                }
            }, { quoted: ms });
        }

    } catch (error) {
        console.error("Pair code error:", error.message);
        
        // Error message
        await origine.sendMessage(dest, {
            text: "❌ *An error occurred while generating pair code.*\nPlease try again later.\n\n⚡ *RAHMANI-XMD*",
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
