"use strict";

const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, jidDecode, downloadContentFromMessage, getContentType } = require("@whiskeysockets/baileys");
const pino = require("pino");
const fs = require("fs-extra");
const path = require("path");
const FileType = require('file-type');
const moment = require("moment-timezone");
const { Sticker, StickerTypes } = require('wa-sticker-formatter');
const conf = require("./set");
const axios = require("axios");

// ============ FOLDERS & FILES ============
const folders = ['./auth', './bdd', './commandes', './framework', './temp', './media'];
folders.forEach(folder => {
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
        console.log(`✅ ${folder} folder created`);
    }
});

// ============ CONFIG FILES ============
const configFiles = [
    { path: './bdd/antilink.json', data: { status: "off", action: "warn", warnCount: 3 } },
    { path: './bdd/antibug.json', data: { status: "off" } },
    { path: './bdd/antidelete.json', data: { status: "off" } },
    { path: './bdd/xmd/antibot.json', data: {} }
];

configFiles.forEach(file => {
    const dir = path.dirname(file.path);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(file.path)) {
        fs.writeFileSync(file.path, JSON.stringify(file.data, null, 2));
        console.log(`✅ ${file.path} created`);
    }
});

// ============ COMMAND HANDLER ============
const cm = [];
function zokou(settings, func) {
    cm.push({ ...settings, fonction: func });
}
global.zokou = zokou;
global.cm = cm;

// Load commands
const commandsDir = path.join(__dirname, 'commandes');
if (fs.existsSync(commandsDir)) {
    fs.readdirSync(commandsDir).forEach(file => {
        if (file.endsWith('.js')) {
            try {
                require(path.join(commandsDir, file));
                console.log(`✅ Command loaded: ${file}`);
            } catch (e) {
                console.log(`❌ Failed to load ${file}: ${e.message}`);
            }
        }
    });
}

// ============ REACTION HANDLER ============
async function reagir(remoteJid, sock, msg, reaction) {
    try {
        await sock.sendMessage(remoteJid, {
            react: { text: reaction, key: msg.key }
        });
    } catch (e) { }
}

// ============ UTILITY FUNCTIONS ============
function decodeJid(jid) {
    if (!jid) return jid;
    if (/:\d+@/gi.test(jid)) {
        const decode = jidDecode(jid) || {};
        return decode.user && decode.server ? decode.user + '@' + decode.server : jid;
    }
    return jid;
}

function groupeAdmin(participants) {
    return participants?.filter(p => p.admin).map(p => p.id) || [];
}

// ============ SESSION AUTH ============
async function getAuth() {
    try {
        const { state, saveCreds } = await useMultiFileAuthState('./auth');
        return { state, saveCreds };
    } catch (e) {
        console.log("❌ Auth error:", e);
        return null;
    }
}

