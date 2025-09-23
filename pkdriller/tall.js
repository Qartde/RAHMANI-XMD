const { zokou } = require('../framework/zokou');
const traduire = require("../framework/traduction");
const { default: axios } = require('axios');
const fs = require('fs');
const pkg = require('@whiskeysockets/baileys');
const { generateWAMessageFromContent, proto } = pkg;

if (!global.userChats) global.userChats = {};

zokou({ nomCom: "gpt", reaction: "🤠", categorie: "ai" }, async (dest, zk, commandeOptions) => {
  const { arg, ms } = commandeOptions;

  try {
    if (!arg || arg.length === 0) {
      return await zk.sendMessage(dest, { text: "❌ Please provide a question or message." }, { quoted: ms });
    }

    const text = arg.join(" ");

    // Store user chat history
    if (!global.userChats[ms.sender]) global.userChats[ms.sender] = [];
    global.userChats[ms.sender].push(`User: ${text}`);

    // Keep only last 15 messages
    if (global.userChats[ms.sender].length > 15) {
      global.userChats[ms.sender].shift();
    }

    const history = global.userChats[ms.sender].join("\n");

    const prompt = `
You are Rahman Ai surrport by HansTz, a friendly and intelligent WhatsApp bot. Chat naturally without asking repetitive questions, and do not ask, 'How can I assist you?'

### Chat History:  
${history}
`;

    // Call your API
    const { data } = await axios.get("https://HansTzTech-api.hf.space/ai/logic", {
      params: { q: text, logic: prompt }
    });

    if (data && data.response) {
      const botReply = `${data.response}`;

      // Save bot response in history
      global.userChats[ms.sender].push(`Bot: ${data.response}`);

      // Send reply via zk
      await zk.sendMessage(dest, { text: botReply }, { quoted: ms });
    } else {
      throw new Error("Invalid response from API");
    }
  } catch (error) {
    console.error("Error in GPT command:", error.message);
    await zk.sendMessage(dest, { text: "⚠️ Error while fetching AI response. Please try again." }, { quoted: ms });
  }
});
