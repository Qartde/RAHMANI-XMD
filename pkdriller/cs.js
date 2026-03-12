"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

const { zokou } = require("../framework/zokou");
const axios = require("axios");
const conf = require("../set");

zokou(
  { 
    nomCom: "repo", 
    categorie: "General", 
    reaction: "🌟", 
    nomFichier: __filename 
  },
  async (dest, zk, commandeOptions) => {
    
    const repoUrl = "https://github.com/Qartde/RAHMANI-XMD";
    const channelUrl = "https://whatsapp.com/channel/0029VatokI45EjxufALmY32X";
    const imageUrl = conf.URL || "https://files.catbox.moe/aktbgo.jpg";
    const botName = conf.BOT || "ʀᴀʜᴍᴀɴɪ xᴍᴅ";
    
    try {
      const response = await axios.get("https://api.github.com/repos/Qartde/RAHMANI-XMD");
      const data = response.data;

      const stars = data.stargazers_count || 0;
      const forks = data.forks_count || 0;
      const updated = new Date(data.updated_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });

      const repoMessage = `
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   🌟 *${botName} REPOSITORY* 🌟
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ ✨ *REPO INFORMATION*
┃ ═══════════════════════════
┃
┃ 📂 *Repo:*RAHMANI-XMD
┃ 👤 *Owner:* Qartde
┃ 📅 *Updated:* ${updated}
┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃
┃ ⭐ *Stars:* ${stars}  │  🍴 *Forks:* ${forks}
┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃
┃ 📝 *Description:*
┃ ${data.description || "Multi-functional WhatsApp Bot"}
┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃
┃ 🔗 *LINKS*
┃ ═══════════════════════════
┃ 📎 GitHub: ${repoUrl}
┃ 📢 Channel: ${channelUrl}
┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃
┃ ⚡ *Quick Commands*
┃ ═══════════════════════════
┃ ${conf.PREFIXE || '.'}menu  - Bot Menu
┃ ${conf.PREFIXE || '.'}ping  - Check Speed
┃ ${conf.PREFIXE || '.'}alive - Bot Status
┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

╭━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   ⭐ *Star this repo on GitHub!*
┃   🚀 *Powered by ${botName}*
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
      `;

      await zk.sendMessage(dest, {
        image: { url: imageUrl },
        caption: repoMessage,
        contextInfo: {
          externalAdReply: {
            title: `🌟 ${botName} Repository`,
            body: `${stars} Stars • ${forks} Forks • Updated ${updated}`,
            thumbnailUrl: imageUrl,
            mediaType: 1,
            sourceUrl: repoUrl,
            showAdAttribution: true,
            renderLargerThumbnail: true
          }
        }
      });

    } catch (error) {
      // Fallback message if API fails
      const fallbackMessage = `
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   🌟 *${botName} REPOSITORY* 🌟
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ ✨ *REPO INFORMATION*
┃ ═══════════════════════════
┃
┃ 📂 *Repo:* RAHMANI-XMD
┃ 👤 *Owner:*Qartde
┃ 📅 *Updated:* March 2025
┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃
┃ ⭐ *Stars:* ★★★★★  │  🍴 *Forks:* ∞
┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃
┃ 📝 *Description:*
┃ Multi-functional WhatsApp Bot
┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃
┃ 🔗 *LINKS*
┃ ═══════════════════════════
┃ 📎 GitHub: ${repoUrl}
┃ 📢 Channel: ${channelUrl}
┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃
┃ ⚡ *Quick Commands*
┃ ═══════════════════════════
┃ ${conf.PREFIXE || '.'}menu  - Bot Menu
┃ ${conf.PREFIXE || '.'}ping  - Check Speed
┃ ${conf.PREFIXE || '.'}alive - Bot Status
┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

╭━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   ⭐ *Star this repo on GitHub!*
┃   🚀 *Powered by ${botName}*
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
      `;

      await zk.sendMessage(dest, {
        image: { url: imageUrl },
        caption: fallbackMessage,
        contextInfo: {
          externalAdReply: {
            title: `🌟 ${botName} Repository`,
            body: "Click to visit GitHub",
            thumbnailUrl: imageUrl,
            mediaType: 1,
            sourceUrl: repoUrl,
            showAdAttribution: true,
            renderLargerThumbnail: true
          }
        }
      });
    }
  }
);
