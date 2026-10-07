const { zokou } = require("../framework/zokou");
const conf = require("../set");
const fs = require("fs-extra");
const path = require("path");

// ═══════════════════════════════════════════
//   📁 DB PATH
// ═══════════════════════════════════════════
const dbPath = path.join(__dirname, "../bdd/antilien.json");

// Initialize DB
if (!fs.existsSync(dbPath)) {
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(dbPath, JSON.stringify({}), "utf8");
}

function loadData() {
    try {
        return JSON.parse(fs.readFileSync(dbPath, "utf8"));
    } catch {
        return {};
    }
}

function saveData(data) {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf8");
}

async function getState(jid) {
    const data = loadData();
    return data[jid]?.enabled === true;
}

async function getAction(jid) {
    const data = loadData();
    return data[jid]?.action || "delete";
}

async function setState(jid, enabled) {
    const data = loadData();
    if (!data[jid]) data[jid] = { enabled: false, action: "delete" };
    data[jid].enabled = enabled === true;
    saveData(data);
}

async function setAction(jid, action) {
    const data = loadData();
    if (!data[jid]) data[jid] = { enabled: false, action: "delete" };
    data[jid].action = action;
    saveData(data);
}

// ═══════════════════════════════════════════
//   🛡️ ANTILINK COMMAND
// ═══════════════════════════════════════════
zokou({
    nomCom: "antilink",
    categorie: "Group",
    reaction: "🛡️",
    desc: "Manage anti-link protection",
    fromMe: false
}, async (dest, zk, commandeOptions) => {
    console.log("🛡️ ANTILINK COMMAND TRIGGERED");
    console.log("   dest:", dest);
    console.log("   arg:", commandeOptions.arg);
    console.log("   verifGroupe:", commandeOptions.verifGroupe);
    console.log("   verifAdmin:", commandeOptions.verifAdmin);
    console.log("   superUser:", commandeOptions.superUser);

    const { ms, arg, repondre, verifGroupe, verifAdmin, superUser, nomGroupe } = commandeOptions;

    try {
        // ✅ Group only
        if (!verifGroupe) {
            return repondre("❌ *This command only works in groups!*");
        }

        // ✅ Admin or Owner only
        if (!verifAdmin && !superUser) {
            return repondre("❌ *Only admins or owner can use this command!*");
        }

        // 📌 Show status (no args)
        if (!arg || arg.length === 0) {
            const isEnabled = await getState(dest);
            const action = await getAction(dest);

            const statusEmoji = isEnabled ? "🟢" : "🔴";
            const statusText = isEnabled ? "ENABLED" : "DISABLED";

            let actionText = "None";
            if (action === "remove") actionText = "🚫 Remove";
            if (action === "delete") actionText = "🗑️ Delete";
            if (action === "warn") actionText = "⚠️ Warn";

            return repondre(`🛡️ *ANTI-LINK | RAHMANI-XMD*

📌 *Group:* ${nomGroupe || "This Group"}
${statusEmoji} *Status:* ${statusText}
⚙️ *Action:* ${actionText}

📖 *Commands:*
▸ .antilink on
▸ .antilink off
▸ .antilink set remove
▸ .antilink set delete
▸ .antilink set warn

> *View channel*`);
        }

        const action = (arg[0] || "").toLowerCase();

        // 🟢 ON
        if (action === "on") {
            await setState(dest, true);
            return repondre(`🛡️ *ANTI-LINK ENABLED* ✅

📌 *Group:* ${nomGroupe || "This Group"}
⚙️ *Status:* 🟢 ON
🔨 *Action:* ${await getAction(dest)}

> *View channel*`);
        }

        // 🔴 OFF
        if (action === "off") {
            await setState(dest, false);
            return repondre(`🛡️ *ANTI-LINK DISABLED* ❌

📌 *Group:* ${nomGroupe || "This Group"}
⚙️ *Status:* 🔴 OFF

> *View channel*`);
        }

        // ⚙️ SET
        if (action === "set") {
            const setAction = (arg[1] || "").toLowerCase();

            if (!["remove", "delete", "warn"].includes(setAction)) {
                return repondre(`❌ *Choose a valid action:*

▸ .antilink set remove
▸ .antilink set delete
▸ .antilink set warn

> *View channel*`);
            }

            await setAction(dest, setAction);

            const emoji = setAction === "remove" ? "🚫" : setAction === "delete" ? "🗑️" : "⚠️";

            return repondre(`🛡️ *ANTI-LINK ACTION SET* ✅

📌 *Group:* ${nomGroupe || "This Group"}
${emoji} *Action:* ${setAction.toUpperCase()}
⚙️ *Status:* 🟢 ON

> *View channel*`);
        }

        // ❓ Unknown
        return repondre(`❓ *Unknown option*

📖 *Commands:*
▸ .antilink on
▸ .antilink off
▸ .antilink set remove
▸ .antilink set delete
▸ .antilink set warn

> *View channel*`);

    } catch (err) {
        console.error("❌ ANTILINK ERROR:", err);
        return repondre(`❌ *Error:* ${err.message}`);
    }
});
