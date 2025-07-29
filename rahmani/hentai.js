const {
  zokou
} = require("../framework/zokou");
const gis = require("g-i-s");
const axios = require("axios");
const conf = require(__dirname + "/../set");
zokou({
  'nomCom': "img",
  'aliases': ["image", "images"],
  'categorie': "search",
  'reaction': '☘️'
}, async (_0x2ebed9, _0x1f4ff7, _0x5ebebb) => {
  const {
    repondre: _0x15e1d9,
    ms: _0x1a6165,
    arg: _0x411eb7
  } = _0x5ebebb;
  if (!_0x411eb7[0]) {
    _0x15e1d9("whích ímαgє dσ чσu wαnt mч fríєnd?");
    return;
  }
  const _0x2d6871 = _0x411eb7.join(" ");
  gis(_0x2d6871, (_0x1a5ea4, _0x1cd909) => _0x466828(_0x1a5ea4, _0x1cd909));
  function _0x466828(_0x30287f, _0x54f9fa) {
    if (_0x30287f) {
      _0x15e1d9("Oops, an error occurred.");
      return;
    }
    if (!_0x54f9fa || _0x54f9fa.length === 0) {
      _0x15e1d9("No images found.");
      return;
    }
    for (let _0xf62d6 = 0; _0xf62d6 < Math.min(_0x54f9fa.length, 5); _0xf62d6++) {
      _0x1f4ff7.sendMessage(_0x2ebed9, {
        'image': {
          'url': _0x54f9fa[_0xf62d6].url
        },
        'caption': "Enjoy the view",
        'contextInfo': {
          'externalAdReply': {
            'title': "Rahmani-Md",
            'body': "Here's the image you searched for: " + _0x2d6871,
            'thumbnailUrl': _0x54f9fa[_0xf62d6].url,
            'sourceUrl': conf.GURL,
            'mediaType': 0x1,
            'showAdAttribution': true
          }
        }
      }, {
        'quoted': _0x1a6165
      });
    }
  }
});
zokou({
  'nomCom': "waifues",
  'categorie': "Hentai",
  'reaction': '💗'
}, async (_0x376a4f, _0x5b78d8, _0x1f7067) => {
  const {
    repondre: _0x3aa311,
    ms: _0x502cda
  } = _0x1f7067;
  try {
    for (let _0x30726b = 0; _0x30726b < 5; _0x30726b++) {
      const _0x54ba54 = await axios.get("https://api.waifu.pics/nsfw/waifu");
      const _0x4859df = _0x54ba54.data.url;
      await _0x5b78d8.sendMessage(_0x376a4f, {
        'image': {
          'url': _0x4859df
        },
        'caption': "Enjoy the view",
        'contextInfo': {
          'externalAdReply': {
            'title': "Rahmani-Md",
            'body': "Here's a great image related to: waifu",
            'thumbnailUrl': _0x4859df,
            'sourceUrl': conf.GURL,
            'mediaType': 0x1,
            'showAdAttribution': true
          }
        }
      }, {
        'quoted': _0x502cda
      });
    }
  } catch (_0x21952d) {
    _0x3aa311("Error retrieving data: " + _0x21952d.message);
  }
});
zokou({
  'nomCom': "trap",
  'categorie': "Hentai",
  'reaction': '☘️'
}, async (_0xed2bfa, _0x2a858c, _0x1468de) => {
  const {
    repondre: _0x49e9e9,
    ms: _0x2842bb
  } = _0x1468de;
  try {
    for (let _0x189889 = 0; _0x189889 < 5; _0x189889++) {
      const _0x1b5fa5 = await axios.get("https://api.waifu.pics/nsfw/trap");
      const _0x557942 = _0x1b5fa5.data.url;
      await _0x2a858c.sendMessage(_0xed2bfa, {
        'image': {
          'url': _0x557942
        },
        'caption': "Enjoy the view",
        'contextInfo': {
          'externalAdReply': {
            'title': "Rahmani-Md",
            'body': "Here's a great image related to: waifu",
            'thumbnailUrl': _0x557942,
            'sourceUrl': conf.GURL,
            'mediaType': 0x1,
            'showAdAttribution': true
          }
        }
      }, {
        'quoted': _0x2842bb
      });
    }
  } catch (_0x3cf187) {
    _0x49e9e9("Error retrieving data: " + _0x3cf187.message);
  }
});
zokou({
  'nomCom': "neko",
  'categorie': "Hentai",
  'reaction': '💗'
}, async (_0x506093, _0x3a048e, _0x2c5289) => {
  const {
    repondre: _0x29d4dd,
    ms: _0x2023d3
  } = _0x2c5289;
  try {
    for (let _0x2ad81a = 0; _0x2ad81a < 5; _0x2ad81a++) {
      const _0xff5e8d = await axios.get("https://api.waifu.pics/nsfw/neko");
      const _0x48dd46 = _0xff5e8d.data.url;
      await _0x3a048e.sendMessage(_0x506093, {
        'image': {
          'url': _0x48dd46
        },
        'caption': "Enjoy the view",
        'contextInfo': {
          'externalAdReply': {
            'title': "Rahmani-Md",
            'body': "Here's a great image related to: waifu",
            'thumbnailUrl': _0x48dd46,
            'sourceUrl': conf.GURL,
            'mediaType': 0x1,
            'showAdAttribution': true
          }
        }
      }, {
        'quoted': _0x2023d3
      });
    }
  } catch (_0x2ad7f0) {
    _0x29d4dd("Error retrieving data: " + _0x2ad7f0.message);
  }
});
zokou({
  'nomCom': "girls",
  'categorie': "Hentai",
  'reaction': '💗'
}, async (_0x7b6528, _0x36d13b, _0x513a8c) => {
  const {
    repondre: _0x280d67,
    ms: _0xa4e1dc
  } = _0x513a8c;
  try {
    for (let _0x475b33 = 0; _0x475b33 < 5; _0x475b33++) {
      const _0x2b992b = await axios.get("https://api.waifu.pics/nsfw/blowjob");
      const _0x35d7d7 = _0x2b992b.data.url;
      await _0x36d13b.sendMessage(_0x7b6528, {
        'image': {
          'url': _0x35d7d7
        },
        'caption': "Enjoy the view",
        'contextInfo': {
          'externalAdReply': {
            'title': "Rahmani-Md",
            'body': "Here's a great image related to: waifu",
            'thumbnailUrl': _0x35d7d7,
            'sourceUrl': conf.GURL,
            'mediaType': 0x1,
            'showAdAttribution': true
          }
        }
      }, {
        'quoted': _0xa4e1dc
      });
    }
  } catch (_0x2db5c3) {
    _0x280d67("Error retrieving data: " + _0x2db5c3.message);
  }
});
