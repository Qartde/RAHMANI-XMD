const { zokou } = require('../framework/zokou');
const { default: axios } = require('axios');

if (!global.userChats) global.userChats = {};

zokou({ nomCom: "gpt", reaction: "🤠", categorie: "ai" }, async (dest, zk, commandeOptions) => {
    const { arg, ms } = commandeOptions;
    const sender = ms.sender;
    const from = dest;

    try {
        if (!arg || arg.length === 0) {
            return await zk.sendMessage(from, { text: "❌ Please provide a question or message." }, { quoted: ms });
        }

        const text = arg.join(" ");

        // Initialize user chat history
        if (!global.userChats[sender]) global.userChats[sender] = [];
        global.userChats[sender].push(`User: ${text}`);

        // Keep only last 15 messages
        if (global.userChats[sender].length > 15) global.userChats[sender].shift();

        const history = global.userChats[sender].join("\n");

        const prompt = `
You are Rahman Ai, a friendly and intelligent WhatsApp bot. Chat naturally without asking repetitive questions.

### Chat History:
${history}
`;

        // Call your API
        const { data } = await axios.get("https://HansTzTech-api.hf.space/ai/logic", {
            params: { q: text, logic: prompt }
        });

        // Extract bot response
        const botResponse = data?.result || "⚠️ Sorry, I couldn't understand your question.";

        // Save bot reply in history
        global.userChats[sender].push(`Bot: ${botResponse}`);

        // Send plain reply
        await zk.sendMessage(from, { text: botResponse }, { quoted: ms });

    } catch (err) {
        console.error("❌ GPT Error:", err);
        await zk.sendMessage(from, { text: "❌ An error occurred: " + err.message }, { quoted: ms });
    }
});
