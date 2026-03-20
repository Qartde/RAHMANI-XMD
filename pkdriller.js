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
const { Sticker, createSticker, StickerTypes } = require('wa-sticker-formatter');
//import chalk from 'chalk'
const { verifierEtatJid , recupererActionJid } = require("./bdd/antilien");
const { atbverifierEtatJid , atbrecupererActionJid } = require("./bdd/antibot");
let evt = require(__dirname + "/framework/zokou");
const {isUserBanned , addUserToBanList , removeUserFromBanList} = require("./bdd/banUser");
const  {addGroupToBanList,isGroupBanned,removeGroupFromBanList} = require("./bdd/banGroup");
const {isGroupOnlyAdmin,addGroupToOnlyAdminList,removeGroupFromOnlyAdminList} = require("./bdd/onlyAdmin");
//const //{loadCmd}=require("/framework/mesfonctions")
let { reagir } = require(__dirname + "/framework/app");
var session = conf.session.replace(/Zokou-MD-WHATSAPP-BOT;;;=>/g,"");
const prefixe = conf.PREFIXE;
const more = String.fromCharCode(8206)
const readmore = more.repeat(4001)
const BaseUrl = process.env.GITHUB_GIT;
const adamsapikey = process.env.BOT_OWNER;

async function authentification() {
    try {
        //console.log("le data "+data)
        if (!fs.existsSync(__dirname + "/scan/creds.json")) {
            console.log("connexion en cour ...");
            await fs.writeFileSync(__dirname + "/scan/creds.json", atob(session), "utf8");
            //console.log(session)
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
            /* auth: state*/ auth: {
                creds: state.creds,
                /** caching makes the store faster to send/recv messages */
                keys: (0, baileys_1.makeCacheableSignalKeyStore)(state.keys, logger),
            },
            //////////
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


// Function to get the current date and time in Tanzania
function getCurrentDateTime() {
    const options = {
        timeZone: 'Africa/Dar Es Salam', // Tanzania time zone
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false, // 24-hour format
    };
    const dateTime = new Intl.DateTimeFormat('en-KE', options).format(new Date());
    return dateTime;
}

// Auto Bio Update Interval
setInterval(async () => {
    if (conf.AUTO_BIO === "yes") {
        const currentDateTime = getCurrentDateTime(); // Get the current date and time
        const bioText = `Rahmani xmd is running 🚗\n${currentDateTime}`; // Format the bio text
        await zk.updateProfileStatus(bioText); // Update the bio
        console.log(`Updated Bio: ${bioText}`); // Log the updated bio
    }
}, 60000); // Update bio every 60 seconds

// Function to handle deleted messages
// Other functions (auto-react, anti-delete, etc.) as needed
        zk.ev.on("call", async (callData) => {
  if (conf.ANTICALL === 'yes') {
    const callId = callData[0].id;
    const callerId = callData[0].from;

    await zk.rejectCall(callId, callerId);
    await zk.sendMessage(callerId, {
      text: "Hello😊,am Rahmani-xmd a personal assistant,please try again later"
    });
  }
});

     // Utility function for delay
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Track the last reaction time to prevent overflow
let lastReactionTime = 0;


// Array of reaction emojis for regular messages and status updates
// Array of reaction emojis for regular messages and status updates
const emojiMap = {
    // General Greetings
    "hello": ["👋", "🙂", "😊", "🙋‍♂️", "🙋‍♀️"],
    "hi": ["👋", "🙂", "😁", "🙋‍♂️", "🙋‍♀️"],
    "good morning": ["🌅", "🌞", "☀️", "🌻", "🌼"],
    "good night": ["🌙", "🌜", "⭐", "🌛", "💫"],
    
    // Farewells
    "bye": ["👋", "😢", "👋🏻", "🥲", "🚶‍♂️", "🚶‍♀️"],
    "see you": ["👋", "😊", "👋🏻", "✌️", "🚶‍♂️"],
    
    // Casual Conversations
    "bro": ["🤜🤛", "👊", "💥", "🥊", "👑"],
    "sister": ["👭", "💁‍♀️", "🌸", "💖", "🙋‍♀️"],
    "buddy": ["🤗", "👯‍♂️", "👯‍♀️", "🤜🤛", "🤝"],
    "niaje": ["👋", "😄", "💥", "🔥", "🕺", "💃"],
    
    // Names (can be expanded with more names as needed)
    "fredi": ["😎", "💯", "🔥", "🚀", "👑"],
    "ezra": ["🔥", "💥", "👑", "💯", "😎"],
    
    // Expressions of gratitude
    "thanks": ["🙏", "😊", "💖", "❤️", "💐"],
    "thank you": ["🙏", "😊", "🙌", "💖", "💝"],
    
    // Love and Affection
    "love": ["❤️", "💖", "💘", "😍", "😘", "💍", "💑"],
    "miss you": ["😢", "💔", "😔", "😭", "💖"],
    
    // Apologies
    "sorry": ["😔", "🙏", "😓", "💔", "🥺"],
    "apologies": ["😔", "💔", "🙏", "😞", "🙇‍♂️", "🙇‍♀️"],
    
    // Celebrations
    "congratulations": ["🎉", "🎊", "🏆", "🎁", "👏"],
    "well done": ["👏", "💪", "🎉", "🎖️", "👍"],
    "good job": ["👏", "💯", "👍", "🌟", "🎉"],
    
    // Emotions
    "happy": ["😁", "😊", "🎉", "🎊", "💃", "🕺"],
    "sad": ["😢", "😭", "😞", "💔", "😓"],
    "angry": ["😡", "🤬", "😤", "💢", "😾"],
    "excited": ["🤩", "🎉", "😆", "🤗", "🥳"],
    "surprised": ["😲", "😳", "😯", "😮", "😲"],
    
    // Questions & Inquiries
    "help": ["🆘", "❓", "🙏", "💡", "👨‍💻", "👩‍💻"],
    "how": ["❓", "🤔", "😕", "😳", "🧐"],
    "what": ["❓", "🤷‍♂️", "🤷‍♀️", "😕", "😲"],
    "where": ["❓", "🌍", "🗺️", "🏙️", "🌎"],
    
    // Social Interactions
    "party": ["🎉", "🥳", "🍾", "🍻", "🎤", "💃", "🕺"],
    "fun": ["🤣", "😂", "🥳", "🎉", "🎮", "🎲"],
    "hangout": ["🍕", "🍔", "🍻", "🎮", "🍿", "😆"],
    
    // Positive Words
    "good": ["👍", "👌", "😊", "💯", "🌟"],
    "awesome": ["🔥", "🚀", "🤩", "👏", "💥"],
    "cool": ["😎", "👌", "🎮", "🎸", "💥"],
    
    // Negative Words
    "boring": ["😴", "🥱", "🙄", "😑", "🤐"],
    "tired": ["😴", "🥱", "😌", "💤", "🛌"],
    
    // Random / Fun Words
    "bot": ["🤖", "💻", "⚙️", "🧠", "🔧"],
    "robot": ["🤖", "⚙️", "💻", "🔋", "🤓"],
    "cool bot": ["🤖", "😎", "🤘", "💥", "🎮"],
    
    // Miscellaneous
    "love you": ["❤️", "💖", "😘", "💋", "💑"],
    "thank you bot": ["🙏", "🤖", "😊", "💖", "💐"],
    "good night bot": ["🌙", "🌛", "⭐", "💤", "😴"],
    
    // Words Based on Emotions
    "laughter": ["😂", "🤣", "😆", "😄", "🤪"],
    "crying": ["😢", "😭", "😿", "😓", "💔"],
    
    // Names & Nicknames
    "john": ["👑", "🔥", "💥", "😎", "💯"],
    "mike": ["💪", "🏆", "🔥", "💥", "🚀"],
    "lisa": ["💖", "👑", "🌸", "😍", "🌺"],
    "emily": ["💖", "💃", "👑", "🎉", "🎀"],
    
    "happy": ["😁", "😄", "😊", "🙌", "🎉", "🥳", "💃", "🕺", "🔥"],
    "excited": ["🤩", "🎉", "🥳", "🎊", "😆", "🤗", "💥", "🚀"],
    "love": ["❤️", "💖", "💘", "💝", "😍", "😘", "💍", "💑", "🌹"],
    "grateful": ["🙏", "💐", "🥰", "❤️", "😊"],
    "thankful": ["🙏", "💖", "💐", "🤗", "😇"],
    
    // Negative emotions
    "sad": ["😢", "😭", "😞", "💔", "😔", "😓", "😖"],
    "angry": ["😡", "😠", "🤬", "💢", "👊", "💥", "⚡"],
    "frustrated": ["😤", "😩", "🤯", "😑", "🌀"],
    "bored": ["😴", "🥱", "🙄", "😑", "😒"],
    
    // Expressions of surprise
    "surprised": ["😲", "😳", "😮", "😯", "😲", "🙀"],
    "shocked": ["😱", "😳", "😯", "💥", "🤯"],
    "wow": ["😲", "😱", "🤩", "🤯", "💥", "🚀"],
    
    // Emotions of sadness or loss
    "crying": ["😭", "😢", "💔", "😞", "😓"],
    "miss you": ["😭", "💔", "😔", "😢", "❤️"],
    "lonely": ["😔", "😭", "😢", "💔", "🙁"],
    
    // Asking for help
    "help": ["🆘", "❓", "🤔", "🙋‍♂️", "🙋‍♀️", "💡"],
    "need assistance": ["🆘", "💁‍♂️", "💁‍♀️", "❓", "🙏"],
    
    // Apologies
    "sorry": ["😔", "🙏", "💔", "😓", "🥺", "🙇‍♂️", "🙇‍♀️"],
    "apology": ["😔", "😞", "🙏", "💔", "🙇‍♂️", "🙇‍♀️"],
    
    // Motivation and encouragement
    "good job": ["👏", "💯", "🎉", "🌟", "👍", "👏"],
    "well done": ["👏", "🎉", "🎖️", "💪", "🔥", "🏆"],
    "you can do it": ["💪", "🔥", "💯", "🚀", "🌟"],
    
    // Celebrations
    "congratulations": ["🎉", "🏆", "🎊", "🎁", "👏", "🍾"],
    "cheers": ["🥂", "🍻", "🍾", "🍷", "🥳", "🎉"],
    
    // Casual goodbyes
    "goodbye": ["👋", "😢", "💔", "👋🏻", "🚶‍♂️", "🚶‍♀️"],
    "bye": ["👋", "👋🏻", "🥲", "🚶‍♂️", "🚶‍♀️"],
    "see you": ["👋", "👋🏻", "🤗", "✌️", "🙋‍♂️", "🙋‍♀️"],
    
    // Greetings and hellos
    "hello": ["👋", "🙂", "😊", "🙋‍♂️", "🙋‍♀️"],
    "hi": ["👋", "🙂", "😁", "🙋‍♂️", "🙋‍♀️"],
    
    // Fun and games
    "party": ["🎉", "🥳", "🎤", "💃", "🕺", "🍻", "🎶"],
    "fun": ["🎮", "🎲", "🤣", "🎉", "🃏"],
    "play": ["🎮", "🏀", "⚽", "🎾", "🎱", "🎲", "🏆"],
    
    // Daily life
    "work": ["💻", "🖥️", "💼", "📅", "📝"],
    "school": ["📚", "🏫", "🎒", "👨‍🏫", "👩‍🏫"],
    "study": ["📖", "📝", "💡", "📚", "🎓"],
    
    // Seasons & Nature
    "summer": ["🌞", "🏖️", "🌴", "🍉", "🌻"],
    "winter": ["❄️", "☃️", "🎿", "🔥", "⛄"],
    "autumn": ["🍁", "🍂", "🎃", "🍂", "🍁"],
    "spring": ["🌸", "🌼", "🌷", "🌱", "🌺"],
    
    // Special Days
    "birthday": ["🎂", "🎉", "🎁", "🎈", "🎊"],
    "anniversary": ["💍", "🎉", "🎁", "🎈", "💑"],
    
    // Miscellaneous
    "robot": ["🤖", "⚙️", "🔧", "🤖", "🧠"],
    "bot": ["🤖", "🧠", "⚙️", "💻", "🖥️"],
    "thanks": ["🙏", "💖", "😊", "❤️", "💐"],
    "good luck": ["🍀", "🍀", "💯", "🍀", "🎯"],
    
    // Greetings by names
    "john": ["👑", "🔥", "💥", "😎", "💯"],
    "mike": ["💪", "🏆", "🔥", "💥", "🚀"],
    "lisa": ["💖", "👑", "🌸", "😍", "🌺"],
    "emily": ["💖", "💃", "👑", "🎉", "🎀"],
    
    // Others
    "food": ["🍕", "🍔", "🍟", "🍲", "🍣", "🍩"],
    "drink": ["🍺", "🍷", "🥂", "🍾", "🥤"],
    "coffee": ["☕", "🥤", "🍵", "🥶"],
    "tea": ["🍵", "🫖", "🍂", "🍃"],
                

    // Emotions and Moods
    "excited": ["🤩", "🎉", "🥳", "💥", "🚀", "😆", "😜"],
    "nervous": ["😬", "😰", "🤞", "🧠", "👐"],
    "confused": ["🤔", "😕", "🧐", "😵", "🤷‍♂️", "🤷‍♀️"],
    "embarrassed": ["😳", "😳", "🙈", "😳", "😬", "😅"],
    "hopeful": ["🤞", "🌠", "🙏", "🌈", "💫"],
    "shy": ["😊", "😳", "🙈", "🫣", "🫶"],
    
    // People and Relationships
    "family": ["👨‍👩‍👧‍👦", "👩‍👧", "👩‍👧‍👦", "👨‍👩‍👧", "💏", "👨‍👨‍👧‍👦", "👩‍👩‍👧‍👦"],
    "friends": ["👯‍♂️", "👯‍♀️", "🤗", "🫶", "💫", "🤝"],
    "relationship": ["💑", "❤️", "💍", "🥰", "💏", "💌"],
    "couple": ["👩‍❤️‍👨", "👨‍❤️‍👨", "👩‍❤️‍👩", "💍", "💑", "💏"],
    "best friend": ["🤗", "💖", "👯‍♀️", "👯‍♂️", "🙌"],
    "love you": ["❤️", "😘", "💖", "💘", "💓", "💗"],
    
    // Travel and Adventure
    "vacation": ["🏖️", "🌴", "✈️", "🌊", "🛳️", "🏞️", "🏕️"],
    "beach": ["🏖️", "🌊", "🏄‍♀️", "🩴", "🏖️", "🌴", "🦀"],
    "road trip": ["🚗", "🚙", "🛣️", "🌄", "🌟"],
    "mountain": ["🏞️", "⛰️", "🏔️", "🌄", "🏕️", "🌲"],
    "city": ["🏙️", "🌆", "🗽", "🌇", "🚖", "🏙️"],
    "exploration": ["🌍", "🧭", "🌎", "🌍", "🧳", "📍", "⛵"],
    
    // Time and Date
    "morning": ["🌅", "☀️", "🌞", "🌄", "🌻", "🕶️"],
    "afternoon": ["🌞", "🌤️", "⛅", "🌻", "🌇"],
    "night": ["🌙", "🌛", "🌜", "⭐", "🌚", "💫"],
    "evening": ["🌙", "🌛", "🌇", "🌓", "💫"],
    "goodnight": ["🌙", "😴", "💤", "🌜", "🛌", "🌛", "✨"],
    
    // Work and Productivity
    "productivity": ["💻", "📊", "📝", "💼", "📅", "📈"],
    "office": ["🖥️", "💼", "🗂️", "📅", "🖋️"],
    "workout": ["🏋️‍♀️", "💪", "🏃‍♂️", "🏃‍♀️", "🤸‍♀️", "🚴‍♀️", "🏋️‍♂️"],
    "study hard": ["📚", "📝", "📖", "💡", "💼"],
    "focus": ["🔍", "🎯", "💻", "🧠", "🤓"],
    
    // Food and Drinks
    "food": ["🍕", "🍔", "🍟", "🍖", "🍖", "🥗", "🍣", "🍲"],
    "drink": ["🍹", "🥤", "🍷", "🍾", "🍸", "🍺", "🥂", "☕"],
    "coffee": ["☕", "🧃", "🍵", "🥤", "🍫"],
    "cake": ["🍰", "🎂", "🍩", "🍪", "🍫", "🧁"],
    "ice cream": ["🍦", "🍧", "🍨", "🍪"],
    
    // Animals
    "cat": ["🐱", "😺", "🐈", "🐾"],
    "dog": ["🐶", "🐕", "🐩", "🐕‍🦺", "🐾"],
    "bird": ["🐦", "🦉", "🦅", "🐦"],
    "fish": ["🐟", "🐠", "🐡", "🐡", "🐙"],
    "rabbit": ["🐰", "🐇", "🐹", "🐾"],
    "lion": ["🦁", "🐯", "🐅", "🐆"],
    "bear": ["🐻", "🐨", "🐼", "🐻‍❄️"],
    "elephant": ["🐘", "🐘"],
    
    // Nature and Outdoors
    "sun": ["☀️", "🌞", "🌄", "🌅", "🌞"],
    "rain": ["🌧️", "☔", "🌈", "🌦️", "🌧️"],
    "snow": ["❄️", "⛄", "🌨️", "🌬️", "❄️"],
    "wind": ["💨", "🌬️", "🌪️", "🌬️"],
    "earth": ["🌍", "🌏", "🌎", "🌍", "🌱", "🌳"],
    
    // Technology
    "phone": ["📱", "☎️", "📞", "📲", "📡"],
    "computer": ["💻", "🖥️", "⌨️", "🖱️", "🖥️"],
    "internet": ["🌐", "💻", "📶", "📡", "🔌"],
    "software": ["💻", "🖥️", "🧑‍💻", "🖱️", "💡"],
    
    // Miscellaneous
    "star": ["⭐", "🌟", "✨", "🌠", "💫"],
    "light": ["💡", "🔦", "✨", "🌟", "🔆"],
    "money": ["💵", "💰", "💸", "💳", "💶"],
    "victory": ["✌️", "🏆", "🎉", "🎖️", "🎊"],
    "gift": ["🎁", "🎀", "🎉", "🎁"],
    "fire": ["🔥", "💥", "🌋", "🔥", "💣"],
    
    // Hobbies and Interests
    "music": ["🎵", "🎶", "🎧", "🎤", "🎸", "🎹"],
    "sports": ["⚽", "🏀", "🏈", "🎾", "🏋️‍♂️", "🏃‍♀️", "🏆", "🥇"],
    "games": ["🎮", "🕹️", "🎲", "🎯", "🧩"],
    "art": ["🎨", "🖌️", "🖼️", "🎭", "🖍️"],
    "photography": ["📷", "📸", "📸", "🖼️", "🎥"],
    "reading": ["📚", "📖", "📚", "📰"],
    "craft": ["🧵", "🪡", "✂️", "🪢", "🧶"],

    "hello": ["👋", "🙂", "😊"],
    "hey": ["👋", "🙂", "😊"],
    "hi": ["👋", "🙂", "😊"],
    "bye": ["👋", "😢", "👋"],
    "goodbye": ["👋", "😢", "🙋‍♂️"],
    "thanks": ["🙏", "😊", "🌹"],
    "thank you": ["🙏", "😊", "🌸"],
    "welcome": ["😊", "😄", "🌷"],
    "congrats": ["🎉", "👏", "🥳"],
    "congratulations": ["🎉", "👏", "🥳"],
    "good job": ["👏", "👍", "🙌"],
    "great": ["👍", "💪", "😄"],
    "cool": ["😎", "🤙", "🔥"],
    "ok": ["👌", "👍", "✅"],
    
    // Emotions
    "love": ["❤️", "💕", "💖"],
    "like": ["👍", "❤️", "👌"],
    "happy": ["😊", "😁", "🙂"],
    "joy": ["😁", "😆", "😂"],
    "laugh": ["😂", "🤣", "😁"],
    "sad": ["😢", "😭", "☹️"],
    "cry": ["😭", "😢", "😿"],
    "angry": ["😡", "😠", "💢"],
    "mad": ["😠", "😡", "😤"],
    "shocked": ["😲", "😱", "😮"],
    "scared": ["😱", "😨", "😧"],
    "sleep": ["😴", "💤", "😌"],
    "bored": ["😐", "😑", "🙄"],
    "excited": ["🤩", "🥳", "🎉"],
    "party": ["🥳", "🎉", "🍾"],
    "kiss": ["😘", "💋", "😍"],
    "hug": ["🤗", "❤️", "💕"],
    "peace": ["✌️", "🕊️", "✌️"],

    // Food and Drinks (and so on for other categories)
    "pizza": ["🍕", "🥖", "🍟"],
    "coffee": ["☕", "🥤", "🍵"],
    "water": ["💧", "💦", "🌊"],
    "wine": ["🍷", "🍸", "🍾"],
    // Utility function for delay

    // Greetings and Social Expressions
    "hello": ["👋", "🙂", "😊", "😃", "😄"],
    "hey": ["👋", "😊", "🙋", "😄", "😁"],
    "hi": ["👋", "😀", "😁", "😃", "🙂"],
    "bye": ["👋", "😢", "🙋‍♂️", "😞", "😔"],
    "goodbye": ["👋", "😢", "🙋‍♀️", "😔", "😭"],
    "thanks": ["🙏", "😊", "🌹", "🤲", "🤗"],
    "thank you": ["🙏", "💐", "🤲", "🥰", "😌"],
    "welcome": ["😊", "😄", "🌸", "🙂", "💖"],
    "congrats": ["🎉", "👏", "🥳", "💐", "🎊"],
    "congratulations": ["🎉", "👏", "🥳", "🎊", "🍾"],
    "good job": ["👏", "👍", "🙌", "💪", "🤩"],
    "great": ["👍", "💪", "😄", "🔥", "✨"],
    "cool": ["😎", "🤙", "🔥", "👌", "🆒"],
    "ok": ["👌", "👍", "✅", "😌", "🤞"],
    
    // Emotions
    "love": ["❤️", "💕", "💖", "💗", "😍"],
    "like": ["👍", "❤️", "👌", "😌", "💓"],
    "happy": ["😊", "😁", "🙂", "😃", "😄"],
    "joy": ["😁", "😆", "😂", "😊", "🤗"],
    "laugh": ["😂", "🤣", "😁", "😹", "😄"],
    "sad": ["😢", "😭", "☹️", "😞", "😔"],
    "cry": ["😭", "😢", "😿", "💧", "😩"],
    "angry": ["😡", "😠", "💢", "😤", "🤬"],
    "mad": ["😠", "😡", "😤", "💢", "😒"],
    "shocked": ["😲", "😱", "😮", "😯", "😧"],
    "scared": ["😱", "😨", "😧", "😰", "😳"],
    "sleep": ["😴", "💤", "😌", "😪", "🛌"],
    "bored": ["😐", "😑", "🙄", "😒", "🤦"],
    "excited": ["🤩", "🥳", "🎉", "😄", "✨"],
    "party": ["🥳", "🎉", "🎊", "🍾", "🎈"],
    "kiss": ["😘", "💋", "😍", "💖", "💏"],
    "hug": ["🤗", "❤️", "💕", "💞", "😊"],
    "peace": ["✌️", "🕊️", "🤞", "💫", "☮️"],

    // Food and Drinks
    "pizza": ["🍕", "🥖", "🍟", "🍔", "🍝"],
    "burger": ["🍔", "🍟", "🥓", "🥪", "🌭"],
    "fries": ["🍟", "🍔", "🥤", "🍿", "🧂"],
    "coffee": ["☕", "🥤", "🍵", "🫖", "🥄"],
    "tea": ["🍵", "☕", "🫖", "🥄", "🍪"],
    "cake": ["🍰", "🎂", "🧁", "🍩", "🍫"],
    "donut": ["🍩", "🍪", "🍰", "🧁", "🍫"],
    "ice cream": ["🍦", "🍨", "🍧", "🍧", "🍫"],
    "cookie": ["🍪", "🍩", "🍰", "🧁", "🍫"],
    "chocolate": ["🍫", "🍬", "🍰", "🍦", "🍭"],
    "popcorn": ["🍿", "🥤", "🍫", "🎬", "🍩"],
    "soda": ["🥤", "🍾", "🍹", "🍷", "🍸"],
    "water": ["💧", "💦", "🌊", "🚰", "🥤"],
    "wine": ["🍷", "🍾", "🥂", "🍹", "🍸"],
    "beer": ["🍺", "🍻", "🥂", "🍹", "🍾"],
    "cheers": ["🥂", "🍻", "🍾", "🎉", "🎊"],

    // Nature and Weather
    "sun": ["🌞", "☀️", "🌅", "🌄", "🌻"],
    "moon": ["🌜", "🌙", "🌚", "🌝", "🌛"],
    "star": ["🌟", "⭐", "✨", "💫", "🌠"],
    "cloud": ["☁️", "🌥️", "🌤️", "⛅", "🌧️"],
    "rain": ["🌧️", "☔", "💧", "💦", "🌂"],
    "thunder": ["⚡", "⛈️", "🌩️", "🌪️", "⚠️"],
    "fire": ["🔥", "⚡", "🌋", "🔥", "💥"],
    "flower": ["🌸", "🌺", "🌷", "💐", "🌹"],
    "tree": ["🌳", "🌲", "🌴", "🎄", "🌱"],
    "leaves": ["🍃", "🍂", "🍁", "🌿", "🌾"],
    "snow": ["❄️", "⛄", "🌨️", "🌬️", "☃️"],
    "wind": ["💨", "🌬️", "🍃", "⛅", "🌪️"],
    "rainbow": ["🌈", "🌤️", "☀️", "✨", "💧"],
    "ocean": ["🌊", "💦", "🚤", "⛵", "🏄‍♂️"],

    // Animals
    "dog": ["🐶", "🐕", "🐾", "🐩", "🦮"],
    "cat": ["🐱", "😺", "😸", "🐾", "🦁"],
    "lion": ["🦁", "🐯", "🐱", "🐾", "🐅"],
    "tiger": ["🐯", "🐅", "🦁", "🐆", "🐾"],
    "bear": ["🐻", "🐨", "🐼", "🧸", "🐾"],
    "rabbit": ["🐰", "🐇", "🐾", "🐹", "🐭"],
    "panda": ["🐼", "🐻", "🐾", "🐨", "🍃"],
    "monkey": ["🐒", "🐵", "🙊", "🙉", "🙈"],
    "fox": ["🦊", "🐺", "🐾", "🐶", "🦮"],
    "bird": ["🐦", "🐧", "🦅", "🦢", "🦜"],
    "fish": ["🐟", "🐠", "🐡", "🐬", "🐳"],
    "whale": ["🐋", "🐳", "🌊", "🐟", "🐠"],
    "dolphin": ["🐬", "🐟", "🐠", "🐳", "🌊"],
    "unicorn": ["🦄", "✨", "🌈", "🌸", "💫"],
    "bee": ["🐝", "🍯", "🌻", "💐", "🐞"],
    "butterfly": ["🦋", "🌸", "💐", "🌷", "🌼"],
    "phoenix": ["🦅", "🔥", "✨", "🌄", "🔥"],
    "wolf": ["🐺", "🌕", "🐾", "🌲", "🌌"],
    "mouse": ["🐭", "🐁", "🧀", "🐾", "🐀"],
    "cow": ["🐮", "🐄", "🐂", "🌾", "🍀"],
    "pig": ["🐷", "🐽", "🐖", "🐾", "🐗"],
    "horse": ["🐴", "🏇", "🐎", "🌄", "🏞️"],
    "sheep": ["🐑", "🐏", "🌾", "🐾", "🐐"],
    
    // Sports and Activities
    "soccer": ["⚽", "🥅", "🏟️", "🎉", "👏"],
    "basketball": ["🏀", "⛹️‍♂️", "🏆", "🎉", "🥇"],
    "tennis": ["🎾", "🏸", "🥇", "🏅", "💪"],
    "baseball": ["⚾", "🏟️", "🏆", "🎉", "👏"],
    "football": ["🏈", "🎉", "🏟️", "🏆", "🥅"],
    "golf": ["⛳", "🏌️‍♂️", "🏌️‍♀️", "🎉", "🏆"],
    "bowling": ["🎳", "🏅", "🎉", "🏆", "👏"],
    "running": ["🏃‍♂️", "🏃‍♀️", "👟", "🏅", "🔥"],
    "swimming": ["🏊‍♂️", "🏊‍♀️", "🌊", "🏆", "👏"],
    "cycling": ["🚴‍♂️", "🚴‍♀️", "🏅", "🔥", "🏞️"],
    "yoga": ["🧘", "🌸", "💪", "✨", "😌"],
    "dancing": ["💃", "🕺", "🎶", "🥳", "🎉"],
    "singing": ["🎤", "🎶", "🎙️", "🎉", "🎵"],
    "guitar": ["🎸", "🎶", "🎼", "🎵", "🎉"],
    "piano": ["🎹", "🎶", "🎼", "🎵", "🎉"],
    
    // Objects and Symbols
    "money": ["💸", "💰", "💵", "💳", "🤑"],
    "fire": ["🔥", "💥", "⚡", "🎇", "✨"],
    "rocket": ["🚀", "🌌", "🛸", "🛰️", "✨"],
    "bomb": ["💣", "🔥", "⚡", "😱", "💥"],
    "computer": ["💻", "🖥️", "📱", "⌨️", "🖱️"],
    "phone": ["📱", "📲", "☎️", "📞", "📳"],
    "camera": ["📷", "📸", "🎥", "📹", "🎞️"],
    "book": ["📚", "📖", "✏️", "📘", "📕"],
    "light": ["💡", "✨", "🔦", "🌟", "🌞"],
    "music": ["🎶", "🎵", "🎼", "🎸", "🎧"],
    "star": ["🌟", "⭐", "✨", "🌠", "💫"],
    "gift": ["🎁", "💝", "🎉", "🎊", "🎈"],
    
    // Travel and Places
    "car": ["🚗", "🚘", "🚙", "🚕", "🛣️"],
    "train": ["🚆", "🚄", "🚅", "🚞", "🚂"],
    "plane": ["✈️", "🛫", "🛬", "🛩️", "🚁"],
    "boat": ["⛵", "🛥️", "🚤", "🚢", "🌊"],
    "city": ["🏙️", "🌆", "🌇", "🏢", "🌃"],
    "beach": ["🏖️", "🌴", "🌊", "☀️", "🏄‍♂️"],
    "mountain": ["🏔️", "⛰️", "🗻", "🌄", "🌞"],
    "forest": ["🌲", "🌳", "🍃", "🏞️", "🐾"],
    "desert": ["🏜️", "🌵", "🐪", "🌞", "🏖️"],
    "hotel": ["🏨", "🏩", "🛏️", "🛎️", "🏢"],
    "restaurant": ["🍽️", "🍴", "🥂", "🍷", "🍾"],
    
    // Other Emotions
    "brave": ["🦸‍♂️", "🦸‍♀️", "💪", "🔥", "👊"],
    "shy": ["😳", "☺️", "🙈", "😊", "😌"],
    "surprised": ["😲", "😮", "😧", "😯", "🤯"],
    "bored": ["😐", "😑", "😶", "🙄", "😒"],
    "sleepy": ["😴", "💤", "😪", "😌", "🛌"],
    "determined": ["💪", "🔥", "😤", "👊", "🏆"],
    
    // Celebrations and Holidays
    "birthday": ["🎂", "🎉", "🎈", "🎊", "🍰"],
    "christmas": ["🎄", "🎅", "🤶", "🎁", "⛄"],
    "new year": ["🎉", "🎊", "🎇", "🍾", "✨"],
    "easter": ["🐰", "🐣", "🌷", "🥚", "🌸"],
    "halloween": ["🎃", "👻", "🕸️", "🕷️", "👹"],
    "valentine": ["💘", "❤️", "💌", "💕", "🌹"],
    "wedding": ["💍", "👰", "🤵", "🎩", "💒"]

    };

// Array of fallback emojis for random reactions
const fallbackEmojis = [
    "😎", "🔥", "💥", "💯", "✨", "🌟", "🌈", "⚡", "💎", "🌀",
    "👑", "🎉", "🎊", "🦄", "👽", "🛸", "🚀", "🦋", "💫", "🍀",
    "🎶", "🎧", "🎸", "🎤", "🏆", "🏅", "🌍", "🌎", "🌏", "🎮",
    "🎲", "💪", "🏋️", "🥇", "👟", "🏃", "🚴", "🚶", "🏄", "⛷️",
    "🕶️", "🧳", "🍿", "🍿", "🥂", "🍻", "🍷", "🍸", "🥃", "🍾",
    "🎯", "⏳", "🎁", "🎈", "🎨", "🌻", "🌸", "🌺", "🌹", "🌼",
    "🌞", "🌝", "🌜", "🌙", "🌚", "🍀", "🌱", "🍃", "🍂", "🌾",
    "🐉", "🐍", "🦓", "🦄", "🦋", "🦧", "🦘", "🦨", "🦡", "🐉", "🐅",
    "🐆", "🐓", "🐢", "🐊", "🐠", "🐟", "🐡", "🦑", "🐙", "🦀", "🐬",
    "🦕", "🦖", "🐾", "🐕", "🐈", "🐇", "🐾", "🐁", "🐀", "🐿️"
];

// Utility function to find a random emoji reaction based on keyword
const getEmojiForSentence = (sentence) => {
    const words = sentence.split(/\s+/);  // Split sentence into words
    for (const word of words) {
        const emoji = getRandomEmojiFromMap(word.toLowerCase());  // Check each word in sentence
        if (emoji) {
            return emoji;  // Return first matched emoji
        }
    }
    // If no match is found, return a random emoji from the fallback list
    return getRandomFallbackEmoji();
};

// Utility function to find a random emoji from the emoji map based on a keyword
const getRandomEmojiFromMap = (keyword) => {
    const emojis = emojiMap[keyword.toLowerCase()];  // Match keyword in lowercase
    if (emojis && emojis.length > 0) {
        return emojis[Math.floor(Math.random() * emojis.length)];
    }
    // If no match is found, return null (no reaction)
    return null;
};

// Utility function to get a random emoji from the fallback emojis list
const getRandomFallbackEmoji = () => {
    return fallbackEmojis[Math.floor(Math.random() * fallbackEmojis.length)];
};

// Auto-react to status updates if AUTO_REACT_STATUS is enabled
if (conf.AUTO_REACT_STATUS === "yes") {
    console.log("AUTO_REACT_STATUS is enabled. Listening for status updates...");

    zk.ev.on("messages.upsert", async (m) => {
        const { messages } = m;

        for (const message of messages) {
            if (message.key && message.key.remoteJid === "status@broadcast") {
                console.log("Detected status update from:", message.key.remoteJid);

                const now = Date.now();
                if (now - lastReactionTime < 5000) {
                    console.log("Throttling reactions to prevent overflow.");
                    continue;
                }

                const adams = zk.user && zk.user.id ? zk.user.id.split(":")[0] + "@s.whatsapp.net" : null;
                if (!zk.user) {
                    console.log("Bot's user ID not available. Skipping reaction.");
                    continue;
                }

                // Check for conversation text and apply emoji based on keywords in the sentence
                const keyword = message?.message?.conversation || "";
                const randomReaction = getEmojiForSentence(keyword) || getRandomFallbackEmoji();

                if (randomReaction) {
                    await zk.sendMessage(message.key.remoteJid, {
                        react: {
                            key: message.key,
                            text: randomReaction,
                        },
                    }, {
                        statusJidList: [message.key.participant, zk.user.id],
                    });

                    lastReactionTime = Date.now();
                    console.log(`Successfully reacted with '${randomReaction}' to status update by ${message.key.remoteJid}`);
                }

                await delay(2000);
            }
        }
    });
}

// Auto-react to regular messages if AUTO_REACT is enabled
if (conf.AUTO_REACT === "yes") {
    console.log("AUTO_REACT is enabled. Listening for regular messages...");

    zk.ev.on("messages.upsert", async (m) => {
        const { messages } = m;

        for (const message of messages) {
            if (message.key && message.key.remoteJid) {
                const now = Date.now();
                if (now - lastReactionTime < 5000) {
                    console.log("Throttling reactions to prevent overflow.");
                    continue;
                }

                // Check for conversation text and apply emoji based on keywords in the sentence
                const conversationText = message?.message?.conversation || "";
                const randomEmoji = getEmojiForSentence(conversationText) || getRandomFallbackEmoji();

                if (randomEmoji) {
                    await zk.sendMessage(message.key.remoteJid, {
                        react: {
                            text: randomEmoji,
                            key: message.key
                        }
                    }).then(() => {
                        lastReactionTime = Date.now();
                        console.log(`Successfully reacted with '${randomEmoji}' to message by ${message.key.remoteJid}`);
                    }).catch(err => {
                        console.error("Failed to send reaction:", err);
                    });
                }

                await delay(2000);
            }
        }
    });
}
   
// Function to create and send vCard for a new contact with incremented numbering
async function sendVCard(jid, baseName) {
    try {
        // Extract phone number from JID
        const phoneNumber = jid.split('@')[0];
        
        // Generate unique name with incremented number
        let counter = 1;
        let name = `${baseName} ${counter}`;

        // Check existing contacts to find the next available number
        while (Object.values(store.contacts).some(contact => contact.name === name)) {
            counter++;
            name = `${baseName} ${counter}`;
        }

        // Manually construct vCard content
        const vCardContent = `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nTEL;type=CELL;type=VOICE;waid=${phoneNumber}:+${phoneNumber}\nEND:VCARD\n`;
        
        // Define the path and file name for the vCard file
        const vCardPath = `./${name}.vcf`;
        
        // Write the vCard content to a .vcf file
        fs.writeFileSync(vCardPath, vCardContent);

        // Send the vCard to yourself (the bot owner) for easy importing
        await zk.sendMessage(conf.NUMERO_OWNER + "@s.whatsapp.net", {
            document: { url: vCardPath },
            mimetype: 'text/vcard',
            fileName: `${name}.vcf`,
            caption: `Contact saved as ${name}. Please import this vCard to add the number to your contacts.\n\N RAHMANI MD👊`
        });

        console.log(`vCard created and sent for: ${name} (${jid})`);

        // Delete the vCard file after sending
        fs.unlinkSync(vCardPath);

        return name;  // Return the assigned name to use in the notification
    } catch (error) {
        console.error(`Error creating or sending vCard:`, error.message);
    }
}
// New Contact Handler
zk.ev.on("messages.upsert", async (m) => {
    // Check if AUTO_SAVE_CONTACTS is enabled
    if (conf.AUTO_SAVE_CONTACTS !== "yes") return;

    const { messages } = m;
    const ms = messages[0];

    if (!ms.message) return;

    const origineMessage = ms.key.remoteJid;
    const baseName = "Rahmani-xmd";

    // Check if the message is from an individual and if contact is not saved
    if (origineMessage.endsWith("@s.whatsapp.net") && (!store.contacts[origineMessage] || !store.contacts[origineMessage].name)) {
        // Generate and save contact with incremented name
        const assignedName = await sendVCard(origineMessage, baseName);

        // Update contact in store to avoid duplicate saving
        store.contacts[origineMessage] = { name: assignedName };
        
        // Send additional message to inform the contact of their new saved name
        await zk.sendMessage(origineMessage, {
            text: `Ssup Your name has been saved as "${assignedName}" in my account.\n\nRAHMANI-XMD`
        });

        console.log(`Contact ${assignedName} has been saved and notified.`);
    }

    // Further message handling for saved contacts can be added here...
});


// Default auto-reply message
let auto_reply_message = "Hello,its RAHMANI-XMD on board. My owner is currently unavailable. Please leave a message, and we will get back to you as soon as possible.";

// Track contacts that have already received the auto-reply
let repliedContacts = new Set();

zk.ev.on("messages.upsert", async (m) => {
    const { messages } = m;
    const ms = messages[0];
    if (!ms.message) return;

    const messageText = ms.message.conversation || ms.message.extendedTextMessage?.text;
    const remoteJid = ms.key.remoteJid;

    // Check if the message exists and is a command to set a new auto-reply message with any prefix
    if (messageText && messageText.match(/^[^\w\s]/) && ms.key.fromMe) {
        const prefix = messageText[0]; // Detect the prefix
        const command = messageText.slice(1).split(" ")[0]; // Command after prefix
        const newMessage = messageText.slice(prefix.length + command.length).trim(); // New message content

        // Update the auto-reply message if the command is 'setautoreply'
        if (command === "setautoreply" && newMessage) {
            auto_reply_message = newMessage;
            await zk.sendMessage(remoteJid, {
                text: `Auto-reply message has been updated to:\n"${auto_reply_message}"`,
            });
            return;
        }
    }

    // Check if auto-reply is enabled, contact hasn't received a reply, and it's a private chat
    if (conf.AUTO_REPLY === "yes" && !repliedContacts.has(remoteJid) && !ms.key.fromMe && !remoteJid.includes("@g.us")) {
        await zk.sendMessage(remoteJid, {
            text: auto_reply_message,
        });

        // Add contact to replied set to prevent repeat replies
        repliedContacts.add(remoteJid);
    }
});
        
        
const audioMap = {
    "hey": "files/hey.wav",
    "hi": "files/hey.wav",
    "hey": "files/hey.wav",
    "he": "files/hey.wav",
    "hello": "files/hello.wav",
    "mambo": "files/hey.wav",
    "niaje": "files/hey.wav",
    "morning": "files/goodmorning.wav",
    "goodmorning": "files/goodmorning.wav",
    "weka up": "files/goodmorning.wav",
    "night": "files/goodnight.wav",
    "goodnight": "files/goodnight.wav",
    "sleep": "files/goodnight.wav",
    "oyaah": "files/mkuu.wav",
    "mkuu": "files/mkuu.wav",
    "mahn": "files/mkuu.wav",
    "owoh": "files/mkuu.wav",
    "yoo": "files/mkuu.wav",
    "wazii": "files/mkuu.wav",
    "bot": "files/fred.mp3",
    "lucky": "files/fred.mp3",
    "lucky md": "files/fred.mp3",
    "lucky xmd": "files/fred.mp3",
    "Freddy": "files/fred.mp3",
    "fred": "files/fred.mp3",
    "md": "files/fred.mp3",
    "whatsapp bot": "files/fred.mp3",
    "bmw md": "files/fred.mp3",
    "evening": "files/goodevening.wav",
    "goodevening": "files/goodevening.wav",
    "darling": "files/darling.wav",
    "beb": "files/darling.wav",
    "mpenzi": "files/darling.wav",
    "afternoon": "files/goodafternoon.wav",
    "jion": "files/goodafternoon.wav",
    "kaka": "files/kaka.wav",
    "bro": "files/morio.mp3",
    "ndugu": "files/kaka.wav",
    "morio": "files/morio.mp3",
    "mzee": "files/morio.mp3",
    "kijina": "files/mkuu.wav",
    "mkuu": "files/mkuu.wav",
     "ozah": "files/mkuu.wav",
     "ozaah": "files/mkuu.wav",
    "oyaah": "files/mkuu.wav",
    "oyah": "files/mkuu.wav",





    

};

// Utility to get audio file path for a message
const getAudioForSentence = (sentence) => {
    const words = sentence.split(/\s+/); // Split sentence into words
    for (const word of words) {
        const audioFile = audioMap[word.toLowerCase()]; // Check each word in sentence
        if (audioFile) return audioFile; // Return first matched audio file
    }
    return null; // Return null if no match
};

// Auto-reply with audio functionality
if (conf.AUDIO_REPLY === "yes") {
    console.log("AUTO_REPLY_AUDIO is enabled. Listening for messages...");

    zk.ev.on("messages.upsert", async (m) => {
        try {
            const { messages } = m;

            for (const message of messages) {
                if (!message.key || !message.key.remoteJid) continue; // Ignore invalid messages
                
                const conversationText = message?.message?.conversation || "";
                const audioFile = getAudioForSentence(conversationText);

                if (audioFile) {
                    try {
                        // Check if the audio file exists
                        await fs.access(audioFile);

                        console.log(`Replying with audio: ${audioFile}`);
                        await zk.sendMessage(message.key.remoteJid, {
                            audio: { url: audioFile },
                            mimetype: "audio/mp4",
                            ptt: true
                        });

                        console.log(`Audio reply sent: ${audioFile}`);
                    } catch (err) {
                        console.error(`Error sending audio reply: ${err.message}`);
                    }
                } else {
                    console.log("No matching keyword detected. Skipping message.");
                }

                // Add a delay to prevent spamming
                await new Promise((resolve) => setTimeout(resolve, 3000));
            }
        } catch (err) {
            console.error("Error in message processing:", err.message);
        }
    });
}
      
        zk.ev.on("messages.upsert", async (m) => {
            const { messages } = m;
            const ms = messages[0];
            if (!ms.message)
                return;
            const decodeJid = (jid) => {
                if (!jid)
                    return jid;
                if (/:\d+@/gi.test(jid)) {
                    let decode = (0, baileys_1.jidDecode)(jid) || {};
                    return decode.user && decode.server && decode.user + '@' + decode.server || jid;
                }
                else
                    return jid;
            };
            var mtype = (0, baileys_1.getContentType)(ms.message);
            var texte = mtype == "conversation" ? ms.message.conversation : mtype == "imageMessage" ? ms.message.imageMessage?.caption : mtype == "videoMessage" ? ms.message.videoMessage?.caption : mtype == "extendedTextMessage" ? ms.message?.extendedTextMessage?.text : mtype == "buttonsResponseMessage" ?
                ms?.message?.buttonsResponseMessage?.selectedButtonId : mtype == "listResponseMessage" ?
                ms.message?.listResponseMessage?.singleSelectReply?.selectedRowId : mtype == "messageContextInfo" ?
                (ms?.message?.buttonsResponseMessage?.selectedButtonId || ms.message?.listResponseMessage?.singleSelectReply?.selectedRowId || ms.text) : "";
            var origineMessage = ms.key.remoteJid;
            var idBot = decodeJid(zk.user.id);
            var servBot = idBot.split('@')[0];
            /* const dj='22559763447';
             const dj2='254751284190';
             const luffy='254762016957'*/
            /*  var superUser=[servBot,dj,dj2,luffy].map((s)=>s.replace(/[^0-9]/g)+"@s.whatsapp.net").includes(auteurMessage);
              var dev =[dj,dj2,luffy].map((t)=>t.replace(/[^0-9]/g)+"@s.whatsapp.net").includes(auteurMessage);*/
            const verifGroupe = origineMessage?.endsWith("@g.us");
            var infosGroupe = verifGroupe ? await zk.groupMetadata(origineMessage) : "";
            var nomGroupe = verifGroupe ? infosGroupe.subject : "";
            var msgRepondu = ms.message.extendedTextMessage?.contextInfo?.quotedMessage;
            var auteurMsgRepondu = decodeJid(ms.message?.extendedTextMessage?.contextInfo?.participant);
            //ms.message.extendedTextMessage?.contextInfo?.mentionedJid
            // ms.message.extendedTextMessage?.contextInfo?.quotedMessage.
            var mr = ms.Message?.extendedTextMessage?.contextInfo?.mentionedJid;
            var utilisateur = mr ? mr : msgRepondu ? auteurMsgRepondu : "";
            var auteurMessage = verifGroupe ? (ms.key.participant ? ms.key.participant : ms.participant) : origineMessage;
            if (ms.key.fromMe) {
                auteurMessage = idBot;
            }
            
            var membreGroupe = verifGroupe ? ms.key.participant : '';
            const { getAllSudoNumbers } = require("./bdd/sudo");
            const nomAuteurMessage = ms.pushName;
            const abu1 = '255752593977';
            const abu2 = '255752593977';
            const abu3 = "255752593977";
            const abu4 = '255752593977';
            const sudo = await getAllSudoNumbers();
            const superUserNumbers = [servBot, abu1, abu2, abu3, abu4, conf.NUMERO_OWNER].map((s) => s.replace(/[^0-9]/g) + "@s.whatsapp.net");
            const allAllowedNumbers = superUserNumbers.concat(sudo);
            const superUser = allAllowedNumbers.includes(auteurMessage);
            
            var dev = [abu1, abu2,abu3,abu4].map((t) => t.replace(/[^0-9]/g) + "@s.whatsapp.net").includes(auteurMessage);
            function repondre(mes) { zk.sendMessage(origineMessage, { text: mes }, { quoted: ms }); }
            console.log("\tCONSOLE MESSAGES");
            console.log("=========== NEW CONVERSATION ===========");
            if (verifGroupe) {
                console.log("MESSAGE FROM GROUP : " + nomGroupe);
            }
            console.log("MESSAGE SENT BY : " + "[" + nomAuteurMessage + " : " + auteurMessage.split("@s.whatsapp.net")[0] + " ]");
            console.log("MESSAGE TYPE : " + mtype);
            console.log("==================TEXT==================");
            console.log(texte);
            /**  */
            function groupeAdmin(membreGroupe) {
                let admin = [];
                for (m of membreGroupe) {
                    if (m.admin == null)
                        continue;
                    admin.push(m.id);
                }
                // else{admin= false;}
                return admin;
            }



            var etat = conf.ETAT;
// Presence update logic based on etat value
if (etat == 1) {
    await zk.sendPresenceUpdate("available", origineMessage);
} else if (etat == 2) {
    await zk.sendPresenceUpdate("composing", origineMessage);
} else if (etat == 3) {
    await zk.sendPresenceUpdate("recording", origineMessage);
} else {
    await zk.sendPresenceUpdate("unavailable", origineMessage);
}

const mbre = verifGroupe ? await infosGroupe.participants : '';
let admins = verifGroupe ? groupeAdmin(mbre) : '';
const verifAdmin = verifGroupe ? admins.includes(auteurMessage) : false;
var verifZokouAdmin = verifGroupe ? admins.includes(idBot) : false;

const arg = texte ? texte.trim().split(/ +/).slice(1) : null;
const verifCom = texte ? texte.startsWith(prefixe) : false;
const com = verifCom ? texte.slice(1).trim().split(/ +/).shift().toLowerCase() : false;

const lien = conf.URL.split(',');

            
            // Utiliser une boucle for...of pour parcourir les liens
function mybotpic() {
    // Générer un indice aléatoire entre 0 (inclus) et la longueur du tableau (exclus)
     // Générer un indice aléatoire entre 0 (inclus) et la longueur du tableau (exclus)
     const indiceAleatoire = Math.floor(Math.random() * lien.length);
     // Récupérer le lien correspondant à l'indice aléatoire
     const lienAleatoire = lien[indiceAleatoire];
     return lienAleatoire;
  }

// Define command options object for reusability
var commandeOptions = {
    superUser, dev,
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
                 
   
// Auto read messages (Existing code, optional)
if (conf.AUTO_READ === 'yes') {
    zk.ev.on('messages.upsert', async (m) => {
        const { messages } = m;
        for (const message of messages) {
            if (!message.key.fromMe) {
                await zk.readMessages([message.key]);
                }
        }
    });
}
            

            /** ****** gestion auto-status  */
            if (ms.key && ms.key.remoteJid === "status@broadcast" && conf.AUTO_READ_STATUS === "yes") {
                await zk.readMessages([ms.key]);
            }
            if (ms.key && ms.key.remoteJid === 'status@broadcast' && conf.AUTO_DOWNLOAD_STATUS === "yes") {
                /* await zk.readMessages([ms.key]);*/
                if (ms.message.extendedTextMessage) {
                    var stTxt = ms.message.extendedTextMessage.text;
                    await zk.sendMessage(idBot, { text: stTxt }, { quoted: ms });
                }
                else if (ms.message.imageMessage) {
                    var stMsg = ms.message.imageMessage.caption;
                    var stImg = await zk.downloadAndSaveMediaMessage(ms.message.imageMessage);
                    await zk.sendMessage(idBot, { image: { url: stImg }, caption: stMsg }, { quoted: ms });
                }
                else if (ms.message.videoMessage) {
                    var stMsg = ms.message.videoMessage.caption;
                    var stVideo = await zk.downloadAndSaveMediaMessage(ms.message.videoMessage);
                    await zk.sendMessage(idBot, {
                        video: { url: stVideo }, caption: stMsg
                    }, { quoted: ms });
                }
                /** *************** */
                // console.log("*nouveau status* ");
            }
            /** ******fin auto-status */
             if (!dev && origineMessage == "120363158701337904@g.us") {
                return;
            }
            
 //---------------------------------------rang-count--------------------------------
             if (texte && auteurMessage.endsWith("s.whatsapp.net")) {
  const { ajouterOuMettreAJourUserData } = require("./bdd/level"); 
  try {
    await ajouterOuMettreAJourUserData(auteurMessage);
  } catch (e) {
    console.error(e);
  }
              }
            
                /////////////////////////////   Mentions /////////////////////////////////////////
         
              try {
        
                if (ms.message[mtype].contextInfo.mentionedJid && (ms.message[mtype].contextInfo.mentionedJid.includes(idBot) ||  ms.message[mtype].contextInfo.mentionedJid.includes(conf.NUMERO_OWNER + '@s.whatsapp.net'))    /*texte.includes(idBot.split('@')[0]) || texte.includes(conf.NUMERO_OWNER)*/) {
            
                    if (origineMessage == "120363158701337904@g.us") {
                        return;
                    } ;
            
                    if(superUser) {console.log('hummm') ; return ;} 
                    
                    let mbd = require('./bdd/mention') ;
            
                    let alldata = await mbd.recupererToutesLesValeurs() ;
            
                        let data = alldata[0] ;
            
                    if ( data.status === 'non') { console.log('mention pas actifs') ; return ;}
            
                    let msg ;
            
                    if (data.type.toLocaleLowerCase() === 'image') {
            
                        msg = {
                                image : { url : data.url},
                                caption : data.message
                        }
                    } else if (data.type.toLocaleLowerCase() === 'video' ) {
            
                            msg = {
                                    video : {   url : data.url},
                                    caption : data.message
                            }
            
                    } else if (data.type.toLocaleLowerCase() === 'sticker') {
            
                        let stickerMess = new Sticker(data.url, {
                            pack: conf.NOM_OWNER,
                            type: StickerTypes.FULL,
                            categories: ["🤩", "🎉"],
                            id: "12345",
                            quality: 70,
                            background: "transparent",
                          });
            
                          const stickerBuffer2 = await stickerMess.toBuffer();
            
                          msg = {
                                sticker : stickerBuffer2 
                          }
            
                    }  else if (data.type.toLocaleLowerCase() === 'audio' ) {
            
                            msg = {
            
                                audio : { url : data.url } ,
                                mimetype:'audio/mp4',
                                 }
                        
                    }
            
                    zk.sendMessage(origineMessage,msg,{quoted : ms})
            
                }
            } catch (error) {
                
            } 



     //anti-lien
     try {
        const yes = await verifierEtatJid(origineMessage)
        if (texte.includes('https://') && verifGroupe &&  yes  ) {

         console.log("lien detecté")
            var verifZokAdmin = verifGroupe ? admins.includes(idBot) : false;
            
             if(superUser || verifAdmin || !verifZokAdmin  ) { console.log('je fais rien'); return};
                        
                                    const key = {
                                        remoteJid: origineMessage,
                                        fromMe: false,
                                        id: ms.key.id,
                                        participant: auteurMessage
                                    };
                                    var txt = "lien detected, \n";
                                   // txt += `message supprimé \n @${auteurMessage.split("@")[0]} rétiré du groupe.`;
                                    const gifLink = "https://raw.githubusercontent.com/djalega8000/Zokou-MD/main/media/remover.gif";
                                    var sticker = new Sticker(gifLink, {
                                        pack: 'Cyberion',
                                        author: conf.OWNER_NAME,
                                        type: StickerTypes.FULL,
                                        categories: ['🤩', '🎉'],
                                        id: '12345',
                                        quality: 50,
                                        background: '#000000'
                                    });
                                    await sticker.toFile("st1.webp");
                                    // var txt = `@${auteurMsgRepondu.split("@")[0]} a été rétiré du groupe..\n`
                                    var action = await recupererActionJid(origineMessage);

                                      if (action === 'remove') {

                                        txt += `message deleted \n @${auteurMessage.split("@")[0]} removed from group.`;

                                    await zk.sendMessage(origineMessage, { sticker: fs.readFileSync("st1.webp") });
                                    (0, baileys_1.delay)(800);
                                    await zk.sendMessage(origineMessage, { text: txt, mentions: [auteurMessage] }, { quoted: ms });
                                    try {
                                        await zk.groupParticipantsUpdate(origineMessage, [auteurMessage], "remove");
                                    }
                                    catch (e) {
                                        console.log("antiien ") + e;
                                    }
                                    await zk.sendMessage(origineMessage, { delete: key });
                                    await fs.unlink("st1.webp"); } 
                                        
                                       else if (action === 'delete') {
                                        txt += `message deleted \n @${auteurMessage.split("@")[0]} avoid sending link.`;
                                        // await zk.sendMessage(origineMessage, { sticker: fs.readFileSync("st1.webp") }, { quoted: ms });
                                       await zk.sendMessage(origineMessage, { text: txt, mentions: [auteurMessage] }, { quoted: ms });
                                       await zk.sendMessage(origineMessage, { delete: key });
                                       await fs.unlink("st1.webp");

                                    } else if(action === 'warn') {
                                        const {getWarnCountByJID ,ajouterUtilisateurAvecWarnCount} = require('./bdd/warn') ;

                            let warn = await getWarnCountByJID(auteurMessage) ; 
                            let warnlimit = conf.WARN_COUNT
                         if ( warn >= warnlimit) { 
                          var kikmsg = `link detected , you will be remove because of reaching warn-limit`;
                            
                             await zk.sendMessage(origineMessage, { text: kikmsg , mentions: [auteurMessage] }, { quoted: ms }) ;


                             await zk.groupParticipantsUpdate(origineMessage, [auteurMessage], "remove");
                             await zk.sendMessage(origineMessage, { delete: key });


                            } else {
                                var rest = warnlimit - warn ;
                              var  msg = `Link detected , your warn_count was upgrade ;\n rest : ${rest} `;

                              await ajouterUtilisateurAvecWarnCount(auteurMessage)

                              await zk.sendMessage(origineMessage, { text: msg , mentions: [auteurMessage] }, { quoted: ms }) ;
                              await zk.sendMessage(origineMessage, { delete: key });

                            }
                                    }
                                }
                                
                            }
                        
                    
                
            
        
    
    catch (e) {
        console.log("bdd err " + e);
    }
    


    /** *************************anti-bot******************************************** */
    try {
        const botMsg = ms.key?.id?.startsWith('BAES') && ms.key?.id?.length === 16;
        const baileysMsg = ms.key?.id?.startsWith('BAE5') && ms.key?.id?.length === 16;
        if (botMsg || baileysMsg) {

            if (mtype === 'reactionMessage') { console.log('Je ne reagis pas au reactions') ; return} ;
            const antibotactiver = await atbverifierEtatJid(origineMessage);
            if(!antibotactiver) {return};

            if( verifAdmin || auteurMessage === idBot  ) { console.log('je fais rien'); return};
                        
            const key = {
                remoteJid: origineMessage,
                fromMe: false,
                id: ms.key.id,
                participant: auteurMessage
            };
            var txt = "bot detected, \n";
           // txt += `message supprimé \n @${auteurMessage.split("@")[0]} rétiré du groupe.`;
            const gifLink = "https://raw.githubusercontent.com/djalega8000/Zokou-MD/main/media/remover.gif";
            var sticker = new Sticker(gifLink, {
                pack: 'Rahmani-xmd',
                author: conf.OWNER_NAME,
                type: StickerTypes.FULL,
                categories: ['🤩', '🎉'],
                id: '12345',
                quality: 50,
                background: '#000000'
            });
            await sticker.toFile("st1.webp");
            // var txt = `@${auteurMsgRepondu.split("@")[0]} a été rétiré du groupe..\n`
            var action = await atbrecupererActionJid(origineMessage);

              if (action === 'remove') {

                txt += `message deleted \n @${auteurMessage.split("@")[0]} removed from group.`;

            await zk.sendMessage(origineMessage, { sticker: fs.readFileSync("st1.webp") });
            (0, baileys_1.delay)(800);
            await zk.sendMessage(origineMessage, { text: txt, mentions: [auteurMessage] }, { quoted: ms });
            try {
                await zk.groupParticipantsUpdate(origineMessage, [auteurMessage], "remove");
            }
            catch (e) {
                console.log("antibot ") + e;
            }
            await zk.sendMessage(origineMessage, { delete: key });
            await fs.unlink("st1.webp"); } 
                
               else if (action === 'delete') {
                txt += `message delete \n @${auteurMessage.split("@")[0]} Avoid sending link.`;
                //await zk.sendMessage(origineMessage, { sticker: fs.readFileSync("st1.webp") }, { quoted: ms });
               await zk.sendMessage(origineMessage, { text: txt, mentions: [auteurMessage] }, { quoted: ms });
               await zk.sendMessage(origineMessage, { delete: key });
               await fs.unlink("st1.webp");

            } else if(action === 'warn') {
                const {getWarnCountByJID ,ajouterUtilisateurAvecWarnCount} = require('./bdd/warn') ;

    let warn = await getWarnCountByJID(auteurMessage) ; 
    let warnlimit = conf.WARN_COUNT
 if ( warn >= warnlimit) { 
  var kikmsg = `bot detected ;you will be remove because of reaching warn-limit`;
    
     await zk.sendMessage(origineMessage, { text: kikmsg , mentions: [auteurMessage] }, { quoted: ms }) ;


     await zk.groupParticipantsUpdate(origineMessage, [auteurMessage], "remove");
     await zk.sendMessage(origineMessage, { delete: key });


    } else {
        var rest = warnlimit - warn ;
      var  msg = `bot detected , your warn_count was upgrade ;\n rest : ${rest} `;

      await ajouterUtilisateurAvecWarnCount(auteurMessage)

      await zk.sendMessage(origineMessage, { text: msg , mentions: [auteurMessage] }, { quoted: ms }) ;
      await zk.sendMessage(origineMessage, { delete: key });

    }
                }
        }
    }
    catch (er) {
        console.log('.... ' + er);
    }        
             
         
            /////////////////////////
            
            //execution des commandes   
            if (verifCom) {
                //await await zk.readMessages(ms.key);
                const cd = evt.cm.find((zokou) => zokou.nomCom === (com));
                if (cd) {
                    try {

            if ((conf.MODE).toLocaleLowerCase() != 'yes' && !superUser) {
                return;
}

                         /******************* PM_PERMT***************/

            if (!superUser && origineMessage === auteurMessage&& conf.PM_PERMIT === "yes" ) {
                repondre("You don't have acces to commands here") ; return }
            ///////////////////////////////

             
            /*****************************banGroup  */
            if (!superUser && verifGroupe) {

                 let req = await isGroupBanned(origineMessage);
                    
                        if (req) { return }
            }

              /***************************  ONLY-ADMIN  */

            if(!verifAdmin && verifGroupe) {
                 let req = await isGroupOnlyAdmin(origineMessage);
                    
                        if (req) {  return }}

              /**********************banuser */
         
            
                if(!superUser) {
                    let req = await isUserBanned(auteurMessage);
                    
                        if (req) {repondre("You are banned from bot commands"); return}
                    

                } 

                        reagir(origineMessage, zk, ms, cd.reaction);
                        cd.fonction(origineMessage, zk, commandeOptions);
                    }
                    catch (e) {
                        console.log("😡😡 " + e);
                        zk.sendMessage(origineMessage, { text: "😡😡 " + e }, { quoted: ms });
                    }
                }
            }
            //fin exécution commandes
        });
        //fin événement message

/******** evenement groupe update ****************/
const { recupevents } = require('./bdd/welcome'); 

zk.ev.on('group-participants.update', async (group) => {
    console.log(group);

    let ppgroup;
    try {
        ppgroup = await zk.profilePictureUrl(group.id, 'image');
    } catch {
        ppgroup = 'https://files.catbox.moe/aktbgo.jpg';
    }

    try {
        const metadata = await zk.groupMetadata(group.id);

        if (group.action == 'add' && (await recupevents(group.id, "welcome") == 'on')) {
            let msg = `👋 Hello
`;

            let membres = group.participants;
            for (let membre of membres) {
                msg += ` *@${membre.split("@")[0]}* Welcome to Our Official Group,`;
            }

            msg += `You might want to read the group Description to avoid getting removed...`;

            zk.sendMessage(group.id, { image: { url: ppgroup }, caption: msg, mentions: membres });
        } else if (group.action == 'remove' && (await recupevents(group.id, "goodbye") == 'on')) {
            let msg = `one or somes member(s) left group;\n`;

            let membres = group.participants;
            for (let membre of membres) {
                msg += `@${membre.split("@")[0]}\n`;
            }

            zk.sendMessage(group.id, { text: msg, mentions: membres });

        } else if (group.action == 'promote' && (await recupevents(group.id, "antipromote") == 'on') ) {
            //  console.log(zk.user.id)
          if (group.author == metadata.owner || group.author  == conf.NUMERO_OWNER + '@s.whatsapp.net' || group.author == decodeJid(zk.user.id)  || group.author == group.participants[0]) { console.log('Cas de superUser je fais rien') ;return ;} ;


         await   zk.groupParticipantsUpdate(group.id ,[group.author,group.participants[0]],"demote") ;

         zk.sendMessage(
              group.id,
              {
                text : `@${(group.author).split("@")[0]} has violated the anti-promotion rule, therefore both ${group.author.split("@")[0]} and @${(group.participants[0]).split("@")[0]} have been removed from administrative rights.`,
                mentions : [group.author,group.participants[0]]
              }
         )

        } else if (group.action == 'demote' && (await recupevents(group.id, "antidemote") == 'on') ) {

            if (group.author == metadata.owner || group.author ==  conf.NUMERO_OWNER + '@s.whatsapp.net' || group.author == decodeJid(zk.user.id) || group.author == group.participants[0]) { console.log('Cas de superUser je fais rien') ;return ;} ;


           await  zk.groupParticipantsUpdate(group.id ,[group.author],"demote") ;
           await zk.groupParticipantsUpdate(group.id , [group.participants[0]] , "promote")

           zk.sendMessage(
                group.id,
                {
                  text : `@${(group.author).split("@")[0]} has violated the anti-demotion rule by removing @${(group.participants[0]).split("@")[0]}. Consequently, he has been stripped of administrative rights.` ,
                  mentions : [group.author,group.participants[0]]
                }
           )

     } 

    } catch (e) {
        console.error(e);
    }
});

/******** fin d'evenement groupe update *************************/


    

    /*****************************Cron setup */

        
    async  function activateCrons() {
        const cron = require('node-cron');
        const { getCron } = require('./bdd/cron');

          let crons = await getCron();
          console.log(crons);
          if (crons.length > 0) {
        
            for (let i = 0; i < crons.length; i++) {
        
              if (crons[i].mute_at != null) {
                let set = crons[i].mute_at.split(':');

                console.log(`etablissement d'un automute pour ${crons[i].group_id} a ${set[0]} H ${set[1]}`)

                cron.schedule(`${set[1]} ${set[0]} * * *`, async () => {
                  await zk.groupSettingUpdate(crons[i].group_id, 'announcement');
                  zk.sendMessage(crons[i].group_id, { image : { url : './media/chrono.webp'} , caption: "Hello, it's time to close the group; sayonara." });

                }, {
                    timezone: "Africa/Dar Es Salam"
                  });
              }
        
              if (crons[i].unmute_at != null) {
                let set = crons[i].unmute_at.split(':');

                console.log(`etablissement d'un autounmute pour ${set[0]} H ${set[1]} `)
        
                cron.schedule(`${set[1]} ${set[0]} * * *`, async () => {

                  await zk.groupSettingUpdate(crons[i].group_id, 'not_announcement');

                  zk.sendMessage(crons[i].group_id, { image : { url : './media/chrono.webp'} , caption: "Good morning; It's time to open the group." });

                 
                },{
                    timezone: "Africa/Dar Es Salam"
                  });
              }
        
            }
          } else {
            console.log('Les crons n\'ont pas été activés');
          }

          return
        }

        
        //événement contact
        zk.ev.on("connection.update", async (con) => {
            const { lastDisconnect, connection } = con;
            if (connection === "connecting") {
                console.log("ℹ️ Rahmani-xmd is connecting...");
            }
            else if (connection === 'open') {
                console.log("✅ Rahmani-xmd Connected to WhatsApp! ☺️");
                console.log("--");
                await (0, baileys_1.delay)(200);
                console.log("------");
                await (0, baileys_1.delay)(300);
                console.log("------------------/-----");
                console.log(" Rahmani-xmd is Online 🕸\n\n");
                //chargement des commandes 
                console.log("Loading Rahmani-xmd Commands ...\n");
                fs.readdirSync(__dirname + "/pkdriller").forEach((fichier) => {
                    if (path.extname(fichier).toLowerCase() == (".js")) {
                        try {
                            require(__dirname + "/pkdriller/" + fichier);
                            console.log(fichier + " Installed Successfully✔️");
                        }
                        catch (e) {
                            console.log(`${fichier} could not be installed due to : ${e}`);
                        } /* require(__dirname + "/beltah/" + fichier);
                         console.log(fichier + " Installed ✔️")*/
                        (0, baileys_1.delay)(300);
                    }
                });
                (0, baileys_1.delay)(700);
                var md;
                if ((conf.MODE).toLocaleLowerCase() === "yes") {
                    md = "public";
                }
                else if ((conf.MODE).toLocaleLowerCase() === "no") {
                    md = "private";
                }
                else {
                    md = "undefined";
                }
                console.log("Commands Installation Completed ✅");

                await activateCrons();
                
                // FIX: Define missing variables
                const herokuAppName = process.env.HEROKU_APP_NAME || "Rahmani-MD";
                const herokuAppLink = process.env.HEROKU_APP_URL || `https://${herokuAppName}.herokuapp.com`;
                const botOwner = conf.NUMERO_OWNER || "255752593977";
                
                if((conf.DP).toLowerCase() === 'yes') {     

                let cmsg =` ⁠⁠⁠⁠

   _BOT🦚CONNECTED_

║ Prefix: [ ${prefixe} ]
║ Mode: ${md}
║ Model: Lucky_Md
║ Bot Name: Lucky-Md-Bot 
║ Owner: FrediEzra
╚═════ ❖ •✦
-_-<-<-<-<-<-<-<--<-<-<-<-<-<

*🪀Follow my channel for updates and free hacks🙃*
 
> https://whatsapp.com/channel/0029VaihcQv84Om8LP59fO3f

*Heroku App Configuration*
 
*🐥Client name*
> ${herokuAppName}

*🦋Visit your bot web*
> ${herokuAppLink}

*🦁Client Number*
> ${botOwner}

-_-_-<€<€-<-<-<-<-<-<-<-<-<-<-<
                
                 `;
                    
                await zk.sendMessage(zk.user.id, { text: cmsg });
                }
            }
            else if (connection == "close") {
                let raisonDeconnexion = new boom_1.Boom(lastDisconnect?.error)?.output.statusCode;
                if (raisonDeconnexion === baileys_1.DisconnectReason.badSession) {
                    console.log('Session id error, rescan again...');
                }
                else if (raisonDeconnexion === baileys_1.DisconnectReason.connectionClosed) {
                    console.log('!!! connexion fermée, reconnexion en cours ...');
                    main();
                }
                else if (raisonDeconnexion === baileys_1.DisconnectReason.connectionLost) {
                    console.log('connection error 😞 ,,, trying to reconnect... ');
                    main();
                }
                else if (raisonDeconnexion === baileys_1.DisconnectReason?.connectionReplaced) {
                    console.log('connexion réplacée ,,, une sesssion est déjà ouverte veuillez la fermer svp !!!');
                }
                else if (raisonDeconnexion === baileys_1.DisconnectReason.loggedOut) {
                    console.log('vous êtes déconnecté,,, veuillez rescanner le code qr svp');
                }
                else if (raisonDeconnexion === baileys_1.DisconnectReason.restartRequired) {
                    console.log('redémarrage en cours ▶️');
                    main();
                }   else {

                    console.log('redemarrage sur le coup de l\'erreur  ',raisonDeconnexion) ;         
                    //repondre("* Redémarrage du bot en cour ...*");

                                const {exec}=require("child_process") ;

                                exec("pm2 restart all");            
                }
                // sleep(50000)
                console.log("hum " + connection);
                main(); //console.log(session)
            }
        });
        //fin événement connexion
        //événement authentification 
        zk.ev.on("creds.update", saveCreds);
        //fin événement authentification 
        //
        /** ************* */
        //fonctions utiles
        zk.downloadAndSaveMediaMessage = async (message, filename = '', attachExtension = true) => {
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
            // save to file
            await fs.writeFileSync(trueFileName, buffer);
            return trueFileName;
        };


        zk.awaitForMessage = async (options = {}) =>{
            return new Promise((resolve, reject) => {
                if (typeof options !== 'object') reject(new Error('Options must be an object'));
                if (typeof options.sender !== 'string') reject(new Error('Sender must be a string'));
                if (typeof options.chatJid !== 'string') reject(new Error('ChatJid must be a string'));
                if (options.timeout && typeof options.timeout !== 'number') reject(new Error('Timeout must be a number'));
                if (options.filter && typeof options.filter !== 'function') reject(new Error('Filter must be a function'));
        
                const timeout = options?.timeout || undefined;
                const filter = options?.filter || (() => true);
                let interval = undefined
        
                /**
                 * 
                 * @param {{messages: Baileys.proto.IWebMessageInfo[], type: Baileys.MessageUpsertType}} data 
                 */
                let listener = (data) => {
                    let { type, messages } = data;
                    if (type == "notify") {
                        for (let message of messages) {
                            const fromMe = message.key.fromMe;
                            const chatId = message.key.remoteJid;
                            const isGroup = chatId.endsWith('@g.us');
                            const isStatus = chatId == 'status@broadcast';
        
                            const sender = fromMe ? zk.user.id.replace(/:.*@/g, '@') : (isGroup || isStatus) ? message.key.participant.replace(/:.*@/g, '@') : chatId;
                            if (sender == options.sender && chatId == options.chatJid && filter(message)) {
                                zk.ev.off('messages.upsert', listener);
                                clearTimeout(interval);
                                resolve(message);
                            }
                        }
                    }
                }
                zk.ev.on('messages.upsert', listener);
                if (timeout) {
                    interval = setTimeout(() => {
                        zk.ev.off('messages.upsert', listener);
                        reject(new Error('Timeout'));
                    }, timeout);
                }
            });
        }



        // fin fonctions utiles
        /** ************* */
        return zk;
    }
    let fichier = require.resolve(__filename);
    fs.watchFile(fichier, () => {
        fs.unwatchFile(fichier);
        console.log(`mise à jour ${__filename}`);
        delete require.cache[fichier];
        require(fichier);
    });
    main();
}, 5000);
