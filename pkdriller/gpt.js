const { zokou } = require("../framework/zokou");
const axios = require("axios");

const BOT_NAME = "ʀᴀʜᴍᴀɴɪ xᴍᴅ";
const NEWSLETTER_JID = "120363353854480831@newsletter";
const THUMBNAIL_URL = "https://files.catbox.moe/aktbgo.jpg";

zokou({
  nomCom: "gpt",
  aliases: ["ai", "chatgpt", "openai", "ask"],
  reaction: "🧠",
  categorie: "AI"
}, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;
  const question = arg.join(" ");

  try {
    // Check if question is provided
    if (!question) {
      await zk.sendMessage(dest, {
        text: `🧠 *${BOT_NAME} AI ASSISTANT*

╭━━━〔 *HOW TO USE* 〕━━━╮
┃
┃ Ask me anything!
┃
┃ *Examples:*
┃ • .gpt What is WhatsApp bot?
┃ • .gpt Who created you?
┃ • .gpt Tell me a joke
┃ • .gpt Explain quantum physics
┃
╰━━━〔 *POWERED BY RAHMANI* 〕━━━╯

⚡ *${BOT_NAME}*`,
        contextInfo: {
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: NEWSLETTER_JID,
            newsletterName: "RAHMANI XMD",
            serverMessageId: 143
          },
          forwardingScore: 999,
          externalAdReply: {
            title: BOT_NAME,
            body: '🧠 Ask me anything',
            thumbnailUrl: THUMBNAIL_URL,
            mediaType: 1,
            renderSmallThumbnail: true
          }
        }
      }, { quoted: ms });
      return;
    }

    // Send thinking message
    await zk.sendMessage(dest, {
      text: `🧠 *${BOT_NAME} is thinking...*

╭━━━〔 *YOUR QUESTION* 〕━━━╮
┃
┃ ${question}
┃
╰━━━━━━━━━━━━━━━━━━━━╯

⏳ Please wait...`,
      contextInfo: {
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: NEWSLETTER_JID,
          newsletterName: "RAHMANI XMD",
          serverMessageId: 143
        },
        forwardingScore: 999,
        externalAdReply: {
          title: BOT_NAME,
          body: `🤔 ${question.substring(0, 25)}...`,
          thumbnailUrl: THUMBNAIL_URL,
          mediaType: 1,
          renderSmallThumbnail: true
        }
      }
    }, { quoted: ms });

    // Prepare prompt with owner recognition
    const prompt = `You are a helpful, polite AI assistant. Your name is RAHMANI-XMD AI. Your creator and owner is ${BOT_NAME}. Always respond in a friendly manner. If someone asks who created you, say you were created by ${BOT_NAME}. Answer: ${question}`;
    
    // Call API
    const apiUrl = `https://api.deline.web.id/ai/openai?text=${encodeURIComponent(question)}&prompt=${encodeURIComponent(prompt)}`;
    
    const response = await axios.get(apiUrl, { timeout: 30000 });
    
    if (response.data?.status === true && response.data?.result) {
      const answer = response.data.result;
      
      // Format response nicely
      const formattedResponse = `🧠 *${BOT_NAME} AI*

╭━━━〔 *YOUR QUESTION* 〕━━━╮
┃
┃ ${question}
┃
╰━━━━━━━━━━━━━━━━━━━━╯

╭━━━〔 *AI RESPONSE* 〕━━━╮
┃
┃ ${answer}
┃
╰━━━━━━━━━━━━━━━━━━━━╯

⚡ *${BOT_NAME}*`;

      await zk.sendMessage(dest, {
        text: formattedResponse,
        contextInfo: {
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: NEWSLETTER_JID,
            newsletterName: "RAHMANI XMD",
            serverMessageId: 143
          },
          forwardingScore: 999,
          externalAdReply: {
            title: BOT_NAME,
            body: `✅ Response generated`,
            thumbnailUrl: THUMBNAIL_URL,
            mediaType: 1,
            renderSmallThumbnail: true
          }
        }
      }, { quoted: ms });
      
    } else {
      throw new Error("Invalid API response");
    }

  } catch (error) {
    console.error("GPT Error:", error.message);
    
    // Error message
    await zk.sendMessage(dest, {
      text: `❌ *Error*

╭━━━〔 *ERROR DETAILS* 〕━━━╮
┃
┃ ${error.message}
┃
┃ Please try again later.
┃
╰━━━━━━━━━━━━━━━━━━━━╯

⚡ *${BOT_NAME}*`,
      contextInfo: {
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: NEWSLETTER_JID,
          newsletterName: "RAHMANI XMD",
          serverMessageId: 143
        },
        forwardingScore: 999,
        externalAdReply: {
          title: BOT_NAME,
          body: '❌ Request Failed',
          thumbnailUrl: THUMBNAIL_URL,
          mediaType: 1,
          renderSmallThumbnail: true
        }
      }
    }, { quoted: ms });
  }
});
