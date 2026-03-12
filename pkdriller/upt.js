const {
  zokou
} = require("../framework/zokou");
const runtime = function (_0x28ca1c) {
  _0x28ca1c = Number(_0x28ca1c);
  var _0x268c3d = Math.floor(_0x28ca1c / 86400);
  var _0x345b56 = Math.floor(_0x28ca1c % 86400 / 3600);
  var _0x239dce = Math.floor(_0x28ca1c % 3600 / 60);
  var _0x206c14 = Math.floor(_0x28ca1c % 60);
  var _0x19d16e = _0x268c3d > 0 ? _0x268c3d + (_0x268c3d == 1 ? " day, " : " d, ") : '';
  var _0x49ce9c = _0x345b56 > 0 ? _0x345b56 + (_0x345b56 == 1 ? " hour, " : " h, ") : '';
  var _0x249a90 = _0x239dce > 0 ? _0x239dce + (_0x239dce == 1 ? " minute, " : " m, ") : '';
  var _0x12266c = _0x206c14 > 0 ? _0x206c14 + (_0x206c14 == 1 ? " second" : " s") : '';
  return _0x19d16e + _0x49ce9c + _0x249a90 + _0x12266c;
};
zokou({
  'nomCom': "uptime",
  'desc': "To check runtime",
  'Categorie': "General",
  'reaction': '🔱',
  'fromMe': "true"
}, async (_0x4d1cb2, _0x6e67fd, _0x17c78a) => {
  const {
    ms: _0x42d661,
    arg: _0x32ab8b,
    repondre: _0x1e9691
  } = _0x17c78a;
  try {
    await _0x6e67fd.sendMessage(_0x4d1cb2, {
      'audio': {
        'url': "https://files.catbox.moe/2wonzj.mp3"
      },
      'mimetype': "audio/mp4",
      'ptt': true,
      'contextInfo': {
        'isForwarded': true,
        'forwardedNewsletterMessageInfo': {
          'newsletterJid': "120363353854480831@newsletter",
          'newsletterName': "RAHMANI-XMD",
          'serverMessageId': 0x8f
        },
        'forwardingScore': 0x3e7,
        'externalAdReply': {
          'title': "Bot Runtime",
          'body': " Uptime: " + runtime(process.uptime()),
          'thumbnailUrl': "https://files.catbox.moe/aktbgo.jpg",
          'sourceUrl': "",
          'mediaType': 0x1,
          'renderLargerThumbnail': true
        }
      }
    }, {
      'quoted': _0x42d661
    });
  } catch (_0x141e7b) {
    console.log("❌ uptime Command Error: " + _0x141e7b);
    _0x1e9691("❌ Error: " + _0x141e7b);
  }
});
