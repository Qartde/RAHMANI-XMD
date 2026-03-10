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

// ============ IMPORT ANTILINK FUNCTIONS ============
const { handleAntilink } = require("./commandes/antilink");

var session = conf.session.replace(/Zokou-MD-WHATSAPP-BOT;;;=>/g,"");
const prefixe = conf.PREFIXE;
const more = String.fromCharCode(8206);
const readmore = more.repeat(4001);
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

// ============ ENSURE BDD FOLDER EXISTS ============
if (!fs.existsSync('./bdd')) {
    fs.mkdirSync('./bdd');
    console.log("✅ bdd folder created");
}
// ============ END ============

async function authentification() {
    try {
        if (!fs.existsSync(__dirname + "/scan/creds.json")) {
            console.log("Connecting...");
            await fs.writeFileSync(__dirname + "/scan/creds.json", atob(session), "utf8");
        }
        else if (fs.existsSync(__dirname + "/scan/creds.json") && session != "zokk") {
            await fs.writeFileSync(__dirname + "/scan/creds.json", atob(session), "utf8");
        }
    }
    catch (e) {
        console.log("Session Invalid: " + e);
        return;
    }
}
authentification();

const store = (0, baileys_1.makeInMemoryStore)({
    logger: pino().child({ level: "silent", stream: "store" }),
});

