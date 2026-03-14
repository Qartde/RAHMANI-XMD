"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

const { zokou } = require("../framework/zokou");
const fs = require("fs");

// Database for warnings and settings
const WARN_DB = "./data/antimentions.json";
const SETTINGS_DB = "./data/antimention_settings.json";

// Ensure data folder exists
if (!fs.existsSync("./data")) fs.mkdirSync("./data");

// Load or create databases
function loadWarnings() {
    if (!fs.existsSync(WARN_DB)) {
        fs.writeFileSync(WARN_DB, JSON.stringify({}));
        return {};
    }
    return JSON.parse(fs.readFileSync(WARN_DB));
}

function loadSettings() {
    if (!fs.existsSync(SETTINGS_DB)) {
        fs.writeFileSync(SETTINGS_DB, JSON.stringify({}));
        return {};
    }
    return JSON.parse(fs.readFileSync(SETTINGS_DB));
}

function saveWarnings(data) {
    fs.writeFileSync(WARN_DB, JSON.stringify(data, null, 2));
}

function saveSettings(data) {
    fs.writeFileSync(SETTINGS_DB, JSON.stringify(data, null, 2));
}

// ----------------------------------------------------------------------
// COMMAND: ENABLE/DISABLE ANTI-MENTION
// ----------------------------------------------------------------------
zokou(
    { 
        nomCom: "antimentions", 
        reaction: "🛡️", 
        nomFichier: __filename,
        categorie: "Admin"
    },
    async (dest, zk, commandeOptions) => {
        const { ms: quotedMessage, repondre, args, auteurMessage } = commandeOptions;
        const groupId = dest;
        
        // Check if in group
        if (!groupId.endsWith("@g.us")) {
            return repondre("❌ This command only works in groups!");
        }
        
        // Get sender ID - auteurMessage ndio njia sahihi
        const sender = auteurMessage;
        
        console.log("Sender ID:", sender); // Debug
        
        // Get group metadata and check if sender is admin
        const groupMetadata = await zk.groupMetadata(groupId);
        const participant = groupMetadata.participants.find(p => p.id === sender);
        const isAdmin = participant && (participant.admin === "admin" || participant.admin === "superadmin");
        
        console.log("Is Admin:", isAdmin); // Debug
        
        if (!isAdmin) {
            return repondre("❌ Only group admins can use this command!");
        }
        
        const settings = loadSettings();
        if (!settings[groupId]) {
            settings[groupId] = {
                enabled: false,
                action: "warn",
                maxMentions: 3,
                warnLimit: 3
            };
        }
        
        if (!args || args.length === 0) {
            const status = settings[groupId].enabled ? "✅ ENABLED" : "❌ DISABLED";
            return repondre(`
🛡️ *ANTI-MENTION SETTINGS*

Status: ${status}
Action: ${settings[groupId].action}
Max Mentions: ${settings[groupId].maxMentions}
Warn Limit: ${settings[groupId].warnLimit}

*Commands:*
!antimentions on - Enable
!antimentions off - Disable
!antimentions action <warn|delete|remove>
!antimentions limit <number>
!antimentions warnlimit <number>
            `);
        }
        
        switch (args[0].toLowerCase()) {
            case "on":
                settings[groupId].enabled = true;
                saveSettings(settings);
                return repondre("✅ Anti-mention enabled!");
                
            case "off":
                settings[groupId].enabled = false;
                saveSettings(settings);
                return repondre("❌ Anti-mention disabled!");
                
            case "action":
                if (args[1] && ["warn", "delete", "remove"].includes(args[1].toLowerCase())) {
                    settings[groupId].action = args[1].toLowerCase();
                    saveSettings(settings);
                    return repondre(`✅ Action changed to: ${args[1]}`);
                }
                return repondre("❌ Please specify: warn, delete, or remove");
                
            case "limit":
                if (args[1] && !isNaN(args[1])) {
                    settings[groupId].maxMentions = parseInt(args[1]);
                    saveSettings(settings);
                    return repondre(`✅ Max mentions set to: ${args[1]}`);
                }
                return repondre("❌ Please provide a valid number");
                
            case "warnlimit":
                if (args[1] && !isNaN(args[1])) {
                    settings[groupId].warnLimit = parseInt(args[1]);
                    saveSettings(settings);
                    return repondre(`✅ Warn limit set to: ${args[1]}`);
                }
                return repondre("❌ Please provide a valid number");
                
            default:
                return repondre("❌ Unknown command!");
        }
    }
);

// ----------------------------------------------------------------------
// MESSAGE HANDLER - Monitors mentions
// ----------------------------------------------------------------------
zokou(
    { 
        nomCom: "_antimention_handler", 
        reaction: "👁️", 
        nomFichier: __filename,
        isHandler: true
    },
    async (dest, zk, commandeOptions) => {
        const { message, isGroup } = commandeOptions;
        
        if (!isGroup || !message) return;
        
        const groupId = dest;
        const sender = message.key.participant || message.key.remoteJid;
        const messageContent = message.message?.conversation || 
                              message.message?.extendedTextMessage?.text || "";
        
        if (sender.includes("bot") || sender.includes("status")) return;
        
        const settings = loadSettings();
        if (!settings[groupId] || !settings[groupId].enabled) return;
        
        let mentionCount = 0;
        
        // Check for @mentions in text
        const mentionMatches = messageContent.match(/@\d+/g) || [];
        mentionCount += mentionMatches.length;
        
        // Check for mentions in mentionedJid array
        if (message.message?.extendedTextMessage?.contextInfo?.mentionedJid) {
            mentionCount += message.message.extendedTextMessage.contextInfo.mentionedJid.length;
        }
        
        // Check for status broadcasting
        const broadcastPatterns = ["@all", "@everyone", "@group", "@tagall", "@mention", "mention all", "tag all"];
        const hasBroadcast = broadcastPatterns.some(pattern => 
            messageContent.toLowerCase().includes(pattern.toLowerCase())
        );
        
        if (hasBroadcast) {
            const groupMetadata = await zk.groupMetadata(groupId);
            mentionCount = groupMetadata.participants.length;
        }
        
        if (mentionCount > settings[groupId].maxMentions) {
            await handleViolation(groupId, zk, sender, message, mentionCount, settings[groupId]);
        }
    }
);

