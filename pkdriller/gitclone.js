const { zokou } = require("../framework/zokou");

zokou({
  nomCom: "github",
  aliases: ["git", "gh"],
  reaction: "📃",
  categorie: "Search"
}, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms, prefixe } = commandeOptions;
  
  const username = arg.join(" ");
  
  if (!username) {
    return repondre(`📃 *Example:* ${prefixe}github betingrich`);
  }

  try {
    await repondre(`🔍 Searching GitHub for: ${username}...`);

    const response = await fetch(`https://api.github.com/users/${username}`);
    const data = await response.json();

    if (!response.ok || data.message === "Not Found") {
      return repondre(`❌ User "${username}" not found on GitHub.`);
    }

    const info = `📃 *GITHUB USER INFO*\n\n` +
                 `📛 *Name:* ${data.name || 'N/A'}\n` +
                 `👤 *Username:* ${data.login}\n` +
                 `📝 *Bio:* ${data.bio || 'N/A'}\n` +
                 `📍 *Location:* ${data.location || 'N/A'}\n` +
                 `📁 *Public Repos:* ${data.public_repos}\n` +
                 `👥 *Followers:* ${data.followers}\n` +
                 `🫂 *Following:* ${data.following}\n` +
                 `🔗 *URL:* ${data.html_url}\n\n` +
                 `⚡ *RAHMANI-XMD*`;

    await zk.sendMessage(dest, {
      image: { url: data.avatar_url },
      caption: info
    }, { quoted: ms });

  } catch (error) {
    console.error(error);
    repondre(`❌ Error: ${error.message}`);
  }
});
