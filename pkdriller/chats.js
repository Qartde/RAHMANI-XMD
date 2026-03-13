const { zokou } = require("../framework/zokou");

// ==================== GET PRIVACY SETTINGS ====================
zokou({
    nomCom: "privacy",
    aliases: ["getprivacy", "privacysettings"],
    reaction: "🔒",
    categorie: "Settings"
}, async (dest, zk, commandeOptions) => {
    const { ms, repondre, auteurMessage } = commandeOptions;
    
    try {
        const privacy = await zk.fetchPrivacySettings(true);
        
        const msg = `🔒 *WHATSAPP PRIVACY SETTINGS*\n\n` +
                    `👤 *Profile:* ${privacy.profile || 'all'}\n` +
                    `📝 *Status:* ${privacy.status || 'all'}\n` +
                    `👁️ *Last Seen:* ${privacy.last || 'all'}\n` +
                    `✅ *Read Receipts:* ${privacy.readreceipts || 'all'}\n` +
                    `🌐 *Online:* ${privacy.online || 'all'}\n` +
                    `👥 *Group Add:* ${privacy.groupadd || 'all'}\n` +
                    `📞 *Calls:* ${privacy.calladd || 'all'}`;

        await zk.sendMessage(dest, { text: msg }, { quoted: ms });
        
    } catch (e) {
        console.error("Privacy error:", e);
        await repondre("❌ Error: " + e.message);
    }
});

// ==================== LAST SEEN PRIVACY ====================
zokou({
    nomCom: "lastseen",
    reaction: "👁️",
    categorie: "Settings"
}, async (dest, zk, commandeOptions) => {
    const { ms, repondre, arg } = commandeOptions;
    
    try {
        const setting = arg[0];
        if (!setting) {
            return await repondre("❌ *Usage:* .lastseen [all/contacts/none]\nExample: .lastseen none");
        }
        
        const valid = ['all', 'contacts', 'contact_blacklist', 'none'];
        if (!valid.includes(setting)) {
            return await repondre("❌ Invalid! Use: all/contacts/none");
        }
        
        await zk.updateLastSeenPrivacy(setting);
        await repondre(`✅ Last seen privacy set to: *${setting}*`);
        
    } catch (e) {
        console.error("Lastseen error:", e);
        await repondre("❌ Error: " + e.message);
    }
});

// ==================== PROFILE PICTURE PRIVACY ====================
zokou({
    nomCom: "profilepic",
    aliases: ["pprivacy", "mypp"],
    reaction: "🖼️",
    categorie: "Settings"
}, async (dest, zk, commandeOptions) => {
    const { ms, repondre, arg } = commandeOptions;
    
    try {
        const setting = arg[0];
        if (!setting) {
            return await repondre("❌ *Usage:* .profilepic [all/contacts/none]\nExample: .profilepic contacts");
        }
        
        const valid = ['all', 'contacts', 'contact_blacklist', 'none'];
        if (!valid.includes(setting)) {
            return await repondre("❌ Invalid! Use: all/contacts/none");
        }
        
        await zk.updateProfilePicturePrivacy(setting);
        await repondre(`✅ Profile picture privacy set to: *${setting}*`);
        
    } catch (e) {
        console.error("Profilepic error:", e);
        await repondre("❌ Error: " + e.message);
    }
});

// ==================== STATUS PRIVACY ====================
zokou({
    nomCom: "statusprivacy",
    aliases: ["statuspriv", "mystatus"],
    reaction: "📝",
    categorie: "Settings"
}, async (dest, zk, commandeOptions) => {
    const { ms, repondre, arg } = commandeOptions;
    
    try {
        const setting = arg[0];
        if (!setting) {
            return await repondre("❌ *Usage:* .statusprivacy [all/contacts/none]\nExample: .statusprivacy all");
        }
        
        const valid = ['all', 'contacts', 'contact_blacklist', 'none'];
        if (!valid.includes(setting)) {
            return await repondre("❌ Invalid! Use: all/contacts/none");
        }
        
        await zk.updateStatusPrivacy(setting);
        await repondre(`✅ Status privacy set to: *${setting}*`);
        
    } catch (e) {
        console.error("Statusprivacy error:", e);
        await repondre("❌ Error: " + e.message);
    }
});

