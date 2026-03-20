"use strict";

const baileys = require("@whiskeysockets/baileys");
const logger = require("@whiskeysockets/baileys/lib/Utils/logger").default;
const pino = require("pino");
const { Boom } = require("@hapi/boom");
const config = require("./set");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const fileType = require("file-type");
const express = require("express");

const {
  Sticker,
  createSticker,
  StickerTypes,
} = require("wa-sticker-formatter");

const {
  verifierEtatJid: isAntiLinkEnabled,
  recupererActionJid: getAntiLinkAction,
} = require("./bdd/antilien");

const {
  atbverifierEtatJid: isAntiBotEnabled,
  atbrecupererActionJid: getAntiBotAction,
} = require("./bdd/antibot");

const commands = require(__dirname + "/framework/zokou");

const {
  isUserBanned,
  addUserToBanList,
  removeUserFromBanList,
} = require("./bdd/banUser");

const {
  addGroupToBanList,
  isGroupBanned,
  removeGroupFromBanList,
} = require("./bdd/banGroup");

const {
  isGroupOnlyAdmin,
  addGroupToOnlyAdminList,
  removeGroupFromOnlyAdminList,
} = require("./bdd/onlyAdmin");

const { reagir } = require(__dirname + "/framework/app");

const baileysLogger = logger.child({});
baileysLogger.level = "silent";

const PREFIX = config.PREFIXE;
const zeroWidthChar = String.fromCharCode(8206);
const zeroWidthChars = zeroWidthChar.repeat(4001);

let sessionData = config.session.replace(/Zokou-MD-WHATSAPP-BOT;\n;\n;\n=>/g, "");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

async function ensureSessionFile() {
  try {
    const credsPath = path.join(__dirname, "scan", "creds.json");

    if (!fs.existsSync(credsPath)) {
      console.log("connexion en cour ...");
      fs.writeFileSync(credsPath, atob(sessionData), "utf8");
      return;
    }

    if (fs.existsSync(credsPath) && sessionData !== "zokk") {
      fs.writeFileSync(credsPath, atob(sessionData), "utf8");
    }
  } catch (error) {
    console.log("Session Invalid " + error);
  }
}

ensureSessionFile();

const store = baileys.makeInMemoryStore({
  logger: pino().child({ level: "silent", stream: "store" }),
});

const antiSpamMap = new Map();
const groupMetadataCache = new Map();

function isThrottled(chatId, delay = 3000) {
  const now = Date.now();

  if (!antiSpamMap.has(chatId)) {
    antiSpamMap.set(chatId, now);
    return false;
  }

  const lastTime = antiSpamMap.get(chatId);

  if (now - lastTime < delay) {
    return true;
  }

  antiSpamMap.set(chatId, now);
  return false;
}

