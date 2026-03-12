const {zokou}=require("../framework/zokou") 
const {getContentType}=require("@whiskeysockets/baileys")


zokou({ nomCom: "vv", aliases: ["send", "keep"], categorie: "General" }, async (dest, zk, commandeOptions) => {
  const { repondre, msgRepondu, superUser } = commandeOptions;

  if (msgRepondu) {
    console.log(msgRepondu);
    let msg;
    try {
      // Check for different message types and handle accordingly
      if (msgRepondu.imageMessage) {
        const media = await zk.downloadAndSaveMediaMessage(msgRepondu.imageMessage);
        msg = { image: { url: media }, caption: msgRepondu.imageMessage.caption };
      } else if (msgRepondu.videoMessage) {
        const media = await zk.downloadAndSaveMediaMessage(msgRepondu.videoMessage);
        msg = { video: { url: media }, caption: msgRepondu.videoMessage.caption };
      } else if (msgRepondu.audioMessage) {
        const media = await zk.downloadAndSaveMediaMessage(msgRepondu.audioMessage);
        msg = { audio: { url: media }, mimetype: 'audio/mp4' };
      } else if (msgRepondu.stickerMessage) {
        const media = await zk.downloadAndSaveMediaMessage(msgRepondu.stickerMessage);
        const stickerMess = new Sticker(media, {
          pack: '𝐊𝐈𝐍𝐆𝐒-𝐌𝐃',
          type: StickerTypes.CROPPED,
          categories: ["🤩", "🎉"],
          id: "12345",
          quality: 70,
          background: "transparent",
        });
        const stickerBuffer2 = await stickerMess.toBuffer();
        msg = { sticker: stickerBuffer2 };
      } else {
        msg = { text: msgRepondu.conversation };
      }

      // Send the message
      await zk.sendMessage(dest, msg);

    } catch (error) {
      console.error("Error processing the message:", error);
      repondre('An error occurred while processing your request.');
    }

  } else {
    repondre('Mention the message that you want to save');
  }
});
