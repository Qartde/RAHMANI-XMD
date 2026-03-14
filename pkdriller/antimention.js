"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

const { zokou } = require("../framework/zokou");
const fs = require("fs");

// Database ya warnings na settings
const WARN_DB = "./data/antimentions.json";
const SETTINGS_DB = "./data/antimention_settings.json";

// Hakikisha folders zipo
if (!fs.existsSync("./data")) fs.mkdirSync("./data");

// Load au create database
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
// COMMAND: KUWASHA/KUZIMA ANTI-MENTION
// ----------------------------------------------------------------------
zokou(
    { 
        nomCom: "antimentions", 
        reaction: "🛡️", 
        nomFichier: __filename,
        categorie: "Admin"
    },
    async (dest, zk, commandeOptions) => {
        const { ms: quotedMessage, repondre, args, superUser } = commandeOptions;
        const groupId = dest;
        
        // Check if in group
        if (!groupId.endsWith("@g.us")) {
            return repondre("❌ Command hii inafanya kazi kwenye group pekee!");
        }
        
        // Check if sender is admin
        const groupMetadata = await zk.groupMetadata(groupId);
        const isAdmin = groupMetadata.participants.some(p => 
            p.id === superUser && (p.admin === "admin" || p.admin === "superadmin")
        );
        
        if (!isAdmin) {
            return repondre("❌ Admin pekee ndio anaweza kutumia command hii!");
        }
        
        const settings = loadSettings();
        if (!settings[groupId]) {
            settings[groupId] = {
                enabled: false,
                action: "warn", // warn, delete, remove
                maxMentions: 3,
                warnLimit: 3
            };
        }
        
        if (!args || args.length === 0) {
            const status = settings[groupId].enabled ? "✅ IMEWASHWA" : "❌ IMEZIMWA";
            return repondre(`
🛡️ *ANTI-MENTION SETTINGS*

Status: ${status}
Action: ${settings[groupId].action}
Max Mentions: ${settings[groupId].maxMentions}
Warn Limit: ${settings[groupId].warnLimit}

*Commands:*
!antimentions on - Washa
!antimentions off - Zima
!antimentions action <warn|delete|remove>
!antimentions limit <number>
!antimentions warnlimit <number>
            `);
        }
        
        switch (args[0].toLowerCase()) {
            case "on":
                settings[groupId].enabled = true;
                saveSettings(settings);
                return repondre("✅ Anti-mention imewashwa!");
                
            case "off":
                settings[groupId].enabled = false;
                saveSettings(settings);
                return repondre("❌ Anti-mention imezimwa!");
                
            case "action":
                if (args[1] && ["warn", "delete", "remove"].includes(args[1].toLowerCase())) {
                    settings[groupId].action = args[1].toLowerCase();
                    saveSettings(settings);
                    return repondre(`✅ Action imebadilishwa kuwa: ${args[1]}`);
                }
                return repondre("❌ Tafadhali weka: warn, delete, au remove");
                
            case "limit":
                if (args[1] && !isNaN(args[1])) {
                    settings[groupId].maxMentions = parseInt(args[1]);
                    saveSettings(settings);
                    return repondre(`✅ Max mentions sasa ni: ${args[1]}`);
                }
                return repondre("❌ Tafadhali weka namba halali");
                
            case "warnlimit":
                if (args[1] && !isNaN(args[1])) {
                    settings[groupId].warnLimit = parseInt(args[1]);
                    saveSettings(settings);
                    return repondre(`✅ Warn limit sasa ni: ${args[1]}`);
                }
                return repondre("❌ Tafadhali weka namba halali");
                
            default:
                return repondre("❌ Command haitambuliki!");
        }
    }
);