async function getCachedGroupMetadata(sock, groupJid) {
  if (groupMetadataCache.has(groupJid)) {
    return groupMetadataCache.get(groupJid);
  }

  try {
    const metadata = await sock.groupMetadata(groupJid);
    groupMetadataCache.set(groupJid, metadata);

    setTimeout(() => {
      groupMetadataCache.delete(groupJid);
    }, 60000);

    return metadata;
  } catch (error) {
    if (error.message?.includes("rate-overlimit")) {
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
    return null;
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function startBot() {
  const { version } = await baileys.fetchLatestBaileysVersion();
  const { state, saveCreds } = await baileys.useMultiFileAuthState(
    path.join(__dirname, "scan")
  );

  const sock = baileys.default({
    version,
    logger: pino({ level: "silent" }),
    browser: ["Bmw-Md", "safari", "1.0.0"],
    printQRInTerminal: true,
    fireInitQueries: false,
    shouldSyncHistoryMessage: true,
    downloadHistory: true,
    syncFullHistory: true,
    generateHighQualityLinkPreview: true,
    markOnlineOnConnect: false,
    keepAliveIntervalMs: 30000,
    auth: {
      creds: state.creds,
      keys: baileys.makeCacheableSignalKeyStore(state.keys, baileysLogger),
    },
    getMessage: async (key) => {
      if (!store) {
        return { conversation: "An Error Occurred, Repeat Command!" };
      }

      const msg = await store.loadMessage(key.remoteJid, key.id, undefined);
      return msg?.message || undefined;
    },
  });

  store.bind(sock.ev);

  process.on("uncaughtException", () => {});
  process.on("unhandledRejection", () => {});

  sock.ev.on("messages.upsert", async ({ messages }) => {
    if (!messages || messages.length === 0) return;

    for (const msg of messages) {
      if (!msg.message) continue;

      const chatId = msg.key.remoteJid;
      if (isThrottled(chatId)) continue;
    }
  });

  sock.ev.on("groups.update", async (updates) => {
    for (const update of updates) {
      const groupId = update.id;
      if (!groupId.endsWith("@g.us")) continue;
      await getCachedGroupMetadata(sock, groupId);
    }
  });

  if (config.ANTIDELETE1 === "yes") {
    sock.ev.on("messages.upsert", async ({ messages }) => {
      const msg = messages[0];
      if (!msg?.message) return;

      const chatId = msg.key.remoteJid;

      if (!store.chats[chatId]) {
        store.chats[chatId] = [];
      }

      store.chats[chatId].push(msg);

      const protocol = msg.message.protocolMessage;
      if (!protocol || protocol.type !== 0) return;

      const deletedKey = protocol.key;
      const savedMessages = store.chats[chatId];
      const original = savedMessages.find((m) => m.key.id === deletedKey.id);

      if (!original) return;

      try {
        const sender = original.key.participant || original.key.remoteJid;
        const notice = `*🛑 This message was deleted by @${sender.split("@")[0]}*`;
        const ownerJid = `${config.NUMERO_OWNER}@s.whatsapp.net`;

        if (original.message.conversation) {
          await sock.sendMessage(ownerJid, {
            text: `${notice}\nDeleted message: ${original.message.conversation}`,
            mentions: [sender],
          });
          return;
        }

        if (original.message.imageMessage) {
          const caption = original.message.imageMessage.caption || "";
          const file = await sock.downloadAndSaveMediaMessage(original.message.imageMessage);
          await sock.sendMessage(ownerJid, {
            image: { url: file },
            caption: `${notice}\n${caption}`,
            mentions: [sender],
          });
          return;
        }

        if (original.message.videoMessage) {
          const caption = original.message.videoMessage.caption || "";
          const file = await sock.downloadAndSaveMediaMessage(original.message.videoMessage);
          await sock.sendMessage(ownerJid, {
            video: { url: file },
            caption: `${notice}\n${caption}`,
            mentions: [sender],
          });
          return;
        }

        if (original.message.audioMessage) {
          const file = await sock.downloadAndSaveMediaMessage(original.message.audioMessage);
          await sock.sendMessage(ownerJid, {
            audio: { url: file },
            ptt: true,
            caption: notice,
            mentions: [sender],
          });
          return;
        }

        if (original.message.stickerMessage) {
          const file = await sock.downloadAndSaveMediaMessage(original.message.stickerMessage);
          await sock.sendMessage(ownerJid, {
            sticker: { url: file },
            caption: notice,
            mentions: [sender],
          });
        }
      } catch (error) {
        console.error("Error handling deleted message:", error);
      }
    });
  }

  sock.ev.on("call", async (calls) => {
    if (config.ANTICALL !== "yes") return;

    const call = calls[0];
    await sock.rejectCall(call.id, call.from);

    setTimeout(async () => {
      await sock.sendMessage(call.from, {
        text: "🚫 *Call Rejected❗* ",
      });
    }, 1000);
  });

  sock.ev.on("creds.update", saveCreds);

  sock.downloadAndSaveMediaMessage = async (message, fileName = "", attachExtension = true) => {
    const content = message.msg ? message.msg : message;
    const mime = (message.msg || message).mimetype || "";
    const type = message.mtype
      ? message.mtype.replace(/Message/gi, "")
      : mime.split("/")[0];

    const stream = await baileys.downloadContentFromMessage(content, type);
    let buffer = Buffer.from([]);

    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }

    const detectedType = await fileType.fromBuffer(buffer);
    const fullName = `./${fileName}.${detectedType.ext}`;

    fs.writeFileSync(fullName, buffer);
    return fullName;
  };

  sock.awaitForMessage = async (options = {}) => {
    return new Promise((resolve, reject) => {
      if (typeof options !== "object") return reject(new Error("Options must be an object"));
      if (typeof options.sender !== "string") return reject(new Error("Sender must be a string"));
      if (typeof options.chatJid !== "string") return reject(new Error("ChatJid must be a string"));
      if (options.timeout && typeof options.timeout !== "number") {
        return reject(new Error("Timeout must be a number"));
      }
      if (options.filter && typeof options.filter !== "function") {
        return reject(new Error("Filter must be a function"));
      }

      const timeout = options.timeout;
      const filter = options.filter || (() => true);
      let timeoutId;

      const listener = ({ type, messages }) => {
        if (type !== "notify") return;

        for (const msg of messages) {
          const fromMe = msg.key.fromMe;
          const remoteJid = msg.key.remoteJid;
          const isGroup = remoteJid.endsWith("@g.us");
          const isStatus = remoteJid === "status@broadcast";

          const sender = fromMe
            ? sock.user.id.replace(/:.*@/g, "@")
            : isGroup || isStatus
            ? msg.key.participant.replace(/:.*@/g, "@")
            : remoteJid;

          if (sender === options.sender && remoteJid === options.chatJid && filter(msg)) {
            sock.ev.off("messages.upsert", listener);
            clearTimeout(timeoutId);
            resolve(msg);
          }
        }
      };

      sock.ev.on("messages.upsert", listener);

      if (timeout) {
        timeoutId = setTimeout(() => {
          sock.ev.off("messages.upsert", listener);
          reject(new Error("Timeout"));
        }, timeout);
      }
    });
  };

  return sock;
}

setTimeout(() => {
  startBot();
}, 5000);
