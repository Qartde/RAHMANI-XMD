const { zokou } = require("../framework/zokou");
const conf = require("../set");
const {
    verifierEtatJid,
    recupererActionJid,
    modifierEtatJid,
    modifierActionJid
} = require("../bdd/antilien");

zokou({
    nomCom: "antilink",
    categorie: "Group",
    reaction: "🛡️",
    desc: "Manage anti-link protection (on/off/set/get)",
    fromMe: false
}, async (dest, zk, commandeOptions) => {
    const { ms, arg, repondre, verifGroupe, verifAdmin, superUser, nomGroupe } = commandeOptions;

    // ═══════════════════════════════════════════
    //   ✅ CHECK — Group only
    // ═══════════════════════════════════════════
    if (!verifGroupe) {
        return repondre("❌ *This command only works in groups!*");
    }

    // ═══════════════════════════════════════════
    //   ✅ CHECK — Admin or Owner only
    // ═══════════════════════════════════════════
    if (!verifAdmin && !superUser) {
        return repondre("❌ *Only admins or owner can use this command!*");
    }

    // ═══════════════════════════════════════════
    //   📌 NO ARGS — Show status
    // ═══════════════════════════════════════════
    if (!arg || arg.length === 0) {
        const isEnabled = await verifierEtatJid(dest);
        const action = await recupererActionJid(dest);

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
▸ *.antilink on* — Enable
▸ *.antilink off* — Disable
▸ *.antilink set remove* — Remove user
▸ *.antilink set delete* — Delete message
▸ *.antilink set warn* — Warn user

> *View channel*`);
    }

    const action = (arg[0] || "").toLowerCase();

    // ═══════════════════════════════════════════
    //   🟢 ON — Enable anti-link
    // ═══════════════════════════════════════════
    if (action === "on") {
        await modifierEtatJid(dest, true);
        return repondre(`🛡️ *ANTI-LINK ENABLED* ✅

📌 *Group:* ${nomGroupe || "This Group"}
⚙️ *Status:* 🟢 ON
🔨 *Action:* Delete

⚠️ *Set action with*: .antilink set <remove|delete|warn>

> *View channel*`);
    }

    // ═══════════════════════════════════════════
    //   🔴 OFF — Disable anti-link
    // ═══════════════════════════════════════════
    if (action === "off") {
        await modifierEtatJid(dest, false);
        return repondre(`🛡️ *ANTI-LINK DISABLED* ❌

📌 *Group:* ${nomGroupe || "This Group"}
⚙️ *Status:* 🔴 OFF

> *View channel*`);
    }

    // ═══════════════════════════════════════════
    //   ⚙️ SET — Choose action
    // ═══════════════════════════════════════════
    if (action === "set") {
        const setAction = (arg[1] || "").toLowerCase();

        if (!["remove", "delete", "warn"].includes(setAction)) {
            return repondre(`❌ *Choose a valid action:*

▸ *.antilink set remove* — Remove user
▸ *.antilink set delete* — Delete message
▸ *.antilink set warn* — Warn user

> *View channel*`);
        }

        await modifierActionJid(dest, setAction);

        const actionEmoji = setAction === "remove" ? "🚫" : setAction === "delete" ? "🗑️" : "⚠️";

        return repondre(`🛡️ *ANTI-LINK ACTION SET* ✅

📌 *Group:* ${nomGroupe || "This Group"}
${actionEmoji} *Action:* ${setAction.toUpperCase()}
⚙️ *Status:* 🟢 ON

> *View channel*`);
    }

    // ═══════════════════════════════════════════
    //   ❓ UNKNOWN — Show help
    // ═══════════════════════════════════════════
    return repondre(`❓ *Unknown command*

📖 *Commands:*
▸ *.antilink on* — Enable
▸ *.antilink off* — Disable
▸ *.antilink set remove* — Remove user
▸ *.antilink set delete* — Delete message
▸ *.antilink set warn* — Warn user

> *View channel*`);
});
