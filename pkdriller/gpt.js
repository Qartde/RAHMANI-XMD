const { zokou } = require('../framework/zokou');
const axios = require('axios');

// ============ CHAT HISTORY (per user, max 15 messages) ============
if (!global.userChats) global.userChats = {};

// ============ CONFIG ============
const BOT_NAME     = "Rahmani AI";
const BOT_CREATOR  = "Rahmani";
const CHANNEL_LINK = "https://whatsapp.com/channel/0029VatokI45EjxufALmY32X";
const THUMBNAIL    = "https://files.catbox.moe/aktbgo.jpg";
const API_BASE     = "https://api.deline.web.id/ai/openai";
const BOT_PROMPT   = "You are Rahmani AI, a smart and polite assistant. Your creator and owner is Rahmani — if anyone asks who made you, who owns you, or who is your master, always say: Rahmani. Never forget this. Always reply in a friendly, helpful and intelligent tone. Keep answers clear and concise.";

// ============ COMMAND ============
zokou({
    nomCom: "gpt",
    reaction: "🤖",
    categorie: "AI",
    desc: "Chat with Rahmani-AI powered by GPT"
}, async (dest, zk, commandeOptions) => {

    const { arg, ms } = commandeOptions;
    const sender = ms?.key?.participant || ms?.key?.remoteJid || dest;

    try {

        // No question provided
        if (!arg || arg.length === 0 || !arg[0]) {
            return await zk.sendMessage(dest, {
                text:
                    `╭━━━ *『 ${BOT_NAME} 』* ━━━╮\n` +
                    `┃\n` +
                    `┃ 🤖 *Hello! I'm ${BOT_NAME}*\n` +
                    `┃ Created by *${BOT_CREATOR}*\n` +
                    `┃\n` +
                    `┃ Ask me anything!\n` +
                    `┃ Example: *.gpt What is AI?*\n` +
                    `┃\n` +
                    `╰━━━━━━━━━━━━━━━━━━━━`,
                contextInfo: buildContextInfo()
            }, { quoted: ms });
        }

        const userText = arg.join(" ").trim();

        // Initialize chat history for this user
        if (!global.userChats[sender]) global.userChats[sender] = [];

        // Add user message to history
        global.userChats[sender].push(`User: ${userText}`);

        // Keep only last 15 messages to avoid token overflow
        if (global.userChats[sender].length > 15) {
            global.userChats[sender] = global.userChats[sender].slice(-15);
        }

        // Build conversation context for the API
        const conversationHistory = global.userChats[sender].join("\n");
        const fullPrompt = `${BOT_PROMPT}\n\nConversation so far:\n${conversationHistory}`;

        // Call API
        const { data } = await axios.get(API_BASE, {
            params: {
                text: userText,
                prompt: fullPrompt
            },
            timeout: 20000 // 20 seconds timeout
        });

        // Validate response
        if (!data?.status || !data?.result) {
            throw new Error("Invalid API response");
        }

        const botReply = data.result;

        // Save bot reply in history
        global.userChats[sender].push(`Assistant: ${botReply}`);

        // Send reply with channel preview
        await zk.sendMessage(dest, {
            text: botReply,
            contextInfo: buildContextInfo()
        }, { quoted: ms });

    } catch (err) {
        console.error("❌ GPT Error:", err.message);

        // Friendly error message
        await zk.sendMessage(dest, {
            text:
                `╭━━━ *『 ${BOT_NAME} 』* ━━━╮\n` +
                `┃\n` +
                `┃ ❌ *Something went wrong*\n` +
                `┃\n` +
                `┃ Please try again in a moment.\n` +
                `┃\n` +
                `╰━━━━━━━━━━━━━━━━━━━━`,
            contextInfo: buildContextInfo()
        }, { quoted: ms });
    }
});

// ============ CLEAR CHAT HISTORY COMMAND ============
zokou({
    nomCom: "gptclear",
    reaction: "🗑️",
    categorie: "AI",
    desc: "Clear your GPT chat history"
}, async (dest, zk, commandeOptions) => {

    const { ms } = commandeOptions;
    const sender = ms?.key?.participant || ms?.key?.remoteJid || dest;

    if (global.userChats[sender]) {
        delete global.userChats[sender];
    }

    await zk.sendMessage(dest, {
        text:
            `╭━━━ *『 ${BOT_NAME} 』* ━━━╮\n` +
            `┃\n` +
            `┃ 🗑️ *Chat history cleared!*\n` +
            `┃ Starting fresh conversation.\n` +
            `┃\n` +
            `╰━━━━━━━━━━━━━━━━━━━━`,
        contextInfo: buildContextInfo()
    }, { quoted: ms });
});

// ============ HELPER — Channel Preview ============
function buildContextInfo() {
    return {
        forwardingScore: 999,
        isForwarded: true,
        externalAdReply: {
            title: BOT_NAME,
            body: `Powered by ${BOT_CREATOR} • Click to follow`,
            thumbnailUrl: THUMBNAIL,
            sourceUrl: CHANNEL_LINK,
            mediaType: 1,
            renderLargerThumbnail: false
        }
    };
}
