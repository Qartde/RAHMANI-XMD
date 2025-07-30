const {
  zokou
} = require("../framework/zokou");
zokou({
  'nomCom': 'vv2',
  'categorie': "Général",
  'reaction': '🤲🏿'
}, async (_0x4ac9d6, _0x549432, _0x14b0f8) => {
  const {
    ms: _0x48ad36,
    msgRepondu: _0x28e70f,
    repondre: _0x198321
  } = _0x14b0f8;
  if (!_0x28e70f) {
    return _0x198321("*Please mention a message sent in single view*.");
  }
  console.log(_0x28e70f);
  if (_0x28e70f.viewOnceMessageV2 || _0x28e70f.viewOnceMessageV2Extension) {
    let _0x23b0a6 = _0x28e70f.viewOnceMessageV2Extension ?? _0x28e70f.viewOnceMessageV2;
    if (_0x23b0a6.message.imageMessage) {
      var _0x1b35e8 = await _0x549432.downloadAndSaveMediaMessage(_0x28e70f.viewOnceMessageV2.message.imageMessage);
      var _0x2c26a0 = _0x28e70f.viewOnceMessageV2.message.imageMessage.caption;
      await _0x549432.sendMessage(_0x4ac9d6, {
        'image': {
          'url': _0x1b35e8
        },
        'caption': _0x2c26a0
      }, {
        'quoted': _0x48ad36
      });
    } else {
      if (_0x23b0a6.message.videoMessage) {
        var _0x2224d6 = await _0x549432.downloadAndSaveMediaMessage(_0x28e70f.viewOnceMessageV2.message.videoMessage);
        var _0x2c26a0 = _0x28e70f.viewOnceMessageV2.message.videoMessage.caption;
        await _0x549432.sendMessage(_0x4ac9d6, {
          'video': {
            'url': _0x2224d6
          },
          'caption': _0x2c26a0
        }, {
          'quoted': _0x48ad36
        });
      } else {
        if (_0x23b0a6.message.audioMessage) {
          var _0x2684dd = await _0x549432.downloadAndSaveMediaMessage(_0x23b0a6.message.audioMessage);
          await _0x549432.sendMessage(_0x4ac9d6, {
            'audio': {
              'url': _0x2684dd
            },
            'mymetype': 'audio/mp4'
          }, {
            'quoted': _0x48ad36,
            'ptt': false
          });
        }
      }
    }
  } else {
    return _0x198321("The message you mentioned is not a single view message.");
  }
});