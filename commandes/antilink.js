const { zokou } = require("../framework/zokou");
const fs = require("fs-extra");
const path = require("path");

const antilinkPath = path.join(__dirname, "../bdd/antilink.json");
const warnPath = path.join(__dirname, "../bdd/antilinkWarns.json");

// Ensure bdd folder exists
if (!fs.existsSync(path.join(__dirname, "../bdd"))) {
    fs.mkdirSync(path.join(__dirname, "../bdd"));
}

// Create config if not exists
if (!fs.existsSync(antilinkPath)) {
    fs.writeFileSync(antilinkPath, JSON.stringify({ 
        status: "off", 
        action: "warn",
        warnCount: 3
    }, null, 2));
}

// Create warns file if not exists
if (!fs.existsSync(warnPath)) {
    fs.writeFileSync(warnPath, JSON.stringify({}, null, 2));
}

// Function to read antilink status
function isAntilinkOn() {
    try {
        const data = fs.readFileSync(antilinkPath);
        const config = JSON.parse(data);
        return config.status === "on";
    } catch {
        return false;
    }
}

// Function to get antilink action
function getAntilinkAction() {
    try {
        const data = fs.readFileSync(antilinkPath);
        const config = JSON.parse(data);
        return config.action || "warn";
    } catch {
        return "warn";
    }
}

// Function to get warn count setting
function getWarnCountSetting() {
    try {
        const data = fs.readFileSync(antilinkPath);
        const config = JSON.parse(data);
        return config.warnCount || 3;
    } catch {
        return 3;
    }
}

// Function to get user warns
function getUserWarns(userJid, groupJid) {
    try {
        const data = fs.readFileSync(warnPath);
        const warns = JSON.parse(data);
        const key = `${groupJid}_${userJid}`;
        return warns[key] || 0;
    } catch {
        return 0;
    }
}

// Function to add user warn
function addUserWarn(userJid, groupJid) {
    try {
        const data = fs.readFileSync(warnPath);
        const warns = JSON.parse(data);
        const key = `${groupJid}_${userJid}`;
        warns[key] = (warns[key] || 0) + 1;
        fs.writeFileSync(warnPath, JSON.stringify(warns, null, 2));
        return warns[key];
    } catch (error) {
        console.log("Error saving warn:", error);
        return 1;
    }
}

// Function to reset user warns
function resetUserWarns(userJid, groupJid) {
    try {
        const data = fs.readFileSync(warnPath);
        const warns = JSON.parse(data);
        const key = `${groupJid}_${userJid}`;
        delete warns[key];
        fs.writeFileSync(warnPath, JSON.stringify(warns, null, 2));
    } catch (error) {
        console.log("Error resetting warns:", error);
    }
}

