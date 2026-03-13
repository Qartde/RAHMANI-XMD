const { zokou } = require("../framework/zokou");
const axios = require("axios");

const OWNER = "ʀᴀʜᴍᴀɴɪ xᴍᴅ";

zokou({
  nomCom: "gpt",
  aliases: ["ai"],
  reaction: "🧠",
  categorie: "AI"
}, async (dest, zk, { repondre, arg, ms }) => {
  const question = arg.join(" ");
  if (!question) return repondre(`🧠 *Example:* .gpt What is AI?`);

  try {
    await repondre(`🧠 ${OWNER} is thinking...`);

    const prompt = `You are an AI assistant. Your owner is ${OWNER}. Answer: ${question}`;
    const { data } = await axios.get(`https://api.deline.web.id/ai/openai?text=${encodeURIComponent(question)}&prompt=${encodeURIComponent(prompt)}`);
    
    if (data?.result) {
      await zk.sendMessage(dest, {
        text: `🧠 *${OWNER}*\n\n*Q:* ${question}\n\n*A:* ${data.result}\n\n⚡ ${OWNER}`,
        contextInfo: {
          forwardedNewsletterMessageInfo: {
            newsletterJid: "120363353854480831@newsletter",
            newsletterName: "RAHMANI XMD"
          },
          externalAdReply: {
            title: "RAHMANI-XMD AI",
            body: question.substring(0, 30),
            thumbnailUrl: "https://files.catbox.moe/aktbgo.jpg",
            mediaType: 1
          }
        }
      }, { quoted: ms });
    }
  } catch (error) {
    repondre(`❌ Error: ${error.message}`);
  }
});