// ----------------------------------------------------------------------
// VIOLATION HANDLER
// ----------------------------------------------------------------------
async function handleViolation(groupId, zk, sender, message, mentionCount, settings) {
    const warnings = loadWarnings();
    
    if (!warnings[groupId]) warnings[groupId] = {};
    if (!warnings[groupId][sender]) warnings[groupId][sender] = 0;
    
    warnings[groupId][sender] += 1;
    const currentWarnings = warnings[groupId][sender];
    
    const groupMetadata = await zk.groupMetadata(groupId);
    const botId = zk.user.id.split(":")[0] + "@s.whatsapp.net";
    const isBotAdmin = groupMetadata.participants.some(p => 
        p.id === botId && (p.admin === "admin" || p.admin === "superadmin")
    );
    
    switch (settings.action) {
        case "delete":
            if (isBotAdmin) {
                await zk.sendMessage(groupId, { delete: message.key });
                await zk.sendMessage(groupId, {
                    text: `⚠️ @${sender.split("@")[0]} mentioned too many people (${mentionCount})! Message deleted.`,
                    mentions: [sender]
                });
            }
            break;
            
        case "warn":
            if (isBotAdmin) {
                await zk.sendMessage(groupId, { delete: message.key });
            }
            
            await zk.sendMessage(groupId, {
                text: `⚠️ @${sender.split("@")[0]} WARNING ${currentWarnings}/${settings.warnLimit}\nYou mentioned ${mentionCount} people!`,
                mentions: [sender]
            });
            break;
            
        case "remove":
            if (currentWarnings >= settings.warnLimit) {
                if (isBotAdmin) {
                    await zk.groupParticipantsUpdate(groupId, [sender], "remove");
                    await zk.sendMessage(groupId, {
                        text: `🔨 @${sender.split("@")[0]} was removed from group for repeatedly mentioning too many people.`,
                        mentions: [sender]
                    });
                    delete warnings[groupId][sender];
                }
            } else {
                if (isBotAdmin) {
                    await zk.sendMessage(groupId, { delete: message.key });
                }
                await zk.sendMessage(groupId, {
                    text: `⚠️ @${sender.split("@")[0]} WARNING ${currentWarnings}/${settings.warnLimit}\nYou mentioned ${mentionCount} people! Reaching ${settings.warnLimit} will result in removal.`,
                    mentions: [sender]
                });
            }
            break;
    }
    
    saveWarnings(warnings);
}

// ----------------------------------------------------------------------
// COMMAND: CHECK WARNINGS
// ----------------------------------------------------------------------
zokou(
    { 
        nomCom: "warnings", 
        reaction: "📋", 
        nomFichier: __filename,
        categorie: "Group"
    },
    async (dest, zk, commandeOptions) => {
        const { repondre, auteurMessage } = commandeOptions;
        const groupId = dest;
        
        if (!groupId.endsWith("@g.us")) {
            return repondre("❌ This command only works in groups!");
        }
        
        const warnings = loadWarnings();
        if (!warnings[groupId] || Object.keys(warnings[groupId]).length === 0) {
            return repondre("✅ No warnings in this group!");
        }
        
        let message = "📋 *WARNINGS LIST*\n\n";
        for (let [user, count] of Object.entries(warnings[groupId])) {
            message += `• @${user.split("@")[0]}: ${count}\n`;
        }
        
        await zk.sendMessage(groupId, {
            text: message,
            mentions: Object.keys(warnings[groupId])
        });
    }
);

// ----------------------------------------------------------------------
// COMMAND: RESET WARNINGS
// ----------------------------------------------------------------------
zokou(
    { 
        nomCom: "resetwarns", 
        reaction: "🔄", 
        nomFichier: __filename,
        categorie: "Admin"
    },
    async (dest, zk, commandeOptions) => {
        const { repondre, args, auteurMessage } = commandeOptions;
        const groupId = dest;
        
        if (!groupId.endsWith("@g.us")) {
            return repondre("❌ This command only works in groups!");
        }
        
        // Get sender ID
        const sender = auteurMessage;
        
        // Check if sender is admin
        const groupMetadata = await zk.groupMetadata(groupId);
        const participant = groupMetadata.participants.find(p => p.id === sender);
        const isAdmin = participant && (participant.admin === "admin" || participant.admin === "superadmin");
        
        if (!isAdmin) {
            return repondre("❌ Only group admins can use this command!");
        }
        
        const warnings = loadWarnings();
        
        if (args && args[0]) {
            const user = args[0].replace("@", "") + "@s.whatsapp.net";
            if (warnings[groupId] && warnings[groupId][user]) {
                delete warnings[groupId][user];
                saveWarnings(warnings);
                return repondre(`✅ Warnings for @${args[0].replace("@", "")} have been reset!`);
            }
            return repondre("❌ User has no warnings!");
        } else {
            delete warnings[groupId];
            saveWarnings(warnings);
            return repondre("✅ All warnings for this group have been reset!");
        }
    }
);