// ============ START BOT ============
async function startBot() {
    console.log("\n🚀 STARTING RAHMANI-XMD...\n");

    const { state, saveCreds } = await getAuth();
    if (!state) return setTimeout(startBot, 5000);

    const sock = makeWASocket({
        version: [2, 3000, 1015901307],
        auth: state,
        printQRInTerminal: true,
        logger: pino({ level: 'silent' }),
        browser: ['Rahmani XMD', 'Chrome', '1.0.0'],
        syncFullHistory: true,
        markOnlineOnConnect: false,
        keepAliveIntervalMs: 30000
    });

    // ============ STORE ============
    const store = {
        messages: {},
        contacts: {},
        async loadMessage(jid, id) {
            return this.messages[jid]?.find(m => m.key.id === id);
        }
    };
    sock.store = store;

    // ============ MESSAGE SAVER ============
    async function saveMessage(msg) {
        try {
            if (!msg.message || msg.key.fromMe) return;
            const jid = msg.key.remoteJid;
            if (!store.messages[jid]) store.messages[jid] = [];
            store.messages[jid].push({
                key: msg.key,
                message: msg.message,
                messageTimestamp: msg.messageTimestamp || Date.now() / 1000
            });
            if (store.messages[jid].length > 100) store.messages[jid] = store.messages[jid].slice(-100);
        } catch (e) { }
    }

    // ============ MESSAGE HANDLER ============
    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message) return;

        // Save message
        await saveMessage(msg);

        const mtype = getContentType(msg.message);
        let text = "";
        if (mtype === 'conversation') text = msg.message.conversation || "";
        else if (mtype === 'extendedTextMessage') text = msg.message.extendedTextMessage?.text || "";
        else if (mtype === 'imageMessage') text = msg.message.imageMessage?.caption || "";
        else if (mtype === 'videoMessage') text = msg.message.videoMessage?.caption || "";

        const from = msg.key.remoteJid;
        const isGroup = from?.endsWith('@g.us');
        const sender = msg.key.participant || from;
        const botId = decodeJid(sock.user.id);
        const isMe = msg.key.fromMe;

        // Group metadata
        let groupMetadata = null;
        let groupName = "";
        let participants = [];
        let admins = [];
        let isSenderAdmin = false;
        let isBotAdmin = false;

        if (isGroup) {
            try {
                groupMetadata = await sock.groupMetadata(from);
                groupName = groupMetadata.subject || "Unknown Group";
                participants = groupMetadata.participants || [];
                admins = groupeAdmin(participants);
                isSenderAdmin = admins.includes(sender);
                isBotAdmin = admins.includes(botId);
            } catch (e) { }
        }

        // Sudo users
        const sudoNumbers = [conf.NUMERO_OWNER].map(n => n + '@s.whatsapp.net');
        const superUser = sudoNumbers.includes(sender) || isMe;

        // Console log
        console.log(`\n📨 From: ${sender.split('@')[0]}${isGroup ? ' in ' + groupName : ''}`);
        console.log(`💬 Text: ${text.substring(0, 100)}${text.length > 100 ? '...' : ''}`);

        // ============ ANTIBUG ============
        if (!isMe && conf.ANTIBUG === 'on') {
            const antibugConfig = fs.readJSONSync('./bdd/antibug.json', { throws: false }) || { status: 'off' };
            if (antibugConfig.status === 'on') {
                const bugPatterns = [
                    { pattern: /.{500,}/, type: 'CHARACTER_OVERLOAD' },
                    { pattern: /(?:[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27FF]){15,}/, type: 'EMOJI_OVERLOAD' },
                    { pattern: /<script|javascript:|onerror=/i, type: 'SCRIPT' }
                ];
                const isBug = bugPatterns.some(b => b.pattern.test(text));
                if (isBug) {
                    console.log(`🚨 BUG DETECTED from ${sender.split('@')[0]}`);
                    try {
                        await sock.updateBlockStatus(sender, 'block');
                        console.log('✅ User blocked');
                    } catch (e) { }
                    try {
                        if (isGroup && isBotAdmin) await sock.sendMessage(from, { delete: msg.key });
                    } catch (e) { }
                    return;
                }
            }
        }

        // ============ ANTILINK ============
        if (!isMe && isGroup && isBotAdmin && !isSenderAdmin) {
            const antilinkConfig = fs.readJSONSync('./bdd/antilink.json', { throws: false }) || { status: 'off', action: 'warn' };
            if (antilinkConfig.status === 'on') {
                const linkRegex = /(https?:\/\/[^\s]+)|(wa\.me\/)|(chat\.whatsapp\.com\/)|(t\.me\/)/gi;
                if (linkRegex.test(text)) {
                    console.log(`🔗 LINK DETECTED from ${sender.split('@')[0]}`);
                    try {
                        await sock.sendMessage(from, { delete: msg.key });
                        if (antilinkConfig.action === 'remove') {
                            await sock.groupParticipantsUpdate(from, [sender], 'remove');
                        } else {
                            await sock.sendMessage(from, {
                                text: `⚠️ @${sender.split('@')[0]} links are not allowed!`,
                                mentions: [sender]
                            });
                        }
                    } catch (e) { }
                    return;
                }
            }
        }

        // ============ ANTIDELETE ============
        if (msg.message?.protocolMessage?.type === 0) {
            const antideleteConfig = fs.readJSONSync('./bdd/antidelete.json', { throws: false }) || { status: 'off' };
            if (antideleteConfig.status === 'on' && !msg.key.fromMe) {
                console.log('🗑️ DELETED MESSAGE DETECTED');
                const deletedKey = msg.message.protocolMessage.key;
                const deletedMsg = await store.loadMessage(deletedKey.remoteJid, deletedKey.id);
                if (deletedMsg?.message) {
                    const dmsg = deletedMsg.message;
                    let content = '';
                    if (dmsg.conversation) content = dmsg.conversation;
                    else if (dmsg.extendedTextMessage?.text) content = dmsg.extendedTextMessage.text;
                    else content = `[${Object.keys(dmsg)[0]}]`;
                    
                    await sock.sendMessage(conf.NUMERO_OWNER + '@s.whatsapp.net', {
                        text: `🗑️ *Deleted Message*\nFrom: ${sender.split('@')[0]}\nContent: ${content}`
                    });
                }
            }
        }

        // ============ COMMANDS ============
        if (text.startsWith(conf.PREFIXE)) {
            const cmd = text.slice(1).split(' ')[0].toLowerCase();
            const args = text.split(' ').slice(1);
            const command = cm.find(c => c.nomCom === cmd);

            if (command) {
                try {
                    console.log(`⚡ Command: ${cmd}`);
                    await reagir(from, sock, msg, command.reaction || '⚡');
                    await command.fonction(from, sock, {
                        repondre: (mes) => sock.sendMessage(from, { text: mes }, { quoted: msg }),
                        arg: args,
                        ms: msg,
                        mtype,
                        superUser,
                        verifGroupe: isGroup,
                        verifAdmin: isSenderAdmin,
                        verifZokouAdmin: isBotAdmin,
                        infosGroupe: groupMetadata,
                        nomGroupe: groupName,
                        auteurMessage: sender,
                        nomAuteurMessage: msg.pushName,
                        idBot: botId,
                        prefixe: conf.PREFIXE,
                        groupeAdmin,
                        msgRepondu: msg.message.extendedTextMessage?.contextInfo?.quotedMessage,
                        auteurMsgRepondu: msg.message.extendedTextMessage?.contextInfo?.participant,
                        mybotpic: () => conf.URL || 'https://files.catbox.moe/aktbgo.jpg'
                    });
                } catch (e) {
                    console.log(`❌ Command error: ${e.message}`);
                    await sock.sendMessage(from, { text: `❌ Error: ${e.message}` }, { quoted: msg });
                }
            }
        }
    });

    // ============ GROUP PARTICIPANTS UPDATE ============
    sock.ev.on('group-participants.update', async (update) => {
        console.log('👥 Group update:', update);
        const welcomeConfig = fs.readJSONSync('./bdd/welcome.json', { throws: false }) || { welcome: 'off', goodbye: 'off' };
        if (update.action === 'add' && welcomeConfig.welcome === 'on') {
            await sock.sendMessage(update.id, {
                text: `👋 Welcome @${update.participants[0].split('@')[0]}!`,
                mentions: update.participants
            });
        }
        if (update.action === 'remove' && welcomeConfig.goodbye === 'on') {
            await sock.sendMessage(update.id, {
                text: `👋 Goodbye @${update.participants[0].split('@')[0]}!`,
                mentions: update.participants
            });
        }
    });

    // ============ CONNECTION UPDATE ============
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'connecting') console.log('🔄 Connecting...');
        else if (connection === 'open') {
            console.log('✅✅✅ CONNECTED TO WHATSAPP!');
            console.log('📱 Bot is online!');
            if (conf.DP === 'yes') {
                sock.sendMessage(conf.NUMERO_OWNER + '@s.whatsapp.net', {
                    text: `╭━━━ *『 RAHMANI-XMD 』* ━━━╮
┃
┃ ✅ *Bot is online!*
┃
┃ 📢 *Join Channel*
┃ https://whatsapp.com/channel/0029VatokI45EjxufALmY32X
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯`
                });
            }
        }
        else if (connection === 'close') {
            const statusCode = lastDisconnect?.error?.output?.statusCode;
            console.log(`❌ Disconnected: ${statusCode}`);
            if (statusCode === DisconnectReason.loggedOut) {
                console.log('📱 Session expired. Please scan QR again.');
                fs.removeSync('./auth');
            }
            setTimeout(startBot, 5000);
        }
    });

    // ============ CREDS UPDATE ============
    sock.ev.on('creds.update', saveCreds);
}

// ============ START ============
startBot().catch(err => {
    console.error('❌ Fatal error:', err);
    setTimeout(() => process.exit(1), 5000);
});

// ============ MEMORY OPTIMIZATION ============
setInterval(() => {
    try {
        global.gc?.();
        console.log('🧹 Garbage collected');
    } catch (e) { }
}, 30 * 60 * 1000);
