// Rahmanixmd/chatgpt.js
// ChatGPT API for Rahmani-Xmd

const axios = require('axios');
const { zokou } = require('../framework/zokou');

// Configuration
const API_URL = 'https://bmb-api.zone.id/api/chatgpt';
const OWNER_NAME = 'Rahmani';
const BOT_NAME = 'RAHMANI-XMD';

// Command: .chatgpt or .gpt
zokou({
    nomCom: 'chatgpt',
    reaction: '🤖',
    categorie: 'AI'
}, async (origineMessage, zk, commandeOptions) => {
    const { arg, repondre, ms, auteurMessage, nomAuteurMessage } = commandeOptions;
    
    // Check if user provided text
    if (!arg || arg.length === 0) {
        await repondre(`*🤖 ChatGPT API*
            
*Usage:* .chatgpt [question]
*Example:* .chatgpt How are you?

*Owner:* ${OWNER_NAME}
*Bot:* ${BOT_NAME}`);
        return;
    }

    const question = arg.join(' ');
    
    // Show typing indicator
    await zk.sendPresenceUpdate('composing', origineMessage);
    
    try {
        // Check if user is owner (Rahmani)
        const isOwner = nomAuteurMessage?.toLowerCase().includes('rahmani') || 
                       auteurMessage === `${conf.NUMERO_OWNER}@s.whatsapp.net`;
        
        // Call API
        const response = await axios.get(API_URL, {
            params: { text: question },
            timeout: 30000
        });
        
        if (response.data && response.data.status === true) {
            let reply = response.data.result;
            
            // Add owner recognition
            if (isOwner) {
                reply = `👑 *Owner Rahmani!*\n\n${reply}`;
            }
            
            // Add bot signature
            reply = `${reply}\n\n_🤖 ${BOT_NAME}_`;
            
            await repondre(reply);
        } else {
            await repondre('❌ API not responding. Please try again.');
        }
    } catch (error) {
        console.error('ChatGPT Error:', error.message);
        await repondre('❌ Network error. Please try again later.');
    }
});

// Command: .ai (shortcut)
zokou({
    nomCom: 'ai',
    reaction: '🧠',
    categorie: 'AI'
}, async (origineMessage, zk, commandeOptions) => {
    const { arg, repondre } = commandeOptions;
    
    if (!arg || arg.length === 0) {
        await repondre(`*🧠 AI Assistant*
            
*Usage:* .ai [question]
*Example:* .ai Who are you?`);
        return;
    }

    const question = arg.join(' ');
    
    await zk.sendPresenceUpdate('composing', origineMessage);
    
    try {
        const response = await axios.get(API_URL, {
            params: { text: question },
            timeout: 30000
        });
        
        if (response.data && response.data.status === true) {
            let reply = response.data.result;
            
            // Check if user is Rahmani
            const isOwner = commandeOptions.nomAuteurMessage?.toLowerCase().includes('rahmani');
            if (isOwner) {
                reply = `👑 *Rahmani Owner!*\n\n${reply}`;
            }
            
            await repondre(reply);
        } else {
            await repondre('❌ Please try again.');
        }
    } catch (error) {
        await repondre('❌ Network error. Please try again.');
    }
});

// Auto-reply in private chat (optional)
zokou({
    nomCom: 'chatgpt_auto',
    reaction: '💬',
    categorie: 'AI',
    auto: true
}, async (origineMessage, zk, commandeOptions) => {
    const { texte, auteurMessage, repondre, ms, nomAuteurMessage } = commandeOptions;
    
    // Only in private chat
    if (origineMessage.endsWith('@g.us')) return;
    if (!texte) return;
    if (texte.startsWith(conf.PREFIXE)) return;
    if (ms.key.fromMe) return;
    
    // Check if ChatGPT auto is enabled
    if (conf.CHATGPT_AUTO !== 'yes') return;
    
    await zk.sendPresenceUpdate('composing', origineMessage);
    
    try {
        const isOwner = nomAuteurMessage?.toLowerCase().includes('rahmani') || 
                       auteurMessage === `${conf.NUMERO_OWNER}@s.whatsapp.net`;
        
        const response = await axios.get(API_URL, {
            params: { text: texte },
            timeout: 30000
        });
        
        if (response.data && response.data.status === true) {
            let reply = response.data.result;
            
            if (isOwner) {
                reply = `👑 *Owner Rahmani!*\n\n${reply}`;
            }
            
            await repondre(reply);
        }
    } catch (error) {
        console.error('Auto ChatGPT Error:', error);
    }
});
