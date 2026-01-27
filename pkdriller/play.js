const {
  zokou
} = require("../framework/zokou");
const axios = require("axios");
const ytSearch = require("yt-search");
const conf = require(__dirname + "/../set");
const getContextInfo = (_0x258510 = '', _0x297ad1 = '', _0x4f4404 = '') => ({
  'mentionedJid': [_0x297ad1],
  'forwardingScore': 0x3e7,
  'isForwarded': true,
  'forwardedNewsletterMessageInfo': {
    'newsletterJid': "120363353854480831@newsletter",
    'newsletterName': "ʀᴀʜᴍᴀɴɪ xᴍᴅ",
    'serverMessageId': Math.floor(100000 + Math.random() * 900000)
  },
  'externalAdReply': {
    'showAdAttribution': true,
    'title': conf.BOT || "YouTube Downloader",
    'body': _0x258510 || "Media Downloader",
    'thumbnailUrl': _0x4f4404 || conf.URL || '',
    'sourceUrl': conf.GURL || '',
    'mediaType': 0x1,
    'renderLargerThumbnail': false
  }
});
async function searchYouTube(_0x47c5af) {
  try {
    const _0x1822f9 = await ytSearch(_0x47c5af);
    if (!_0x1822f9?.["videos"]?.["length"]) {
      throw new Error("No video found for the specified query.");
    }
    return _0x1822f9.videos[0];
  } catch (_0x430ee7) {
    console.error("YouTube search error:", _0x430ee7);
    throw new Error("YouTube search failed: " + _0x430ee7.message);
  }
}
async function downloadFromApis(_0x29f64a) {
  for (const _0x4aaca1 of _0x29f64a) {
    try {
      const _0x2a933e = await axios.get(_0x4aaca1, {
        'timeout': 0x3a98
      });
      if (_0x2a933e.data?.["success"]) {
        return _0x2a933e.data;
      }
    } catch (_0x3a62e0) {
      console.warn("API " + _0x4aaca1 + " failed:", _0x3a62e0.message);
      continue;
    }
  }
  throw new Error("Failed to retrieve download URL from all sources.");
}
zokou({
  'nomCom': "play",
  'aliases': ["song", "playdoc", "audio", "mp3"],
  'categorie': "download",
  'reaction': '🎸'
}, async (_0x46123e, _0x14ad1a, _0x2ee1ed) => {
  const {
    arg: _0x34cbb1,
    ms: _0x5a9eaa,
    userJid: _0x16c0df
  } = _0x2ee1ed;
  try {
    if (!_0x34cbb1[0]) {
      return repondre(_0x14ad1a, _0x46123e, _0x5a9eaa, "Please provide a song name.");
    }
    const _0x26b391 = _0x34cbb1.join(" ");
    const _0x1c20b7 = await searchYouTube(_0x26b391);
    await _0x14ad1a.sendMessage(_0x46123e, {
      'text': "🎵 *ʀᴀʜᴍᴀɴɪ xᴍᴅ ᴅᴏᴡɴʟᴏᴀᴅɪɴɢ ᴀᴜᴅɪᴏ*...",
      'contextInfo': getContextInfo("Downloading", _0x16c0df, _0x1c20b7.thumbnail)
    }, {
      'quoted': _0x5a9eaa
    });
    const _0xc4f0b5 = ["https://api.davidcyriltech.my.id/download/ytmp3?url=" + encodeURIComponent(_0x1c20b7.url), "https://www.dark-yasiya-api.site/download/ytmp3?url=" + encodeURIComponent(_0x1c20b7.url), "https://api.giftedtech.web.id/api/download/dlmp3?url=" + encodeURIComponent(_0x1c20b7.url) + "&apikey=gifted-md", "https://api.dreaded.site/api/ytdl/audio?url=" + encodeURIComponent(_0x1c20b7.url)];
    const _0x4446ff = await downloadFromApis(_0xc4f0b5);
    const {
      download_url: _0x543549,
      title: _0x46aaeb
    } = _0x4446ff.result;
    const _0x20534e = [{
      'audio': {
        'url': _0x543549
      },
      'mimetype': "audio/mp4",
      'caption': "🎵 *" + _0x46aaeb + '*',
      'contextInfo': getContextInfo(_0x46aaeb, _0x16c0df, _0x1c20b7.thumbnail)
    }, {
      'document': {
        'url': _0x543549
      },
      'mimetype': "audio/mpeg",
      'fileName': (_0x46aaeb + ".mp3").replace(/[^\w\s.-]/gi, ''),
      'caption': "📁 *" + _0x46aaeb + "* (Document)",
      'contextInfo': getContextInfo(_0x46aaeb, _0x16c0df, _0x1c20b7.thumbnail)
    }];
    for (const _0x4c7a63 of _0x20534e) {
      await _0x14ad1a.sendMessage(_0x46123e, _0x4c7a63, {
        'quoted': _0x5a9eaa
      });
    }
  } catch (_0x357695) {
    console.error("Audio download error:", _0x357695);
    repondre(_0x14ad1a, _0x46123e, _0x5a9eaa, "Download failed: " + _0x357695.message);
  }
});
zokou({
  'nomCom': "video",
  'aliases': ["videodoc", "film", "mp4"],
  'categorie': "download",
  'reaction': '🎬'
}, async (_0x377d94, _0x465ef0, _0x148c35) => {
  const {
    arg: _0x23f31d,
    ms: _0x3748bd,
    userJid: _0x46b664
  } = _0x148c35;
  try {
    if (!_0x23f31d[0]) {
      return repondre(_0x465ef0, _0x377d94, _0x3748bd, "Please provide a video name.");
    }
    const _0xd64eb4 = _0x23f31d.join(" ");
    const _0x4ca720 = await searchYouTube(_0xd64eb4);
    await _0x465ef0.sendMessage(_0x377d94, {
      'text': "🎵 *ʀᴀʜᴍᴀɴɪ xᴍᴅ ᴅᴏᴡɴʟᴏᴀᴅɪɴɢ ᴀᴜᴅɪᴏ*...",
      'contextInfo': getContextInfo("Downloading", _0x46b664, _0x4ca720.thumbnail)
    }, {
      'quoted': _0x3748bd
    });
    const _0x304ee0 = ["https://api.davidcyriltech.my.id/download/ytmp4?url=" + encodeURIComponent(_0x4ca720.url), "https://www.dark-yasiya-api.site/download/ytmp4?url=" + encodeURIComponent(_0x4ca720.url), "https://api.giftedtech.web.id/api/download/dlmp4?url=" + encodeURIComponent(_0x4ca720.url) + "&apikey=gifted-md", "https://api.dreaded.site/api/ytdl/video?url=" + encodeURIComponent(_0x4ca720.url)];
    const _0x380408 = await downloadFromApis(_0x304ee0);
    const {
      download_url: _0x50b9ff,
      title: _0x5e9cb6
    } = _0x380408.result;
    const _0x2a716f = [{
      'video': {
        'url': _0x50b9ff
      },
      'mimetype': "video/mp4",
      'caption': "🎥 *" + _0x5e9cb6 + '*',
      'contextInfo': getContextInfo(_0x5e9cb6, _0x46b664, _0x4ca720.thumbnail)
    }, {
      'document': {
        'url': _0x50b9ff
      },
      'mimetype': "video/mp4",
      'fileName': (_0x5e9cb6 + ".mp4").replace(/[^\w\s.-]/gi, ''),
      'caption': "📁 *" + _0x5e9cb6 + "* (Document)",
      'contextInfo': getContextInfo(_0x5e9cb6, _0x46b664, _0x4ca720.thumbnail)
    }];
    for (const _0x350613 of _0x2a716f) {
      await _0x465ef0.sendMessage(_0x377d94, _0x350613, {
        'quoted': _0x3748bd
      });
    }
  } catch (_0x53705e) {
    console.error("Video download error:", _0x53705e);
    repondre(_0x465ef0, _0x377d94, _0x3748bd, "Download failed: " + _0x53705e.message);
  }
});
