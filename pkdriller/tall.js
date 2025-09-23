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

    if (global.userChats[ms.sender].length > 15) {
      global.userChats[ms.sender].shift();
    }

    const history = global.userChats[ms.sender].join("\n");

    const prompt = `
You are Rahman Ai surrport by HansTz, a friendly and intelligent WhatsApp bot. Chat naturally without asking repetitive questions.

### Chat History:  
${history}
`;

    // Call your API
    const { data } = await axios.get("https://HansTzTech-api.hf.space/ai/logic", {
      params: { q: text, logic: prompt }
    });

    console.log("✅ API Raw Response:", data);

    let botReply = "";
    if (typeof data === "string") {
      botReply = data;
    } else if (data.response) {
      botReply = data.response;
    } else if (data.output) {
      botReply = data.output;
    } else {
      throw new Error("Unexpected API response format");
    }

    // Direct reply only once
    await zk.sendMessage(dest, { text: botReply }, { quoted: ms });

  } catch (error) {
    console.error("❌ Error in GPT command:", error);
    await zk.sendMessage(dest, { text: "⚠️ Error while fetching AI response. Please try again." }, { quoted: ms });
  }
});