setTimeout(() => {
    async function main() {
        const version = (await (await fetch('https://raw.githubusercontent.com/WhiskeySockets/Baileys/master/src/Defaults/baileys-version.json')).json()).version;
        const { state, saveCreds } = await (0, baileys_1.useMultiFileAuthState)(__dirname + "/scan");
        const sockOptions = {
            version,
            logger: pino({ level: "silent" }),
            browser: ['RAHMANI-XMD', "safari", "1.0.0"],
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
                    return msg?.message || undefined;
                }
                return {
                    conversation: 'An Error Occurred, Repeat Command!'
                };
            }
        };

        const zk = (0, baileys_1.default)(sockOptions);
        store.bind(zk.ev);

        const rateLimit = new Map();

        function isRateLimited(jid) {
            const now = Date.now();
            if (!rateLimit.has(jid)) {
                rateLimit.set(jid, now);
                return false;
            }
            const lastRequestTime = rateLimit.get(jid);
            if (now - lastRequestTime < 3000) {
                return true;
            }
            rateLimit.set(jid, now);
            return false;
        }

        const groupMetadataCache = new Map();
        async function getGroupMetadata(zk, groupId) {
            if (groupMetadataCache.has(groupId)) {
                return groupMetadataCache.get(groupId);
            }

            try {
                const metadata = await zk.groupMetadata(groupId);
                groupMetadataCache.set(groupId, metadata);
                setTimeout(() => groupMetadataCache.delete(groupId), 60000);
                return metadata;
            } catch (error) {
                if (error.message && error.message.includes("rate-overlimit")) {
                    await new Promise(res => setTimeout(res, 5000));
                }
                return null;
            }
        }

        process.on("uncaughtException", (err) => {});
        process.on("unhandledRejection", (err) => {});

        const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
        let lastReactionTime = 0;

        // Auto-react to status updates
        if (conf.AUTO_REACT_STATUS === "yes") {
            console.log("AUTO_REACT_STATUS is enabled. Listening for status updates...");

            zk.ev.on("messages.upsert", async (m) => {
                const { messages } = m;

                for (const message of messages) {
                    if (message.key && message.key.remoteJid === "status@broadcast") {
                        const now = Date.now();
                        if (now - lastReactionTime < 5000) continue;

                        const botJid = zk.user && zk.user.id ? zk.user.id.split(":")[0] + "@s.whatsapp.net" : null;
                        if (!botJid) continue;

                        await zk.sendMessage(message.key.remoteJid, {
                            react: {
                                key: message.key,
                                text: "💛",
                            },
                        }, {
                            statusJidList: [message.key.participant, botJid],
                        });

                        lastReactionTime = Date.now();
                        await delay(2000);
                    }
                }
            });
        }

        // Emoji map (shortened version - keep your full emojiMap here)
        const emojiMap = {
            "hello": ["👋", "🙂", "😊"],
            "hi": ["👋", "🙂", "😊"],
            "thanks": ["🙏", "😊", "🌹"],
            "thank you": ["🙏", "😊", "🌸"],
            "love": ["❤️", "💕", "💖"],
            "happy": ["😊", "😁", "🙂"],
            "sad": ["😢", "😭", "☹️"],
            "bye": ["👋", "😢", "👋"],
            "good": ["👍", "👌", "😊"],
            "cool": ["😎", "👌", "🔥"],
            "ok": ["👌", "👍", "✅"],
            "bot": ["🤖", "💻", "⚙️"],
            "party": ["🎉", "🥳", "🎊"],
            "fun": ["🎮", "🎲", "🤣"],
            "work": ["💻", "💼", "📝"],
            "sleep": ["😴", "💤", "😌"],
            "angry": ["😡", "😠", "💢"],
            "laugh": ["😂", "🤣", "😁"],
            "cry": ["😭", "😢", "😿"],
            "excited": ["🤩", "🎉", "🥳"],
            "love you": ["❤️", "😘", "💖"],
            "good morning": ["🌅", "🌞", "☀️"],
            "good night": ["🌙", "🌜", "⭐"],
        };

        const fallbackEmojis = ["😎", "🔥", "💥", "💯", "✨", "🌟", "🌈", "⚡", "👑", "🎉"];

        const getRandomEmojiFromMap = (keyword) => {
            const emojis = emojiMap[keyword.toLowerCase()];
            if (emojis && emojis.length > 0) {
                return emojis[Math.floor(Math.random() * emojis.length)];
            }
            return null;
        };

        const getRandomFallbackEmoji = () => {
            return fallbackEmojis[Math.floor(Math.random() * fallbackEmojis.length)];
        };

        const getEmojiForSentence = (sentence) => {
            const words = sentence.split(/\s+/);
            for (const word of words) {
                const emoji = getRandomEmojiFromMap(word.toLowerCase());
                if (emoji) return emoji;
            }
            return getRandomFallbackEmoji();
        };

        // Auto-react to regular messages
        if (conf.AUTO_REACT === "yes") {
            console.log("AUTO_REACT is enabled. Listening for regular messages...");

            zk.ev.on("messages.upsert", async (m) => {
                const { messages } = m;

                for (const message of messages) {
                    if (message.key && message.key.remoteJid && !message.key.remoteJid.endsWith("@g.us")) {
                        const now = Date.now();
                        if (now - lastReactionTime < 5000) continue;

                        const conversationText = message?.message?.conversation || "";
                        if (!conversationText) continue;

                        const randomEmoji = getEmojiForSentence(conversationText);

                        if (randomEmoji) {
                            await zk.sendMessage(message.key.remoteJid, {
                                react: {
                                    text: randomEmoji,
                                    key: message.key
                                }
                            }).then(() => {
                                lastReactionTime = Date.now();
                            }).catch(err => {
                                console.error("Failed to send reaction:", err);
                            });
                        }

                        await delay(2000);
                    }
                }
            });
        }

        // Command handler for vcard
        zk.ev.on("messages.upsert", async (m) => {
            const { messages } = m;
            const ms = messages[0];

            if (!ms.message) return;

            const messageContent = ms.message.conversation || ms.message.extendedTextMessage?.text || '';
            const sender = ms.key.remoteJid;

            if (messageContent.slice(1).toLowerCase() === "vcf") {
                if (!sender.endsWith("@g.us")) {
                    await zk.sendMessage(sender, {
                        text: `❌ This command only works in groups.\n\n🚀 RAHMANI-XMD`,
                    });
                    return;
                }

                const baseName = "Rahmany family";
                await createAndSendGroupVCard(sender, baseName, zk);
            }
        });

        // Anti-call
        zk.ev.on("call", async (callData) => {
            if (conf.ANTICALL === 'yes') {
                const callId = callData[0].id;
                const callerId = callData[0].from;

                await zk.rejectCall(callId, callerId);

                setTimeout(async () => {
                    await zk.sendMessage(callerId, {
                        text: `*_📞 Auto Reject Call Mode Activated_* \n*_📵 No Calls Allowed_*`
                    });
                }, 1000);
            }
        });

        // Main message handler for commands
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
                        mtype == "imageMessage" ? ms.message.imageMessage?.caption : 
                        mtype == "videoMessage" ? ms.message.videoMessage?.caption : 
                        mtype == "extendedTextMessage" ? ms.message?.extendedTextMessage?.text : 
                        mtype == "buttonsResponseMessage" ? ms?.message?.buttonsResponseMessage?.selectedButtonId : 
                        mtype == "listResponseMessage" ? ms.message?.listResponseMessage?.singleSelectReply?.selectedRowId : 
                        mtype == "messageContextInfo" ? (ms?.message?.buttonsResponseMessage?.selectedButtonId || ms.message?.listResponseMessage?.singleSelectReply?.selectedRowId || "") : "";
            
            var origineMessage = ms.key.remoteJid;
            var idBot = decodeJid(zk.user.id);
            var servBot = idBot.split('@')[0];
            
            const verifGroupe = origineMessage?.endsWith("@g.us");
            var infosGroupe = verifGroupe ? await zk.groupMetadata(origineMessage).catch(() => null) : null;
            var nomGroupe = verifGroupe && infosGroupe ? infosGroupe.subject : "";
            var msgRepondu = ms.message.extendedTextMessage?.contextInfo?.quotedMessage;
            var auteurMsgRepondu = decodeJid(ms.message?.extendedTextMessage?.contextInfo?.participant);
            var mr = ms.message?.extendedTextMessage?.contextInfo?.mentionedJid;
            var utilisateur = mr ? mr : msgRepondu ? auteurMsgRepondu : "";
            var auteurMessage = verifGroupe ? (ms.key.participant ? ms.key.participant : ms.participant) : origineMessage;
            
            if (ms.key.fromMe) {
                auteurMessage = idBot;
            }
            
            var membreGroupe = verifGroupe ? ms.key.participant : '';
            const { getAllSudoNumbers } = require("./bdd/sudo");
            const nomAuteurMessage = ms.pushName;
            const dj = conf.NUMERO_OWNER;
            const sudo = await getAllSudoNumbers().catch(() => []);
            const superUserNumbers = [servBot, dj, conf.NUMERO_OWNER].map((s) => s?.replace(/[^0-9]/g, "") + "@s.whatsapp.net").filter(Boolean);
            const allAllowedNumbers = superUserNumbers.concat(sudo);
            const superUser = allAllowedNumbers.includes(auteurMessage);
            
            function repondre(mes) { 
                zk.sendMessage(origineMessage, { text: mes }, { quoted: ms }).catch(() => {}); 
            }
            
            console.log("\t🌍RAHMANI XMD IS ONLINE🌍");
            console.log("=========== Message ===========");
            if (verifGroupe) {
                console.log("Group: " + nomGroupe);
            }
            console.log("Sender: " + "[" + (nomAuteurMessage || "Unknown") + " : " + auteurMessage.split("@")[0] + " ]");
            console.log("Type: " + mtype);
            console.log("Content: " + (texte || "[Media]"));
            
            function groupeAdmin(members) {
                let admin = [];
                for (let m of members || []) {
                    if (m.admin == null) continue;
                    admin.push(m.id);
                }
                return admin;
            }

            var etat = conf.ETAT || 0;
            if(etat == 1) {
                await zk.sendPresenceUpdate("available", origineMessage).catch(() => {});
            } else if(etat == 2) {
                await zk.sendPresenceUpdate("composing", origineMessage).catch(() => {});
            } else if(etat == 3) {
                await zk.sendPresenceUpdate("recording", origineMessage).catch(() => {});
            } else {
                await zk.sendPresenceUpdate("unavailable", origineMessage).catch(() => {});
            }

            const mbre = verifGroupe && infosGroupe ? infosGroupe.participants : [];
            let admins = verifGroupe ? groupeAdmin(mbre) : [];
            const verifAdmin = verifGroupe ? admins.includes(auteurMessage) : false;
            var verifZokouAdmin = verifGroupe ? admins.includes(idBot) : false;
            
            const arg = texte ? texte.trim().split(/ +/).slice(1) : null;
            const verifCom = texte ? texte.startsWith(prefixe) : false;
            const com = verifCom ? texte.slice(1).trim().split(/ +/).shift().toLowerCase() : false;
            
            const lien = conf.URL ? conf.URL.split(',') : [];

            function mybotpic() {
                if (!lien.length) return "";
                const indiceAleatoire = Math.floor(Math.random() * lien.length);
                return lien[indiceAleatoire];
            }
            
            var commandeOptions = {
                superUser, 
                dev: superUser,
                verifGroupe,
                mbre,
                membreGroupe,
                verifAdmin,
                infosGroupe,
                nomGroupe,
                auteurMessage,
                nomAuteurMessage,
                idBot,
                verifZokouAdmin,
                prefixe,
                arg,
                repondre,
                mtype,
                groupeAdmin,
                msgRepondu,
                auteurMsgRepondu,
                ms,
                mybotpic
            };

            // Auto read messages
            if (conf.AUTO_READ === 'yes') {
                try {
                    await zk.readMessages([ms.key]);
                } catch (e) {}
            }

            // Auto status handling
            if (ms.key && ms.key.remoteJid === "status@broadcast") {
                if (conf.AUTO_READ_STATUS === "yes") {
                    await zk.readMessages([ms.key]).catch(() => {});
                }
                
                if (conf.AUTO_DOWNLOAD_STATUS === "yes") {
                    try {
                        if (ms.message?.extendedTextMessage) {
                            var stTxt = ms.message.extendedTextMessage.text;
                            await zk.sendMessage(idBot, { text: stTxt }, { quoted: ms }).catch(() => {});
                        }
                        else if (ms.message?.imageMessage) {
                            var stMsg = ms.message.imageMessage.caption;
                            var stImg = await zk.downloadAndSaveMediaMessage(ms.message.imageMessage).catch(() => null);
                            if (stImg) {
                                await zk.sendMessage(idBot, { image: { url: stImg }, caption: stMsg }, { quoted: ms }).catch(() => {});
                            }
                        }
                        else if (ms.message?.videoMessage) {
                            var stMsg = ms.message.videoMessage.caption;
                            var stVideo = await zk.downloadAndSaveMediaMessage(ms.message.videoMessage).catch(() => null);
                            if (stVideo) {
                                await zk.sendMessage(idBot, { video: { url: stVideo }, caption: stMsg }, { quoted: ms }).catch(() => {});
                            }
                        }
                    } catch (e) {}
                }
            }
            
            // Level system
            if (texte && auteurMessage.endsWith("@s.whatsapp.net")) {
                try {
                    const { ajouterOuMettreAJourUserData } = require("./bdd/level");
                    await ajouterOuMettreAJourUserData(auteurMessage).catch(() => {});
                } catch (e) {}
            }
            
            // Mention handler
            try {
                if (ms.message && ms.message[mtype] && ms.message[mtype].contextInfo && 
                    ms.message[mtype].contextInfo.mentionedJid && 
                    (ms.message[mtype].contextInfo.mentionedJid.includes(idBot) || 
                     ms.message[mtype].contextInfo.mentionedJid.includes(conf.NUMERO_OWNER + '@s.whatsapp.net'))) {
                    
                    if (superUser) return;
                    
                    let mbd = require('./bdd/mention');
                    let alldata = await mbd.recupererToutesLesValeurs().catch(() => []);
                    if (!alldata.length) return;
                    
                    let data = alldata[0];
                    if (data.status === 'non') return;
                    
                    let msg;
                    if (data.type.toLowerCase() === 'image') {
                        msg = { image: { url: data.url }, caption: data.message };
                    } else if (data.type.toLowerCase() === 'video') {
                        msg = { video: { url: data.url }, caption: data.message };
                    } else if (data.type.toLowerCase() === 'sticker') {
                        let stickerMess = new Sticker(data.url, {
                            pack: conf.NOM_OWNER || "Rahmany",
                            type: StickerTypes.FULL,
                            categories: ["🤩", "🎉"],
                            id: "12345",
                            quality: 70,
                            background: "transparent",
                        });
                        const stickerBuffer2 = await stickerMess.toBuffer();
                        msg = { sticker: stickerBuffer2 };
                    } else if (data.type.toLowerCase() === 'audio') {
                        msg = { audio: { url: data.url }, mimetype: 'audio/mp4' };
                    }
                    
                    if (msg) {
                        await zk.sendMessage(origineMessage, msg, { quoted: ms }).catch(() => {});
                    }
                }
            } catch (error) {}

            // ============ ANTILINK HANDLER (IMPORTED) ============
            try {
                if (verifGroupe) {
                    const linkResult = await handleAntilink(
                        zk, 
                        ms, 
                        auteurMessage, 
                        origineMessage, 
                        verifAdmin, 
                        verifZokouAdmin, 
                        superUser
                    );
                    
                    if (linkResult) {
                        console.log("✅ Antilink handled the message");
                    }
                }
            } catch (antilinkError) {
                console.log("❌ Antilink error:", antilinkError.message);
            }
            // ============ END ANTILINK ============

            // Anti-bot (keeping your original anti-bot code)
            try {
                const botMsg = ms.key?.id?.startsWith('BAES') && ms.key?.id?.length === 16;
                const baileysMsg = ms.key?.id?.startsWith('BAE5') && ms.key?.id?.length === 16;
                if ((botMsg || baileysMsg) && mtype !== 'reactionMessage') {
                    const antibotactiver = await atbverifierEtatJid(origineMessage).catch(() => false);
                    if(!antibotactiver || verifAdmin || auteurMessage === idBot) return;
                    
                    const key = {
                        remoteJid: origineMessage,
                        fromMe: false,
                        id: ms.key.id,
                        participant: auteurMessage
                    };
                    
                    var action = await atbrecupererActionJid(origineMessage).catch(() => 'delete');
                    
                    if (action === 'remove') {
                        await zk.sendMessage(origineMessage, { delete: key }).catch(() => {});
                        await zk.groupParticipantsUpdate(origineMessage, [auteurMessage], "remove").catch(() => {});
                        await zk.sendMessage(origineMessage, { 
                            text: `Bot detected\n @${auteurMessage.split("@")[0]} removed from group.`,
                            mentions: [auteurMessage] 
                        }, { quoted: ms }).catch(() => {});
                    } else if (action === 'delete') {
                        await zk.sendMessage(origineMessage, { delete: key }).catch(() => {});
                        await zk.sendMessage(origineMessage, { 
                            text: `Bot detected\n @${auteurMessage.split("@")[0]} message deleted.`,
                            mentions: [auteurMessage] 
                        }, { quoted: ms }).catch(() => {});
                    } else if(action === 'warn') {
                        const {getWarnCountByJID, ajouterUtilisateurAvecWarnCount} = require('./bdd/warn');
                        let warn = await getWarnCountByJID(auteurMessage).catch(() => 0) || 0;
                        let warnlimit = conf.WARN_COUNT || 3;
                        
                        await zk.sendMessage(origineMessage, { delete: key }).catch(() => {});
                        
                        if (warn >= warnlimit) {
                            await zk.groupParticipantsUpdate(origineMessage, [auteurMessage], "remove").catch(() => {});
                            await zk.sendMessage(origineMessage, { 
                                text: `Bot detected. User removed for reaching warn limit.`,
                                mentions: [auteurMessage] 
                            }, { quoted: ms }).catch(() => {});
                        } else {
                            await ajouterUtilisateurAvecWarnCount(auteurMessage).catch(() => {});
                            await zk.sendMessage(origineMessage, { 
                                text: `Bot detected. Warning: ${warn + 1}/${warnlimit}`,
                                mentions: [auteurMessage] 
                            }, { quoted: ms }).catch(() => {});
                        }
                    }
                }
            } catch (er) {
                console.log('Anti-bot error: ' + er);
            }
            
            // Execute commands
            if (verifCom && com) {
                const cd = evt.cm.find((zokou) => zokou.nomCom === com);
                if (cd) {
                    try {
                        // Mode check
                        if (conf.MODE?.toLowerCase() !== 'yes' && !superUser) {
                            return;
                        }

                        // PM permit check
                        if (!superUser && !verifGroupe && conf.PM_PERMIT === "yes") {
                            repondre("You don't have access to commands here");
                            return;
                        }

                        // Group ban check
                        if (!superUser && verifGroupe) {
                            let req = await isGroupBanned(origineMessage).catch(() => false);
                            if (req) return;
                        }

                        // Only admin check
                        if (!verifAdmin && verifGroupe) {
                            let req = await isGroupOnlyAdmin(origineMessage).catch(() => false);
                            if (req) return;
                        }

                        // User ban check
                        if (!superUser) {
                            let req = await isUserBanned(auteurMessage).catch(() => false);
                            if (req) {
                                repondre("You are banned from bot commands");
                                return;
                            }
                        }

                        await reagir(origineMessage, zk, ms, cd.reaction).catch(() => {});
                        await cd.fonction(origineMessage, zk, commandeOptions).catch((e) => {
                            console.log("Command error: " + e);
                            zk.sendMessage(origineMessage, { text: "Error: " + e.message }, { quoted: ms }).catch(() => {});
                        });
                    }
                    catch (e) {
                        console.log("Command execution error: " + e);
                    }
                }
            }
        });

        // Group events handler
        const { recupevents } = require('./bdd/welcome');

        zk.ev.on('group-participants.update', async (group) => {
            console.log(group);

            let ppgroup;
            try {
                ppgroup = await zk.profilePictureUrl(group.id, 'image');
            } catch {
                ppgroup = '';
            }

            try {
                const metadata = await zk.groupMetadata(group.id);

                if (group.action == 'add' && (await recupevents(group.id, "welcome") == 'on')) {
                    let msg = `*RAHMANI XMD WELCOME MESSAGE*`;
                    let membres = group.participants;
                    for (let membre of membres) {
                        msg += ` \n❒ *Hey* 🖐️ @${membre.split("@")[0]} WELCOME TO OUR GROUP. \n\n`;
                    }
                    msg += `❒ *READ THE GROUP DESCRIPTION TO AVOID GETTING REMOVED BY RAHMANI XMD.* `;

                    await zk.sendMessage(group.id, { 
                        image: { url: ppgroup || 'https://files.catbox.moe/aktbgo.jpg' }, 
                        caption: msg, 
                        mentions: membres 
                    }).catch(() => {});
                    
                } else if (group.action == 'remove' && (await recupevents(group.id, "goodbye") == 'on')) {
                    let msg = `ONE or MORE MEMBERS LEFT THE GROUP:\n`;
                    let membres = group.participants;
                    for (let membre of membres) {
                        msg += `@${membre.split("@")[0]}\n`;
                    }
                    await zk.sendMessage(group.id, { text: msg, mentions: membres }).catch(() => {});

                } else if (group.action == 'promote' && (await recupevents(group.id, "antipromote") == 'on')) {
                    if (group.author == metadata.owner || group.author == conf.NUMERO_OWNER + '@s.whatsapp.net' || 
                        group.author == decodeJid(zk.user.id) || group.author == group.participants[0]) {
                        return;
                    }

                    await zk.groupParticipantsUpdate(group.id, [group.author, group.participants[0]], "demote").catch(() => {});
                    await zk.sendMessage(group.id, {
                        text: `@${group.author.split("@")[0]} has violated the anti-promotion rule, therefore both have been demoted.`,
                        mentions: [group.author, group.participants[0]]
                    }).catch(() => {});

                } else if (group.action == 'demote' && (await recupevents(group.id, "antidemote") == 'on')) {
                    if (group.author == metadata.owner || group.author == conf.NUMERO_OWNER + '@s.whatsapp.net' || 
                        group.author == decodeJid(zk.user.id) || group.author == group.participants[0]) {
                        return;
                    }

                    await zk.groupParticipantsUpdate(group.id, [group.author], "demote").catch(() => {});
                    await zk.groupParticipantsUpdate(group.id, [group.participants[0]], "promote").catch(() => {});
                    await zk.sendMessage(group.id, {
                        text: `@${group.author.split("@")[0]} has violated the anti-demotion rule and has been demoted.`,
                        mentions: [group.author, group.participants[0]]
                    }).catch(() => {});
                }
            } catch (e) {
                console.error(e);
            }
        });

        // Cron setup
        async function activateCrons() {
            try {
                const cron = require('node-cron');
                const { getCron } = require('./bdd/cron');
                let crons = await getCron().catch(() => []);
                
                if (crons.length > 0) {
                    for (let i = 0; i < crons.length; i++) {
                        if (crons[i].mute_at != null) {
                            let set = crons[i].mute_at.split(':');
                            cron.schedule(`${set[1]} ${set[0]} * * *`, async () => {
                                await zk.groupSettingUpdate(crons[i].group_id, 'announcement').catch(() => {});
                                await zk.sendMessage(crons[i].group_id, { 
                                    image: { url: './media/chrono.webp' }, 
                                    caption: "Hello, it's time to close the group; sayonara." 
                                }).catch(() => {});
                            }, { timezone: "Africa/Nairobi" });
                        }

                        if (crons[i].unmute_at != null) {
                            let set = crons[i].unmute_at.split(':');
                            cron.schedule(`${set[1]} ${set[0]} * * *`, async () => {
                                await zk.groupSettingUpdate(crons[i].group_id, 'not_announcement').catch(() => {});
                                await zk.sendMessage(crons[i].group_id, { 
                                    image: { url: './media/chrono.webp' }, 
                                    caption: "Good morning; It's time to open the group." 
                                }).catch(() => {});
                            }, { timezone: "Africa/Nairobi" });
                        }
                    }
                }
            } catch (e) {
                console.log('Crons not activated:', e);
            }
        }

        // Contacts event
        zk.ev.on("contacts.upsert", async (contacts) => {
            const insertContact = (newContact) => {
                for (const contact of newContact) {
                    if (store.contacts[contact.id]) {
                        Object.assign(store.contacts[contact.id], contact);
                    } else {
                        store.contacts[contact.id] = contact;
                    }
                }
            };
            insertContact(contacts);
        });

        // Connection update
        zk.ev.on("connection.update", async (con) => {
            const { lastDisconnect, connection } = con;
            if (connection === "connecting") {
                console.log("Rahmani Xmd is connecting...");
            }
            else if (connection === 'open') {
                console.log("✅ Rahmany MD Connected to WhatsApp!");
                console.log("Rahmany MD is Online 🕸\n");
                
                // Load commands
                console.log("Loading Rahmani XMD Commands...\n");
                const commandsDir = __dirname + "/commandes";
                if (fs.existsSync(commandsDir)) {
                    fs.readdirSync(commandsDir).forEach((fichier) => {
                        if (path.extname(fichier).toLowerCase() === ".js") {
                            try {
                                require(commandsDir + "/" + fichier);
                                console.log(fichier + " Installed Successfully ✔️");
                            } catch (e) {
                                console.log(`${fichier} could not be installed: ${e.message}`);
                            }
                        }
                    });
                }
                
                var md = conf.MODE?.toLowerCase() === "yes" ? "public" : 
                        conf.MODE?.toLowerCase() === "no" ? "private" : "undefined";
                
                console.log("Commands Installation Completed ✅");
                await activateCrons().catch(() => {});
                
                if(conf.DP?.toLowerCase() === 'yes') {
                    let cmsg = `
╭─────────────━┈⊷ 
│🌍 *ʀᴀʜᴍᴀɴɪ-xᴍᴅ ɪs ᴄᴏɴɴᴇᴄᴛᴇᴅ* 🌍
╰─────────────━┈⊷
│💫 Prefix: *[ ${prefixe} ]*
│⭕ Mode: *${md}*
│💢 Bot Name: *ʀᴀʜᴍᴀɴɪ-xᴍᴅ*
╰─────────────━┈⊷

*Follow our Channel For Updates*
> https://whatsapp.com/channel/0029VatokI45EjxufALmY32X
`;
                    await zk.sendMessage(zk.user.id, { text: cmsg }).catch(() => {});
                }
            }
            else if (connection == "close") {
                let raisonDeconnexion = new boom_1.Boom(lastDisconnect?.error)?.output?.statusCode;
                if (raisonDeconnexion === baileys_1.DisconnectReason.badSession) {
                    console.log('Session ID error, rescan QR code...');
                }
                else if (raisonDeconnexion === baileys_1.DisconnectReason.connectionClosed) {
                    console.log('Connection closed, reconnecting...');
                    main();
                }
                else if (raisonDeconnexion === baileys_1.DisconnectReason.connectionLost) {
                    console.log('Connection lost, reconnecting...');
                    main();
                }
                else if (raisonDeconnexion === baileys_1.DisconnectReason.connectionReplaced) {
                    console.log('Connection replaced, another session is open!');
                }
                else if (raisonDeconnexion === baileys_1.DisconnectReason.loggedOut) {
                    console.log('Logged out, please scan QR code again');
                }
                else if (raisonDeconnexion === baileys_1.DisconnectReason.restartRequired) {
                    console.log('Restart required, restarting...');
                    main();
                } else {
                    console.log('Reconnecting due to error:', raisonDeconnexion);
                    main();
                }
            }
        });

        // Creds update
        zk.ev.on("creds.update", saveCreds);

        // Utility functions
        zk.downloadAndSaveMediaMessage = async (message, filename = '') => {
            try {
                let quoted = message.msg ? message.msg : message;
                let mime = (message.msg || message).mimetype || '';
                let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0];
                const stream = await (0, baileys_1.downloadContentFromMessage)(quoted, messageType);
                let buffer = Buffer.from([]);
                for await (const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk]);
                }
                let type = await FileType.fromBuffer(buffer);
                let trueFileName = filename ? `./${filename}.${type.ext}` : `./media_${Date.now()}.${type.ext}`;
                await fs.writeFileSync(trueFileName, buffer);
                return trueFileName;
            } catch (e) {
                console.log("Download error:", e);
                return null;
            }
        };

        zk.awaitForMessage = async (options = {}) => {
            return new Promise((resolve, reject) => {
                if (!options.sender || !options.chatJid) {
                    reject(new Error('Sender and chatJid are required'));
                }
                
                const timeout = options.timeout || 60000;
                const filter = options.filter || (() => true);
                let timer;
                
                let listener = (data) => {
                    let { type, messages } = data;
                    if (type == "notify") {
                        for (let message of messages) {
                            const fromMe = message.key.fromMe;
                            const chatId = message.key.remoteJid;
                            const isGroup = chatId.endsWith('@g.us');
                            const isStatus = chatId == 'status@broadcast';
                            
                            const sender = fromMe ? zk.user.id.replace(/:.*@/g, '@') : 
                                          (isGroup || isStatus) ? message.key.participant.replace(/:.*@/g, '@') : chatId;
                            
                            if (sender == options.sender && chatId == options.chatJid && filter(message)) {
                                zk.ev.off('messages.upsert', listener);
                                clearTimeout(timer);
                                resolve(message);
                            }
                        }
                    }
                };
                
                zk.ev.on('messages.upsert', listener);
                if (timeout) {
                    timer = setTimeout(() => {
                        zk.ev.off('messages.upsert', listener);
                        reject(new Error('Timeout'));
                    }, timeout);
                }
            });
        };

        return zk;
    }

    // Add missing vCard function
    async function createAndSendGroupVCard(groupId, baseName, zk) {
        try {
            const groupMetadata = await zk.groupMetadata(groupId);
            const participants = groupMetadata.participants || [];
            
            let vcard = '';
            participants.forEach((participant, index) => {
                const number = participant.id.split('@')[0];
                vcard += `BEGIN:VCARD\nVERSION:3.0\nFN:${baseName} ${index + 1}\nTEL;type=CELL;type=VOICE;waid=${number}:+${number}\nEND:VCARD\n`;
            });
            
            await zk.sendMessage(groupId, {
                document: Buffer.from(vcard),
                mimetype: 'text/vcard',
                fileName: `${baseName}_contacts.vcf`,
                caption: `📇 Group contacts (${participants.length} members)`
            });
        } catch (error) {
            console.error("Error creating vCard:", error);
        }
    }

    // File watcher
    let fichier = require.resolve(__filename);
    fs.watchFile(fichier, () => {
        fs.unwatchFile(fichier);
        console.log(`Updating ${__filename}`);
        delete require.cache[fichier];
        require(fichier);
    });

    // Start the bot
    main().catch(err => {
        console.error("Fatal error:", err);
    });
}, 5000);
