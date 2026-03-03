const { zokou } = require('../framework/zokou');
const { default: axios } = require('axios');

if (!global.userChats) global.userChats = {};

zokou({ nomCom: "rahman", reaction: "😎", categorie: "ai" }, async (dest, zk, commandeOptions) => {
    const { arg, ms, repondre } = commandeOptions;
    const sender = ms.sender;
    const from = dest;

    try {
        if (!arg || arg.length === 0) {
            return await repondre("> YES BOSS AM LISTENING TO YOU 😎");
        }

        const text = arg.join(" ");

        // Tuma typing indicator
        await zk.sendPresenceUpdate('composing', from);

        // Initialize user chat history
        if (!global.userChats[sender]) global.userChats[sender] = [];
        global.userChats[sender].push(`User: ${text}`);

        // Keep only last 10 messages (ili usitumie token nyingi)
        if (global.userChats[sender].length > 10) global.userChats[sender].shift();

        const history = global.userChats[sender].join("\n");

        const prompt = `
You are Rahmany Ai, a friendly and intelligent WhatsApp bot. Chat naturally without asking repetitive questions.
Answer concisely and helpfully in the same language the user speaks.

### Chat History:
${history}

### Current Query:
User: ${text}

### Your Response:
`;

        // Call your API - HAPA UMEBADILISHA URL NA PARAMETERS
        const { data } = await axios.get("https://api.deline.web.id/ai/openai", {
            params: { 
                text: text,
                prompt: prompt 
            }
        });

        // Extract bot response - ADJUST BASED ON YOUR API RESPONSE STRUCTURE
        let botResponse = "⚠️ Sorry, I couldn't process your request.";
        
        if (data && data.status === true) {
            botResponse = data.result || data.response || data.message || "⚠️ No response from AI";
        } else if (data && data.response) {
            botResponse = data.response;
        } else if (data && typeof data === 'string') {
            botResponse = data;
        }

        // Save bot reply in history
        global.userChats[sender].push(`Bot: ${botResponse}`);

        // Send plain reply
        await zk.sendMessage(from, { text: botResponse }, { quoted: ms });

    } catch (err) {
        console.error("❌ GPT Error:", err);
        
        // Error handling
        let errorMsg = "❌ An error occurred: " + err.message;
        if (err.response) {
            errorMsg = `❌ API Error: ${err.response.status} - ${err.response.statusText}`;
        }
        
        await zk.sendMessage(from, { text: errorMsg }, { quoted: ms });
    }
});
