"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

const {
  zokou
} = require("../framework/zokou");

zokou({
  'nomCom': "test",
  'desc': "Test bot response",
  'categorie': "General",
  'reaction': '📎',
  'fromMe': "true",
  'nomFichier': __filename
}, async (_0x4d1cb2, _0x6e67fd, _0x17c78a) => {
  
  const {
    ms: _0x42d661,
    arg: _0x32ab8b,
    repondre: _0x1e9691,
    prefixe: _0x140f2f
  } = _0x17c78a;
  
  try {
    const repoUrl = "https://github.com/Qartde/RAHMANI-XMD";
    const groupUrl = "https://chat.whatsapp.com/DTnrZzULVtP5r0E9rhoFOj";
    const channelUrl = "https://whatsapp.com/channel/0029VatokI45EjxufALmY32X";
    const thumbnail = "https://files.catbox.moe/aktbgo.jpg";
    const mp4 = 'https://files.catbox.moe/4bepay.mp4';
    
    const testMessage = `
╭━━━━━━━━━━━━━━━━━━━━╮
┃   📎 *TEST MODE* 📎
╰━━━━━━━━━━━━━━━━━━━━╯

┌─── *BOT INFO* ───┐
│ 🤖 *Name:* 𝑹𝑨𝑯𝑴𝑨𝑵𝑰 𝑴𝑫
│ 👤 *Creator:* 𝑹𝑨𝑯𝑴𝑨𝑵𝑰
│ 📝 *Type:* WhatsApp Multi-Device Bot
│ ⚡ *Status:* ONLINE
└──────────────────┘

┌─── *MESSAGE* ───┐
│ Hello! I'm a WhatsApp bot
│ multi-device created by
│ 𝑹𝑨𝑯𝑴𝑨𝑵𝑰 🤖
└──────────────────┘

┌─── *LINKS* ───┐
│ 📎 *GitHub:* ${repoUrl}
│ 👥 *Group:* ${groupUrl}
│ 📢 *Channel:* ${channelUrl}
└────────────────┘

> *RAHMANI-XMD* 📎
    `;

    await _0x6e67fd.sendMessage(_0x4d1cb2, {
      'video': { 'url': mp4 },
      'caption': testMessage,
      'contextInfo': {
        'forwardingScore': 999,
        'isForwarded': true,
        'forwardedNewsletterMessageInfo': {
          'newsletterJid': "120363353854480831@newsletter",
          'newsletterName': "RAHMANI-XMD",
          'serverMessageId': 143
        },
        'externalAdReply': {
          'title': "📎 RAHMANI-XMD TEST",
          'body': "Bot is online and working!",
          'thumbnailUrl': thumbnail,
          'sourceUrl': channelUrl,
          'mediaType': 1,
          'renderLargerThumbnail': true,
          'showAdAttribution': true
        }
      }
    }, {
      'quoted': _0x42d661
    });
    
    console.log("✅ test command executed successfully");
    
  } catch (_0x141e7b) {
    console.log("❌ test Command Error: " + _0x141e7b);
    
    // Fallback - simple message
    await _0x6e67fd.sendMessage(_0x4d1cb2, {
      'text': "╭━━━━━━━━━━━━━━╮\n┃   📎 *TEST* 📎\n╰━━━━━━━━━━━━━━╯\n\nHello! I'm 𝑹𝑨𝑯𝑴𝑨𝑵𝑰 𝑴𝑫, a WhatsApp bot created by 𝑹𝑨𝑯𝑴𝑨𝑵𝑰 🤖\n\n*RAHMANI-XMD*"
    }, {
      'quoted': _0x42d661
    });
  }
});

console.log("✅ test command loaded");
