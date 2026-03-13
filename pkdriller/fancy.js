const {
  zokou
} = require("../framework/zokou");
const fancy = require("../commandes/style");

zokou({
  'nomCom': "fancy",
  'desc': "Convert text to fancy styles",
  'categorie': "Fun",
  'reaction': '💫',
  'fromMe': "true"
}, async (_0x4d1cb2, _0x6e67fd, _0x17c78a) => {
  
  const {
    ms: _0x42d661,
    arg: _0x32ab8b,
    repondre: _0x1e9691,
    prefixe: _0x140f2f
  } = _0x17c78a;
  
  try {
    const id = _0x32ab8b[0]?.match(/\d+/)?.join('');
    const text = _0x32ab8b.slice(1).join(" ");
    
    const repoUrl = "https://github.com/Qartde/RAHMANI-XMD";
    const groupUrl = "https://chat.whatsapp.com/DTnrZzULVtP5r0E9rhoFOj";
    const channelUrl = "https://whatsapp.com/channel/0029VatokI45EjxufALmY32X";
    const thumbnail = "https://files.catbox.moe/aktbgo.jpg";
    
    // Check if no arguments provided
    if (id === undefined || text === undefined) {
      const styleList = fancy.list('RAHMANI-XMD', fancy);
      
      const fancyMessage = `
╭━━━━━━━━━━━━━━━━━━━━╮
┃   💫 *FANCY TEXT* 💫
╰━━━━━━━━━━━━━━━━━━━━╯

┌─── *STYLES* ───┐
${styleList.split('\n').map(line => '│ ' + line).join('\n')}
└────────────────┘

┌─── *USAGE* ───┐
│ 📝 *Example:* ${_0x140f2f}fancy 10 RAHMANI-XMD
│ 🔢 *Styles:* 1-${Object.keys(fancy).length - 2}
└────────────────┘

┌─── *LINKS* ───┐
│ 📎 *GitHub:* ${repoUrl}
│ 👥 *Group:* ${groupUrl}
│ 📢 *Channel:* ${channelUrl}
└────────────────┘

> *RAHMANI-XMD* 💫
      `;

      await _0x6e67fd.sendMessage(_0x4d1cb2, {
        'text': fancyMessage,
        'contextInfo': {
          'forwardingScore': 999,
          'isForwarded': true,
          'forwardedNewsletterMessageInfo': {
            'newsletterJid': "120363353854480831@newsletter",
            'newsletterName': "RAHMANI-XMD",
            'serverMessageId': 143
          },
          'externalAdReply': {
            'title': "💫 FANCY TEXT",
            'body': "Transform your text with styles",
            'thumbnailUrl': thumbnail,
            'sourceUrl': channelUrl, // CTA inapeleka kwenye channel
            'mediaType': 1,
            'renderLargerThumbnail': true,
            'showAdAttribution': true
          }
        }
      }, {
        'quoted': _0x42d661
      });
      
      return;
    }

    // Get selected style
    const selectedStyle = fancy[parseInt(id) - 1];
    
    if (!selectedStyle) {
      return await _0x6e67fd.sendMessage(_0x4d1cb2, {
        'text': `╭━━━━━━━━━━━━━━╮
┃   ❌ *ERROR* ❌
╰━━━━━━━━━━━━━━╯

┌─── *STYLE NOT FOUND* ───┐
│ Style number ${id} doesn't exist
│ Use styles 1-${Object.keys(fancy).length - 2}
└────────────────────────┘

> *RAHMANI-XMD* 💫`,
        'contextInfo': {
          'forwardingScore': 999,
          'isForwarded': true,
          'forwardedNewsletterMessageInfo': {
            'newsletterJid': "120363353854480831@newsletter",
            'newsletterName': "RAHMANI-XMD",
            'serverMessageId': 143
          },
          'externalAdReply': {
            'title': "💫 FANCY TEXT",
            'body': "Error: Style not found",
            'thumbnailUrl': thumbnail,
            'sourceUrl': channelUrl, // CTA inapeleka kwenye channel
            'mediaType': 1,
            'renderLargerThumbnail': true,
            'showAdAttribution': true
          }
        }
      }, {
        'quoted': _0x42d661
      });
    }

    // Apply fancy style
    const fancyText = fancy.apply(selectedStyle, text);
    
    // Send result with fancy text
    await _0x6e67fd.sendMessage(_0x4d1cb2, {
      'text': `╭━━━━━━━━━━━━━━╮
┃   💫 *RESULT* 💫
╰━━━━━━━━━━━━━━╯

┌─── *FANCY TEXT* ───┐
│ ${fancyText}
└────────────────────┘

┌─── *INFO* ───┐
│ 🎨 *Style:* ${id}
│ 📝 *Original:* ${text.substring(0, 30)}
└────────────────┘

┌─── *LINKS* ───┐
│ 📎 *GitHub:* ${repoUrl}
│ 👥 *Group:* ${groupUrl}
│ 📢 *Channel:* ${channelUrl}
└────────────────┘

> *RAHMANI-XMD* 💫`,
      'contextInfo': {
        'forwardingScore': 999,
        'isForwarded': true,
        'forwardedNewsletterMessageInfo': {
          'newsletterJid': "120363353854480831@newsletter",
          'newsletterName': "RAHMANI-XMD",
          'serverMessageId': 143
        },
        'externalAdReply': {
          'title': "💫 FANCY TEXT",
          'body': `Style ${id} applied successfully`,
          'thumbnailUrl': thumbnail,
          'sourceUrl': channelUrl, // CTA inapeleka kwenye channel
          'mediaType': 1,
          'renderLargerThumbnail': true,
          'showAdAttribution': true
        }
      }
    }, {
      'quoted': _0x42d661
    });
    
  } catch (_0x141e7b) {
    console.log("❌ fancy Command Error: " + _0x141e7b);
    
    // Fallback simple message
    await _0x6e67fd.sendMessage(_0x4d1cb2, {
      'text': "❌ Error: " + _0x141e7b.message
    }, {
      'quoted': _0x42d661
    });
  }
});
