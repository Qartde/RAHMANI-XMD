const { zokou } = require("../framework/zokou");
const axios = require("axios");

zokou({
    nomCom: "logo",
    aliases: ["logomaker", "logogen", "textlogo"],
    reaction: "🎨",
    categorie: "General"
}, async (dest, zk, commandeOptions) => {
    const { repondre, arg, ms } = commandeOptions;

    try {
        // Check if user provided text
        if (!arg || arg.length === 0) {
            await zk.sendMessage(dest, {
                text: "🎨 *LOGO GENERATOR*\n\nPlease provide text for the logo!\n\nExample: `.logo RAHMANI-XMD`",
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
                        body: '🎨 Enter text to generate logo',
                        thumbnailUrl: 'https://files.catbox.moe/aktbgo.jpg',
                        mediaType: 1,
                        renderSmallThumbnail: true
                    }
                }
            }, { quoted: ms });
            return;
        }

        // Join all arguments as the logo text
        const logoText = arg.join(" ");
        
        // Send processing message
        await zk.sendMessage(dest, {
            text: `⏳ *Generating logo for:*\n"${logoText}"\n\nPlease wait...`,
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
                    body: `⏳ Generating: ${logoText.substring(0, 20)}`,
                    thumbnailUrl: 'https://files.catbox.moe/aktbgo.jpg',
                    mediaType: 1,
                    renderSmallThumbnail: true
                }
            }
        }, { quoted: ms });

        // WORKING API OPTIONS
        
        // OPTION 1: TextPro API (reliable)
        const textProUrl = `https://api.lolhuman.xyz/api/textprome?apikey=7f1faa12106d8e88e706a835&text=${encodeURIComponent(logoText)}`;
        
        // OPTION 2: PhotoOxi API
        const photoOxiUrl = `https://api.lolhuman.xyz/api/photooxi?apikey=7f1faa12106d8e88e706a835&text=${encodeURIComponent(logoText)}`;
        
        // OPTION 3: Canvas API (backup)
        const canvasUrl = `https://api.lolhuman.xyz/api/ephoto1?apikey=7f1faa12106d8e88e706a835&text=${encodeURIComponent(logoText)}`;
        
        // Try multiple APIs
        let imageUrl = null;
        
        try {
            // Try first API
            const response1 = await axios.get(textProUrl, { timeout: 10000 });
            if (response1.data && response1.data.result) {
                imageUrl = response1.data.result;
            }
        } catch (e) {
            console.log("API 1 failed, trying API 2...");
        }
        
        if (!imageUrl) {
            try {
                // Try second API
                const response2 = await axios.get(photoOxiUrl, { timeout: 10000 });
                if (response2.data && response2.data.result) {
                    imageUrl = response2.data.result;
                }
            } catch (e) {
                console.log("API 2 failed, trying API 3...");
            }
        }
        
        if (!imageUrl) {
            try {
                // Try third API
                const response3 = await axios.get(canvasUrl, { timeout: 10000 });
                if (response3.data && response3.data.result) {
                    imageUrl = response3.data.result;
                }
            } catch (e) {
                console.log("API 3 failed");
            }
        }
        
        // If no API worked, use fallback
        if (!imageUrl) {
            // Fallback to a simpler API
            imageUrl = `https://api.dorratz.com/v2/text-logo?text=${encodeURIComponent(logoText)}`;
        }

        // Send the generated logo image
        await zk.sendMessage(dest, {
            image: { url: imageUrl },
            caption: `🎨 *LOGO GENERATED*\n\n📝 *Text:* ${logoText}\n\n⚡ *RAHMANI-XMD*`,
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
                    body: `🎨 Logo: ${logoText.substring(0, 25)}${logoText.length > 25 ? '...' : ''}`,
                    thumbnailUrl: imageUrl,
                    mediaType: 1,
                    renderSmallThumbnail: true
                }
            }
        }, { quoted: ms });

    } catch (error) {
        console.log("Logo error:", error.message || error);
        
        // Error message with suggestion
        await zk.sendMessage(dest, {
            text: "❌ *Failed to generate logo.*\n\nTry using shorter text or different words.\n\n⚡ *RAHMANI-XMD*",
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
                    body: '❌ Logo Generation Failed',
                    thumbnailUrl: 'https://files.catbox.moe/aktbgo.jpg',
                    mediaType: 1,
                    renderSmallThumbnail: true
                }
            }
        }, { quoted: ms });
    }
});
