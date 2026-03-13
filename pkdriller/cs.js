const {
  zokou
} = require("../framework/zokou");

zokou({
  'nomCom': "repo",
  'desc': "Show repository information",
  'categorie': "General",
  'reaction': '🌍',
  'fromMe': "true"
}, async (_0x4d1cb2, _0x6e67fd, _0x17c78a) => {
  
  const {
    ms: _0x42d661,
    arg: _0x32ab8b,
    repondre: _0x1e9691
  } = _0x17c78a;
  
  try {
    const repoUrl = "https://github.com/Qartde/RAHMANI-XMD";
    const groupUrl = "https://chat.whatsapp.com/DTnrZzULVtP5r0E9rhoFOj";
    const channelUrl = "https://whatsapp.com/channel/0029VatokI45EjxufALmY32X"; // Sasa channel ina link ya pair session
    const thumbnail = "https://files.catbox.moe/aktbgo.jpg";
    
    const repoMessage = `
╭━━━━━━━━━━━━━━━━━━━━╮
┃   📁 *REPO INFO* 📁
╰━━━━━━━━━━━━━━━━━━━━╯

┌─── *ABOUT* ───┐
│ 🤖 *Name:* RAHMANI-XMD
│ 👤 *Owner:* Qartde
│ 📝 *Desc:* Powerful WhatsApp Bot
│ 🔧 *Status:* UNDER MAINTENANCE
└────────────────┘

┌─── *FEATURES* ───┐
│ • Group Management
│ • Anti-Link & Anti-Bug
│ • Media Downloader
│ • AI Features (GPT, Bard)
│ • Fun Commands
│ • Level System
└──────────────────┘

┌─── *LINKS* ───┐
│ 📎 *GitHub:* ${repoUrl}
│ 👥 *Group:* ${groupUrl}
│ 📢 *Channel:* ${channelUrl}
└────────────────┘

> *RAHMANI-XMD* 🚀
    `;

    await _0x6e67fd.sendMessage(_0x4d1cb2, {
      'text': repoMessage,
      'contextInfo': {
        'forwardingScore': 999,
        'isForwarded': true,
        'forwardedNewsletterMessageInfo': {
          'newsletterJid': "120363353854480831@newsletter",
          'newsletterName': "RAHMANI-XMD",
          'serverMessageId': 143
        },
        'externalAdReply': {
          'title': "📁 RAHMANI-XMD REPO",
          'body': "GitHub • Group • Pair Session",
          'thumbnailUrl': thumbnail,
          'sourceUrl': repoUrl,
          'mediaType': 1,
          'renderLargerThumbnail': true,
          'showAdAttribution': true
        }
      }
    }, {
      'quoted': _0x42d661
    });
    
  } catch (_0x141e7b) {
    console.log("❌ repo Command Error: " + _0x141e7b);
    
    // Fallback
    await _0x6e67fd.sendMessage(_0x4d1cb2, {
      'text': `╭━━━━━━━━━━━━━━╮
┃   📁 *REPO* 📁
╰━━━━━━━━━━━━━━╯

┌─── *LINKS* ───┐
│ 📎 GitHub: ${repoUrl}
│ 👥 Group: ${groupUrl}
│ 📢 Channel: ${channelUrl}
└────────────────┘

*RAHMANI-XMD* 🚀`
    }, {
      'quoted': _0x42d661
    });
  }
});
