"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
  var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc); 
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const baileys_1 = __importStar(require("@whiskeysockets/baileys"));
const logger_1 = __importDefault(require("@whiskeysockets/baileys/lib/Utils/logger"));
const logger = logger_1.default.child({});
logger.level = 'silent';
const pino = require("pino");
const boom_1 = require("@hapi/boom");
const conf = require("./set");
const axios = require("axios");
let fs = require("fs-extra");
let path = require("path");
const FileType = require('file-type');
const { Sticker, StickerTypes } = require('wa-sticker-formatter');
const { verifierEtatJid , recupererActionJid } = require("./bdd/antilien");
const { atbverifierEtatJid , atbrecupererActionJid } = require("./bdd/antibot");
let evt = require(__dirname + "/framework/zokou");
const {isUserBanned , addUserToBanList , removeUserFromBanList} = require("./bdd/banUser");
const  {addGroupToBanList,isGroupBanned,removeGroupFromBanList} = require("./bdd/banGroup");
const {isGroupOnlyAdmin,addGroupToOnlyAdminList,removeGroupFromOnlyAdminList} = require("./bdd/onlyAdmin");
let { reagir } = require(__dirname + "/framework/app");
var session = conf.session.replace(/Zokou-MD-WHATSAPP-BOT;;;=>/g,"");
const prefixe = conf.PREFIXE;
const more = String.fromCharCode(8206)
const readmore = more.repeat(4001)

// Memory Optimization
if (global.gc) {
    setInterval(() => { global.gc(); }, 30000);
}

async function authentification() {
    try {
        if (!fs.existsSync(__dirname + "/scan/creds.json")) {
            console.log("connexion en cour ...");
            await fs.writeFileSync(__dirname + "/scan/creds.json", atob(session), "utf8");
        }
        else if (fs.existsSync(__dirname + "/scan/creds.json") && session != "zokk") {
            await fs.writeFileSync(__dirname + "/scan/creds.json", atob(session), "utf8");
        }
    }
    catch (e) {
        console.log("Session Invalid " + e);
        return;
    }
}
authentification();
const store = (0, baileys_1.makeInMemoryStore)({
    logger: pino().child({ level: "silent", stream: "store" }),
});

// Clean store periodically
setInterval(() => {
    if (store && store.messages) {
        for (const [jid, messages] of store.messages.entries()) {
            if (messages && messages.length > 50) {
                store.messages.set(jid, messages.slice(-50));
            }
        }
    }
}, 60000);

