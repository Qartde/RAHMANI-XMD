const { zokou } = require("../framework/zokou");
const { Sticker, StickerTypes } = require("wa-sticker-formatter");
const fs = require("fs-extra");
const path = require("path");

zokou({
  nomCom: "take",
  aliases: ["steal", "getsticker", "s", "t"],
  reaction: "🎨",
  categorie: "Sticker"
}, async (dest, zk, commandeOptions) => {
  const { ms, repondre, arg, msgRepondu, mtype, auteurMessage, superUser } = commandeOptions;
  
  try {
    // Check if there's a quoted message
    if (!msgRepondu) {
      return repondre(`╭━━━〔 *RAHMANI XMD* 〕━━━╮
┃
┃ 📌 *TAKE COMMAND*
┃
┃ Convert sticker to your own pack!
┃
┃ *Usage:*
┃ Reply to a sticker with:
┃ ${commandeOptions.prefixe}take <packname> <author>
┃
┃ *Example:*
┃ ${commandeOptions.prefixe}take RAHMANI-XMD Rahmani
┃
╰━━━〔 *BY RAHMANI XMD* 〕━━━╯`);
    }
    
    // Get packname and author from args
    let packname = arg[0] || "RAHMANI-XMD";
    let author = arg[1] || "RAHMANI XMD";
    
    // If there's more text, combine them
    if (arg.length > 2) {
      author = arg.slice(1).join(" ");
    }
    
    // Check if the quoted message is a sticker
    const quotedMsg = msgRepondu;
    let stickerBuffer = null;
    let isVideo = false;
    
    // Get the sticker from quoted message
    if (quotedMsg.stickerMessage) {
      console.log("📸 Sticker detected, downloading...");
      stickerBuffer = await zk.downloadMediaMessage(quotedMsg);
      isVideo = false;
    } 
    else if (quotedMsg.videoMessage) {
      console.log("🎥 Video detected, converting to sticker...");
      const videoDuration = quotedMsg.videoMessage.seconds || 0;
      if (videoDuration > 11) {
        return repondre("❌ Video too long! Maximum 10 seconds for sticker.");
      }
      stickerBuffer = await zk.downloadMediaMessage(quotedMsg);
      isVideo = true;
    }
    else if (quotedMsg.imageMessage) {
      console.log("🖼️ Image detected, converting to sticker...");
      stickerBuffer = await zk.downloadMediaMessage(quotedMsg);
      isVideo = false;
    }
    else {
      return repondre("❌ Please reply to a sticker, image, or short video!");
    }
    
    if (!stickerBuffer) {
      return repondre("❌ Failed to download media!");
    }
    
    // Send processing message
    await repondre("🎨 *Processing sticker...*");
    
    // Create sticker with new pack
    let sticker;
    
    if (isVideo) {
      // For video stickers
      sticker = new Sticker(stickerBuffer, {
        pack: packname,
        author: author,
        type: StickerTypes.CIRCLE,
        categories: ['🤩', '🎉'],
        quality: 50,
        background: 'transparent'
      });
    } else {
      // For image stickers
      sticker = new Sticker(stickerBuffer, {
        pack: packname,
        author: author,
        type: StickerTypes.FULL,
        categories: ['🤩', '🎉'],
        quality: 50,
        background: 'transparent'
      });
    }
    
    const stickerBufferOut = await sticker.toBuffer();
    
    // Send the new sticker
    await zk.sendMessage(dest, {
      sticker: stickerBufferOut,
      contextInfo: {
        externalAdReply: {
          title: packname,
          body: author,
          thumbnailUrl: "https://files.catbox.moe/aktbgo.jpg",
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    });
    
    console.log(`✅ Sticker sent with pack: ${packname} | author: ${author}`);
    
  } catch (error) {
    console.error("Take command error:", error);
    repondre(`❌ Error: ${error.message}\n\nMake sure you're replying to a sticker/image/video.`);
  }
});
