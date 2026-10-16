const fs = require('fs');
const path = require('path');

// Helper functions for settings
const SETTINGS_PATH = path.join(__dirname, 'settings.json');

function loadSettings() {
    try {
        if (fs.existsSync(SETTINGS_PATH)) {
            return JSON.parse(fs.readFileSync(SETTINGS_PATH, 'utf8'));
        }
    } catch (error) {
        console.error('[SETTINGS] Load error:', error);
    }
    return {};
}

function saveSettings(settings) {
    try {
        fs.writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2));
        return true;
    } catch (error) {
        console.error('[SETTINGS] Save error:', error);
        return false;
    }
}

async function antidemoteCommand(sock, chatId, message, args, groupMeta, sender) {
    try {
        // Extract text from message
        const rawText = message.message?.conversation?.trim() ||
            message.message?.extendedTextMessage?.text?.trim() ||
            message.message?.imageMessage?.caption?.trim() ||
            message.message?.videoMessage?.caption?.trim() ||
            '';
        
        const used = (rawText || '').split(/\s+/)[0] || '.antidemote';
        const query = rawText.slice(used.length).trim();
        const argsList = query.split(/\s+/).filter(arg => arg);
        
        // Group validation
        if (!groupMeta) {
            await sock.sendMessage(chatId, { 
                text: '❌ This command can only be used in groups!' 
            }, { quoted: message });
            return;
        }

        // Admin check
        const groupAdmins = groupMeta.participants.filter(p => p.admin).map(p => p.id);
        const isAdmin = groupAdmins.includes(sender);
        
        if (!isAdmin) {
            await sock.sendMessage(chatId, { 
                text: '⚠️ You must be an admin first to execute this command!' 
            }, { quoted: message });
            return;
        }

        // Load settings
        const settings = loadSettings();
        settings.antidemote = settings.antidemote || {};

        // Parse arguments
        const option = argsList[0]?.toLowerCase();
        const mode = argsList[1]?.toLowerCase() || "revert";

        // Handle ON option
        if (option === "on") {
            if (mode !== "revert" && mode !== "kick") {
                await sock.sendMessage(chatId, { 
                    text: '❌ Invalid mode! Use "revert" or "kick".\nExample: .antidemote on revert' 
                }, { quoted: message });
                return;
            }

            settings.antidemote[chatId] = { enabled: true, mode };
            
            if (saveSettings(settings)) {
                await sock.sendMessage(chatId, { 
                    text: `✅ AntiDemote enabled!\nMode: *${mode.toUpperCase()}*` 
                }, { quoted: message });
            } else {
                await sock.sendMessage(chatId, { 
                    text: '❌ Failed to save settings. Please try again.' 
                }, { quoted: message });
            }
            return;
        }

        // Handle OFF option
        if (option === "off") {
            delete settings.antidemote[chatId];
            
            if (saveSettings(settings)) {
                await sock.sendMessage(chatId, { 
                    text: '❎ AntiDemote disabled!' 
                }, { quoted: message });
            } else {
                await sock.sendMessage(chatId, { 
                    text: '❌ Failed to save settings. Please try again.' 
                }, { quoted: message });
            }
            return;
        }

        // Show current status (when no option provided)
        const current = settings.antidemote[chatId]?.enabled
            ? `✅ ON (${settings.antidemote[chatId].mode.toUpperCase()})`
            : "❎ OFF";

        const helpText = 
            `📢 *AntiDemote Settings*\n\n` +
            `• Status: ${current}\n\n` +
            `🧩 Usage:\n` +
            `- .antidemote on revert\n` +
            `- .antidemote on kick\n` +
            `- .antidemote off`;

        await sock.sendMessage(chatId, { 
            text: helpText 
        }, { quoted: message });

    } catch (error) {
        console.error('[ANTIDEMOTE] error:', error?.message || error);
        const errorMsg = error?.message || 'Unknown error';
        await sock.sendMessage(chatId, { 
            text: `❌ Failed to configure AntiDemote.\nError: ${errorMsg}` 
        }, { quoted: message });
    }
}

