const { zokou } = require("../framework/zokou");
const conf = require("../set");

zokou({
    nomCom: "repo",
    categorie: "General",
    reaction: "📦",
    desc: "Show bot repository and info",
    fromMe: false
}, async (dest, client, cmd) => {
    const { ms, repondre } = cmd;

    const text = `📦 *${conf.BOT_NAME || "RAHMANI-XMD"} REPOSITORY*

┌─────────────────────
│  🔗 *Repo:*
│  github.com/Qartde/RAHMANI-XMD
│
│  🌐 *Pair Site:*
│  rahmani-pair.onrender.com
│
│  👤 *Owner:*
│  wa.me/255693629079
│
└─────────────────────

⚡ *Powered by ${conf.BOT_NAME || "RAHMANI-XMD"}*`;

    await repondre(text);
});