// ==================== READ RECEIPTS PRIVACY ====================
zokou({
    nomCom: "readreceipts",
    aliases: ["read", "recipts"],
    reaction: "✅",
    categorie: "Settings"
}, async (dest, zk, commandeOptions) => {
    const { ms, repondre, arg } = commandeOptions;
    
    try {
        const setting = arg[0];
        if (!setting) {
            return await repondre("❌ *Usage:* .readreceipts [all/none]\nExample: .readreceipts none");
        }
        
        const valid = ['all', 'none'];
        if (!valid.includes(setting)) {
            return await repondre("❌ Invalid! Use: all/none");
        }
        
        await zk.updateReadReceiptsPrivacy(setting);
        await repondre(`✅ Read receipts set to: *${setting}*`);
        
    } catch (e) {
        console.error("Readreceipts error:", e);
        await repondre("❌ Error: " + e.message);
    }
});

// ==================== GROUP ADD PRIVACY ====================
zokou({
    nomCom: "groupadd",
    aliases: ["addprivacy"],
    reaction: "👥",
    categorie: "Settings"
}, async (dest, zk, commandeOptions) => {
    const { ms, repondre, arg } = commandeOptions;
    
    try {
        const setting = arg[0];
        if (!setting) {
            return await repondre("❌ *Usage:* .groupadd [all/contacts/none]\nExample: .groupadd contacts");
        }
        
        const valid = ['all', 'contacts', 'contact_blacklist', 'none'];
        if (!valid.includes(setting)) {
            return await repondre("❌ Invalid! Use: all/contacts/none");
        }
        
        await zk.updateGroupsAddPrivacy(setting);
        await repondre(`✅ Group add privacy set to: *${setting}*`);
        
    } catch (e) {
        console.error("Groupadd error:", e);
        await repondre("❌ Error: " + e.message);
    }
});

// ==================== ONLINE PRIVACY ====================
zokou({
    nomCom: "onlineprivacy",
    aliases: ["online"],
    reaction: "🌐",
    categorie: "Settings"
}, async (dest, zk, commandeOptions) => {
    const { ms, repondre, arg } = commandeOptions;
    
    try {
        const setting = arg[0];
        if (!setting) {
            return await repondre("❌ *Usage:* .onlineprivacy [all/lastseen]\nExample: .onlineprivacy all");
        }
        
        const valid = ['all', 'match_last_seen', 'lastseen'];
        if (!valid.includes(setting)) {
            return await repondre("❌ Invalid! Use: all/lastseen");
        }
        
        const value = setting === 'lastseen' ? 'match_last_seen' : setting;
        await zk.updateOnlinePrivacy(value);
        await repondre(`✅ Online privacy set to: *${setting}*`);
        
    } catch (e) {
        console.error("Online error:", e);
        await repondre("❌ Error: " + e.message);
    }
});

// ==================== PROFILE NAME ====================
zokou({
    nomCom: "setname",
    aliases: ["profilename"],
    reaction: "✏️",
    categorie: "Settings"
}, async (dest, zk, commandeOptions) => {
    const { ms, repondre, arg } = commandeOptions;
    
    try {
        const name = arg.join(" ");
        if (!name) {
            return await repondre("❌ *Usage:* .setname Your Name\nExample: .setname Rahman Xmd");
        }
        
        await zk.updateProfileName(name);
        await repondre(`✅ Profile name updated to: *${name}*`);
        
    } catch (e) {
        console.error("Setname error:", e);
        await repondre("❌ Error: " + e.message);
    }
});