// Main command
zokou({
    nomCom: "antilink",
    categorie: "Group",
    reaction: "🔗",
    desc: "Enable or disable anti-link with warn system",
    fromMe: true
}, async (dest, zk, commandeOptions) => {
    const { repondre, arg, verifGroupe, verifAdmin, superUser } = commandeOptions;

    if (!verifGroupe) {
        return repondre("❌ *This command can only be used in groups!*");
    }

    if (!verifAdmin && !superUser) {
        return repondre("❌ *Only group admins can use this command!*");
    }

    if (!arg[0]) {
        return repondre("*❗ Usage:*\n" +
            ".antilink on - Enable\n" +
            ".antilink off - Disable\n" +
            ".antilink action warn|remove|delete - Set action\n" +
            ".antilink warncount [number] - Set warn count\n" +
            ".antilink resetwarn @user - Reset warns\n" +
            ".antilink status - Check status\n\n" +
            "_Powered by Sebastian_");
    }

    if (arg[0].toLowerCase() === "status") {
        const config = JSON.parse(fs.readFileSync(antilinkPath));
        return repondre(`📊 *ANTILINK STATUS*\n\n` +
            `Status: ${config.status === 'on' ? '✅ ON' : '❌ OFF'}\n` +
            `Action: ${config.action.toUpperCase()}\n` +
            `Warn Count: ${config.warnCount}\n\n` +
            `_Powered by Sebastian_`);
    }

    if (arg[0].toLowerCase() === "warncount" && arg[1]) {
        const count = parseInt(arg[1]);
        if (isNaN(count) || count < 1 || count > 10) {
            return repondre("❌ *Warn count must be between 1 and 10*");
        }
        
        try {
            const config = JSON.parse(fs.readFileSync(antilinkPath));
            config.warnCount = count;
            fs.writeFileSync(antilinkPath, JSON.stringify(config, null, 2));
            return repondre(`✅ *Warn count set to:* ${count}\n\n_Powered by Sebastian_`);
        } catch (e) {
            return repondre("❌ Failed to update warn count.");
        }
    }

    if (arg[0].toLowerCase() === "resetwarn") {
        if (!arg[1]) {
            return repondre("❌ *Please mention the user to reset warns*\nExample: .antilink resetwarn @user");
        }
        
        let targetUser = "";
        if (arg[1].includes("@")) {
            targetUser = arg[1].replace("@", "") + "@s.whatsapp.net";
        } else {
            targetUser = arg[1].replace(/[^0-9]/g, '') + "@s.whatsapp.net";
        }
        
        resetUserWarns(targetUser, dest);
        return repondre(`✅ *Warns reset for @${targetUser.split('@')[0]}*\n\n_Powered by Sebastian_`);
    }

    if (arg[0].toLowerCase() === "action" && arg[1]) {
        const action = arg[1].toLowerCase();
        if (!["delete", "warn", "remove"].includes(action)) {
            return repondre("❌ *Invalid action! Use: delete, warn, or remove*");
        }
        
        try {
            const config = JSON.parse(fs.readFileSync(antilinkPath));
            config.action = action;
            fs.writeFileSync(antilinkPath, JSON.stringify(config, null, 2));
            return repondre(`✅ *Antilink action set to:* ${action.toUpperCase()}\n\n_Powered by Sebastian_`);
        } catch (e) {
            return repondre("❌ Failed to update action.");
        }
    }

    if (!["on", "off"].includes(arg[0].toLowerCase())) {
        return repondre("*❗ Usage:* .antilink on|off|action|warncount|resetwarn|status");
    }

    const status = arg[0].toLowerCase();

    try {
        const config = JSON.parse(fs.readFileSync(antilinkPath));
        config.status = status;
        fs.writeFileSync(antilinkPath, JSON.stringify(config, null, 2));
        
        await repondre(
            status === "on"
                ? `✅ *ANTILINK ENABLED*\n\n` +
                  `Action: ${config.action.toUpperCase()}\n` +
                  `Warn Count: ${config.warnCount}\n\n` +
                  `_Powered by Sebastian_`
                : `⚠️ *ANTILINK DISABLED*\n\n_Powered by Sebastian_`
        );
    } catch (e) {
        await repondre("❌ Failed to update antilink configuration.");
    }
});

