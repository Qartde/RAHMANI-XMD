const { bmbtz } = require("../../devbmb/bmbtz");
const axios = require('axios');
const { Sticker, StickerTypes } = require('wa-sticker-formatter'); // Hakikisha ume-install hii

bmbtz({
    nomCom: "stickersearch",
    alias: ["sticker", "getsticker"],
    categorie: "Search",
    reaction: "🩹",
    desc: "Search and download stickers"
}, async (dest, client, commandeOptions) => {
    const { ms, arg, repondre } = commandeOptions;
    
    // 1. Kagua kama mtumiaji ameandika neno
    if (!arg[0]) {
        return repondre("❌ *Tafadhali weka jina la sticker!*\nMfano: `.stickersearch batman`");
    }

    const query = arg.join(' ');
    await repondre(`⏳ *Inatafuta sticker za "${query}"...*`);

    try {
        // API ya kutafuta stickers (Tenor/Giphy)
        // Kama API hii imegoma siku zijazo, unaweza kuibadilisha
        const res = await axios.get(`https://api.nexoracle.com/search/stickers?apikey=free&q=${encodeURIComponent(query)}`);
        
        if (!res.data || !res.data.result || res.data.result.length === 0) {
            return repondre(`❌ *Hakuna sticker zilizopatikana kwa "${query}".* Jaribu neno lingine.`);
        }

        // Chukua sticker 3 za kwanza
        const stickers = res.data.result.slice(0, 3); 
        
        for (let i = 0; i < stickers.length; i++) {
            const stickerUrl = stickers[i];
            
            try {
                // Badilisha picha kuwa sticker ya WhatsApp
                const sticker = new Sticker(stickerUrl, {
                    pack: 'RAHMANI-XMD',
                    author: 'Rahmani',
                    type: StickerTypes.FULL,
                    quality: 70
                });
                
                const buffer = await sticker.toBuffer();
                
                // Tuma sticker
                await client.sendMessage(dest, { sticker: buffer }, { quoted: ms });

            } catch (err) {
                console.log("Kosa kwenye kubadilisha sticker:", err);
            }
        }

    } catch (error) {
        console.error("❌ Sticker Search Error:", error);
        // Hapa ndipo ilipoleta ile error ya Kifaransa, sasa tunaweka ujumbe mzuri
        await repondre("❌ *Kuna tatizo la mtandao au API imeanguka.* Jaribu tena baada ya muda.");
    }
});
