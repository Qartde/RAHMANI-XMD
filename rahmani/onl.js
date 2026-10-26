const { zokou } = require("../framework/zokou");
const conf = require("../set");

zokou({
    nomCom: "online",
    categorie: "Group",
    reaction: "🟢",
    desc: "Check online members in group",
    fromMe: false
}, async (dest, client, cmd) => {
    const { ms, repondre, verifGroupe } = cmd;

    if (!verifGroupe) {
        return repondre("❌ *This command only works in groups!*");
    }

    await repondre("⏳ *Scanning for online members... (This may take a few seconds)*");

    try {
        // Chukua taarifa za group
        const metadata = await client.groupMetadata(dest);
        const participants = metadata.participants;
        
        let onlineUsers = [];

        // WhatsApp inatuwezesha ku-subscribe kwa presence ya kila mtu
        // Hapa tunasubiri sekunde 3 ili kupokea majibu ya nani yupo online
        for (const p of participants) {
            await client.presenceSubscribe(p.id);
        }

        // Tunatumia event listener kwa muda mfupi kukamata wale walio online
        const onlineTracker = new Set();
        
        const presenceListener = (update) => {
            if (update.presences) {
                for (const [jid, data] of Object.entries(update.presences)) {
                    if (data.lastKnownPresence === "available" || data.lastKnownPresence === "composing" || data.lastKnownPresence === "recording") {
                        onlineTracker.add(jid);
                    }
                }
            }
        };

        client.ev.on("presence.update", presenceListener);

        // Subiri sekunde 4 kupata majibu
        await new Promise(resolve => setTimeout(resolve, 4000));

        // Ondoa listener baada ya kumaliza
        client.ev.off("presence.update", presenceListener);

        // Tengeneza ujumbe
        if (onlineTracker.size === 0) {
            return repondre("🟢 *Currently, no members are detected online.*");
        }

        let text = `🟢 *ONLINE MEMBERS (${onlineTracker.size})*\n\n`;
        let mentions = [];

        for (const jid of onlineTracker) {
            const number = jid.split('@')[0];
            text += `• @${number}\n`;
            mentions.push(jid);
        }

        text += `\n⚡ *Powered by ${conf.BOT_NAME || "RAHMANI-XMD"}*`;

        await client.sendMessage(dest, { 
            text: text, 
            mentions: mentions 
        }, { quoted: ms });

    } catch (e) {
        console.error("Online Command Error:", e.message);
        await repondre(`❌ *Error:* ${e.message}`);
    }
});
