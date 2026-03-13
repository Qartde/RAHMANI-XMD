const { zokou } = require("../framework/zokou");

// ==================== CLEAR CHAT ====================
zokou({
    nomCom: 'clear',
    categorie: 'Whatsapp',
    reaction: '🧹'
}, async (dest, zk, commandeOptions) => {
    const { ms, repondre, auteurMessage } = commandeOptions;
    
    try {
        await zk.chatModify({
            delete: true,
            lastMessages: [{
                key: ms.key,
                messageTimestamp: ms.messageTimestamp
            }]
        }, dest);

        await zk.sendMessage(dest, { 
            text: '✅ *Chat cleared successfully!*' 
        }, { quoted: ms });
        
    } catch (e) {
        console.error("Clear error:", e);
        await repondre('❌ Error: ' + e.message);
    }
});

// ==================== ARCHIVE CHAT ====================
zokou({
    nomCom: 'archive',
    categorie: 'Whatsapp',
    reaction: '📦'
}, async (dest, zk, commandeOptions) => {
    const { ms, repondre } = commandeOptions;
    
    try {
        await zk.chatModify({
            archive: true,
            lastMessages: [{
                key: ms.key,
                messageTimestamp: ms.messageTimestamp
            }]
        }, dest);

        await zk.sendMessage(dest, { 
            text: '✅ *Chat archived successfully!*' 
        }, { quoted: ms });
        
    } catch (e) {
        console.error("Archive error:", e);
        await repondre('❌ Error: ' + e.message);
    }
});

// ==================== UNARCHIVE CHAT ====================
zokou({
    nomCom: 'unarchive',
    categorie: 'Whatsapp',
    reaction: '📭'
}, async (dest, zk, commandeOptions) => {
    const { ms, repondre } = commandeOptions;
    
    try {
        await zk.chatModify({
            archive: false,
            lastMessages: [{
                key: ms.key,
                messageTimestamp: ms.messageTimestamp
            }]
        }, dest);

        await zk.sendMessage(dest, { 
            text: '✅ *Chat unarchived successfully!*' 
        }, { quoted: ms });
        
    } catch (e) {
        console.error("Unarchive error:", e);
        await repondre('❌ Error: ' + e.message);
    }
});

// ==================== PIN CHAT ====================
zokou({
    nomCom: 'pin',
    aliases: ['pinchat', 'chatpin'],
    categorie: 'Whatsapp',
    reaction: '📌'
}, async (dest, zk, commandeOptions) => {
    const { ms, repondre } = commandeOptions;
    
    try {
        await zk.chatModify({
            pin: true
        }, dest);

        await zk.sendMessage(dest, { 
            text: '✅ *Chat pinned successfully!*' 
        }, { quoted: ms });
        
    } catch (e) {
        console.error("Pin error:", e);
        await repondre('❌ Error: ' + e.message);
    }
});

// ==================== UNPIN CHAT ====================
zokou({
    nomCom: 'unpin',
    aliases: ['unpinchat', 'chatunpin'],
    categorie: 'Whatsapp',
    reaction: '📌'
}, async (dest, zk, commandeOptions) => {
    const { ms, repondre } = commandeOptions;
    
    try {
        await zk.chatModify({
            pin: false
        }, dest);

        await zk.sendMessage(dest, { 
            text: '✅ *Chat unpinned successfully!*' 
        }, { quoted: ms });
        
    } catch (e) {
        console.error("Unpin error:", e);
        await repondre('❌ Error: ' + e.message);
    }
});

// ==================== MARK AS READ ====================
zokou({
    nomCom: 'read',
    aliases: ['markread'],
    categorie: 'Whatsapp',
    reaction: '👁️'
}, async (dest, zk, commandeOptions) => {
    const { ms, repondre } = commandeOptions;
    
    try {
        await zk.chatModify({
            markRead: true,
            lastMessages: [{
                key: ms.key,
                messageTimestamp: ms.messageTimestamp
            }]
        }, dest);

        await zk.sendMessage(dest, { 
            text: '✅ *Marked as read!*' 
        }, { quoted: ms });
        
    } catch (e) {
        console.error("Mark read error:", e);
        await repondre('❌ Error: ' + e.message);
    }
});

// ==================== MARK AS UNREAD ====================
zokou({
    nomCom: 'unread',
    aliases: ['markunread'],
    categorie: 'Whatsapp',
    reaction: '👁️‍🗨️'
}, async (dest, zk, commandeOptions) => {
    const { ms, repondre } = commandeOptions;
    
    try {
        await zk.chatModify({
            markRead: false,
            lastMessages: [{
                key: ms.key,
                messageTimestamp: ms.messageTimestamp
            }]
        }, dest);

        await zk.sendMessage(dest, { 
            text: '✅ *Marked as unread!*' 
        }, { quoted: ms });
        
    } catch (e) {
        console.error("Mark unread error:", e);
        await repondre('❌ Error: ' + e.message);
    }
});

// ==================== MUTE CHAT ====================
zokou({
    nomCom: 'mute',
    aliases: ['mutechat'],
    categorie: 'Whatsapp',
    reaction: '🔇'
}, async (dest, zk, commandeOptions) => {
    const { ms, repondre, arg } = commandeOptions;
    
    try {
        // Mute kwa muda: 1h, 8h, 1w, always
        let muteDuration = '1h'; // default
        if (arg[0]) {
            if (arg[0] === '8h') muteDuration = '8h';
            else if (arg[0] === '1w') muteDuration = '1w';
            else if (arg[0] === 'always') muteDuration = 'always';
        }

        await zk.chatModify({
            mute: muteDuration
        }, dest);

        await zk.sendMessage(dest, { 
            text: `✅ *Chat muted for ${muteDuration}!*` 
        }, { quoted: ms });
        
    } catch (e) {
        console.error("Mute error:", e);
        await repondre('❌ Error: ' + e.message);
    }
});

// ==================== UNMUTE CHAT ====================
zokou({
    nomCom: 'unmute',
    aliases: ['unmutechat'],
    categorie: 'Whatsapp',
    reaction: '🔊'
}, async (dest, zk, commandeOptions) => {
    const { ms, repondre } = commandeOptions;
    
    try {
        await zk.chatModify({
            mute: null
        }, dest);

        await zk.sendMessage(dest, { 
            text: '✅ *Chat unmuted successfully!*' 
        }, { quoted: ms });
        
    } catch (e) {
        console.error("Unmute error:", e);
        await repondre('❌ Error: ' + e.message);
    }
});

// ==================== PROFILE NAME ====================
zokou({
    nomCom: 'setname',
    aliases: ['profilename', 'changename'],
    categorie: 'Whatsapp',
    reaction: '✏️'
}, async (dest, zk, commandeOptions) => {
    const { ms, repondre, arg } = commandeOptions;
    
    try {
        const newName = arg.join(' ');
        if (!newName) {
            return await repondre('❌ Please provide a name!\nExample: `.setname Rahman Xmd`');
        }

        await zk.updateProfileName(newName);
        await zk.sendMessage(dest, { 
            text: `✅ *Profile name updated to:*\n${newName}` 
        }, { quoted: ms });
        
    } catch (e) {
        console.error("Setname error:", e);
        await repondre('❌ Error: ' + e.message);
    }
});
