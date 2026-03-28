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

// ============= ANTI-VIRUS & ANTI-BUG SYSTEM =============
const antiMalware = {
    enabled: true,
    autoDelete: true,
    sendWarning: true,
    autoBlock: true,
    logAttacks: true,
    
    blockedUsers: new Map(),
    
    blockUser: async function(sock, userJid, reason) {
        if (this.blockedUsers.has(userJid)) return false;
        try {
            await sock.updateBlockStatus(userJid, 'block');
            this.blockedUsers.set(userJid, {
                timestamp: Date.now(),
                reason: reason
            });
            console.log(`🚫 BLOCKED: ${userJid} - ${reason}`);
            return true;
        } catch(e) {
            console.log(`Block failed: ${e.message}`);
            return false;
        }
    },
    
    detection: {
        maxMessageLength: 5000,
        maxConsecutiveMessages: 5,
        spamWindowMs: 10000,
        
        patterns: {
            unicodeFlood: [
                /[\uA980-\uA9DF\u1B00-\u1B7F\u0980-\u09FF]{15,}/,
                /(.)\1{60,}/
            ],
            longString: /^[^\s]{200,}$/,
            jsInjection: [
                /<script/i, /javascript:/i, /onclick/i, /onerror/i, /eval\s*\(/i,
                /document\./i, /window\./i, /alert\s*\(/i, /__proto__/i
            ],
            sqlInjection: [
                /union\s+select/i, /drop\s+table/i, /delete\s+from/i,
                /insert\s+into/i, /'\s+or\s+1=1/i
            ],
            maliciousFiles: [
                /\.exe\b/i, /\.bat\b/i, /\.cmd\b/i, /\.vbs\b/i, /\.sh\b/i
            ]
        },
        
        blockedKeywords: ['virus', 'trojan', 'malware', 'ransomware', 'keylogger', 'hack', 'crack']
    },
    
    securityLogs: [],
    attackCount: new Map(),
    spamTracker: new Map(),
    
    logSecurityEvent: function(type, sender, group, details) {
        this.securityLogs.unshift({
            timestamp: new Date().toISOString(),
            type: type, sender: sender, group: group, details: details
        });
        if (this.securityLogs.length > 500) this.securityLogs.pop();
        console.log(`🛡️ ${type}: ${details}`);
    },
    
    detectMaliciousContent: function(message) {
        if (!message || typeof message !== 'string') return { detected: false };
        
        if (message.length > this.detection.maxMessageLength) {
            return { detected: true, reason: `Message too long (${message.length} chars)`, type: 'excessive_length' };
        }
        
        for (let p of this.detection.patterns.unicodeFlood) {
            if (p.test(message)) {
                return { detected: true, reason: 'CRASH ATTACK - Unicode flood detected', type: 'crash_attack' };
            }
        }
        
        if (this.detection.patterns.longString.test(message)) {
            return { detected: true, reason: `CRASH ATTACK - Long string (${message.length} chars)`, type: 'crash_attack' };
        }
        
        const repeatedPattern = /(.)\1{100,}/;
        if (repeatedPattern.test(message)) {
            return { detected: true, reason: 'CRASH ATTACK - Character repetition', type: 'crash_attack' };
        }
        
        for (let p of this.detection.patterns.jsInjection) {
            if (p.test(message)) return { detected: true, reason: 'JavaScript injection', type: 'js_injection' };
        }
        
        for (let p of this.detection.patterns.sqlInjection) {
            if (p.test(message)) return { detected: true, reason: 'SQL injection', type: 'sql_injection' };
        }
        
        for (let p of this.detection.patterns.maliciousFiles) {
            if (p.test(message)) return { detected: true, reason: 'Malicious file', type: 'malicious_file' };
        }
        
        for (let kw of this.detection.blockedKeywords) {
            if (message.toLowerCase().includes(kw)) return { detected: true, reason: `Blocked: ${kw}`, type: 'keyword' };
        }
        
        return { detected: false };
    },
    
    checkSpam: function(sender) {
        const now = Date.now();
        const data = this.spamTracker.get(sender) || { count: 0, time: now };
        if (now - data.time < this.detection.spamWindowMs) {
            data.count++;
            if (data.count > this.detection.maxConsecutiveMessages) return true;
        } else {
            data.count = 1;
            data.time = now;
        }
        this.spamTracker.set(sender, data);
        return false;
    },
    
    trackAttack: function(sender, type) {
        const key = `${sender}:${type}`;
        const count = (this.attackCount.get(key) || 0) + 1;
        this.attackCount.set(key, count);
        return count >= 2;
    }
};

setInterval(() => {
    const now = Date.now();
    for (let [s, d] of antiMalware.spamTracker) {
        if (now - d.time > 20000) antiMalware.spamTracker.delete(s);
    }
}, 60000);

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

const store = baileys_1.makeInMemoryStore({
  'logger': pino().child({ 'level': "silent", 'stream': "store" })
});

setTimeout(() => {
  async function _0x1b1480() {
    const { version: _0x3729c6 } = await baileys_1.fetchLatestBaileysVersion();
    const { state: _0xfe616d, saveCreds: _0x43ea6e } = await baileys_1.useMultiFileAuthState(__dirname + "/scan");
    
    const _0x34e3ed = {
      'version': _0x3729c6,
      'logger': pino({ 'level': "silent" }),
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
        return { 'conversation': "An Error Occurred, Repeat Command!" };
      }
    };
    
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
      if (_0x155b79 - _0x42a7dd < 0xbb8) return true;
      _0x32404a.set(_0x3dc481, _0x155b79);
      return false;
    }
    
    const _0xe9147a = new Map();
    async function _0x29c430(_0x1d4240, _0xd3aa26) {
      if (_0xe9147a.has(_0xd3aa26)) return _0xe9147a.get(_0xd3aa26);
      try {
        const _0x461194 = await _0x1d4240.groupMetadata(_0xd3aa26);
        _0xe9147a.set(_0xd3aa26, _0x461194);
        setTimeout(() => _0xe9147a['delete'](_0xd3aa26), 0xea60);
        return _0x461194;
      } catch (_0xb096db) {
        if (_0xb096db.message.includes("rate-overlimit")) await new Promise(r => setTimeout(r, 0x1388));
        return null;
      }
    }
    
    process.on("uncaughtException", () => {});
    process.on("unhandledRejection", () => {});
    
    _0x243e88.ev.on("messages.upsert", async _0x2223dd => {
      const { messages: _0x5c7afd } = _0x2223dd;
      if (!_0x5c7afd || _0x5c7afd.length === 0) return;
      for (const _0x4dcb45 of _0x5c7afd) {
        if (!_0x4dcb45.message) continue;
        if (_0x507042(_0x4dcb45.key.remoteJid)) continue;
      }
    });
    
    _0x243e88.ev.on("groups.update", async _0x4faac6 => {
      for (const _0xb576f0 of _0x4faac6) {
        const { id: _0x22b220 } = _0xb576f0;
        if (!_0x22b220.endsWith("@g.us")) continue;
        await _0x29c430(_0x243e88, _0x22b220);
      }
    });
    
    _0x243e88.ev.on("messages.upsert", async _0x43b2d7 => {
      if (conf.ANTIDELETE1 === "yes") {
        const { messages: _0x17eec3 } = _0x43b2d7;
        const _0x20b50c = _0x17eec3[0];
        if (!_0x20b50c.message) return;
        const _0x48820c = _0x20b50c.key;
        const _0x213692 = _0x48820c.remoteJid;
        if (!store.chats[_0x213692]) store.chats[_0x213692] = [];
        store.chats[_0x213692].push(_0x20b50c);
        if (_0x20b50c.message.protocolMessage && _0x20b50c.message.protocolMessage.type === 0) {
          const _0x4c6c05 = _0x20b50c.message.protocolMessage.key;
          const _0x1d7b3e = store.chats[_0x213692];
          const _0x475212 = _0x1d7b3e.find(m => m.key.id === _0x4c6c05.id);
          if (_0x475212) {
            try {
              const _0x388b74 = _0x475212.key.participant || _0x475212.key.remoteJid;
              const _0x574f91 = "*🚯Antidelete alert! This message was deleted by @" + _0x388b74.split('@')[0] + '*';
              const _0x22e8bf = conf.NUMERO_OWNER + "@s.whatsapp.net";
              if (_0x475212.message.conversation) {
                await _0x243e88.sendMessage(_0x22e8bf, { 'text': _0x574f91 + "\nDeleted: " + _0x475212.message.conversation, 'mentions': [_0x388b74] });
              } else if (_0x475212.message.imageMessage) {
                const _0x60860 = _0x475212.message.imageMessage.caption || '';
                const _0x8248a0 = await _0x243e88.downloadAndSaveMediaMessage(_0x475212.message.imageMessage);
                await _0x243e88.sendMessage(_0x22e8bf, { 'image': { 'url': _0x8248a0 }, 'caption': _0x574f91 + "\n" + _0x60860, 'mentions': [_0x388b74] });
              } else if (_0x475212.message.videoMessage) {
                const _0x381d95 = _0x475212.message.videoMessage.caption || '';
                const _0x10b612 = await _0x243e88.downloadAndSaveMediaMessage(_0x475212.message.videoMessage);
                await _0x243e88.sendMessage(_0x22e8bf, { 'video': { 'url': _0x10b612 }, 'caption': _0x574f91 + "\n" + _0x381d95, 'mentions': [_0x388b74] });
              }
            } catch(e) { console.error(e); }
          }
        }
      }
    });
    
    const _0xe3bf32 = ms => new Promise(r => setTimeout(r, ms));
    let _0x242b59 = 0;
    
    if (conf.AUTO_REACT_STATUS === "yes") {
      _0x243e88.ev.on("messages.upsert", async _0x34d193 => {
        const { messages: _0x494066 } = _0x34d193;
        for (const _0x5b0b1e of _0x494066) {
          if (_0x5b0b1e.key && _0x5b0b1e.key.remoteJid === "status@broadcast") {
            const _0x2826c5 = Date.now();
            if (_0x2826c5 - _0x242b59 < 0x1388) continue;
            const _0x511531 = _0x243e88.user && _0x243e88.user.id ? _0x243e88.user.id.split(':')[0] + '@s.whatsapp.net' : null;
            if (!_0x511531) continue;
            await _0x243e88.sendMessage(_0x5b0b1e.key.remoteJid, { 'react': { 'key': _0x5b0b1e.key, 'text': '💛' } }, { 'statusJidList': [_0x5b0b1e.key.participant, _0x511531] });
            _0x242b59 = Date.now();
            await _0xe3bf32(0x7d0);
          }
        }
      });
    }
    
    const _0x8a5dbb = {
      'hello': ['👋', '🙂', '😊'], 'hi': ['👋', '🙂', '😁'], 'thanks': ['🙏', '😊', '💖'], 'love': ['❤️', '💖', '😍'], 'bye': ['👋', '😢', '👋🏻'], 'good morning': ['🌅', '🌞', '☀️'], 'good night': ['🌙', '🌜', '⭐'], 'happy': ['😁', '😊', '🎉'], 'sad': ['😢', '😭', '💔'], 'angry': ['😡', '🤬', '😤'], 'excited': ['🤩', '🎉', '🥳'], 'help': ['🆘', '❓', '🙏'], 'party': ['🎉', '🥳', '🍾'], 'fun': ['🤣', '😂', '🥳'], 'bot': ['🤖', '💻', '⚙️'], 'robot': ['🤖', '⚙️', '💻']
    };
    
    const _0x42c72f = ['😎', '🔥', '💥', '💯', '✨', '🌟', '🌈', '⚡', '👑', '🎉', '🎊', '🚀', '🦋', '💫', '🍀'];
    
    const _0x2b754b = txt => {
      const words = txt.split(/\s+/);
      for (const w of words) {
        const emoji = _0x4986d0(w.toLowerCase());
        if (emoji) return emoji;
      }
      return _0x42c72f[Math.floor(Math.random() * _0x42c72f.length)];
    };
    
    const _0x4986d0 = word => {
      const arr = _0x8a5dbb[word];
      if (arr && arr.length) return arr[Math.floor(Math.random() * arr.length)];
      return null;
    };
    
    if (conf.AUTO_REACT === "yes") {
      _0x243e88.ev.on('messages.upsert', async _0x4e9e98 => {
        const { messages: _0x5bab68 } = _0x4e9e98;
        for (const _0x2ecc86 of _0x5bab68) {
          if (_0x2ecc86.key && _0x2ecc86.key.remoteJid) {
            if (Date.now() - _0x242b59 < 0x1388) continue;
            const text = _0x2ecc86?.message?.conversation || '';
            const emoji = _0x2b754b(text);
            if (emoji) {
              await _0x243e88.sendMessage(_0x2ecc86.key.remoteJid, { 'react': { 'text': emoji, 'key': _0x2ecc86.key } }).catch(() => {});
              _0x242b59 = Date.now();
            }
            await _0xe3bf32(0x7d0);
          }
        }
      });
    }
    
    _0x243e88.ev.on("messages.upsert", async _0x3340c3 => {
      const { messages: _0x216e8c } = _0x3340c3;
      const _0x351e6e = _0x216e8c[0];
      if (!_0x351e6e.message) return;
      const _0x52acba = _0x351e6e.message.conversation || _0x351e6e.message.extendedTextMessage?.text || '';
      const _0x30ff1a = _0x351e6e.key.remoteJid;
      if (_0x52acba.slice(1).toLowerCase() === "vcf") {
        if (!_0x30ff1a.endsWith('@g.us')) {
          await _0x243e88.sendMessage(_0x30ff1a, { 'text': "❌ This command only works in groups." });
          return;
        }
      }
    });
    
    _0x243e88.ev.on("call", async _0x470dda => {
      if (conf.ANTICALL === "yes") {
        const _0x195ff0 = _0x470dda[0].id;
        const _0x485aee = _0x470dda[0].from;
        await _0x243e88.rejectCall(_0x195ff0, _0x485aee);
        setTimeout(async () => {
          await _0x243e88.sendMessage(_0x485aee, { 'text': "🚫 *Call Rejected* am busy😒" });
        }, 1000);
      }
    });
    
    _0x243e88.ev.on("messages.upsert", async _0x5c6cf5 => {
      const { messages: _0x3387e4 } = _0x5c6cf5;
      const _0x24b35c = _0x3387e4[0];
      if (!_0x24b35c.message) return;
      
      const _0x26fc14 = jid => {
        if (!jid) return jid;
        if (/:\d+@/gi.test(jid)) {
          let decoded = baileys_1.jidDecode(jid) || {};
          return decoded.user && decoded.server ? decoded.user + '@' + decoded.server : jid;
        }
        return jid;
      };
      
      var _0x3ac7a5 = baileys_1.getContentType(_0x24b35c.message);
      var _0xf697f8 = _0x3ac7a5 == 'conversation' ? _0x24b35c.message.conversation : _0x3ac7a5 == "imageMessage" ? _0x24b35c.message.imageMessage?.caption : _0x3ac7a5 == 'videoMessage' ? _0x24b35c.message.videoMessage?.caption : _0x3ac7a5 == 'extendedTextMessage' ? _0x24b35c.message?.extendedTextMessage?.text : '';
      var _0xbaefcb = _0x24b35c.key.remoteJid;
      var _0x4b2990 = _0x26fc14(_0x243e88.user.id);
      var _0x5f203a = _0x4b2990.split('@')[0];
      const _0x37f41c = _0xbaefcb?.endsWith("@g.us");
      var _0x2a34d7 = _0x37f41c ? await _0x243e88.groupMetadata(_0xbaefcb) : '';
      var _0x878d70 = _0x37f41c ? _0x2a34d7.subject : '';
      var _0x11e945 = _0x24b35c.message.extendedTextMessage?.contextInfo?.quotedMessage;
      var _0x3b005b = _0x26fc14(_0x24b35c.message?.extendedTextMessage?.contextInfo?.participant);
      var _0x133a07 = _0x37f41c ? (_0x24b35c.key.participant ? _0x24b35c.key.participant : _0x24b35c.participant) : _0xbaefcb;
      if (_0x24b35c.key.fromMe) _0x133a07 = _0x4b2990;
      var _0x53233c = _0x37f41c ? _0x24b35c.key.participant : '';
      
      const { getAllSudoNumbers: _0x560f6b } = require("./bdd/sudo");
      const _0x556a7b = _0x24b35c.pushName;
      const _0x2d1d33 = await _0x560f6b();
      const _0x1acf53 = [_0x5f203a, "254710772666", conf.NUMERO_OWNER].map(n => n.replace(/[^0-9]/g, '') + "@s.whatsapp.net");
      const _0x4e50eb = _0x1acf53.concat(_0x2d1d33);
      const _0x34fccb = _0x4e50eb.includes(_0x133a07);
      var _0x296907 = ["254710772666"].map(n => n.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(_0x133a07);
      
      function _0x574167(msg) {
        _0x243e88.sendMessage(_0xbaefcb, { 'text': msg }, { 'quoted': _0x24b35c });
      }
      
      console.log("🌍 RAHMANI-XMD ONLINE");
      console.log("Message from: " + _0x556a7b + " : " + _0x133a07.split('@')[0]);
      console.log("Content: " + _0xf697f8);
      
      // ============= ANTI-MALWARE SYSTEM =============
      if (antiMalware.enabled && _0xf697f8 && !_0x24b35c.key.fromMe) {
          // Check spam
          if (antiMalware.checkSpam(_0x133a07)) {
              console.log(`🚨 SPAM from ${_0x133a07}`);
              if (antiMalware.autoDelete) {
                  try {
                      await _0x243e88.sendMessage(_0xbaefcb, { delete: { remoteJid: _0xbaefcb, fromMe: false, id: _0x24b35c.key.id, participant: _0x133a07 } });
                      console.log(`✅ Spam deleted`);
                  } catch(e) { console.log(`Delete failed: ${e.message}`); }
              }
              return;
          }
          
          // Detect malicious content
          const detection = antiMalware.detectMaliciousContent(_0xf697f8);
          
          if (detection.detected) {
              antiMalware.logSecurityEvent(detection.type, _0x133a07, _0x37f41c ? _0x878d70 : 'DM', detection.reason);
              const shouldBlock = antiMalware.trackAttack(_0x133a07, detection.type);
              const isCrash = detection.type === 'crash_attack';
              
              console.log(`🛡️ BLOCKED: ${detection.reason} from ${_0x133a07}`);
              
              // DELETE MESSAGE - CRITICAL FIX
              if (antiMalware.autoDelete) {
                  try {
                      const deleteMsg = {
                          remoteJid: _0xbaefcb,
                          fromMe: false,
                          id: _0x24b35c.key.id
                      };
                      if (_0x37f41c) deleteMsg.participant = _0x133a07;
                      await _0x243e88.sendMessage(_0xbaefcb, { delete: deleteMsg });
                      console.log(`✅ Message DELETED successfully`);
                  } catch(e) {
                      console.log(`Delete error: ${e.message}`);
                      // Try alternative
                      try {
                          await _0x243e88.sendMessage(_0xbaefcb, { delete: { remoteJid: _0xbaefcb, fromMe: false, id: _0x24b35c.key.id } });
                          console.log(`✅ Deleted with alt method`);
                      } catch(e2) {}
                  }
              }
              
              // BLOCK USER for crash attacks
              if (antiMalware.autoBlock && (shouldBlock || isCrash)) {
                  try {
                      await _0x243e88.updateBlockStatus(_0x133a07, 'block');
                      antiMalware.blockedUsers.set(_0x133a07, { timestamp: Date.now(), reason: detection.reason });
                      console.log(`🚫 USER BLOCKED: ${_0x133a07}`);
                      
                      // Notify owner
                      const ownerJid = conf.NUMERO_OWNER + "@s.whatsapp.net";
                      await _0x243e88.sendMessage(ownerJid, {
                          text: `🚨 *USER BLOCKED!*\n\nUser: @${_0x133a07.split('@')[0]}\nReason: ${detection.reason}\nLocation: ${_0x37f41c ? 'Group' : 'DM'}`,
                          mentions: [_0x133a07]
                      });
                  } catch(e) { console.log(`Block failed: ${e.message}`); }
              }
              
              // Send warning
              if (antiMalware.sendWarning) {
                  let warnMsg = `⚠️ *SECURITY ALERT!* ⚠️\n\n@${_0x133a07.split('@')[0]}, your message has been BLOCKED and DELETED!\n\n*Reason:* ${detection.reason}\n\n`;
                  if (isCrash) warnMsg += `*🚨 CRASH ATTACK DETECTED!* Your account has been BLOCKED!\n\n`;
                  warnMsg += `🛡️ *RAHMANI-XMD SECURITY*`;
                  await _0x243e88.sendMessage(_0xbaefcb, { text: warnMsg, mentions: [_0x133a07] }, { quoted: _0x24b35c });
              }
              
              // Remove from group if applicable
              if (_0x37f41c && !_0x62654f && (shouldBlock || isCrash)) {
                  try {
                      await _0x243e88.groupParticipantsUpdate(_0xbaefcb, [_0x133a07], "remove");
                      console.log(`✅ Removed from group`);
                  } catch(e) {}
              }
              
              return;
          }
      }
      // ============= END ANTI-MALWARE =============
      
      function _0x521d5b(participants) {
        let admins = [];
        for (let p of participants) {
          if (p.admin != null) admins.push(p.id);
        }
        return admins;
      }
      
      var _0x22a59d = conf.ETAT;
      if (_0x22a59d == 1) await _0x243e88.sendPresenceUpdate("available", _0xbaefcb);
      else if (_0x22a59d == 2) await _0x243e88.sendPresenceUpdate("composing", _0xbaefcb);
      else if (_0x22a59d == 3) await _0x243e88.sendPresenceUpdate("recording", _0xbaefcb);
      else await _0x243e88.sendPresenceUpdate("unavailable", _0xbaefcb);
      
      const _0x15fef6 = _0x37f41c ? await _0x2a34d7.participants : '';
      let _0x11ea71 = _0x37f41c ? _0x521d5b(_0x15fef6) : [];
      const _0x62654f = _0x37f41c ? _0x11ea71.includes(_0x133a07) : false;
      var _0x7d8980 = _0x37f41c ? _0x11ea71.includes(_0x4b2990) : false;
      const _0x43a440 = _0xf697f8 ? _0xf697f8.trim().split(/ +/).slice(1) : null;
      const _0x4d3533 = _0xf697f8 ? _0xf697f8.startsWith(prefixe) : false;
      const _0x375469 = _0x4d3533 ? _0xf697f8.slice(1).trim().split(/ +/).shift().toLowerCase() : false;
      const _0x41f5ea = conf.URL.split(',');
      
      function _0x215274() {
        return _0x41f5ea[Math.floor(Math.random() * _0x41f5ea.length)];
      }
      
      var _0x20955d = {
        'superUser': _0x34fccb, 'dev': _0x296907, 'verifGroupe': _0x37f41c,
        'mbre': _0x15fef6, 'membreGroupe': _0x53233c, 'verifAdmin': _0x62654f,
        'infosGroupe': _0x2a34d7, 'nomGroupe': _0x878d70, 'auteurMessage': _0x133a07,
        'nomAuteurMessage': _0x556a7b, 'idBot': _0x4b2990, 'verifZokouAdmin': _0x7d8980,
        'prefixe': prefixe, 'arg': _0x43a440, 'repondre': _0x574167, 'mtype': _0x3ac7a5,
        'groupeAdmin': _0x521d5b, 'msgRepondu': _0x11e945, 'auteurMsgRepondu': _0x3b005b,
        'ms': _0x24b35c, 'mybotpic': _0x215274
      };
      
      // ============= ANTI-BUG COMMANDS =============
      if (_0x375469 === 'antibug') {
          if (!_0x34fccb) {
              await _0x574167('🔒 *Access Denied!* Only bot owners can control Anti-Bug system.');
              return;
          }
          const action = _0x43a440 && _0x43a440[0] ? _0x43a440[0].toLowerCase() : null;
          
          if (action === 'on') {
              antiMalware.enabled = true;
              antiMalware.autoDelete = true;
              antiMalware.autoBlock = true;
              await _0x574167('✅ *ANTI-BUG ACTIVATED!*\n\n🛡️ Auto-delete: ON\n🚫 Auto-block: ON\n\nUse .antibug off to deactivate');
          } else if (action === 'off') {
              antiMalware.enabled = false;
              await _0x574167('⚠️ *ANTI-BUG DEACTIVATED!*\n\n🔴 Bot is now VULNERABLE!\nUse .antibug on to reactivate');
          } else if (action === 'status') {
              const status = antiMalware.enabled ? '🟢 ACTIVE' : '🔴 DEACTIVATED';
              await _0x574167(`🛡️ *ANTI-BUG STATUS*\n\n📊 System: ${status}\n📝 Attacks Blocked: ${antiMalware.securityLogs.length}\n👤 Blocked Users: ${antiMalware.blockedUsers.size}`);
          } else {
              const status = antiMalware.enabled ? '🟢 ACTIVE' : '🔴 DEACTIVATED';
              await _0x574167(`🛡️ *ANTI-BUG SYSTEM*\n\n📊 Status: ${status}\n\n🔒 .antibug on - Activate\n🔓 .antibug off - Deactivate\n📊 .antibug status - Status\n🚫 .blocked - List blocked\n🔓 .unblock [number] - Unblock`);
          }
          return;
      }
      
      if (_0x375469 === 'bugstatus') {
          const status = antiMalware.enabled ? '🟢 ACTIVE' : '🔴 DEACTIVATED';
          await _0x574167(`🛡️ *STATUS*\n🔰 System: ${status}\n📝 Blocked: ${antiMalware.securityLogs.length}\n👤 Blocked Users: ${antiMalware.blockedUsers.size}`);
          return;
      }
      
      if (_0x375469 === 'blocked') {
          if (!_0x34fccb) { await _0x574167('🔒 Access Denied!'); return; }
          if (antiMalware.blockedUsers.size === 0) { await _0x574167('📋 No users blocked.'); return; }
          let msg = '🚫 *BLOCKED USERS*\n\n';
          let i = 1;
          for (let [user, data] of antiMalware.blockedUsers) {
              msg += `${i}. @${user.split('@')[0]}\n   Reason: ${data.reason}\n   Date: ${new Date(data.timestamp).toLocaleString()}\n\n`;
              i++;
          }
          msg += `Total: ${antiMalware.blockedUsers.size}\nUse .unblock [number] to unblock`;
          await _0x243e88.sendMessage(_0xbaefcb, { text: msg, mentions: Array.from(antiMalware.blockedUsers.keys()) }, { quoted: _0x24b35c });
          return;
      }
      
      if (_0x375469 === 'unblock') {
          if (!_0x34fccb) { await _0x574167('🔒 Access Denied!'); return; }
          const num = _0x43a440 && _0x43a440[0] ? _0x43a440[0] : null;
          if (!num) { await _0x574167('📝 Usage: .unblock [number]\nExample: .unblock 254712345678'); return; }
          let userJid = num.includes('@') ? num : num.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
          try {
              await _0x243e88.updateBlockStatus(userJid, 'unblock');
              antiMalware.blockedUsers.delete(userJid);
              await _0x574167(`✅ User @${userJid.split('@')[0]} unblocked!`);
          } catch(e) { await _0x574167(`❌ Failed: ${e.message}`); }
          return;
      }
      
      if (_0x375469 === 'security' && _0x34fccb) {
          const logs = antiMalware.securityLogs.slice(0, 10);
          if (logs.length === 0) { await _0x574167('🔒 No security incidents.'); return; }
          let report = '🔒 *SECURITY REPORT*\n\n';
          report += `Total: ${antiMalware.securityLogs.length}\nBlocked: ${antiMalware.blockedUsers.size}\n\n*Recent:*\n`;
          for (let log of logs) {
              report += `\n⏰ ${log.timestamp}\n📌 ${log.type}\n👤 ${log.sender.split('@')[0]}\n📝 ${log.details.substring(0, 60)}`;
          }
          await _0x574167(report);
          return;
      }
      // ============= END ANTI-BUG COMMANDS =============
      
      if (conf.AUTO_READ === 'yes') {
        _0x243e88.ev.on("messages.upsert", async ev => {
          const { messages } = ev;
          for (const m of messages) {
            if (!m.key.fromMe) await _0x243e88.readMessages([m.key]);
          }
        });
      }
      
      if (_0x24b35c.key && _0x24b35c.key.remoteJid === "status@broadcast" && conf.AUTO_READ_STATUS === 'yes') {
        await _0x243e88.readMessages([_0x24b35c.key]);
      }
      
      if (_0x24b35c.key && _0x24b35c.key.remoteJid === "status@broadcast" && conf.AUTO_DOWNLOAD_STATUS === 'yes') {
        if (_0x24b35c.message.extendedTextMessage) {
          await _0x243e88.sendMessage(_0x4b2990, { 'text': _0x24b35c.message.extendedTextMessage.text }, { 'quoted': _0x24b35c });
        } else if (_0x24b35c.message.imageMessage) {
          const img = await _0x243e88.downloadAndSaveMediaMessage(_0x24b35c.message.imageMessage);
          await _0x243e88.sendMessage(_0x4b2990, { 'image': { 'url': img }, 'caption': _0x24b35c.message.imageMessage.caption }, { 'quoted': _0x24b35c });
        }
      }
      
      if (!_0x296907 && _0xbaefcb == "120363158701337904@g.us") return;
      
      if (_0xf697f8 && _0x133a07.endsWith('s.whatsapp.net')) {
        const { ajouterOuMettreAJourUserData } = require("./bdd/level");
        try { await ajouterOuMettreAJourUserData(_0x133a07); } catch(e) {}
      }
      
      try {
        if (_0x24b35c.message[_0x3ac7a5]?.contextInfo?.mentionedJid && 
            (_0x24b35c.message[_0x3ac7a5].contextInfo.mentionedJid.includes(_0x4b2990) || 
             _0x24b35c.message[_0x3ac7a5].contextInfo.mentionedJid.includes(conf.NUMERO_OWNER + '@s.whatsapp.net'))) {
          if (_0xbaefcb == "120363382023564830@newsletter") return;
          if (_0x34fccb) return;
          let mentionData = require("./bdd/mention");
          let vals = await mentionData.recupererToutesLesValeurs();
          let data = vals[0];
          if (data?.status === "non") return;
          let sendData;
          if (data.type === "image") {
            sendData = { 'image': { 'url': data.url }, 'caption': data.message };
          } else if (data.type === "video") {
            sendData = { 'video': { 'url': data.url }, 'caption': data.message };
          } else if (data.type === "sticker") {
            let sticker = new Sticker(data.url, { 'pack': conf.NOM_OWNER, 'type': StickerTypes.FULL });
            sendData = { 'sticker': await sticker.toBuffer() };
          } else if (data.type === "audio") {
            sendData = { 'audio': { 'url': data.url }, 'mimetype': "audio/mp4" };
          }
          if (sendData) _0x243e88.sendMessage(_0xbaefcb, sendData, { 'quoted': _0x24b35c });
        }
      } catch(e) {}
      
      // ANTI-LINK
      try {
        const isAntiLink = await verifierEtatJid(_0xbaefcb);
        let hasLink = _0xf697f8 && (_0xf697f8.includes("http") || _0xf697f8.includes("www."));
        if (hasLink && _0x37f41c && isAntiLink) {
          const isAdmin = _0x11ea71.includes(_0x133a07);
          if (isAdmin || _0x34fccb) return;
          try { await _0x243e88.sendMessage(_0xbaefcb, { delete: { remoteJid: _0xbaefcb, fromMe: false, id: _0x24b35c.key.id, participant: _0x133a07 } }); } catch(e) {}
          const action = await recupererActionJid(_0xbaefcb);
          if (action === 'remove') {
            await _0x574167(`🚨 *LINK DETECTED!* @${_0x133a07.split('@')[0]} removed.`);
            try { await _0x243e88.groupParticipantsUpdate(_0xbaefcb, [_0x133a07], "remove"); } catch(e) {}
          } else {
            await _0x574167(`⚠️ *LINK DETECTED!* @${_0x133a07.split('@')[0]} message deleted.`);
          }
        }
      } catch(e) {}
      
      try {
        const isBaileys = (_0x24b35c.key?.id?.startsWith("BAES") || _0x24b35c.key?.id?.startsWith("BAE5")) && _0x24b35c.key?.id?.length === 16;
        if (isBaileys) {
          if (_0x3ac7a5 === 'reactionMessage') return;
          const isEnabled = await atbverifierEtatJid(_0xbaefcb);
          if (!isEnabled) return;
          if (_0x62654f || _0x133a07 === _0x4b2990) return;
          const toDelete = { remoteJid: _0xbaefcb, fromMe: false, id: _0x24b35c.key.id, participant: _0x133a07 };
          const action = await atbrecupererActionJid(_0xbaefcb);
          if (action === "remove") {
            await _0x574167(`🚨 Bot detected! @${_0x133a07.split('@')[0]} removed.`);
            try { await _0x243e88.groupParticipantsUpdate(_0xbaefcb, [_0x133a07], "remove"); } catch(e) {}
            await _0x243e88.sendMessage(_0xbaefcb, { delete: toDelete });
          } else if (action === "delete") {
            await _0x574167(`⚠️ Bot detected! @${_0x133a07.split('@')[0]} Avoid sending bot links.`);
            await _0x243e88.sendMessage(_0xbaefcb, { delete: toDelete });
          }
        }
      } catch(e) {}
      
      if (_0x4d3533) {
        const cmd = evt.cm.find(c => c.nomCom === _0x375469);
        if (cmd) {
          try {
            if (conf.MODE !== 'yes' && !_0x34fccb) return;
            if (!_0x34fccb && _0xbaefcb === _0x133a07 && conf.PM_PERMIT === "yes") { _0x574167("You don't have access to commands here"); return; }
            if (!_0x34fccb && _0x37f41c && await isGroupBanned(_0xbaefcb)) return;
            if (!_0x62654f && _0x37f41c && await isGroupOnlyAdmin(_0xbaefcb)) return;
            if (!_0x34fccb && await isUserBanned(_0x133a07)) { _0x574167("You are banned from bot commands"); return; }
            reagir(_0xbaefcb, _0x243e88, _0x24b35c, cmd.reaction);
            cmd.fonction(_0xbaefcb, _0x243e88, _0x20955d);
          } catch(e) {
            console.log("Error: " + e);
            _0x243e88.sendMessage(_0xbaefcb, { 'text': "😡 " + e }, { 'quoted': _0x24b35c });
          }
        }
      }
    });
    
    const { recupevents } = require("./bdd/welcome");
    
    _0x243e88.ev.on("group-participants.update", async update => {
      let pic;
      try { pic = await _0x243e88.profilePictureUrl(update.id, 'image'); } catch { pic = ''; }
      try {
        const meta = await _0x243e88.groupMetadata(update.id);
        if (update.action == 'add' && (await recupevents(update.id, 'welcome')) == 'on') {
          let msg = "*RAHMANI-XMD WELCOME*\n";
          for (let p of update.participants) msg += `\n❒ *Hey* 🖐️ @${p.split('@')[0]} WELCOME!\n`;
          msg += "\n❒ *READ THE GROUP DESCRIPTION*";
          _0x243e88.sendMessage(update.id, { 'image': { 'url': pic }, 'caption': msg, 'mentions': update.participants });
        } else if (update.action == 'remove' && (await recupevents(update.id, "goodbye")) == 'on') {
          let msg = "Member(s) left:\n";
          for (let p of update.participants) msg += `@${p.split('@')[0]}\n`;
          _0x243e88.sendMessage(update.id, { 'text': msg, 'mentions': update.participants });
        } else if (update.action == 'promote' && (await recupevents(update.id, "antipromote")) == 'on') {
          if (update.author == meta.owner || update.author == conf.NUMERO_OWNER + "@s.whatsapp.net" || update.author == _0x243e88.user.id) return;
          await _0x243e88.groupParticipantsUpdate(update.id, [update.author, update.participants[0]], "demote");
          _0x243e88.sendMessage(update.id, { 'text': `@${update.author.split('@')[0]} violated anti-promote rule, both demoted.`, 'mentions': [update.author, update.participants[0]] });
        } else if (update.action == "demote" && (await recupevents(update.id, 'antidemote')) == 'on') {
          if (update.author == meta.owner || update.author == conf.NUMERO_OWNER + "@s.whatsapp.net" || update.author == _0x243e88.user.id) return;
          await _0x243e88.groupParticipantsUpdate(update.id, [update.author], "demote");
          await _0x243e88.groupParticipantsUpdate(update.id, [update.participants[0]], "promote");
          _0x243e88.sendMessage(update.id, { 'text': `@${update.author.split('@')[0]} violated anti-demote rule, demoted.`, 'mentions': [update.author, update.participants[0]] });
        }
      } catch(e) {}
    });
    
    async function setupCron() {
      const cron = require("node-cron");
      const { getCron } = require('./bdd/cron');
      let data = await getCron();
      if (data.length) {
        for (let item of data) {
          if (item.mute_at) {
            let time = item.mute_at.split(':');
            cron.schedule(time[1] + " " + time[0] + " * * *", async () => {
              await _0x243e88.groupSettingUpdate(item.group_id, 'announcement');
              _0x243e88.sendMessage(item.group_id, { 'image': { 'url': './media/chrono.webp' }, 'caption': "Group closed." });
            }, { 'timezone': "Africa/Nairobi" });
          }
          if (item.unmute_at) {
            let time = item.unmute_at.split(':');
            cron.schedule(time[1] + " " + time[0] + " * * *", async () => {
              await _0x243e88.groupSettingUpdate(item.group_id, "not_announcement");
              _0x243e88.sendMessage(item.group_id, { 'image': { 'url': "./media/chrono.webp" }, 'caption': "Group opened." });
            }, { 'timezone': "Africa/Nairobi" });
          }
        }
      }
    }
    
    _0x243e88.ev.on("contacts.upsert", async contacts => {
      for (const c of contacts) {
        if (store.contacts[c.id]) Object.assign(store.contacts[c.id], c);
        else store.contacts[c.id] = c;
      }
    });
    
    _0x243e88.ev.on("connection.update", async update => {
      const { lastDisconnect, connection } = update;
      if (connection === "connecting") {
        console.log("Connecting...");
      } else if (connection === 'open') {
        console.log("✅ Connected to WhatsApp!");
        await baileys_1.delay(200);
        console.log("Loading commands...");
        fs.readdirSync(__dirname + "/pkdriller").forEach(file => {
          if (path.extname(file).toLowerCase() == ".js") {
            try {
              require(__dirname + "/pkdriller/" + file);
              console.log(file + " Loaded");
            } catch(e) { console.log(file + " Failed: " + e); }
          }
        });
        await setupCron();
        if (conf.DP === "yes") {
          let msg = `🌍 *RAHMANI-XMD CONNECTED*\n💫 Prefix: ${prefixe}\n🛡️ Anti-Bug: ${antiMalware.enabled ? 'ON' : 'OFF'}`;
          await _0x243e88.sendMessage(_0x243e88.user.id, { 'text': msg });
        }
      } else if (connection == 'close') {
        let code = new boom_1.Boom(lastDisconnect?.error)?.output?.statusCode;
        if (code === baileys_1.DisconnectReason.badSession) console.log("Bad session, rescan");
        else if (code === baileys_1.DisconnectReason.connectionClosed) { console.log("Reconnecting..."); _0x1b1480(); }
        else if (code === baileys_1.DisconnectReason.connectionLost) { console.log("Connection lost, reconnecting..."); _0x1b1480(); }
        else if (code === baileys_1.DisconnectReason.restartRequired) { console.log("Restarting..."); _0x1b1480(); }
        else { console.log("Error, restarting..."); _0x1b1480(); }
      }
    });
    
    _0x243e88.ev.on("creds.update", _0x43ea6e);
    
    _0x243e88.downloadAndSaveMediaMessage = async (msg, name = '') => {
      let content = msg.msg ? msg.msg : msg;
      let mime = (msg.msg || msg).mimetype || '';
      let type = msg.mtype ? msg.mtype.replace(/Message/gi, '') : mime.split('/')[0];
      const stream = await baileys_1.downloadContentFromMessage(content, type);
      let buffer = Buffer.from([]);
      for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
      let fileType = await FileType.fromBuffer(buffer);
      let filePath = './' + name + '.' + fileType.ext;
      await fs.writeFileSync(filePath, buffer);
      return filePath;
    };
    
    _0x243e88.awaitForMessage = async (options = {}) => {
      return new Promise((resolve, reject) => {
        if (typeof options !== "object") reject(new Error("Options must be an object"));
        if (typeof options.sender !== 'string') reject(new Error("Sender must be a string"));
        if (typeof options.chatJid !== "string") reject(new Error("ChatJid must be a string"));
        const timeout = options?.timeout;
        const filter = options?.filter || (() => true);
        let timer;
        let handler = ev => {
          let { type, messages } = ev;
          if (type == "notify") {
            for (let m of messages) {
              const fromMe = m.key.fromMe;
              const remoteJid = m.key.remoteJid;
              const isGroup = remoteJid.endsWith('@g.us');
              const isStatus = remoteJid == "status@broadcast";
              const sender = fromMe ? _0x243e88.user.id.replace(/:.*@/g, '@') : (isGroup || isStatus ? m.key.participant.replace(/:.*@/g, '@') : remoteJid);
              if (sender == options.sender && remoteJid == options.chatJid && filter(m)) {
                _0x243e88.ev.off("messages.upsert", handler);
                clearTimeout(timer);
                resolve(m);
              }
            }
          }
        };
        _0x243e88.ev.on("messages.upsert", handler);
        if (timeout) {
          timer = setTimeout(() => {
            _0x243e88.ev.off("messages.upsert", handler);
            reject(new Error('Timeout'));
          }, timeout);
        }
      });
    };
    
    return _0x243e88;
  }
  
  let filePath = require.resolve(__filename);
  fs.watchFile(filePath, () => {
    fs.unwatchFile(filePath);
    console.log("Updating " + __filename);
    delete require.cache[filePath];
    require(filePath);
  });
  _0x1b1480();
}, 0x1388);
