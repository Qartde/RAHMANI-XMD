const { zokou } = require("../framework/zokou");
const conf = require("../set");
const fs = require("fs-extra");

// ═══════════════════════════════════════════════
//   ⚡ RAHMANI-XMD : OWNER COMMANDS
// ═══════════════════════════════════════════════

// Helper: Check if sender is owner
function isOwner(cmd) {
    return cmd.superUser || cmd.auteurMessage === conf.NUMERO_OWNER + "@s.whatsapp.net";
}

// 1. MODE (Change Public/Private)
zokou({
    nomCom: "mode",
    categorie: "Owner",
    reaction: "⚙️",
    desc: "Change bot mode (public/private)",
    fromMe: false
}, async (dest, client, cmd) => {
    const { arg, repondre } = cmd;

    if (!isOwner(cmd)) return repondre("❌ *This command is for the Owner only!*");
    if (!arg[0]) return repondre("❌ *Usage:* .mode <public|private>");

    const newMode = arg[0].toLowerCase();
    if (newMode !== "public" && newMode !== "private") {
        return repondre("❌ *Invalid mode! Choose either 'public' or 'private'.*");
    }

    // Update memory (Note: To make it permanent, save to set.js or DB)
    conf.MODE = newMode === "public" ? "yes" : "no";
    
    await repondre(`✅ *Bot mode changed to ${newMode.toUpperCase()}*`);
});

// 2. SETPREFIX (Change Bot Prefix)
zokou({
    nomCom: "setprefix",
    categorie: "Owner",
    reaction: "🔣",
    desc: "Change bot prefix",
    fromMe: false
}, async (dest, client, cmd) => {
    const { arg, repondre } = cmd;

    if (!isOwner(cmd)) return repondre("❌ *This command is for the Owner only!*");
    if (!arg[0]) return repondre("❌ *Usage:* .setprefix <new_prefix>\nExample: .setprefix !");

    const newPrefix = arg[0];
    conf.PREFIXE = newPrefix;
    
    await repondre(`✅ *Bot prefix changed to [ ${newPrefix} ]*`);
});

// 3. BROADCAST (Send message to all chats)
zokou({
    nomCom: "broadcast",
    categorie: "Owner",
    reaction: "📢",
    desc: "Broadcast a message to all chats",
    fromMe: false
}, async (dest, client, cmd) => {
    const { arg, repondre, ms, msgRepondu } = cmd;

    if (!isOwner(cmd)) return repondre("❌ *This command is for the Owner only!*");
    
    const text = msgRepondu ? (msgRepondu.conversation || msgRepondu.extendedTextMessage?.text) : arg.join(" ");
    if (!text) return repondre("❌ *Provide a message to broadcast or reply to a message.*");

    try {
        const chats = Object.keys(await client.groupFetchAllParticipating());
        await repondre(`⏳ *Broadcasting to ${chats.length} groups...*`);
        
        let success = 0;
        for (const chatId of chats) {
            try {
                await client.sendMessage(chatId, { text: `📢 *BROADCAST*\n\n${text}` });
                success++;
                await new Promise(r => setTimeout(r, 2000)); // Delay to prevent ban
            } catch (e) {}
        }
        await repondre(`✅ *Broadcast sent to ${success}/${chats.length} groups!*`);
    } catch (e) {
        await repondre(`❌ Error: ${e.message}`);
    }
});

// 4. RESTART (Restart the bot)
zokou({
    nomCom: "restart",
    categorie: "Owner",
    reaction: "🔄",
    desc: "Restart the bot",
    fromMe: false
}, async (dest, client, cmd) => {
    const { repondre } = cmd;

    if (!isOwner(cmd)) return repondre("❌ *This command is for the Owner only!*");

    await repondre("🔄 *Restarting bot...*");
    setTimeout(() => {
        process.exit(0); // Heroku/Render will auto-restart
    }, 2000);
});

// 5. CLEARSESSION (Delete session and logout)
zokou({
    nomCom: "clearsession",
    categorie: "Owner",
    reaction: "🗑️",
    desc: "Clear bot session (requires re-pairing)",
    fromMe: false
}, async (dest, client, cmd) => {
    const { repondre } = cmd;

    if (!isOwner(cmd)) return repondre("❌ *This command is for the Owner only!*");

    try {
        await repondre("🗑️ *Clearing session... Bot will disconnect.*");
        const scanDir = path.join(__dirname, "../scan");
        if (fs.existsSync(scanDir)) {
            fs.rmSync(scanDir, { recursive: true, force: true });
        }
        setTimeout(() => process.exit(0), 2000);
    } catch (e) {
        await repondre(`❌ Error: ${e.message}`);
    }
});

// 6. SETABOUT (Change Bot Profile Status)
zokou({
    nomCom: "setabout",
    categorie: "Owner",
    reaction: "📝",
    desc: "Change bot about/status",
    fromMe: false
}, async (dest, client, cmd) => {
    const { arg, repondre } = cmd;

    if (!isOwner(cmd)) return repondre("❌ *This command is for the Owner only!*");
    if (!arg[0]) return repondre("❌ *Usage:* .setabout <text>");

    const text = arg.join(" ");
    try {
        await client.updateProfileStatus(text);
        await repondre(`✅ *Bot status updated!*`);
    } catch (e) {
        await repondre(`❌ Error: ${e.message}`);
    }
});

// 7. SETPP (Change Bot Profile Picture)
zokou({
    nomCom: "setpp",
    categorie: "Owner",
    reaction: "🖼️",
    desc: "Change bot profile picture (Reply to image)",
    fromMe: false
}, async (dest, client, cmd) => {
    const { repondre, msgRepondu, ms } = cmd;

    if (!isOwner(cmd)) return repondre("❌ *This command is for the Owner only!*");
    if (!msgRepondu || !msgRepondu.imageMessage) return repondre("❌ *Please reply to an image!*");

    try {
        await repondre("⏳ *Updating profile picture...*");
        const mediaPath = await client.downloadAndSaveMediaMessage(msgRepondu.imageMessage);
        await client.updateProfilePicture(client.user.id, { url: mediaPath });
        
        if (fs.existsSync(mediaPath)) fs.unlinkSync(mediaPath);
        await repondre("✅ *Profile picture updated!*");
    } catch (e) {
        await repondre(`❌ Error: ${e.message}`);
    }
});
