'use strict';

var __createBinding = this && this.__createBinding || (Object.create ? function (_0x50c0f, _0x2c795a, _0x3e0982, _0x468796) {
  if (_0x468796 === undefined) {
    _0x468796 = _0x3e0982;
  }
  var _0x9ab34c = Object.getOwnPropertyDescriptor(_0x2c795a, _0x3e0982);
  if (!_0x9ab34c || ("get" in _0x9ab34c ? !_0x2c795a.__esModule : _0x9ab34c.writable || _0x9ab34c.configurable)) {
    _0x9ab34c = {
      'enumerable': true,
      'get': function () {
        return _0x2c795a[_0x3e0982];
      }
    };
  }
  Object.defineProperty(_0x50c0f, _0x468796, _0x9ab34c);
} : function (_0x5677b0, _0x1fc39c, _0x366b8b, _0x3839f7) {
  if (_0x3839f7 === undefined) {
    _0x3839f7 = _0x366b8b;
  }
  _0x5677b0[_0x3839f7] = _0x1fc39c[_0x366b8b];
});
var __setModuleDefault = this && this.__setModuleDefault || (Object.create ? function (_0x4e536a, _0xa5b63b) {
  Object.defineProperty(_0x4e536a, 'default', {
    'enumerable': true,
    'value': _0xa5b63b
  });
} : function (_0x52bdd7, _0x36e46c) {
  _0x52bdd7["default"] = _0x36e46c;
});
var __importStar = this && this.__importStar || function (_0x23eb7d) {
  if (_0x23eb7d && _0x23eb7d.__esModule) {
    return _0x23eb7d;
  }
  var _0x2fad32 = {};
  if (_0x23eb7d != null) {
    for (var _0x1e483a in _0x23eb7d) if (_0x1e483a !== 'default' && Object.prototype.hasOwnProperty.call(_0x23eb7d, _0x1e483a)) {
      __createBinding(_0x2fad32, _0x23eb7d, _0x1e483a);
    }
  }
  __setModuleDefault(_0x2fad32, _0x23eb7d);
  return _0x2fad32;
};
var __importDefault = this && this.__importDefault || function (_0x1cc369) {
  return _0x1cc369 && _0x1cc369.__esModule ? _0x1cc369 : {
    'default': _0x1cc369
  };
};
Object.defineProperty(exports, "__esModule", {
  'value': true
});
const baileys_1 = __importStar(require("@whiskeysockets/baileys"));
const logger_1 = __importDefault(require("@whiskeysockets/baileys/lib/Utils/logger"));
const logger = logger_1['default'].child({});
logger.level = "silent";
const pino = require("pino");
const boom_1 = require('@hapi/boom');
const conf = require("./set");
let fs = require("fs-extra");
let path = require("path");
const FileType = require("file-type");
const {
  Sticker,
  createSticker,
  StickerTypes
} = require("wa-sticker-formatter");
const {
  verifierEtatJid,
  recupererActionJid
} = require('./bdd/antilien');
const {
  atbverifierEtatJid,
  atbrecupererActionJid
} = require("./bdd/antibot");
let evt = require(__dirname + "/framework/zokou");
const {
  isUserBanned,
  addUserToBanList,
  removeUserFromBanList
} = require("./bdd/banUser");
const {
  addGroupToBanList,
  isGroupBanned,
  removeGroupFromBanList
} = require("./bdd/banGroup");
const {
  isGroupOnlyAdmin,
  addGroupToOnlyAdminList,
  removeGroupFromOnlyAdminList
} = require("./bdd/onlyAdmin");
let {
  reagir
} = require(__dirname + "/framework/app");
var session = conf.session.replace(/Zokou-MD-WHATSAPP-BOT;;;=>/g, '');
const prefixe = conf.PREFIXE;
const express = require('express');
const app = express();
const PORT = process.env.PORT || 0xbb8;
app.use(express['static'](path.join(__dirname, 'public')));
app.listen(PORT, () => {
  console.log("Server is running at http://localhost:" + PORT);
});
async function authentification() {
  try {
    if (!fs.existsSync(__dirname + "/scan/creds.json")) {
      console.log("connexion en cour ...");
      await fs.writeFileSync(__dirname + "/scan/creds.json", atob(session), "utf8");
    } else if (fs.existsSync(__dirname + "/scan/creds.json") && session != "zokk") {
      await fs.writeFileSync(__dirname + "/scan/creds.json", atob(session), "utf8");
    }
  } catch (_0xa2a8b) {
    console.log("Session Invalid " + _0xa2a8b);
    return;
  }
}
authentification();
0x0;
const store = baileys_1.makeInMemoryStore({
  'logger': pino().child({
    'level': "silent",
    'stream': "store"
  })
});
setTimeout(() => {
  async function _0x1b1480() {
    0x0;
    const {
      version: _0x3729c6,
      isLatest: _0x2bc48f
    } = await baileys_1.fetchLatestBaileysVersion();
    0x0;
    const {
      state: _0xfe616d,
      saveCreds: _0x43ea6e
    } = await baileys_1.useMultiFileAuthState(__dirname + "/scan");
    0x0;
    const _0x34e3ed = {
      'version': _0x3729c6,
      'logger': pino({
        'level': "silent"
      }),
      'browser': ["Bmw-Md", "safari", '1.0.0'],
      'printQRInTerminal': true,
      'fireInitQueries': false,
      'shouldSyncHistoryMessage': true,
      'downloadHistory': true,
      'syncFullHistory': true,
      'generateHighQualityLinkPreview': true,
      'markOnlineOnConnect': false,
      'keepAliveIntervalMs': 0x7530,
      'auth': {
        'creds': _0xfe616d.creds,
        'keys': baileys_1.makeCacheableSignalKeyStore(_0xfe616d.keys, logger)
      },
      'getMessage': async _0x415751 => {
        if (store) {
          const _0x47b422 = await store.loadMessage(_0x415751.remoteJid, _0x415751.id, undefined);
          return _0x47b422.message || undefined;
        }
        return {
          'conversation': "An Error Occurred, Repeat Command!"
        };
      }
    };
    0x0;
    const _0x243e88 = baileys_1["default"](_0x34e3ed);
    store.bind(_0x243e88.ev);
    const _0x32404a = new Map();
    function _0x507042(_0x3dc481) {
      const _0x155b79 = Date.now();
      if (!_0x32404a.has(_0x3dc481)) {
        _0x32404a.set(_0x3dc481, _0x155b79);
        return false;
      }
      const _0x42a7dd = _0x32404a.get(_0x3dc481);
      if (_0x155b79 - _0x42a7dd < 0xbb8) {
        return true;
      }
      _0x32404a.set(_0x3dc481, _0x155b79);
      return false;
    }
    const _0xe9147a = new Map();
    async function _0x29c430(_0x1d4240, _0xd3aa26) {
      if (_0xe9147a.has(_0xd3aa26)) {
        return _0xe9147a.get(_0xd3aa26);
      }
      try {
        const _0x461194 = await _0x1d4240.groupMetadata(_0xd3aa26);
        _0xe9147a.set(_0xd3aa26, _0x461194);
        setTimeout(() => _0xe9147a['delete'](_0xd3aa26), 0xea60);
        return _0x461194;
      } catch (_0xb096db) {
        if (_0xb096db.message.includes("rate-overlimit")) {
          await new Promise(_0x277665 => setTimeout(_0x277665, 0x1388));
        }
        return null;
      }
    }
    process.on("uncaughtException", _0x2a166b => {});
    process.on("unhandledRejection", _0x475030 => {});
    _0x243e88.ev.on("messages.upsert", async _0x2223dd => {
      const {
        messages: _0x5c7afd
      } = _0x2223dd;
      if (!_0x5c7afd || _0x5c7afd.length === 0x0) {
        return;
      }
      for (const _0x4dcb45 of _0x5c7afd) {
        if (!_0x4dcb45.message) {
          continue;
        }
        const _0x5c4539 = _0x4dcb45.key.remoteJid;
        if (_0x507042(_0x5c4539)) {
          continue;
        }
      }
    });
    _0x243e88.ev.on("groups.update", async _0x4faac6 => {
      for (const _0xb576f0 of _0x4faac6) {
        const {
          id: _0x22b220
        } = _0xb576f0;
        if (!_0x22b220.endsWith("@g.us")) {
          continue;
        }
        await _0x29c430(_0x243e88, _0x22b220);
      }
    });
    _0x243e88.ev.on("messages.upsert", async _0x43b2d7 => {
      if (conf.ANTIDELETE1 === "yes") {
        const {
          messages: _0x17eec3
        } = _0x43b2d7;
        const _0x20b50c = _0x17eec3[0x0];
        if (!_0x20b50c.message) {
          return;
        }
        const _0x48820c = _0x20b50c.key;
        const _0x213692 = _0x48820c.remoteJid;
        if (!store.chats[_0x213692]) {
          store.chats[_0x213692] = [];
        }
        store.chats[_0x213692].push(_0x20b50c);
        if (_0x20b50c.message.protocolMessage && _0x20b50c.message.protocolMessage.type === 0x0) {
          const _0x4c6c05 = _0x20b50c.message.protocolMessage.key;
          const _0x1d7b3e = store.chats[_0x213692];
          const _0x475212 = _0x1d7b3e.find(_0x341e45 => _0x341e45.key.id === _0x4c6c05.id);
          if (_0x475212) {
            try {
              const _0x388b74 = _0x475212.key.participant || _0x475212.key.remoteJid;
              const _0x574f91 = "*♦🚫 Antidelete message alert🥴🪡 Rahmani doesn't allow deleting of messages This message was deleted by @" + _0x388b74.split('@')[0x0] + '*';
              const _0x22e8bf = conf.NUMERO_OWNER + "@s.whatsapp.net";
              if (_0x475212.message.conversation) {
                await _0x243e88.sendMessage(_0x22e8bf, {
                  'text': _0x574f91 + "\nDeleted message: " + _0x475212.message.conversation,
                  'mentions': [_0x388b74]
                });
              } else {
                if (_0x475212.message.imageMessage) {
                  const _0x60860 = _0x475212.message.imageMessage.caption || '';
                  const _0x8248a0 = await _0x243e88.downloadAndSaveMediaMessage(_0x475212.message.imageMessage);
                  await _0x243e88.sendMessage(_0x22e8bf, {
                    'image': {
                      'url': _0x8248a0
                    },
                    'caption': _0x574f91 + "\n" + _0x60860,
                    'mentions': [_0x388b74]
                  });
                } else {
                  if (_0x475212.message.videoMessage) {
                    const _0x381d95 = _0x475212.message.videoMessage.caption || '';
                    const _0x10b612 = await _0x243e88.downloadAndSaveMediaMessage(_0x475212.message.videoMessage);
                    await _0x243e88.sendMessage(_0x22e8bf, {
                      'video': {
                        'url': _0x10b612
                      },
                      'caption': _0x574f91 + "\n" + _0x381d95,
                      'mentions': [_0x388b74]
                    });
                  } else {
                    if (_0x475212.message.audioMessage) {
                      const _0x25a748 = await _0x243e88.downloadAndSaveMediaMessage(_0x475212.message.audioMessage);
                      await _0x243e88.sendMessage(_0x22e8bf, {
                        'audio': {
                          'url': _0x25a748
                        },
                        'ptt': true,
                        'caption': _0x574f91,
                        'mentions': [_0x388b74]
                      });
                    } else {
                      if (_0x475212.message.stickerMessage) {
                        const _0x2ed7e2 = await _0x243e88.downloadAndSaveMediaMessage(_0x475212.message.stickerMessage);
                        await _0x243e88.sendMessage(_0x22e8bf, {
                          'sticker': {
                            'url': _0x2ed7e2
                          },
                          'caption': _0x574f91,
                          'mentions': [_0x388b74]
                        });
                      }
                    }
                  }
                }
              }
            } catch (_0x4be404) {
              console.error("Error handling deleted message:", _0x4be404);
            }
          }
        }
      }
    });
    const _0xe3bf32 = _0x3c0a4d => new Promise(_0x6b4f98 => setTimeout(_0x6b4f98, _0x3c0a4d));
    let _0x242b59 = 0x0;
    if (conf.AUTO_REACT_STATUS === "yes") {
      console.log("AUTO_REACT_STATUS is enabled. Listening for status updates...");
      _0x243e88.ev.on("messages.upsert", async _0x34d193 => {
        const {
          messages: _0x494066
        } = _0x34d193;
        for (const _0x5b0b1e of _0x494066) {
          if (_0x5b0b1e.key && _0x5b0b1e.key.remoteJid === "status@broadcast") {
            console.log("Detected status update from:", _0x5b0b1e.key.remoteJid);
            const _0x2826c5 = Date.now();
            if (_0x2826c5 - _0x242b59 < 0x1388) {
              console.log("Throttling reactions to prevent overflow.");
              continue;
            }
            const _0x511531 = _0x243e88.user && _0x243e88.user.id ? _0x243e88.user.id.split(':')[0x0] + '@s.whatsapp.net' : null;
            if (!_0x511531) {
              console.log("Bot's user ID not available. Skipping reaction.");
              continue;
            }
            await _0x243e88.sendMessage(_0x5b0b1e.key.remoteJid, {
              'react': {
                'key': _0x5b0b1e.key,
                'text': '✅'
              }
            }, {
              'statusJidList': [_0x5b0b1e.key.participant, _0x511531]
            });
            _0x242b59 = Date.now();
            console.log("Successfully reacted to status update by " + _0x5b0b1e.key.remoteJid);
            await _0xe3bf32(0x7d0);
          }
        }
      });
    }
    const _0x8a5dbb = {
      'hello': ['👋', '🙂', '😊', "🙋‍♂️", "🙋‍♀️"],
      'hi': ['👋', '🙂', '😁', "🙋‍♂️", "🙋‍♀️"],
      "good morning": ['🌅', '🌞', '☀️', '🌻', '🌼'],
      "good night": ['🌙', '🌜', '⭐', '🌛', '💫'],
      'bye': ['👋', '😢', "👋🏻", '🥲', "🚶‍♂️", "🚶‍♀️"],
      "see you": ['👋', '😊', "👋🏻", '✌️', "🚶‍♂️"],
      'bro': ['🤜🤛', '👊', '💥', '🥊', '👑'],
      'sister': ['👭', "💁‍♀️", '🌸', '💖', "🙋‍♀️"],
      'buddy': ['🤗', "👯‍♂️", '👯‍♀️', "🤜🤛", '🤝'],
      'niaje': ['👋', '😄', '💥', '🔥', '🕺', '💃'],
      'ibrahim': ['😎', '💯', '🔥', '🚀', '👑'],
      'adams': ['🔥', '💥', '👑', '💯', '😎'],
      'thanks': ['🙏', '😊', '💖', '❤️', '💐'],
      "thank you": ['🙏', '😊', '🙌', '💖', '💝'],
      'love': ['❤️', '💖', '💘', '😍', '😘', '💍', '💑'],
      "miss you": ['😢', '💔', '😔', '😭', '💖'],
      'sorry': ['😔', '🙏', '😓', '💔', '🥺'],
      'apologies': ['😔', '💔', '🙏', '😞', "🙇‍♂️", "🙇‍♀️"],
      'congratulations': ['🎉', '🎊', '🏆', '🎁', '👏'],
      "well done": ['👏', '💪', '🎉', '🎖️', '👍'],
      "good job": ['👏', '💯', '👍', '🌟', '🎉'],
      'happy': ['😁', '😊', '🎉', '🎊', '💃', '🕺'],
      'sad': ['😢', '😭', '😞', '💔', '😓'],
      'angry': ['😡', '🤬', '😤', '💢', '😾'],
      'excited': ['🤩', '🎉', '😆', '🤗', '🥳'],
      'surprised': ['😲', '😳', '😯', '😮', '😲'],
      'help': ['🆘', '❓', '🙏', '💡', "👨‍💻", "👩‍💻"],
      'how': ['❓', '🤔', '😕', '😳', '🧐'],
      'what': ['❓', "🤷‍♂️", '🤷‍♀️', '😕', '😲'],
      'where': ['❓', '🌍', "🗺️", "🏙️", '🌎'],
      'party': ['🎉', '🥳', '🍾', '🍻', '🎤', '💃', '🕺'],
      'fun': ['🤣', '😂', '🥳', '🎉', '🎮', '🎲'],
      'hangout': ['🍕', '🍔', '🍻', '🎮', '🍿', '😆'],
      'good': ['👍', '👌', '😊', '💯', '🌟'],
      'awesome': ['🔥', '🚀', '🤩', '👏', '💥'],
      'cool': ['😎', '👌', '🎮', '🎸', '💥'],
      'boring': ['😴', '🥱', '🙄', '😑', '🤐'],
      'tired': ['😴', '🥱', '😌', '💤', '🛌'],
      'bot': ['🤖', '💻', '⚙️', '🧠', '🔧'],
      'robot': ['🤖', '⚙️', '💻', '🔋', '🤓'],
      "cool bot": ['🤖', '😎', '🤘', '💥', '🎮'],
      "love you": ['❤️', '💖', '😘', '💋', '💑'],
      "thank you bot": ['🙏', '🤖', '😊', '💖', '💐'],
      "good night bot": ['🌙', '🌛', '⭐', '💤', '😴'],
      'laughter': ['😂', '🤣', '😆', '😄', '🤪'],
      'crying': ['😢', '😭', '😿', '😓', '💔'],
      'john': ['👑', '🔥', '💥', '😎', '💯'],
      'mike': ['💪', '🏆', '🔥', '💥', '🚀'],
      'lisa': ['💖', '👑', '🌸', '😍', '🌺'],
      'emily': ['💖', '💃', '👑', '🎉', '🎀'],
      'happy': ['😁', '😄', '😊', '🙌', '🎉', '🥳', '💃', '🕺', '🔥'],
      'excited': ['🤩', '🎉', '🥳', '🎊', '😆', '🤗', '💥', '🚀'],
      'love': ['❤️', '💖', '💘', '💝', '😍', '😘', '💍', '💑', '🌹'],
      'grateful': ['🙏', '💐', '🥰', '❤️', '😊'],
      'thankful': ['🙏', '💖', '💐', '🤗', '😇'],
      'sad': ['😢', '😭', '😞', '💔', '😔', '😓', '😖'],
      'angry': ['😡', '😠', '🤬', '💢', '👊', '💥', '⚡'],
      'frustrated': ['😤', '😩', '🤯', '😑', '🌀'],
      'bored': ['😴', '🥱', '🙄', '😑', '😒'],
      'surprised': ['😲', '😳', '😮', '😯', '😲', '🙀'],
      'shocked': ['😱', '😳', '😯', '💥', '🤯'],
      'wow': ['😲', '😱', '🤩', '🤯', '💥', '🚀'],
      'crying': ['😭', '😢', '💔', '😞', '😓'],
      "miss you": ['😭', '💔', '😔', '😢', '❤️'],
      'lonely': ['😔', '😭', '😢', '💔', '🙁'],
      'help': ['🆘', '❓', '🤔', "🙋‍♂️", "🙋‍♀️", '💡'],
      "need assistance": ['🆘', "💁‍♂️", '💁‍♀️', '❓', '🙏'],
      'sorry': ['😔', '🙏', '💔', '😓', '🥺', "🙇‍♂️", "🙇‍♀️"],
      'apology': ['😔', '😞', '🙏', '💔', '🙇‍♂️', "🙇‍♀️"],
      "good job": ['👏', '💯', '🎉', '🌟', '👍', '👏'],
      "well done": ['👏', '🎉', '🎖️', '💪', '🔥', '🏆'],
      "you can do it": ['💪', '🔥', '💯', '🚀', '🌟'],
      'congratulations': ['🎉', '🏆', '🎊', '🎁', '👏', '🍾'],
      'cheers': ['🥂', '🍻', '🍾', '🍷', '🥳', '🎉'],
      'goodbye': ['👋', '😢', '💔', "👋🏻", "🚶‍♂️", "🚶‍♀️"],
      'bye': ['👋', '👋🏻', '🥲', '🚶‍♂️', "🚶‍♀️"],
      "see you": ['👋', "👋🏻", '🤗', '✌️', "🙋‍♂️", "🙋‍♀️"],
      'hello': ['👋', '🙂', '😊', "🙋‍♂️", "🙋‍♀️"],
      'hi': ['👋', '🙂', '😁', '🙋‍♂️', "🙋‍♀️"],
      'party': ['🎉', '🥳', '🎤', '💃', '🕺', '🍻', '🎶'],
      'fun': ['🎮', '🎲', '🤣', '🎉', '🃏'],
      'play': ['🎮', '🏀', '⚽', '🎾', '🎱', '🎲', '🏆'],
      'work': ['💻', "🖥️", '💼', '📅', '📝'],
      'school': ['📚', '🏫', '🎒', "👨‍🏫", '👩‍🏫'],
      'study': ['📖', '📝', '💡', '📚', '🎓'],
      'summer': ['🌞', "🏖️", '🌴', '🍉', '🌻'],
      'winter': ['❄️', '☃️', '🎿', '🔥', '⛄'],
      'autumn': ['🍁', '🍂', '🎃', '🍂', '🍁'],
      'spring': ['🌸', '🌼', '🌷', '🌱', '🌺'],
      'birthday': ['🎂', '🎉', '🎁', '🎈', '🎊'],
      'anniversary': ['💍', '🎉', '🎁', '🎈', '💑'],
      'robot': ['🤖', '⚙️', '🔧', '🤖', '🧠'],
      'bot': ['🤖', '🧠', '⚙️', '💻', "🖥️"],
      'thanks': ['🙏', '💖', '😊', '❤️', '💐'],
      "good luck": ['🍀', '🍀', '💯', '🍀', '🎯'],
      'john': ['👑', '🔥', '💥', '😎', '💯'],
      'mike': ['💪', '🏆', '🔥', '💥', '🚀'],
      'lisa': ['💖', '👑', '🌸', '😍', '🌺'],
      'emily': ['💖', '💃', '👑', '🎉', '🎀'],
      'food': ['🍕', '🍔', '🍟', '🍲', '🍣', '🍩'],
      'drink': ['🍺', '🍷', '🥂', '🍾', '🥤'],
      'coffee': ['☕', '🥤', '🍵', '🥶'],
      'tea': ['🍵', '🫖', '🍂', '🍃'],
      'excited': ['🤩', '🎉', '🥳', '💥', '🚀', '😆', '😜'],
      'nervous': ['😬', '😰', '🤞', '🧠', '👐'],
      'confused': ['🤔', '😕', '🧐', '😵', "🤷‍♂️", '🤷‍♀️'],
      'embarrassed': ['😳', '😳', '🙈', '😳', '😬', '😅'],
      'hopeful': ['🤞', '🌠', '🙏', '🌈', '💫'],
      'shy': ['😊', '😳', '🙈', '🫣', '🫶'],
      'family': ["👨‍👩‍👧‍👦", "👩‍👧", "👩‍👧‍👦", "👨‍👩‍👧", '💏', "👨‍👨‍👧‍👦", "👩‍👩‍👧‍👦"],
      'friends': ["👯‍♂️", "👯‍♀️", '🤗', '🫶', '💫', '🤝'],
      'relationship': ['💑', '❤️', '💍', '🥰', '💏', '💌'],
      'couple': ["👩‍❤️‍👨", '👨‍❤️‍👨', "👩‍❤️‍👩", '💍', '💑', '💏'],
      "best friend": ['🤗', '💖', "👯‍♀️", "👯‍♂️", '🙌'],
      "love you": ['❤️', '😘', '💖', '💘', '💓', '💗'],
      'vacation': ["🏖️", '🌴', '✈️', '🌊', "🛳️", '🏞️', "🏕️"],
      'beach': ["🏖️", '🌊', "🏄‍♀️", '🩴', "🏖️", '🌴', '🦀'],
      "road trip": ['🚗', '🚙', "🛣️", '🌄', '🌟'],
      'mountain': ["🏞️", '⛰️', "🏔️", '🌄', "🏕️", '🌲'],
      'city': ["🏙️", '🌆', '🗽', '🌇', '🚖', "🏙️"],
      'exploration': ['🌍', '🧭', '🌎', '🌍', '🧳', '📍', '⛵'],
      'morning': ['🌅', '☀️', '🌞', '🌄', '🌻', '🕶️'],
      'afternoon': ['🌞', "🌤️", '⛅', '🌻', '🌇'],
      'night': ['🌙', '🌛', '🌜', '⭐', '🌚', '💫'],
      'evening': ['🌙', '🌛', '🌇', '🌓', '💫'],
      'goodnight': ['🌙', '😴', '💤', '🌜', '🛌', '🌛', '✨'],
      'productivity': ['💻', '📊', '📝', '💼', '📅', '📈'],
      'office': ['🖥️', '💼', '🗂️', '📅', "🖋️"],
      'workout': ["🏋️‍♀️", '💪', "🏃‍♂️", '🏃‍♀️', "🤸‍♀️", "🚴‍♀️", "🏋️‍♂️"],
      "study hard": ['📚', '📝', '📖', '💡', '💼'],
      'focus': ['🔍', '🎯', '💻', '🧠', '🤓'],
      'food': ['🍕', '🍔', '🍟', '🍖', '🍖', '🥗', '🍣', '🍲'],
      'drink': ['🍹', '🥤', '🍷', '🍾', '🍸', '🍺', '🥂', '☕'],
      'coffee': ['☕', '🧃', '🍵', '🥤', '🍫'],
      'cake': ['🍰', '🎂', '🍩', '🍪', '🍫', '🧁'],
      "ice cream": ['🍦', '🍧', '🍨', '🍪'],
      'cat': ['🐱', '😺', '🐈', '🐾'],
      'dog': ['🐶', '🐕', '🐩', '🐕‍🦺', '🐾'],
      'bird': ['🐦', '🦉', '🦅', '🐦'],
      'fish': ['🐟', '🐠', '🐡', '🐡', '🐙'],
      'rabbit': ['🐰', '🐇', '🐹', '🐾'],
      'lion': ['🦁', '🐯', '🐅', '🐆'],
      'bear': ['🐻', '🐨', '🐼', "🐻‍❄️"],
      'elephant': ['🐘', '🐘'],
      'sun': ['☀️', '🌞', '🌄', '🌅', '🌞'],
      'rain': ["🌧️", '☔', '🌈', "🌦️", '🌧️'],
      'snow': ['❄️', '⛄', "🌨️", "🌬️", '❄️'],
      'wind': ['💨', "🌬️", "🌪️", "🌬️"],
      'earth': ['🌍', '🌏', '🌎', '🌍', '🌱', '🌳'],
      'phone': ['📱', '☎️', '📞', '📲', '📡'],
      'computer': ['💻', '🖥️', '⌨️', "🖱️", "🖥️"],
      'internet': ['🌐', '💻', '📶', '📡', '🔌'],
      'software': ['💻', "🖥️", "🧑‍💻", "🖱️", '💡'],
      'star': ['⭐', '🌟', '✨', '🌠', '💫'],
      'light': ['💡', '🔦', '✨', '🌟', '🔆'],
      'money': ['💵', '💰', '💸', '💳', '💶'],
      'victory': ['✌️', '🏆', '🎉', "🎖️", '🎊'],
      'gift': ['🎁', '🎀', '🎉', '🎁'],
      'fire': ['🔥', '💥', '🌋', '🔥', '💣'],
      'music': ['🎵', '🎶', '🎧', '🎤', '🎸', '🎹'],
      'sports': ['⚽', '🏀', '🏈', '🎾', "🏋️‍♂️", "🏃‍♀️", '🏆', '🥇'],
      'games': ['🎮', "🕹️", '🎲', '🎯', '🧩'],
      'art': ['🎨', "🖌️", '🖼️', '🎭', "🖍️"],
      'photography': ['📷', '📸', '📸', '🖼️', '🎥'],
      'reading': ['📚', '📖', '📚', '📰'],
      'craft': ['🧵', '🪡', '✂️', '🪢', '🧶'],
      'hello': ['👋', '🙂', '😊'],
      'hey': ['👋', '🙂', '😊'],
      'hi': ['👋', '🙂', '😊'],
      'bye': ['👋', '😢', '👋'],
      'goodbye': ['👋', '😢', '🙋‍♂️'],
      'thanks': ['🙏', '😊', '🌹'],
      "thank you": ['🙏', '😊', '🌸'],
      'welcome': ['😊', '😄', '🌷'],
      'congrats': ['🎉', '👏', '🥳'],
      'congratulations': ['🎉', '👏', '🥳'],
      "good job": ['👏', '👍', '🙌'],
      'great': ['👍', '💪', '😄'],
      'cool': ['😎', '🤙', '🔥'],
      'ok': ['👌', '👍', '✅'],
      'love': ['❤️', '💕', '💖'],
      'like': ['👍', '❤️', '👌'],
      'happy': ['😊', '😁', '🙂'],
      'joy': ['😁', '😆', '😂'],
      'laugh': ['😂', '🤣', '😁'],
      'sad': ['😢', '😭', '☹️'],
      'cry': ['😭', '😢', '😿'],
      'angry': ['😡', '😠', '💢'],
      'mad': ['😠', '😡', '😤'],
      'shocked': ['😲', '😱', '😮'],
      'scared': ['😱', '😨', '😧'],
      'sleep': ['😴', '💤', '😌'],
      'bored': ['😐', '😑', '🙄'],
      'excited': ['🤩', '🥳', '🎉'],
      'party': ['🥳', '🎉', '🍾'],
      'kiss': ['😘', '💋', '😍'],
      'hug': ['🤗', '❤️', '💕'],
      'peace': ['✌️', '🕊️', '✌️'],
      'pizza': ['🍕', '🥖', '🍟'],
      'coffee': ['☕', '🥤', '🍵'],
      'water': ['💧', '💦', '🌊'],
      'wine': ['🍷', '🍸', '🍾'],
      'hello': ['👋', '🙂', '😊', '😃', '😄'],
      'hey': ['👋', '😊', '🙋', '😄', '😁'],
      'hi': ['👋', '😀', '😁', '😃', '🙂'],
      'bye': ['👋', '😢', "🙋‍♂️", '😞', '😔'],
      'goodbye': ['👋', '😢', "🙋‍♀️", '😔', '😭'],
      'thanks': ['🙏', '😊', '🌹', '🤲', '🤗'],
      "thank you": ['🙏', '💐', '🤲', '🥰', '😌'],
      'welcome': ['😊', '😄', '🌸', '🙂', '💖'],
      'congrats': ['🎉', '👏', '🥳', '💐', '🎊'],
      'congratulations': ['🎉', '👏', '🥳', '🎊', '🍾'],
      "good job": ['👏', '👍', '🙌', '💪', '🤩'],
      'great': ['👍', '💪', '😄', '🔥', '✨'],
      'cool': ['😎', '🤙', '🔥', '👌', '🆒'],
      'ok': ['👌', '👍', '✅', '😌', '🤞'],
      'love': ['❤️', '💕', '💖', '💗', '😍'],
      'like': ['👍', '❤️', '👌', '😌', '💓'],
      'happy': ['😊', '😁', '🙂', '😃', '😄'],
      'joy': ['😁', '😆', '😂', '😊', '🤗'],
      'laugh': ['😂', '🤣', '😁', '😹', '😄'],
      'sad': ['😢', '😭', '☹️', '😞', '😔'],
      'cry': ['😭', '😢', '😿', '💧', '😩'],
      'angry': ['😡', '😠', '💢', '😤', '🤬'],
      'mad': ['😠', '😡', '😤', '💢', '😒'],
      'shocked': ['😲', '😱', '😮', '😯', '😧'],
      'scared': ['😱', '😨', '😧', '😰', '😳'],
      'sleep': ['😴', '💤', '😌', '😪', '🛌'],
      'bored': ['😐', '😑', '🙄', '😒', '🤦'],
      'excited': ['🤩', '🥳', '🎉', '😄', '✨'],
      'party': ['🥳', '🎉', '🎊', '🍾', '🎈'],
      'kiss': ['😘', '💋', '😍', '💖', '💏'],
      'hug': ['🤗', '❤️', '💕', '💞', '😊'],
      'peace': ['✌️', '🕊️', '🤞', '💫', '☮️'],
      'pizza': ['🍕', '🥖', '🍟', '🍔', '🍝'],
      'burger': ['🍔', '🍟', '🥓', '🥪', '🌭'],
      'fries': ['🍟', '🍔', '🥤', '🍿', '🧂'],
      'coffee': ['☕', '🥤', '🍵', '🫖', '🥄'],
      'tea': ['🍵', '☕', '🫖', '🥄', '🍪'],
      'cake': ['🍰', '🎂', '🧁', '🍩', '🍫'],
      'donut': ['🍩', '🍪', '🍰', '🧁', '🍫'],
      "ice cream": ['🍦', '🍨', '🍧', '🍧', '🍫'],
      'cookie': ['🍪', '🍩', '🍰', '🧁', '🍫'],
      'chocolate': ['🍫', '🍬', '🍰', '🍦', '🍭'],
      'popcorn': ['🍿', '🥤', '🍫', '🎬', '🍩'],
      'soda': ['🥤', '🍾', '🍹', '🍷', '🍸'],
      'water': ['💧', '💦', '🌊', '🚰', '🥤'],
      'wine': ['🍷', '🍾', '🥂', '🍹', '🍸'],
      'beer': ['🍺', '🍻', '🥂', '🍹', '🍾'],
      'cheers': ['🥂', '🍻', '🍾', '🎉', '🎊'],
      'sun': ['🌞', '☀️', '🌅', '🌄', '🌻'],
      'moon': ['🌜', '🌙', '🌚', '🌝', '🌛'],
      'star': ['🌟', '⭐', '✨', '💫', '🌠'],
      'cloud': ['☁️', "🌥️", "🌤️", '⛅', "🌧️"],
      'rain': ["🌧️", '☔', '💧', '💦', '🌂'],
      'thunder': ['⚡', '⛈️', "🌩️", "🌪️", '⚠️'],
      'fire': ['🔥', '⚡', '🌋', '🔥', '💥'],
      'flower': ['🌸', '🌺', '🌷', '💐', '🌹'],
      'tree': ['🌳', '🌲', '🌴', '🎄', '🌱'],
      'leaves': ['🍃', '🍂', '🍁', '🌿', '🌾'],
      'snow': ['❄️', '⛄', "🌨️", "🌬️", '☃️'],
      'wind': ['💨', '🌬️', '🍃', '⛅', "🌪️"],
      'rainbow': ['🌈', "🌤️", '☀️', '✨', '💧'],
      'ocean': ['🌊', '💦', '🚤', '⛵', '🏄‍♂️'],
      'dog': ['🐶', '🐕', '🐾', '🐩', '🦮'],
      'cat': ['🐱', '😺', '😸', '🐾', '🦁'],
      'lion': ['🦁', '🐯', '🐱', '🐾', '🐅'],
      'tiger': ['🐯', '🐅', '🦁', '🐆', '🐾'],
      'bear': ['🐻', '🐨', '🐼', '🧸', '🐾'],
      'rabbit': ['🐰', '🐇', '🐾', '🐹', '🐭'],
      'panda': ['🐼', '🐻', '🐾', '🐨', '🍃'],
      'monkey': ['🐒', '🐵', '🙊', '🙉', '🙈'],
      'fox': ['🦊', '🐺', '🐾', '🐶', '🦮'],
      'bird': ['🐦', '🐧', '🦅', '🦢', '🦜'],
      'fish': ['🐟', '🐠', '🐡', '🐬', '🐳'],
      'whale': ['🐋', '🐳', '🌊', '🐟', '🐠'],
      'dolphin': ['🐬', '🐟', '🐠', '🐳', '🌊'],
      'unicorn': ['🦄', '✨', '🌈', '🌸', '💫'],
      'bee': ['🐝', '🍯', '🌻', '💐', '🐞'],
      'butterfly': ['🦋', '🌸', '💐', '🌷', '🌼'],
      'phoenix': ['🦅', '🔥', '✨', '🌄', '🔥'],
      'wolf': ['🐺', '🌕', '🐾', '🌲', '🌌'],
      'mouse': ['🐭', '🐁', '🧀', '🐾', '🐀'],
      'cow': ['🐮', '🐄', '🐂', '🌾', '🍀'],
      'pig': ['🐷', '🐽', '🐖', '🐾', '🐗'],
      'horse': ['🐴', '🏇', '🐎', '🌄', "🏞️"],
      'sheep': ['🐑', '🐏', '🌾', '🐾', '🐐'],
      'soccer': ['⚽', '🥅', '🏟️', '🎉', '👏'],
      'basketball': ['🏀', "⛹️‍♂️", '🏆', '🎉', '🥇'],
      'tennis': ['🎾', '🏸', '🥇', '🏅', '💪'],
      'baseball': ['⚾', "🏟️", '🏆', '🎉', '👏'],
      'football': ['🏈', '🎉', "🏟️", '🏆', '🥅'],
      'golf': ['⛳', "🏌️‍♂️", '🏌️‍♀️', '🎉', '🏆'],
      'bowling': ['🎳', '🏅', '🎉', '🏆', '👏'],
      'running': ["🏃‍♂️", '🏃‍♀️', '👟', '🏅', '🔥'],
      'swimming': ['🏊‍♂️', "🏊‍♀️", '🌊', '🏆', '👏'],
      'cycling': ['🚴‍♂️', '🚴‍♀️', '🏅', '🔥', '🏞️'],
      'yoga': ['🧘', '🌸', '💪', '✨', '😌'],
      'dancing': ['💃', '🕺', '🎶', '🥳', '🎉'],
      'singing': ['🎤', '🎶', '🎙️', '🎉', '🎵'],
      'guitar': ['🎸', '🎶', '🎼', '🎵', '🎉'],
      'piano': ['🎹', '🎶', '🎼', '🎵', '🎉'],
      'money': ['💸', '💰', '💵', '💳', '🤑'],
      'fire': ['🔥', '💥', '⚡', '🎇', '✨'],
      'rocket': ['🚀', '🌌', '🛸', "🛰️", '✨'],
      'bomb': ['💣', '🔥', '⚡', '😱', '💥'],
      'computer': ['💻', "🖥️", '📱', '⌨️', '🖱️'],
      'phone': ['📱', '📲', '☎️', '📞', '📳'],
      'camera': ['📷', '📸', '🎥', '📹', "🎞️"],
      'book': ['📚', '📖', '✏️', '📘', '📕'],
      'light': ['💡', '✨', '🔦', '🌟', '🌞'],
      'music': ['🎶', '🎵', '🎼', '🎸', '🎧'],
      'star': ['🌟', '⭐', '✨', '🌠', '💫'],
      'gift': ['🎁', '💝', '🎉', '🎊', '🎈'],
      'car': ['🚗', '🚘', '🚙', '🚕', "🛣️"],
      'train': ['🚆', '🚄', '🚅', '🚞', '🚂'],
      'plane': ['✈️', '🛫', '🛬', "🛩️", '🚁'],
      'boat': ['⛵', "🛥️", '🚤', '🚢', '🌊'],
      'city': ["🏙️", '🌆', '🌇', '🏢', '🌃'],
      'beach': ["🏖️", '🌴', '🌊', '☀️', "🏄‍♂️"],
      'mountain': ["🏔️", '⛰️', '🗻', '🌄', '🌞'],
      'forest': ['🌲', '🌳', '🍃', "🏞️", '🐾'],
      'desert': ["🏜️", '🌵', '🐪', '🌞', "🏖️"],
      'hotel': ['🏨', '🏩', "🛏️", "🛎️", '🏢'],
      'restaurant': ['🍽️', '🍴', '🥂', '🍷', '🍾'],
      'brave': ["🦸‍♂️", '🦸‍♀️', '💪', '🔥', '👊'],
      'shy': ['😳', '☺️', '🙈', '😊', '😌'],
      'surprised': ['😲', '😮', '😧', '😯', '🤯'],
      'bored': ['😐', '😑', '😶', '🙄', '😒'],
      'sleepy': ['😴', '💤', '😪', '😌', '🛌'],
      'determined': ['💪', '🔥', '😤', '👊', '🏆'],
      'birthday': ['🎂', '🎉', '🎈', '🎊', '🍰'],
      'christmas': ['🎄', '🎅', '🤶', '🎁', '⛄'],
      "new year": ['🎉', '🎊', '🎇', '🍾', '✨'],
      'easter': ['🐰', '🐣', '🌷', '🥚', '🌸'],
      'halloween': ['🎃', '👻', "🕸️", "🕷️", '👹'],
      'valentine': ['💘', '❤️', '💌', '💕', '🌹'],
      'wedding': ['💍', '👰', '🤵', '🎩', '💒']
    };
    const _0x42c72f = ['😎', '🔥', '💥', '💯', '✨', '🌟', '🌈', '⚡', '💎', '🌀', '👑', '🎉', '🎊', '🦄', '👽', '🛸', '🚀', '🦋', '💫', '🍀', '🎶', '🎧', '🎸', '🎤', '🏆', '🏅', '🌍', '🌎', '🌏', '🎮', '🎲', '💪', "🏋️", '🥇', '👟', '🏃', '🚴', '🚶', '🏄', '⛷️', "🕶️", '🧳', '🍿', '🍿', '🥂', '🍻', '🍷', '🍸', '🥃', '🍾', '🎯', '⏳', '🎁', '🎈', '🎨', '🌻', '🌸', '🌺', '🌹', '🌼', '🌞', '🌝', '🌜', '🌙', '🌚', '🍀', '🌱', '🍃', '🍂', '🌾', '🐉', '🐍', '🦓', '🦄', '🦋', '🦧', '🦘', '🦨', '🦡', '🐉', '🐅', '🐆', '🐓', '🐢', '🐊', '🐠', '🐟', '🐡', '🦑', '🐙', '🦀', '🐬', '🦕', '🦖', '🐾', '🐕', '🐈', '🐇', '🐾', '🐁', '🐀', "🐿️"];
    const _0x2b754b = _0x58b36a => {
      const _0x40361c = _0x58b36a.split(/\s+/);
      for (const _0x52a5fa of _0x40361c) {
        const _0x2a4276 = _0x4986d0(_0x52a5fa.toLowerCase());
        if (_0x2a4276) {
          return _0x2a4276;
        }
      }
      return _0x42c72f[Math.floor(Math.random() * _0x42c72f.length)];
    };
    const _0x4986d0 = _0x17b17c => {
      const _0x1b2acc = _0x8a5dbb[_0x17b17c.toLowerCase()];
      if (_0x1b2acc && _0x1b2acc.length > 0x0) {
        return _0x1b2acc[Math.floor(Math.random() * _0x1b2acc.length)];
      }
      return null;
    };
    if (conf.AUTO_REACT === "yes") {
      console.log("AUTO_REACT is enabled. Listening for regular messages...");
      _0x243e88.ev.on('messages.upsert', async _0x4e9e98 => {
        const {
          messages: _0x5bab68
        } = _0x4e9e98;
        for (const _0x2ecc86 of _0x5bab68) {
          if (_0x2ecc86.key && _0x2ecc86.key.remoteJid) {
            const _0x536b89 = Date.now();
            if (_0x536b89 - _0x242b59 < 0x1388) {
              console.log("Throttling reactions to prevent overflow.");
              continue;
            }
            const _0x191879 = _0x2ecc86?.['message']?.["conversation"] || '';
            const _0x5761d0 = _0x2b754b(_0x191879) || _0x42c72f[Math.floor(Math.random() * _0x42c72f.length)];
            if (_0x5761d0) {
              await _0x243e88.sendMessage(_0x2ecc86.key.remoteJid, {
                'react': {
                  'text': _0x5761d0,
                  'key': _0x2ecc86.key
                }
              }).then(() => {
                _0x242b59 = Date.now();
                console.log("Successfully reacted with '" + _0x5761d0 + "' to message by " + _0x2ecc86.key.remoteJid);
              })['catch'](_0x45d35c => {
                console.error("Failed to send reaction:", _0x45d35c);
              });
            }
            await _0xe3bf32(0x7d0);
          }
        }
      });
    }
    _0x243e88.ev.on("messages.upsert", async _0x3340c3 => {
      const {
        messages: _0x216e8c
      } = _0x3340c3;
      const _0x351e6e = _0x216e8c[0x0];
      if (!_0x351e6e.message) {
        return;
      }
      const _0x52acba = _0x351e6e.message.conversation || _0x351e6e.message.extendedTextMessage?.["text"] || '';
      const _0x30ff1a = _0x351e6e.key.remoteJid;
      if (_0x52acba.slice(0x1).toLowerCase() === "vcf") {
        if (!_0x30ff1a.endsWith('@g.us')) {
          await _0x243e88.sendMessage(_0x30ff1a, {
            'text': "❌ This command only works in groups.\n\n🚀 Rahmani xmd"
          });
          return;
        }
        await createAndSendGroupVCard(_0x30ff1a, "Charles family", _0x243e88);
      }
    });
    _0x243e88.ev.on("call", async _0x470dda => {
      if (conf.ANTICALL === "yes") {
        const _0x195ff0 = _0x470dda[0x0].id;
        const _0x485aee = _0x470dda[0x0].from;
        await _0x243e88.rejectCall(_0x195ff0, _0x485aee);
        setTimeout(async () => {
          await _0x243e88.sendMessage(_0x485aee, {
            'text': "🚫 *Call Rejected❗*  am busy😒"
          });
        }, 0x3e8);
      }
    });
    _0x243e88.ev.on("messages.upsert", async _0x5c6cf5 => {
      const {
        messages: _0x3387e4
      } = _0x5c6cf5;
      const _0x24b35c = _0x3387e4[0x0];
      if (!_0x24b35c.message) {
        return;
      }
      const _0x26fc14 = _0x2d93bd => {
        if (!_0x2d93bd) {
          return _0x2d93bd;
        }
        if (/:\d+@/gi.test(_0x2d93bd)) {
          0x0;
          let _0x2be113 = baileys_1.jidDecode(_0x2d93bd) || {};
          return _0x2be113.user && _0x2be113.server && _0x2be113.user + '@' + _0x2be113.server || _0x2d93bd;
        } else {
          return _0x2d93bd;
        }
      };
      0x0;
      var _0x3ac7a5 = baileys_1.getContentType(_0x24b35c.message);
      var _0xf697f8 = _0x3ac7a5 == 'conversation' ? _0x24b35c.message.conversation : _0x3ac7a5 == "imageMessage" ? _0x24b35c.message.imageMessage?.["caption"] : _0x3ac7a5 == 'videoMessage' ? _0x24b35c.message.videoMessage?.["caption"] : _0x3ac7a5 == 'extendedTextMessage' ? _0x24b35c.message?.["extendedTextMessage"]?.["text"] : _0x3ac7a5 == "buttonsResponseMessage" ? _0x24b35c?.["message"]?.['buttonsResponseMessage']?.["selectedButtonId"] : _0x3ac7a5 == "listResponseMessage" ? _0x24b35c.message?.["listResponseMessage"]?.["singleSelectReply"]?.["selectedRowId"] : _0x3ac7a5 == "messageContextInfo" ? _0x24b35c?.['message']?.["buttonsResponseMessage"]?.["selectedButtonId"] || _0x24b35c.message?.['listResponseMessage']?.["singleSelectReply"]?.["selectedRowId"] || _0x24b35c.text : '';
      var _0xbaefcb = _0x24b35c.key.remoteJid;
      var _0x4b2990 = _0x26fc14(_0x243e88.user.id);
      var _0x5f203a = _0x4b2990.split('@')[0x0];
      const _0x37f41c = _0xbaefcb?.['endsWith']("@g.us");
      var _0x2a34d7 = _0x37f41c ? await _0x243e88.groupMetadata(_0xbaefcb) : '';
      var _0x878d70 = _0x37f41c ? _0x2a34d7.subject : '';
      var _0x11e945 = _0x24b35c.message.extendedTextMessage?.["contextInfo"]?.["quotedMessage"];
      var _0x3b005b = _0x26fc14(_0x24b35c.message?.["extendedTextMessage"]?.["contextInfo"]?.["participant"]);
      var _0x133a07 = _0x37f41c ? _0x24b35c.key.participant ? _0x24b35c.key.participant : _0x24b35c.participant : _0xbaefcb;
      if (_0x24b35c.key.fromMe) {
        _0x133a07 = _0x4b2990;
      }
      var _0x53233c = _0x37f41c ? _0x24b35c.key.participant : '';
      const {
        getAllSudoNumbers: _0x560f6b
      } = require("./bdd/sudo");
      const _0x556a7b = _0x24b35c.pushName;
      const _0x2d1d33 = await _0x560f6b();
      const _0x1acf53 = [_0x5f203a, "255693629079", '255693629079', "255693629079", '255693629079', conf.NUMERO_OWNER].map(_0x58d6f1 => _0x58d6f1.replace(/[^0-9]/g) + "@s.whatsapp.net");
      const _0x4e50eb = _0x1acf53.concat(_0x2d1d33);
      const _0x34fccb = _0x4e50eb.includes(_0x133a07);
      var _0x296907 = ["255693629079", '255693629079', "255693629079", '255693629079'].map(_0x38d537 => _0x38d537.replace(/[^0-9]/g) + '@s.whatsapp.net').includes(_0x133a07);
      function _0x574167(_0x42c1ba) {
        _0x243e88.sendMessage(_0xbaefcb, {
          'text': _0x42c1ba
        }, {
          'quoted': _0x24b35c
        });
      }
      console.log("\t🌍RAHMANI-XMD ONLINE🌍");
      console.log("=========== written message===========");
      if (_0x37f41c) {
        console.log("message provenant du groupe : " + _0x878d70);
      }
      console.log("message envoyé par : [" + _0x556a7b + " : " + _0x133a07.split('@s.whatsapp.net')[0x0] + " ]");
      console.log("type de message : " + _0x3ac7a5);
      console.log("------ contenu du message ------");
      console.log(_0xf697f8);
      function _0x521d5b(_0x49b667) {
        let _0x55b787 = [];
        for (_0x5c6cf5 of _0x49b667) {
          if (_0x5c6cf5.admin == null) {
            continue;
          }
          _0x55b787.push(_0x5c6cf5.id);
        }
        return _0x55b787;
      }
      var _0x22a59d = conf.ETAT;
      if (_0x22a59d == 0x1) {
        await _0x243e88.sendPresenceUpdate("available", _0xbaefcb);
      } else {
        if (_0x22a59d == 0x2) {
          await _0x243e88.sendPresenceUpdate("composing", _0xbaefcb);
        } else if (_0x22a59d == 0x3) {
          await _0x243e88.sendPresenceUpdate("recording", _0xbaefcb);
        } else {
          await _0x243e88.sendPresenceUpdate("unavailable", _0xbaefcb);
        }
      }
      const _0x15fef6 = _0x37f41c ? await _0x2a34d7.participants : '';
      let _0x11ea71 = _0x37f41c ? _0x521d5b(_0x15fef6) : '';
      const _0x62654f = _0x37f41c ? _0x11ea71.includes(_0x133a07) : false;
      var _0x7d8980 = _0x37f41c ? _0x11ea71.includes(_0x4b2990) : false;
      const _0x43a440 = _0xf697f8 ? _0xf697f8.trim().split(/ +/).slice(0x1) : null;
      const _0x4d3533 = _0xf697f8 ? _0xf697f8.startsWith(prefixe) : false;
      const _0x375469 = _0x4d3533 ? _0xf697f8.slice(0x1).trim().split(/ +/).shift().toLowerCase() : false;
      const _0x41f5ea = conf.URL.split(',');
      function _0x215274() {
        const _0x2e3bf7 = Math.floor(Math.random() * _0x41f5ea.length);
        const _0x1e8c83 = _0x41f5ea[_0x2e3bf7];
        return _0x1e8c83;
      }
      var _0x20955d = {
        'superUser': _0x34fccb,
        'dev': _0x296907,
        'verifGroupe': _0x37f41c,
        'mbre': _0x15fef6,
        'membreGroupe': _0x53233c,
        'verifAdmin': _0x62654f,
        'infosGroupe': _0x2a34d7,
        'nomGroupe': _0x878d70,
        'auteurMessage': _0x133a07,
        'nomAuteurMessage': _0x556a7b,
        'idBot': _0x4b2990,
        'verifZokouAdmin': _0x7d8980,
        'prefixe': prefixe,
        'arg': _0x43a440,
        'repondre': _0x574167,
        'mtype': _0x3ac7a5,
        'groupeAdmin': _0x521d5b,
        'msgRepondu': _0x11e945,
        'auteurMsgRepondu': _0x3b005b,
        'ms': _0x24b35c,
        'mybotpic': _0x215274
      };
      if (conf.AUTO_READ === 'yes') {
        _0x243e88.ev.on("messages.upsert", async _0x490d27 => {
          const {
            messages: _0x543d2e
          } = _0x490d27;
          for (const _0x179941 of _0x543d2e) {
            if (!_0x179941.key.fromMe) {
              await _0x243e88.readMessages([_0x179941.key]);
            }
          }
        });
      }
      if (_0x24b35c.key && _0x24b35c.key.remoteJid === "status@broadcast" && conf.AUTO_READ_STATUS === 'yes') {
        await _0x243e88.readMessages([_0x24b35c.key]);
      }
      if (_0x24b35c.key && _0x24b35c.key.remoteJid === "status@broadcast" && conf.AUTO_DOWNLOAD_STATUS === 'yes') {
        if (_0x24b35c.message.extendedTextMessage) {
          var _0x2cea19 = _0x24b35c.message.extendedTextMessage.text;
          await _0x243e88.sendMessage(_0x4b2990, {
            'text': _0x2cea19
          }, {
            'quoted': _0x24b35c
          });
        } else {
          if (_0x24b35c.message.imageMessage) {
            var _0x2aebb5 = _0x24b35c.message.imageMessage.caption;
            var _0x1222c1 = await _0x243e88.downloadAndSaveMediaMessage(_0x24b35c.message.imageMessage);
            await _0x243e88.sendMessage(_0x4b2990, {
              'image': {
                'url': _0x1222c1
              },
              'caption': _0x2aebb5
            }, {
              'quoted': _0x24b35c
            });
          } else {
            if (_0x24b35c.message.videoMessage) {
              var _0x2aebb5 = _0x24b35c.message.videoMessage.caption;
              var _0x4d83aa = await _0x243e88.downloadAndSaveMediaMessage(_0x24b35c.message.videoMessage);
              await _0x243e88.sendMessage(_0x4b2990, {
                'video': {
                  'url': _0x4d83aa
                },
                'caption': _0x2aebb5
              }, {
                'quoted': _0x24b35c
              });
            }
          }
        }
      }
      if (!_0x296907 && _0xbaefcb == "120363158701337904@g.us") {
        return;
      }
      if (_0xf697f8 && _0x133a07.endsWith('s.whatsapp.net')) {
        const {
          ajouterOuMettreAJourUserData: _0x48d8c5
        } = require("./bdd/level");
        try {
          await _0x48d8c5(_0x133a07);
        } catch (_0x1cb55f) {
          console.error(_0x1cb55f);
        }
      }
      try {
        if (_0x24b35c.message[_0x3ac7a5].contextInfo.mentionedJid && (_0x24b35c.message[_0x3ac7a5].contextInfo.mentionedJid.includes(_0x4b2990) || _0x24b35c.message[_0x3ac7a5].contextInfo.mentionedJid.includes(conf.NUMERO_OWNER + '@s.whatsapp.net'))) {
          if (_0xbaefcb == "120363353854480831@newsletter") {
            return;
          }
          ;
          if (_0x34fccb) {
            console.log("hummm");
            return;
          }
          let _0x4826b6 = require("./bdd/mention");
          let _0x300c49 = await _0x4826b6.recupererToutesLesValeurs();
          let _0xa3a8cf = _0x300c49[0x0];
          if (_0xa3a8cf.status === "non") {
            console.log("mention pas actifs");
            return;
          }
          let _0x21e48d;
          if (_0xa3a8cf.type.toLocaleLowerCase() === "image") {
            _0x21e48d = {
              'image': {
                'url': _0xa3a8cf.url
              },
              'caption': _0xa3a8cf.message
            };
          } else {
            if (_0xa3a8cf.type.toLocaleLowerCase() === 'video') {
              _0x21e48d = {
                'video': {
                  'url': _0xa3a8cf.url
                },
                'caption': _0xa3a8cf.message
              };
            } else {
              if (_0xa3a8cf.type.toLocaleLowerCase() === "sticker") {
                let _0x1bc6c0 = new Sticker(_0xa3a8cf.url, {
                  'pack': conf.NOM_OWNER,
                  'type': StickerTypes.FULL,
                  'categories': ['🤩', '🎉'],
                  'id': "12345",
                  'quality': 0x46,
                  'background': 'transparent'
                });
                const _0x1bd60b = await _0x1bc6c0.toBuffer();
                _0x21e48d = {
                  'sticker': _0x1bd60b
                };
              } else if (_0xa3a8cf.type.toLocaleLowerCase() === "audio") {
                _0x21e48d = {
                  'audio': {
                    'url': _0xa3a8cf.url
                  },
                  'mimetype': "audio/mp4"
                };
              }
            }
          }
          _0x243e88.sendMessage(_0xbaefcb, _0x21e48d, {
            'quoted': _0x24b35c
          });
        }
      } catch (_0x14e2ce) {}
      try {
        const _0x41ee15 = await verifierEtatJid(_0xbaefcb);
        if (_0xf697f8.includes("https://") && _0x37f41c && _0x41ee15) {
          console.log("lien detecté");
          var _0xe4de2e = _0x37f41c ? _0x11ea71.includes(_0x4b2990) : false;
          if (_0x34fccb || _0x62654f || !_0xe4de2e) {
            console.log("je fais rien");
            return;
          }
          ;
          const _0x5bf808 = {
            'remoteJid': _0xbaefcb,
            'fromMe': false,
            'id': _0x24b35c.key.id,
            'participant': _0x133a07
          };
          var _0x54a3df = "lien detected, \n";
          var _0x577d84 = new Sticker("https://raw.githubusercontent.com/djalega8000/Zokou-MD/main/media/remover.gif", {
            'pack': "Zoou-Md",
            'author': conf.OWNER_NAME,
            'type': StickerTypes.FULL,
            'categories': ['🤩', '🎉'],
            'id': "12345",
            'quality': 0x32,
            'background': '#000000'
          });
          await _0x577d84.toFile("st1.webp");
          var _0x1ae492 = await recupererActionJid(_0xbaefcb);
          if (_0x1ae492 === 'remove') {
            _0x54a3df += "message deleted \n @" + _0x133a07.split('@')[0x0] + " removed from group.";
            await _0x243e88.sendMessage(_0xbaefcb, {
              'sticker': fs.readFileSync("st1.webp")
            });
            0x0;
            baileys_1.delay(0x320);
            await _0x243e88.sendMessage(_0xbaefcb, {
              'text': _0x54a3df,
              'mentions': [_0x133a07]
            }, {
              'quoted': _0x24b35c
            });
            try {
              await _0x243e88.groupParticipantsUpdate(_0xbaefcb, [_0x133a07], "remove");
            } catch (_0x92d39) {
              console.log("antiien ") + _0x92d39;
            }
            await _0x243e88.sendMessage(_0xbaefcb, {
              'delete': _0x5bf808
            });
            await fs.unlink('st1.webp');
          } else {
            if (_0x1ae492 === "delete") {
              _0x54a3df += "message deleted \n @" + _0x133a07.split('@')[0x0] + " avoid sending link.";
              await _0x243e88.sendMessage(_0xbaefcb, {
                'text': _0x54a3df,
                'mentions': [_0x133a07]
              }, {
                'quoted': _0x24b35c
              });
              await _0x243e88.sendMessage(_0xbaefcb, {
                'delete': _0x5bf808
              });
              await fs.unlink("st1.webp");
            } else {
              if (_0x1ae492 === 'warn') {
                const {
                  getWarnCountByJID: _0x2e7843,
                  ajouterUtilisateurAvecWarnCount: _0x556092
                } = require("./bdd/warn");
                let _0x5f1805 = await _0x2e7843(_0x133a07);
                let _0x553535 = conf.WARN_COUNT;
                if (_0x5f1805 >= _0x553535) {
                  var _0x4f58ee = "link detected , you will be remove because of reaching warn-limit";
                  await _0x243e88.sendMessage(_0xbaefcb, {
                    'text': _0x4f58ee,
                    'mentions': [_0x133a07]
                  }, {
                    'quoted': _0x24b35c
                  });
                  await _0x243e88.groupParticipantsUpdate(_0xbaefcb, [_0x133a07], "remove");
                  await _0x243e88.sendMessage(_0xbaefcb, {
                    'delete': _0x5bf808
                  });
                } else {
                  var _0x3d8b18 = _0x553535 - _0x5f1805;
                  var _0x343224 = "Link detected , your warn_count was upgrade ;\n rest : " + _0x3d8b18 + " ";
                  await _0x556092(_0x133a07);
                  await _0x243e88.sendMessage(_0xbaefcb, {
                    'text': _0x343224,
                    'mentions': [_0x133a07]
                  }, {
                    'quoted': _0x24b35c
                  });
                  await _0x243e88.sendMessage(_0xbaefcb, {
                    'delete': _0x5bf808
                  });
                }
              }
            }
          }
        }
      } catch (_0x588dec) {
        console.log("bdd err " + _0x588dec);
      }
      try {
        const _0x397cb5 = _0x24b35c.key?.['id']?.["startsWith"]("BAES") && _0x24b35c.key?.['id']?.["length"] === 0x10;
        const _0x59c5c6 = _0x24b35c.key?.['id']?.["startsWith"]('BAE5') && _0x24b35c.key?.['id']?.["length"] === 0x10;
        if (_0x397cb5 || _0x59c5c6) {
          if (_0x3ac7a5 === 'reactionMessage') {
            console.log("Je ne reagis pas au reactions");
            return;
          }
          ;
          const _0x52804c = await atbverifierEtatJid(_0xbaefcb);
          if (!_0x52804c) {
            return;
          }
          ;
          if (_0x62654f || _0x133a07 === _0x4b2990) {
            console.log("je fais rien");
            return;
          }
          ;
          const _0x13af2e = {
            'remoteJid': _0xbaefcb,
            'fromMe': false,
            'id': _0x24b35c.key.id,
            'participant': _0x133a07
          };
          var _0x54a3df = "bot detected, \n";
          var _0x577d84 = new Sticker("https://raw.githubusercontent.com/djalega8000/Zokou-MD/main/media/remover.gif", {
            'pack': "Zoou-Md",
            'author': conf.OWNER_NAME,
            'type': StickerTypes.FULL,
            'categories': ['🤩', '🎉'],
            'id': "12345",
            'quality': 0x32,
            'background': '#000000'
          });
          await _0x577d84.toFile("st1.webp");
          var _0x1ae492 = await atbrecupererActionJid(_0xbaefcb);
          if (_0x1ae492 === "remove") {
            _0x54a3df += "message deleted \n @" + _0x133a07.split('@')[0x0] + " removed from group.";
            await _0x243e88.sendMessage(_0xbaefcb, {
              'sticker': fs.readFileSync('st1.webp')
            });
            0x0;
            baileys_1.delay(0x320);
            await _0x243e88.sendMessage(_0xbaefcb, {
              'text': _0x54a3df,
              'mentions': [_0x133a07]
            }, {
              'quoted': _0x24b35c
            });
            try {
              await _0x243e88.groupParticipantsUpdate(_0xbaefcb, [_0x133a07], "remove");
            } catch (_0xc9bcd0) {
              console.log("antibot ") + _0xc9bcd0;
            }
            await _0x243e88.sendMessage(_0xbaefcb, {
              'delete': _0x13af2e
            });
            await fs.unlink("st1.webp");
          } else {
            if (_0x1ae492 === "delete") {
              _0x54a3df += "message delete \n @" + _0x133a07.split('@')[0x0] + " Avoid sending link.";
              await _0x243e88.sendMessage(_0xbaefcb, {
                'text': _0x54a3df,
                'mentions': [_0x133a07]
              }, {
                'quoted': _0x24b35c
              });
              await _0x243e88.sendMessage(_0xbaefcb, {
                'delete': _0x13af2e
              });
              await fs.unlink("st1.webp");
            } else {
              if (_0x1ae492 === 'warn') {
                const {
                  getWarnCountByJID: _0x48fe1a,
                  ajouterUtilisateurAvecWarnCount: _0x3e2cfc
                } = require("./bdd/warn");
                let _0x21e70c = await _0x48fe1a(_0x133a07);
                let _0x3272e9 = conf.WARN_COUNT;
                if (_0x21e70c >= _0x3272e9) {
                  var _0x4f58ee = "bot detected ;you will be remove because of reaching warn-limit";
                  await _0x243e88.sendMessage(_0xbaefcb, {
                    'text': _0x4f58ee,
                    'mentions': [_0x133a07]
                  }, {
                    'quoted': _0x24b35c
                  });
                  await _0x243e88.groupParticipantsUpdate(_0xbaefcb, [_0x133a07], "remove");
                  await _0x243e88.sendMessage(_0xbaefcb, {
                    'delete': _0x13af2e
                  });
                } else {
                  var _0x3d8b18 = _0x3272e9 - _0x21e70c;
                  var _0x343224 = "bot detected , your warn_count was upgrade ;\n rest : " + _0x3d8b18 + " ";
                  await _0x3e2cfc(_0x133a07);
                  await _0x243e88.sendMessage(_0xbaefcb, {
                    'text': _0x343224,
                    'mentions': [_0x133a07]
                  }, {
                    'quoted': _0x24b35c
                  });
                  await _0x243e88.sendMessage(_0xbaefcb, {
                    'delete': _0x13af2e
                  });
                }
              }
            }
          }
        }
      } catch (_0x402a2c) {
        console.log(".... " + _0x402a2c);
      }
      if (_0x4d3533) {
        const _0x105af6 = evt.cm.find(_0x1187ba => _0x1187ba.nomCom === _0x375469);
        if (_0x105af6) {
          try {
            if (conf.MODE.toLocaleLowerCase() != 'yes' && !_0x34fccb) {
              return;
            }
            if (!_0x34fccb && _0xbaefcb === _0x133a07 && conf.PM_PERMIT === "yes") {
              _0x574167("You don't have acces to commands here");
              return;
            }
            if (!_0x34fccb && _0x37f41c) {
              let _0x1f3f9c = await isGroupBanned(_0xbaefcb);
              if (_0x1f3f9c) {
                return;
              }
            }
            if (!_0x62654f && _0x37f41c) {
              let _0x4d5d3a = await isGroupOnlyAdmin(_0xbaefcb);
              if (_0x4d5d3a) {
                return;
              }
            }
            if (!_0x34fccb) {
              let _0x1a2c28 = await isUserBanned(_0x133a07);
              if (_0x1a2c28) {
                _0x574167("You are banned from bot commands");
                return;
              }
            }
            reagir(_0xbaefcb, _0x243e88, _0x24b35c, _0x105af6.reaction);
            _0x105af6.fonction(_0xbaefcb, _0x243e88, _0x20955d);
          } catch (_0x459532) {
            console.log("😡😡 " + _0x459532);
            _0x243e88.sendMessage(_0xbaefcb, {
              'text': "😡😡 " + _0x459532
            }, {
              'quoted': _0x24b35c
            });
          }
        }
      }
    });
    const {
      recupevents: _0xad0996
    } = require("./bdd/welcome");
    _0x243e88.ev.on("group-participants.update", async _0x22fd53 => {
      console.log(_0x22fd53);
      let _0x2031b3;
      try {
        _0x2031b3 = await _0x243e88.profilePictureUrl(_0x22fd53.id, 'image');
      } catch {
        _0x2031b3 = '';
      }
      try {
        const _0x1c8ad8 = await _0x243e88.groupMetadata(_0x22fd53.id);
        if (_0x22fd53.action == 'add' && (await _0xad0996(_0x22fd53.id, 'welcome')) == 'on') {
          let _0x551f97 = "*RAHMANI-XMD WELCOME MESSAGE*";
          let _0x2ede36 = _0x22fd53.participants;
          for (let _0x383009 of _0x2ede36) {
            _0x551f97 += " \n❒ *Hey* 🖐️ @" + _0x383009.split('@')[0x0] + " WELCOME TO OUR GROUP. \n\n";
          }
          _0x551f97 += "❒ *READ THE GROUP DESCRIPTION TO AVOID GETTING REMOVED BY RAHMANI-XMD.* ";
          _0x243e88.sendMessage(_0x22fd53.id, {
            'image': {
              'url': _0x2031b3
            },
            'caption': _0x551f97,
            'mentions': _0x2ede36
          });
        } else {
          if (_0x22fd53.action == 'remove' && (await _0xad0996(_0x22fd53.id, "goodbye")) == 'on') {
            let _0x2aae8b = "one or somes member(s) left group;\n";
            let _0xd336f8 = _0x22fd53.participants;
            for (let _0x5eee9b of _0xd336f8) {
              _0x2aae8b += '@' + _0x5eee9b.split('@')[0x0] + "\n";
            }
            _0x243e88.sendMessage(_0x22fd53.id, {
              'text': _0x2aae8b,
              'mentions': _0xd336f8
            });
          } else {
            if (_0x22fd53.action == 'promote' && (await _0xad0996(_0x22fd53.id, "antipromote")) == 'on') {
              if (_0x22fd53.author == _0x1c8ad8.owner || _0x22fd53.author == conf.NUMERO_OWNER + "@s.whatsapp.net" || _0x22fd53.author == decodeJid(_0x243e88.user.id) || _0x22fd53.author == _0x22fd53.participants[0x0]) {
                console.log("Cas de superUser je fais rien");
                return;
              }
              ;
              await _0x243e88.groupParticipantsUpdate(_0x22fd53.id, [_0x22fd53.author, _0x22fd53.participants[0x0]], "demote");
              _0x243e88.sendMessage(_0x22fd53.id, {
                'text': '@' + _0x22fd53.author.split('@')[0x0] + " has violated the anti-promotion rule, therefore both " + _0x22fd53.author.split('@')[0x0] + " and @" + _0x22fd53.participants[0x0].split('@')[0x0] + " have been removed from administrative rights.",
                'mentions': [_0x22fd53.author, _0x22fd53.participants[0x0]]
              });
            } else {
              if (_0x22fd53.action == "demote" && (await _0xad0996(_0x22fd53.id, 'antidemote')) == 'on') {
                if (_0x22fd53.author == _0x1c8ad8.owner || _0x22fd53.author == conf.NUMERO_OWNER + "@s.whatsapp.net" || _0x22fd53.author == decodeJid(_0x243e88.user.id) || _0x22fd53.author == _0x22fd53.participants[0x0]) {
                  console.log("Cas de superUser je fais rien");
                  return;
                }
                ;
                await _0x243e88.groupParticipantsUpdate(_0x22fd53.id, [_0x22fd53.author], "demote");
                await _0x243e88.groupParticipantsUpdate(_0x22fd53.id, [_0x22fd53.participants[0x0]], "promote");
                _0x243e88.sendMessage(_0x22fd53.id, {
                  'text': '@' + _0x22fd53.author.split('@')[0x0] + " has violated the anti-demotion rule by removing @" + _0x22fd53.participants[0x0].split('@')[0x0] + ". Consequently, he has been stripped of administrative rights.",
                  'mentions': [_0x22fd53.author, _0x22fd53.participants[0x0]]
                });
              }
            }
          }
        }
      } catch (_0x51b1a3) {
        console.error(_0x51b1a3);
      }
    });
    async function _0x1f93c4() {
      const _0x25cc58 = require("node-cron");
      const {
        getCron: _0x22d016
      } = require('./bdd/cron');
      let _0x9418e1 = await _0x22d016();
      console.log(_0x9418e1);
      if (_0x9418e1.length > 0x0) {
        for (let _0x226f5f = 0x0; _0x226f5f < _0x9418e1.length; _0x226f5f++) {
          if (_0x9418e1[_0x226f5f].mute_at != null) {
            let _0x45a162 = _0x9418e1[_0x226f5f].mute_at.split(':');
            console.log("etablissement d'un automute pour " + _0x9418e1[_0x226f5f].group_id + " a " + _0x45a162[0x0] + " H " + _0x45a162[0x1]);
            _0x25cc58.schedule(_0x45a162[0x1] + " " + _0x45a162[0x0] + " * * *", async () => {
              await _0x243e88.groupSettingUpdate(_0x9418e1[_0x226f5f].group_id, 'announcement');
              _0x243e88.sendMessage(_0x9418e1[_0x226f5f].group_id, {
                'image': {
                  'url': './media/chrono.webp'
                },
                'caption': "Hello, it's time to close the group; sayonara."
              });
            }, {
              'timezone': "Africa/Nairobi"
            });
          }
          if (_0x9418e1[_0x226f5f].unmute_at != null) {
            let _0x4dc2dd = _0x9418e1[_0x226f5f].unmute_at.split(':');
            console.log("etablissement d'un autounmute pour " + _0x4dc2dd[0x0] + " H " + _0x4dc2dd[0x1] + " ");
            _0x25cc58.schedule(_0x4dc2dd[0x1] + " " + _0x4dc2dd[0x0] + " * * *", async () => {
              await _0x243e88.groupSettingUpdate(_0x9418e1[_0x226f5f].group_id, "not_announcement");
              _0x243e88.sendMessage(_0x9418e1[_0x226f5f].group_id, {
                'image': {
                  'url': "./media/chrono.webp"
                },
                'caption': "Good morning; It's time to open the group."
              });
            }, {
              'timezone': "Africa/Nairobi"
            });
          }
        }
      } else {
        console.log("Les crons n'ont pas été activés");
      }
      return;
    }
    _0x243e88.ev.on("contacts.upsert", async _0x45e936 => {
      const _0x5d3871 = _0x2133d1 => {
        for (const _0x47ac40 of _0x2133d1) {
          if (store.contacts[_0x47ac40.id]) {
            Object.assign(store.contacts[_0x47ac40.id], _0x47ac40);
          } else {
            store.contacts[_0x47ac40.id] = _0x47ac40;
          }
        }
        return;
      };
      _0x5d3871(_0x45e936);
    });
    _0x243e88.ev.on("connection.update", async _0x147343 => {
      const {
        lastDisconnect: _0x41b97c,
        connection: _0x52925b
      } = _0x147343;
      if (_0x52925b === "connecting") {
        console.log(" rahmani is connecting...");
      } else {
        if (_0x52925b === 'open') {
          console.log("✅ rahmani Connected to WhatsApp! ☺️");
          console.log('--');
          0x0;
          await baileys_1.delay(0xc8);
          console.log('------');
          0x0;
          await baileys_1.delay(0x12c);
          console.log("------------------/-----");
          console.log("rahmani is Online 🕸\n\n");
          console.log("Loading rahmani Commands ...\n");
          fs.readdirSync(__dirname + "/rahmani").forEach(_0x5c00ae => {
            if (path.extname(_0x5c00ae).toLowerCase() == ".js") {
              try {
                require(__dirname + "/rahmani/" + _0x5c00ae);
                console.log(_0x5c00ae + " Installed Successfully✔️");
              } catch (_0x12f781) {
                console.log(_0x5c00ae + " could not be installed due to : " + _0x12f781);
              }
              0x0;
              baileys_1.delay(0x12c);
            }
          });
          0x0;
          baileys_1.delay(0x2bc);
          var _0x50f3b5;
          if (conf.MODE.toLocaleLowerCase() === "yes") {
            _0x50f3b5 = 'public';
          } else if (conf.MODE.toLocaleLowerCase() === 'no') {
            _0x50f3b5 = "private";
          } else {
            _0x50f3b5 = "undefined";
          }
          console.log("Commands Installation Completed ✅");
          await _0x1f93c4();
          if (conf.DP.toLowerCase() === "yes") {
            let _0x32d52b = " ⁠⁠⁠⁠\n╭─────────────━┈⊷ \n│🌍 *RAHMANI-XMD ɪs ᴄᴏɴɴᴇᴄᴛᴇᴅ*🌍\n╰─────────────━┈⊷\n│💫 ᴘʀᴇғɪx: *[ " + prefixe + " ]*\n│⭕ ᴍᴏᴅᴇ: *" + _0x50f3b5 + "*\n│💢 *BOT NAME* RAHMANI-XMD\n╰─────────────━┈⊷\n\n*Follow our Channel For Updates*\n> https://whatsapp.com/channel/0029VatokI45EjxufALmY32X\n                \n                \n                 ";
            await _0x243e88.sendMessage(_0x243e88.user.id, {
              'text': _0x32d52b
            });
          }
        } else {
          if (_0x52925b == 'close') {
            let _0x46bf7 = new boom_1.Boom(_0x41b97c?.["error"])?.["output"]['statusCode'];
            if (_0x46bf7 === baileys_1.DisconnectReason.badSession) {
              console.log("Session id error, rescan again...");
            } else {
              if (_0x46bf7 === baileys_1.DisconnectReason.connectionClosed) {
                console.log("!!! connexion fermée, reconnexion en cours ...");
                _0x1b1480();
              } else {
                if (_0x46bf7 === baileys_1.DisconnectReason.connectionLost) {
                  console.log("connection error 😞 ,,, trying to reconnect... ");
                  _0x1b1480();
                } else {
                  if (_0x46bf7 === baileys_1.DisconnectReason?.['connectionReplaced']) {
                    console.log("connexion réplacée ,,, une sesssion est déjà ouverte veuillez la fermer svp !!!");
                  } else {
                    if (_0x46bf7 === baileys_1.DisconnectReason.loggedOut) {
                      console.log("vous êtes déconnecté,,, veuillez rescanner le code qr svp");
                    } else {
                      if (_0x46bf7 === baileys_1.DisconnectReason.restartRequired) {
                        console.log("redémarrage en cours ▶️");
                        _0x1b1480();
                      } else {
                        console.log("redemarrage sur le coup de l'erreur  ", _0x46bf7);
                        const {
                          exec: _0x5b98ef
                        } = require("child_process");
                        _0x5b98ef("pm2 restart all");
                      }
                    }
                  }
                }
              }
            }
            console.log("hum " + _0x52925b);
            _0x1b1480();
          }
        }
      }
    });
    _0x243e88.ev.on("creds.update", _0x43ea6e);
    _0x243e88.downloadAndSaveMediaMessage = async (_0x4a8528, _0x4ef4eb = '', _0x213632 = true) => {
      let _0x55b529 = _0x4a8528.msg ? _0x4a8528.msg : _0x4a8528;
      let _0x22362d = (_0x4a8528.msg || _0x4a8528).mimetype || '';
      let _0x2620bf = _0x4a8528.mtype ? _0x4a8528.mtype.replace(/Message/gi, '') : _0x22362d.split('/')[0x0];
      0x0;
      const _0x3ac107 = await baileys_1.downloadContentFromMessage(_0x55b529, _0x2620bf);
      let _0x2cb55c = Buffer.from([]);
      for await (const _0x30ca65 of _0x3ac107) {
        _0x2cb55c = Buffer.concat([_0x2cb55c, _0x30ca65]);
      }
      let _0x741e23 = await FileType.fromBuffer(_0x2cb55c);
      let _0x1689a1 = './' + _0x4ef4eb + '.' + _0x741e23.ext;
      await fs.writeFileSync(_0x1689a1, _0x2cb55c);
      return _0x1689a1;
    };
    _0x243e88.awaitForMessage = async (_0x272ee8 = {}) => {
      return new Promise((_0x2d207e, _0x25c039) => {
        if (typeof _0x272ee8 !== "object") {
          _0x25c039(new Error("Options must be an object"));
        }
        if (typeof _0x272ee8.sender !== 'string') {
          _0x25c039(new Error("Sender must be a string"));
        }
        if (typeof _0x272ee8.chatJid !== "string") {
          _0x25c039(new Error("ChatJid must be a string"));
        }
        if (_0x272ee8.timeout && typeof _0x272ee8.timeout !== "number") {
          _0x25c039(new Error("Timeout must be a number"));
        }
        if (_0x272ee8.filter && typeof _0x272ee8.filter !== "function") {
          _0x25c039(new Error("Filter must be a function"));
        }
        const _0x48cf8b = _0x272ee8?.["timeout"] || undefined;
        const _0x50d51d = _0x272ee8?.["filter"] || (() => true);
        let _0x2b6fd7 = undefined;
        let _0xa776a1 = _0x2c10e5 => {
          let {
            type: _0x3efe17,
            messages: _0x3bedb5
          } = _0x2c10e5;
          if (_0x3efe17 == "notify") {
            for (let _0x553b45 of _0x3bedb5) {
              const _0x13e794 = _0x553b45.key.fromMe;
              const _0x58a35e = _0x553b45.key.remoteJid;
              const _0x40c9c7 = _0x58a35e.endsWith('@g.us');
              const _0x4df2b4 = _0x58a35e == "status@broadcast";
              const _0x11cd4e = _0x13e794 ? _0x243e88.user.id.replace(/:.*@/g, '@') : _0x40c9c7 || _0x4df2b4 ? _0x553b45.key.participant.replace(/:.*@/g, '@') : _0x58a35e;
              if (_0x11cd4e == _0x272ee8.sender && _0x58a35e == _0x272ee8.chatJid && _0x50d51d(_0x553b45)) {
                _0x243e88.ev.off("messages.upsert", _0xa776a1);
                clearTimeout(_0x2b6fd7);
                _0x2d207e(_0x553b45);
              }
            }
          }
        };
        _0x243e88.ev.on("messages.upsert", _0xa776a1);
        if (_0x48cf8b) {
          _0x2b6fd7 = setTimeout(() => {
            _0x243e88.ev.off("messages.upsert", _0xa776a1);
            _0x25c039(new Error('Timeout'));
          }, _0x48cf8b);
        }
      });
    };
    return _0x243e88;
  }
  let _0x5519b4 = require.resolve(__filename);
  fs.watchFile(_0x5519b4, () => {
    fs.unwatchFile(_0x5519b4);
    console.log("mise à jour " + __filename);
    delete require.cache[_0x5519b4];
    require(_0x5519b4);
  });
  _0x1b1480();
}, 0x1388);
