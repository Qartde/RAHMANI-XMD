const { zokou } = require("../framework/zokou");

// Store Anti-Delete status per chat (group or personal)
const antiDeleteStatus = new Map();

// Anti-Delete handler - Always active for all chats
module.exports.antiDeleteHandler = async (message, zk) => {
  try {
    const chatId = message.key.remoteJid;
    if (!chatId) return;

    // Only handle deleted messages
    if (message.messageStubType === 68 && message.messageStubParameters) {
      let deletedMessage = await zk.loadMessage(chatId, message.messageStubParameters[0]);

      if (deletedMessage) {
        let sender = deletedMessage.participant || "Unknown";
        let content = extractMessageContent(deletedMessage.message);
        
        if (content) {
          let text = `*🚨 Anti-Delete Alert!*\n👤 *Sender:* @${sender.split('@')[0]}\n📩 *Recovered Message:* ${content}`;
          await zk.sendMessage(chatId, { text, mentions: [sender] });
        }
      }
    }
  } catch (error) {
    console.error("Anti-Delete Handler Error:", error);
  }
};

// Function to extract message content (text, image, video, etc.)
function extractMessageContent(msg) {
  if (!msg) return null;
  return (
    msg.conversation ||
    msg.extendedTextMessage?.text ||
    (msg.imageMessage && "[📷 Image]") ||
    (msg.videoMessage && "[📹 Video]") ||
    (msg.stickerMessage && "[🧩 Sticker]") ||
    (msg.audioMessage && "[🎵 Voice Note]") ||
    "[🚫 Unsupported Message Type]"
  );
}
