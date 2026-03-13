const {
  zokou
} = require("../framework/zokou");

zokou({
  'nomCom': "ping",
  'desc': "Check bot response speed",
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
    const start = Date.now();
    
    // Send initial message to calculate real ping
    const sentMsg = await _0x6e67fd.sendMessage(_0x4d1cb2, {
      'text': "⚡ *Calculating ping...*"
    });
    
    const end = Date.now();
    const ping = end - start;
    
    // Delete the calculation message
    await _0x6e67fd.sendMessage(_0x4d1cb2, {
      'delete': sentMsg.key
    });
    
    // Speed emoji based on ping
    let speedEmoji = "⚡";
    let speedText = "GOOD";
    
    if (ping < 100) {
      speedEmoji = "🚀";
      speedText = "EXCELLENT";
    } else if (ping < 300) {
      speedEmoji = "⚡";
      speedText = "FAST";
    } else if (ping < 500) {
      speedEmoji = "👍";
      speedText = "AVERAGE";
    } else if (ping < 1000) {
      speedEmoji = "🐢";
      speedText = "SLOW";
    } else {
      speedEmoji = "🐌";
      speedText = "VERY SLOW";
    }
    
    await _0x6e67fd.sendMessage(_0x4d1cb2, {
      'text': "╭━━━━━━━━━━━━━━╮\n┃   " + speedEmoji + " *PING* " + speedEmoji + "\n╰━━━━━━━━━━━━━━╯\n\n┌─── *RESULTS* ───┐\n│ ⏱️ *Speed:* " + ping + "ms\n│ 📊 *Status:* " + speedText + "\n│ ⚡ *Performance:* " + (ping < 300 ? "OPTIMAL" : "NEEDS OPTIMIZATION") + "\n└──────────────────┘\n\n> *RAHMANI-XMD* ⚡",
      'contextInfo': {
        'forwardingScore': 999,
        'isForwarded': true,
        'forwardedNewsletterMessageInfo': {
          'newsletterJid': "120363353854480831@newsletter",
          'newsletterName': "RAHMANI-XMD",
          'serverMessageId': 143
        },
        'externalAdReply': {
          'title': "⚡ BOT PING",
          'body': ping + "ms - " + speedText,
          'thumbnailUrl': "https://files.catbox.moe/aktbgo.jpg",
          'sourceUrl': "https://whatsapp.com/channel/0029VatokI45EjxufALmY32X",
          'mediaType': 1,
          'renderLargerThumbnail': true,
          'showAdAttribution': true
        }
      }
    }, {
      'quoted': _0x42d661
    });
    
  } catch (_0x141e7b) {
    console.log("❌ ping Command Error: " + _0x141e7b);
    
    // Simple fallback
    await _0x6e67fd.sendMessage(_0x4d1cb2, {
      'text': "╭━━━━━━━━━━━━━━╮\n┃   ⚡ *PING* ⚡\n╰━━━━━━━━━━━━━━╯\n\n> " + (Date.now() - start) + "ms\n\n*RAHMANI-XMD*"
    }, {
      'quoted': _0x42d661
    });
  }
});