// ----------------------------------------------------------------------
// MESSAGE HANDLER - Inafuatilia mentions
// ----------------------------------------------------------------------
zokou(
    { 
        nomCom: "_antimention_handler", 
        reaction: "👁️", 
        nomFichier: __filename,
        isHandler: true
    },
    async (dest, zk, commandeOptions) => {
        const { message, superUser, isGroup } = commandeOptions;
        
        // Skip if not group or no message
        if (!isGroup || !message) return;
        
        const groupId = dest;
        const sender = message.key.participant || message.key.remoteJid;
        const messageContent = message.message?.conversation || 
                              message.message?.extendedTextMessage?.text || "";
        
        // Skip bot messages
        if (sender.includes("bot")) return;
        
        // Load settings
        const settings = loadSettings();
        if (!settings[groupId] || !settings[groupId].enabled) return;
        
        // Count mentions in message
        let mentionCount = 0;
        
        // Check for @mentions in text
        const mentionMatches = messageContent.match(/@\d+/g) || [];
        mentionCount += mentionMatches.length;
        
        // Check for mentions in mentionedJid array
        if (message.message?.extendedTextMessage?.contextInfo?.mentionedJid) {
            mentionCount += message.message.extendedTextMessage.contextInfo.mentionedJid.length;
        }
        
        // Check for status broadcasting (@all, @everyone, etc)
        const broadcastPatterns = ["@all", "@everyone", "@group", "@tagall", "@mension", "mention all", "tag all"];
        const hasBroadcast = broadcastPatterns.some(pattern => 
            messageContent.toLowerCase().includes(pattern.toLowerCase())
        );
        
        if (hasBroadcast) {
            // Count all group members as mentions
            const groupMetadata = await zk.groupMetadata(groupId);
            mentionCount = groupMetadata.participants.length;
        }
        
        // If mentions exceed limit, take action
        if (mentionCount > settings[groupId].maxMentions) {
            await handleViolation(dest, zk, sender, message, mentionCount, settings[groupId]);
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
    
    // Increase warning count
    warnings[groupId][sender] += 1;
    const currentWarnings = warnings[groupId][sender];
    
    // Get group metadata for admin check
    const groupMetadata = await zk.groupMetadata(groupId);
    const isBotAdmin = groupMetadata.participants.some(p => 
        p.id === zk.user.id && (p.admin === "admin" || p.admin === "superadmin")
    );
    
    // Take action based on settings
    switch (settings.action) {
        case "delete":
            // Delete the message
            if (isBotAdmin) {
                await zk.sendMessage(groupId, { delete: message.key });
                await zk.sendMessage(groupId, {
                    text: `⚠️ @${sender.split("@")[0]} umetaja watu wengi sana (${mentionCount})! Message imefutwa.`,
                    mentions: [sender]
                });
            }
            break;
            
        case "warn":
            // Delete message and send warning
            if (isBotAdmin) {
                await zk.sendMessage(groupId, { delete: message.key });
            }
            
            await zk.sendMessage(groupId, {
                text: `⚠️ @${sender.split("@")[0]} ONYO ${currentWarnings}/${settings.warnLimit}\nUmetaja watu ${mentionCount}!`,
                mentions: [sender]
            });
            break;
            
        case "remove":
            // Remove from group after warning limit reached
            if (currentWarnings >= settings.warnLimit) {
                if (isBotAdmin) {
                    await zk.groupParticipantsUpdate(groupId, [sender], "remove");
                    await zk.sendMessage(groupId, {
                        text: `🔨 @${sender.split("@")[0]} ameondolewa kwenye group kwa kumentiona watu wengi mara kwa mara.`,
                        mentions: [sender]
                    });
                    // Reset warnings after removal
                    delete warnings[groupId][sender];
                }
            } else {
                // Just warn
                if (isBotAdmin) {
                    await zk.sendMessage(groupId, { delete: message.key });
                }
                await zk.sendMessage(groupId, {
                    text: `⚠️ @${sender.split("@")[0]} ONYO ${currentWarnings}/${settings.warnLimit}\nUmetaja watu ${mentionCount}! Ukifika ${settings.warnLimit}, utaondolewa.`,
                    mentions: [sender]
                });
            }
            break;
    }
    
    saveWarnings(warnings);
}

// ----------------------------------------------------------------------
// COMMAND: KUANGALIA WARNINGS
// ----------------------------------------------------------------------
zokou(
    { 
        nomCom: "warnings", 
        reaction: "📋", 
        nomFichier: __filename,
        categorie: "Admin"
    },
    async (dest, zk, commandeOptions) => {
        const { repondre, superUser } = commandeOptions;
        const groupId = dest;
        
        if (!groupId.endsWith("@g.us")) {
            return repondre("❌ Command hii inafanya kazi kwenye group pekee!");
        }
        
        const warnings = loadWarnings();
        if (!warnings[groupId] || Object.keys(warnings[groupId]).length === 0) {
            return repondre("✅ Hakuna warnings kwenye group hili!");
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
// COMMAND: KUFUTA WARNINGS
// ----------------------------------------------------------------------
zokou(
    { 
        nomCom: "resetwarns", 
        reaction: "🔄", 
        nomFichier: __filename,
        categorie: "Admin"
    },
    async (dest, zk, commandeOptions) => {
        const { repondre, args, superUser } = commandeOptions;
        const groupId = dest;
        
        if (!groupId.endsWith("@g.us")) {
            return repondre("❌ Command hii inafanya kazi kwenye group pekee!");
        }
        
        // Check if sender is admin
        const groupMetadata = await zk.groupMetadata(groupId);
        const isAdmin = groupMetadata.participants.some(p => 
            p.id === superUser && (p.admin === "admin" || p.admin === "superadmin")
        );
        
        if (!isAdmin) {
            return repondre("❌ Admin pekee ndio anaweza kutumia command hii!");
        }
        
        const warnings = loadWarnings();
        
        if (args && args[0]) {
            // Reset specific user
            const user = args[0].replace("@", "") + "@s.whatsapp.net";
            if (warnings[groupId] && warnings[groupId][user]) {
                delete warnings[groupId][user];
                saveWarnings(warnings);
                return repondre(`✅ Warnings za @${args[0].replace("@", "")} zimefutwa!`);
            }
            return repondre("❌ Mtumiaji hajawahi kuwa na warnings!");
        } else {
            // Reset all
            delete warnings[groupId];
            saveWarnings(warnings);
            return repondre("✅ Warnings zote za group hili zimefutwa!");
        }
    }
);
