const { zokou } = require("../framework/zokou");
const axios = require("axios");

const GEMINI_API_KEY = "AIzaSyCjl6tq_XaQ-5We9pRPPg2DSDoIYp1MNU4";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

// Memory ya mazungumzo kwa kila mtumiaji
const chatHistory = new Map();

zokou(
  {
    nomCom: "ai",
    aliases: ["gemini", "chat", "gpt"],
    categorie: "AI",
    reaction: "🤖",
  },
  async (origineMessage, zk, commandeOptions) => {
    const { ms, repondre, arg, auteurMessage, nomAuteurMessage } = commandeOptions;

    if (!arg || arg.length === 0) {
      return repondre(
        `🤖 *RAHMANI XMD - AI CHATBOT*\n\n` +
        `Tumia: *.ai [swali lako]*\n\n` +
        `Mfano:\n` +
        `• *.ai Habari yako?*\n` +
        `• *.ai Nipe recipe ya pilau*\n` +
        `• *.ai Saidia kuandika barua*\n\n` +
        `📝 Aliases: .gemini, .chat, .gpt\n` +
        `🗑️ Futa historia: *.ai clear*`
      );
    }

    const userMessage = arg.join(" ").trim();

    // Futa historia ya mazungumzo
    if (userMessage.toLowerCase() === "clear") {
      chatHistory.delete(auteurMessage);
      return repondre("✅ Historia ya mazungumzo imefutwa!");
    }

    // Pata historia ya mtumiaji huyu
    if (!chatHistory.has(auteurMessage)) {
      chatHistory.set(auteurMessage, []);
    }
    const history = chatHistory.get(auteurMessage);

    // Ongeza message ya mtumiaji kwenye historia
    history.push({
      role: "user",
      parts: [{ text: userMessage }],
    });

    // Weka historia kwa max messages 10 tu
    if (history.length > 10) {
      history.splice(0, history.length - 10);
    }

    try {
      await zk.sendPresenceUpdate("composing", origineMessage);

      const response = await axios.post(
        GEMINI_URL,
        {
          system_instruction: {
            parts: [
              {
                text: `Wewe ni AI assistant wa WhatsApp bot inayoitwa Rahmani MD. Jina lako ni Rahmani. Jibu kwa lugha ile ile mtumiaji anayotumia (Swahili, English, au lugha nyingine). Jibu kwa ufupi na kwa njia ya kirafiki. Usitumie markdown nyingi. Mtumiaji anakuita: ${nomAuteurMessage}.`,
              },
            ],
          },
          contents: history,
        },
        {
          headers: { "Content-Type": "application/json" },
          timeout: 20000,
        }
      );

      const reply =
        response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!reply) {
        return repondre("❌ Hakuna jibu lililopatikana. Jaribu tena.");
      }

      // Hifadhi jibu la AI kwenye historia
      history.push({
        role: "model",
        parts: [{ text: reply }],
      });

      await zk.sendPresenceUpdate("available", origineMessage);
      await zk.sendMessage(
        origineMessage,
        { text: `🤖 *Rahmani AI*\n\n${reply}` },
        { quoted: ms }
      );
    } catch (error) {
      await zk.sendPresenceUpdate("available", origineMessage);
      console.log("Gemini error:", error?.response?.data || error.message);

      if (error?.response?.status === 429) {
        return repondre("⚠️ Ombi nyingi sana! Subiri sekunde chache kisha jaribu tena.");
      } else if (error?.response?.status === 400) {
        chatHistory.delete(auteurMessage);
        return repondre("⚠️ Kuna tatizo na ombi lako. Historia imefutwa, jaribu tena.");
      } else {
        return repondre("❌ Kosa limetokea: " + (error?.response?.data?.error?.message || error.message));
      }
    }
  }
);