setTimeout(() => {
authentification();
    async function main() {
        const { version, isLatest } = await (0, baileys_1.fetchLatestBaileysVersion)();
        const { state, saveCreds } = await (0, baileys_1.useMultiFileAuthState)(__dirname + "/scan");
        const sockOptions = {
            version,
            logger: pino({ level: "silent" }),
            browser: ['Rahmani-Md', "safari", "1.0.0"],
            printQRInTerminal: true,
            fireInitQueries: false,
            shouldSyncHistoryMessage: true,
            downloadHistory: true,
            syncFullHistory: true,
            generateHighQualityLinkPreview: true,
            markOnlineOnConnect: false,
            keepAliveIntervalMs: 30_000,
            auth: {
                creds: state.creds,
                keys: (0, baileys_1.makeCacheableSignalKeyStore)(state.keys, logger),
            },
            getMessage: async (key) => {
                if (store) {
                    const msg = await store.loadMessage(key.remoteJid, key.id, undefined);
                    return msg.message || undefined;
                }
                return {
                    conversation: 'An Error Occurred, Repeat Command!'
                };
            }
        };

   const zk = (0, baileys_1.default)(sockOptions);
   store.bind(zk.ev);

// Simple Bio Update (punguza frequency)
setInterval(async () => {
    if (conf.AUTO_BIO === "yes") {
        const date = new Date().toLocaleString('en-KE', { timeZone: 'Africa/Dar_es_Salaam' });
        await zk.updateProfileStatus(`Rahmani MD 🚗 | ${date}`);
    }
}, 120000); // Dakika 2

// Anti-call
zk.ev.on("call", async (callData) => {
    if (conf.ANTICALL === 'yes') {
        const callId = callData[0].id;
        const callerId = callData[0].from;
        await zk.rejectCall(callId, callerId);
        await zk.sendMessage(callerId, { text: "Hello😊, I'm Rahmani-xmd, please try again later" });
    }
});

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
let lastReactionTime = 0;

// Simple emoji reactions (punguza sana)
const emojiMap = {
    "hello": ["👋", "😊"],
    "hi": ["👋", "🙂"],
    "bye": ["👋", "😢"],
    "thanks": ["🙏", "😊"],
    "love": ["❤️", "💕"],
    "happy": ["😊", "🎉"],
    "sad": ["😢", "😔"],
    "good morning": ["🌅", "🌞"],
    "good night": ["🌙", "🌜"],
    "bro": ["🤜🤛", "👊"],
    "bot": ["🤖", "💻"],
    "help": ["🆘", "❓"]
};

const fallbackEmojis = ["😎", "🔥", "💥", "💯", "✨", "🌟"];

const getEmojiForSentence = (sentence) => {
    const words = sentence.toLowerCase().split(/\s+/);
    for (const word of words) {
        const emojis = emojiMap[word];
        if (emojis && emojis.length > 0) {
            return emojis[Math.floor(Math.random() * emojis.length)];
        }
    }
    return fallbackEmojis[Math.floor(Math.random() * fallbackEmojis.length)];
};

// Auto-react (punguza)
if (conf.AUTO_REACT === "yes") {
    zk.ev.on("messages.upsert", async (m) => {
        const { messages } = m;
        for (const message of messages) {
            if (message.key && message.key.remoteJid && !message.key.fromMe && Date.now() - lastReactionTime > 5000) {
                const text = message?.message?.conversation || "";
                if (text) {
                    const emoji = getEmojiForSentence(text);
                    await zk.sendMessage(message.key.remoteJid, {
                        react: { text: emoji, key: message.key }
                    }).catch(() => {});
                    lastReactionTime = Date.now();
                    await delay(2000);
                }
            }
        }
    });
}

// Simple audio reply (punguza sana)
const audioMap = {
    "hello": "files/hello.wav",
    "hi": "files/hey.wav",
    "morning": "files/goodmorning.wav",
    "night": "files/goodnight.wav",
    "bot": "files/fred.mp3"
};

const getAudioForSentence = (sentence) => {
    const words = sentence.toLowerCase().split(/\s+/);
    for (const word of words) {
        if (audioMap[word]) return audioMap[word];
    }
    return null;
};

if (conf.AUDIO_REPLY === "yes") {
    zk.ev.on("messages.upsert", async (m) => {
        const { messages } = m;
        for (const message of messages) {
            if (message.key && message.key.remoteJid && !message.key.fromMe) {
                const text = message?.message?.conversation || "";
                const audioFile = getAudioForSentence(text);
                if (audioFile && fs.existsSync(audioFile)) {
                    await zk.sendMessage(message.key.remoteJid, {
                        audio: { url: audioFile },
                        mimetype: "audio/mp4",
                        ptt: true
                    }).catch(() => {});
                    await delay(3000);
                }
            }
        }
    });
}
      
// Main message handler
zk.ev.on("messages.upsert", async (m) => {
    const { messages } = m;
    const ms = messages[0];
    if (!ms.message) return;
    
    const decodeJid = (jid) => {
        if (!jid) return jid;
        if (/:\d+@/gi.test(jid)) {
            let decode = (0, baileys_1.jidDecode)(jid) || {};
            return decode.user && decode.server && decode.user + '@' + decode.server || jid;
        }
        return jid;
    };
    
    var mtype = (0, baileys_1.getContentType)(ms.message);
    var texte = mtype == "conversation" ? ms.message.conversation : 
                mtype == "extendedTextMessage" ? ms.message?.extendedTextMessage?.text : "";
    var origineMessage = ms.key.remoteJid;
    var idBot = decodeJid(zk.user.id);
    var servBot = idBot.split('@')[0];
    const verifGroupe = origineMessage?.endsWith("@g.us");
    var infosGroupe = verifGroupe ? await zk.groupMetadata(origineMessage) : "";
    var nomGroupe = verifGroupe ? infosGroupe.subject : "";
    var auteurMessage = verifGroupe ? (ms.key.participant ? ms.key.participant : ms.participant) : origineMessage;
    if (ms.key.fromMe) auteurMessage = idBot;
    
    const nomAuteurMessage = ms.pushName;
    const sudo = await require("./bdd/sudo").getAllSudoNumbers();
    const superUserNumbers = [servBot, conf.NUMERO_OWNER].map((s) => s.replace(/[^0-9]/g) + "@s.whatsapp.net");
    const allAllowedNumbers = superUserNumbers.concat(sudo);
    const superUser = allAllowedNumbers.includes(auteurMessage);
    
    function repondre(mes) { zk.sendMessage(origineMessage, { text: mes }, { quoted: ms }); }
    
    console.log("Message from:", nomAuteurMessage, "Type:", mtype);
    
    function groupeAdmin(membreGroupe) {
        let admin = [];
        for (let m of membreGroupe) {
            if (m.admin) admin.push(m.id);
        }
        return admin;
    }

    // Presence update
    const etat = conf.ETAT;
    if (etat == 1) await zk.sendPresenceUpdate("available", origineMessage);
    else if (etat == 2) await zk.sendPresenceUpdate("composing", origineMessage);
    else if (etat == 3) await zk.sendPresenceUpdate("recording", origineMessage);
    else await zk.sendPresenceUpdate("unavailable", origineMessage);

    const mbre = verifGroupe ? await infosGroupe.participants : '';
    let admins = verifGroupe ? groupeAdmin(mbre) : '';
    const verifAdmin = verifGroupe ? admins.includes(auteurMessage) : false;
    var verifZokouAdmin = verifGroupe ? admins.includes(idBot) : false;

    const arg = texte ? texte.trim().split(/ +/).slice(1) : null;
    const verifCom = texte ? texte.startsWith(prefixe) : false;
    const com = verifCom ? texte.slice(1).trim().split(/ +/).shift().toLowerCase() : false;

    const lien = conf.URL.split(',');
    function mybotpic() {
        return lien[Math.floor(Math.random() * lien.length)];
    }

    var commandeOptions = {
        superUser, verifGroupe, mbre, verifAdmin, infosGroupe, nomGroupe,
        auteurMessage, nomAuteurMessage, idBot, verifZokouAdmin, prefixe,
        arg, repondre, mtype, groupeAdmin, ms, mybotpic
    };
    
    // Auto read
    if (conf.AUTO_READ === 'yes' && !ms.key.fromMe) {
        await zk.readMessages([ms.key]);
    }
    
    // Anti-link
    try {
        const yes = await verifierEtatJid(origineMessage);
        if (texte && texte.includes('https://') && verifGroupe && yes && !superUser && !verifAdmin && verifZokouAdmin) {
            const key = { remoteJid: origineMessage, fromMe: false, id: ms.key.id, participant: auteurMessage };
            const action = await recupererActionJid(origineMessage);
            if (action === 'remove') {
                await zk.sendMessage(origineMessage, { text: `⚠️ Link detected! @${auteurMessage.split("@")[0]} removed.`, mentions: [auteurMessage] });
                await zk.groupParticipantsUpdate(origineMessage, [auteurMessage], "remove");
                await zk.sendMessage(origineMessage, { delete: key });
            } else if (action === 'delete') {
                await zk.sendMessage(origineMessage, { text: `⚠️ Link detected! Message deleted.`, mentions: [auteurMessage] });
                await zk.sendMessage(origineMessage, { delete: key });
            }
        }
    } catch (e) { console.log("Anti-link error:", e); }
    
    // Anti-bot
    try {
        const botMsg = ms.key?.id?.startsWith('BAES') && ms.key?.id?.length === 16;
        if (botMsg && verifGroupe && !verifAdmin && auteurMessage !== idBot) {
            const antibotactiver = await atbverifierEtatJid(origineMessage);
            if (antibotactiver) {
                const action = await atbrecupererActionJid(origineMessage);
                if (action === 'remove') {
                    await zk.groupParticipantsUpdate(origineMessage, [auteurMessage], "remove");
                }
            }
        }
    } catch (er) { console.log('Anti-bot error:', er); }
    
    // Execute commands
    if (verifCom) {
        const cd = evt.cm.find((zokou) => zokou.nomCom === com);
        if (cd) {
            try {
                if (conf.MODE?.toLowerCase() !== 'yes' && !superUser) return;
                if (!superUser && origineMessage === auteurMessage && conf.PM_PERMIT === "yes") {
                    repondre("You don't have access to commands here");
                    return;
                }
                if (!superUser && verifGroupe) {
                    if (await isGroupBanned(origineMessage)) return;
                }
                if (!verifAdmin && verifGroupe) {
                    if (await isGroupOnlyAdmin(origineMessage)) return;
                }
                if (!superUser) {
                    if (await isUserBanned(auteurMessage)) {
                        repondre("You are banned from bot commands");
                        return;
                    }
                }
                reagir(origineMessage, zk, ms, cd.reaction);
                cd.fonction(origineMessage, zk, commandeOptions);
            } catch (e) {
                console.log("Command error:", e);
                zk.sendMessage(origineMessage, { text: "Error: " + e }, { quoted: ms });
            }
        }
    }
});

// Group events
const { recupevents } = require('./bdd/welcome');
zk.ev.on('group-participants.update', async (group) => {
    let ppgroup;
    try {
        ppgroup = await zk.profilePictureUrl(group.id, 'image');
    } catch {
        ppgroup = 'https://files.catbox.moe/aktbgo.jpg';
    }
    try {
        const metadata = await zk.groupMetadata(group.id);
        if (group.action == 'add' && (await recupevents(group.id, "welcome") == 'on')) {
            let msg = `👋 Welcome to ${metadata.subject}!\n`;
            let membres = group.participants;
            for (let membre of membres) {
                msg += ` @${membre.split("@")[0]}`;
            }
            zk.sendMessage(group.id, { image: { url: ppgroup }, caption: msg, mentions: membres });
        }
    } catch (e) {
        console.error(e);
    }
});

// Connection update
zk.ev.on("connection.update", async (con) => {
    const { lastDisconnect, connection } = con;
    if (connection === "connecting") {
        console.log("Connecting...");
    }
    else if (connection === 'open') {
        console.log("✅ Connected to WhatsApp!");
        console.log("Loading commands...");
        fs.readdirSync(__dirname + "/pkdriller").forEach((fichier) => {
            if (path.extname(fichier).toLowerCase() === ".js") {
                try {
                    require(__dirname + "/pkdriller/" + fichier);
                    console.log(fichier + " loaded");
                } catch (e) {
                    console.log(`${fichier} error: ${e}`);
                }
            }
        });
        
        // FIX: Define missing variables
        const herokuAppName = process.env.HEROKU_APP_NAME || "Rahmani-MD";
        const herokuAppLink = process.env.HEROKU_APP_URL || `https://${herokuAppName}.herokuapp.com`;
        const botOwner = conf.NUMERO_OWNER || "255752593977";
        
        if (conf.DP?.toLowerCase() === 'yes') {
            let cmsg = `🤖 BOT CONNECTED\n\nPrefix: ${prefixe}\nMode: ${conf.MODE === 'yes' ? 'Public' : 'Private'}\nHeroku: ${herokuAppName}\nOwner: ${botOwner}`;
            await zk.sendMessage(zk.user.id, { text: cmsg });
        }
    }
    else if (connection == "close") {
        let reason = new boom_1.Boom(lastDisconnect?.error)?.output.statusCode;
        console.log("Connection closed:", reason);
        setTimeout(main, 5000);
    }
});

zk.ev.on("creds.update", saveCreds);

// Download media function
zk.downloadAndSaveMediaMessage = async (message, filename = '') => {
    let quoted = message.msg ? message.msg : message;
    let mime = (message.msg || message).mimetype || '';
    let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0];
    const stream = await (0, baileys_1.downloadContentFromMessage)(quoted, messageType);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
    }
    let type = await FileType.fromBuffer(buffer);
    let trueFileName = './' + filename + '.' + type.ext;
    await fs.writeFileSync(trueFileName, buffer);
    return trueFileName;
};

return zk;
}
    let fichier = require.resolve(__filename);
    fs.watchFile(fichier, () => {
        fs.unwatchFile(fichier);
        console.log(`Updating ${__filename}`);
        delete require.cache[fichier];
        require(fichier);
    });
    main();
}, 5000);
