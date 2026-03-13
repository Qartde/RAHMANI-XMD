const { zokou } = require("../framework/zokou");

zokou({
    nomCom: "logo",
    reaction: "🎨",
    categorie: "General"
}, async (dest, zk, commandeOptions) => {
    const { repondre, arg, ms } = commandeOptions;

    try {
        // Check if user provided text
        if (!arg || arg.length === 0) {
            return repondre("*Please provide text for the logo!*\nExample: `.logo RAHMANI-XMD`");
        }

        // Join all arguments as the logo text
        const logoText = arg.join(" ");
        
        // API URL for generating logo
        const apiUrl = `https://www.samirxpikachu.run.place/Arct?text=${encodeURIComponent(logoText)}`;
        
        // Send the generated logo image with RAHMANI-XMD branding
        await zk.sendMessage(dest, {
            image: { url: apiUrl },
            caption: `🎨 *Logo Generated!*\n\n⚡ *RAHMANI-XMD*`,
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
                    body: `🎨 Logo: ${logoText.substring(0, 20)}${logoText.length > 20 ? '...' : ''}`,
                    thumbnailUrl: 'https://files.catbox.moe/aktbgo.jpg',
                    mediaType: 1,
                    renderSmallThumbnail: true
                }
            }
        }, { quoted: ms });

    } catch (error) {
        console.log("Logo error:", error.message || error);
        
        // Error message with RAHMANI-XMD branding
        await zk.sendMessage(dest, {
            text: "❌ *Oops, an error occurred while generating the logo.*\nPlease try again later.\n\n⚡ *RAHMANI-XMD*",
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