// Export functions for main.js
module.exports = {
    isAntilinkOn,
    getAntilinkAction,
    getWarnCountSetting,
    getUserWarns,
    resetUserWarns,
    
    async handleAntilink(zk, message, sender, chatJid, isAdmin, isBotAdmin, superUser) {
        try {
            if (!isAntilinkOn()) return false;
            
            if (isAdmin || superUser || message.key.fromMe) {
                return false;
            }
            
            const messageText = message.message?.conversation || 
                                message.message?.extendedTextMessage?.text ||
                                message.message?.imageMessage?.caption ||
                                "";
            
            if (!messageText) return false;
            
            const linkRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([a-zA-Z0-9]+\.(com|org|net|io|gov|edu|tz|co\.tz|go\.tz|africa|ke|ug))(\/[^\s]*)?/gi;
            
            if (!linkRegex.test(messageText)) return false;
            
            console.log("🔗 LINK DETECTED!");
            console.log(`Sender: ${sender}`);
            console.log(`Bot Admin: ${isBotAdmin}`);
            
            // Try to delete message
            try {
                await zk.sendMessage(chatJid, { 
                    delete: message.key 
                });
                console.log("✅ Link message deleted");
            } catch (deleteError) {
                console.log("❌ Failed to delete:", deleteError.message);
            }
            
            const action = getAntilinkAction();
            const warnLimit = getWarnCountSetting();
            
            if (action === "warn") {
                let currentWarns = getUserWarns(sender, chatJid);
                currentWarns = addUserWarn(sender, chatJid);
                
                console.log(`Current warns: ${currentWarns}/${warnLimit}`);
                
                if (currentWarns >= warnLimit) {
                    // TRY TO REMOVE - MULTIPLE METHODS
                    let removed = false;
                    
                    // METHOD 1: groupParticipantsUpdate
                    try {
                        await zk.groupParticipantsUpdate(chatJid, [sender], "remove");
                        console.log("✅ User removed (Method 1)");
                        removed = true;
                    } catch (e1) {
                        console.log("❌ Method 1 failed:", e1.message);
                        
                        // METHOD 2: Try with different format
                        try {
                            await zk.groupParticipantsUpdate(chatJid, [sender], 'remove');
                            console.log("✅ User removed (Method 2)");
                            removed = true;
                        } catch (e2) {
                            console.log("❌ Method 2 failed:", e2.message);
                            
                            // METHOD 3: Try kicking
                            try {
                                await zk.groupParticipantsUpdate(chatJid, [sender], 'kick');
                                console.log("✅ User removed (Method 3)");
                                removed = true;
                            } catch (e3) {
                                console.log("❌ All removal methods failed");
                            }
                        }
                    }
                    
                    if (removed) {
                        await zk.sendMessage(chatJid, {
                            text: `🔨 @${sender.split('@')[0]} removed for sending links ${warnLimit} times.`,
                            mentions: [sender]
                        });
                        resetUserWarns(sender, chatJid);
                    } else {
                        await zk.sendMessage(chatJid, {
                            text: `⚠️ @${sender.split('@')[0]} You have sent ${currentWarns}/${warnLimit} links.\n` +
                                  `❌ *Failed to remove* - Bot might not have proper admin rights.`,
                            mentions: [sender]
                        });
                    }
                } else {
                    const remaining = warnLimit - currentWarns;
                    await zk.sendMessage(chatJid, {
                        text: `⚠️ @${sender.split('@')[0]} Links are not allowed!\n\n` +
                              `*Warning:* ${currentWarns}/${warnLimit}\n` +
                              `*Remaining:* ${remaining}`,
                        mentions: [sender]
                    });
                }
            } 
            else if (action === "remove") {
                // TRY TO REMOVE IMMEDIATELY - MULTIPLE METHODS
                let removed = false;
                
                try {
                    await zk.groupParticipantsUpdate(chatJid, [sender], "remove");
                    removed = true;
                } catch (e1) {
                    try {
                        await zk.groupParticipantsUpdate(chatJid, [sender], 'kick');
                        removed = true;
                    } catch (e2) {}
                }
                
                if (removed) {
                    await zk.sendMessage(chatJid, {
                        text: `🔨 @${sender.split('@')[0]} removed for sending links.`,
                        mentions: [sender]
                    });
                } else {
                    await zk.sendMessage(chatJid, {
                        text: `⚠️ @${sender.split('@')[0]} Links are not allowed!\n` +
                              `❌ *Failed to remove* - Bot might not have proper admin rights.`,
                        mentions: [sender]
                    });
                }
            }
            
            return true;
            
        } catch (error) {
            console.error("Antilink error:", error);
            return false;
        }
    }
};