async function antipromoteCommand(sock, chatId, message, args, groupMeta, sender) {
    try {
        // Extract text from message
        const rawText = message.message?.conversation?.trim() ||
            message.message?.extendedTextMessage?.text?.trim() ||
            message.message?.imageMessage?.caption?.trim() ||
            message.message?.videoMessage?.caption?.trim() ||
            '';
        
        const used = (rawText || '').split(/\s+/)[0] || '.antipromote';
        const query = rawText.slice(used.length).trim();
        const argsList = query.split(/\s+/).filter(arg => arg);
        
        // Group validation
        if (!groupMeta) {
            await sock.sendMessage(chatId, { 
                text: '❌ This command can only be used in groups!' 
            }, { quoted: message });
            return;
        }

        // Admin check
        const groupAdmins = groupMeta.participants.filter(p => p.admin).map(p => p.id);
        const isAdmin = groupAdmins.includes(sender);
        
        if (!isAdmin) {
            await sock.sendMessage(chatId, { 
                text: '⚠️ You must be an admin first to execute this command!' 
            }, { quoted: message });
            return;
        }

        // Load settings
        const settings = loadSettings();
        settings.antipromote = settings.antipromote || {};

        // Parse arguments
        const option = argsList[0]?.toLowerCase();
        const mode = argsList[1]?.toLowerCase() || "demote";

        // Handle ON option
        if (option === "on") {
            if (mode !== "demote" && mode !== "kick") {
                await sock.sendMessage(chatId, { 
                    text: '❌ Invalid mode! Use "demote" or "kick".\nExample: .antipromote on demote' 
                }, { quoted: message });
                return;
            }

            settings.antipromote[chatId] = { enabled: true, mode };
            
            if (saveSettings(settings)) {
                await sock.sendMessage(chatId, { 
                    text: `✅ AntiPromote enabled!\nMode: *${mode.toUpperCase()}*` 
                }, { quoted: message });
            } else {
                await sock.sendMessage(chatId, { 
                    text: '❌ Failed to save settings. Please try again.' 
                }, { quoted: message });
            }
            return;
        }

        // Handle OFF option
        if (option === "off") {
            delete settings.antipromote[chatId];
            
            if (saveSettings(settings)) {
                await sock.sendMessage(chatId, { 
                    text: '❎ AntiPromote disabled!' 
                }, { quoted: message });
            } else {
                await sock.sendMessage(chatId, { 
                    text: '❌ Failed to save settings. Please try again.' 
                }, { quoted: message });
            }
            return;
        }

        // Show current status (when no option provided)
        const current = settings.antipromote[chatId]?.enabled
            ? `✅ ON (${settings.antipromote[chatId].mode.toUpperCase()})`
            : "❎ OFF";

        const helpText = 
            `📢 *AntiPromote Settings*\n\n` +
            `• Status: ${current}\n\n` +
            `🧩 Usage:\n` +
            `- .antipromote on demote\n` +
            `- .antipromote on kick\n` +
            `- .antipromote off`;

        await sock.sendMessage(chatId, { 
            text: helpText 
        }, { quoted: message });

    } catch (error) {
        console.error('[ANTIPROMOTE] error:', error?.message || error);
        const errorMsg = error?.message || 'Unknown error';
        await sock.sendMessage(chatId, { 
            text: `❌ Failed to configure AntiPromote.\nError: ${errorMsg}` 
        }, { quoted: message });
    }
}

// Event handler for group participants update
async function handleGroupParticipantsUpdate(sock, update) {
    try {
        const { id, participants, action } = update;
        
        // Load settings
        const settings = loadSettings();
        
        // Check antidemote
        if (action === 'demote' && settings.antidemote?.[id]?.enabled) {
            const mode = settings.antidemote[id].mode;
            
            if (mode === "revert") {
                // Re-promote the demoted participant
                for (const participant of participants) {
                    await sock.groupParticipantsUpdate(id, [participant], 'promote');
                }
            } else if (mode === "kick") {
                // Kick the demoter (assuming first participant is the demoter)
                const demoter = participants[0];
                await sock.groupParticipantsUpdate(id, [demoter], 'remove');
            }
        }
        
        // Check antipromote
        if (action === 'promote' && settings.antipromote?.[id]?.enabled) {
            const mode = settings.antipromote[id].mode;
            
            if (mode === "demote") {
                // Demote the promoted participant
                for (const participant of participants) {
                    await sock.groupParticipantsUpdate(id, [participant], 'demote');
                }
            } else if (mode === "kick") {
                // Kick the promoter (assuming first participant is the promoter)
                const promoter = participants[0];
                await sock.groupParticipantsUpdate(id, [promoter], 'remove');
            }
        }
    } catch (error) {
        console.error('[GROUP UPDATE] error:', error?.message || error);
    }
}

module.exports = {
    antidemoteCommand,
    antipromoteCommand,
    handleGroupParticipantsUpdate
};
