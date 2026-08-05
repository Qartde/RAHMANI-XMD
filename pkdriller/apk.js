const axios = require("axios");
const { zokou } = require("../framework/zokou");

// ==================== CONSTANTS ====================
const VCARD_CONTACT = {
  key: {
    fromMe: false,
    participant: "0@s.whatsapp.net",
    remoteJid: "status@broadcast"
  },
  message: {
    contactMessage: {
      displayName: "RAHMANI VERIFIED ✅",
      vcard: `BEGIN:VCARD
VERSION:3.0
FN:RAHMANI VERIFIED ✅
ORG:RAHMANI-XMD BOT;
TEL;type=CELL;type=VOICE;waid=255693629079:+255693629079
END:VCARD`
    }
  }
};

const NEWSLETTER_CONTEXT = {
  contextInfo: {
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: "120363353854480831@newsletter",
      newsletterName: "RAHMANI-XMD",
      serverMessageId: 1
    }
  }
};

const APIS = {
  APK_SEARCH: "https://bmb-api-downloads.vercel.app/api/apk"
};

// ==================== HELPERS ====================
const formatSize = (bytes) => {
  if (!bytes) return "Unknown";
  const mb = bytes / 1048576;
  return mb < 1 ? `${(bytes / 1024).toFixed(2)} KB` : `${mb.toFixed(2)} MB`;
};

const buildApkCaption = (app) => {
  const size = formatSize(app.size);
  const developer = app.developer?.name || "Unknown";
  const packageName = app.package || "N/A";
  const updated = app.updated || "N/A";

  return `┏━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 📦 ${app.name}
┣━━━━━━━━━━━━━━━━━━━━━━━
┃ 📏 Size: ${size}
┃ 📦 Package: ${packageName}
┃ 📅 Updated: ${updated}
┃ 👨‍💻 Dev: ${developer}
┗━━━━━━━━━━━━━━━━━━━━━━━
🔗 Powered by RAHMANI-XMD`;
};

const getDownloadUrl = (app) => {
  return app.file?.path_alt || app.file?.path || null;
};

// ==================== COMMAND ====================
zokou(
  {
    nomCom: "apk",
    categorie: "Download",
    reaction: "🌍"
  },
  async (dest, zk, commandeOptions) => {
    const { arg, repondre, ms } = commandeOptions;

    // --- Validation ---
    if (!arg || arg.length === 0) {
      return repondre("❌ *Usage:* .apk <app name>\n*Example:* .apk whatsapp");
    }

    const searchQuery = arg.join(" ").trim();

    try {
      // --- Send initial reaction ---
      await zk.sendMessage(dest, {
        react: { text: "⏳", key: ms.key }
      });

      // --- Fetch data from API ---
      const apiUrl = `${APIS.APK_SEARCH}?q=${encodeURIComponent(searchQuery)}`;
      const { data } = await axios.get(apiUrl, { timeout: 15000 });

      // --- Validate response ---
      if (!data?.status || !data?.results?.length) {
        return repondre(`⚠️ No results found for *"${searchQuery}"*.\nTry a different keyword.`);
      }

      const app = data.results[0];
      const downloadUrl = getDownloadUrl(app);

      if (!downloadUrl) {
        return repondre(`⚠️ Download link not available for *${app.name}*.`);
      }

      // --- Prepare message data ---
      const caption = buildApkCaption(app);
      const imageUrl = app.icon || null;

      // --- Send app info with image ---
      if (imageUrl) {
        await zk.sendMessage(
          dest,
          {
            image: { url: imageUrl },
            caption,
            ...NEWSLETTER_CONTEXT
          },
          { quoted: VCARD_CONTACT }
        );
      } else {
        await zk.sendMessage(
          dest,
          {
            text: caption,
            ...NEWSLETTER_CONTEXT
          },
          { quoted: VCARD_CONTACT }
        );
      }

      // --- Send APK file ---
      await zk.sendMessage(
        dest,
        {
          document: { url: downloadUrl },
          fileName: `${app.name}.apk`,
          mimetype: "application/vnd.android.package-archive",
          ...NEWSLETTER_CONTEXT
        },
        { quoted: VCARD_CONTACT }
      );

      // --- Send success reaction ---
      await zk.sendMessage(dest, {
        react: { text: "✅", key: ms.key }
      });

    } catch (error) {
      console.error("[APK Command Error]:", error.message);

      const errorMessage = error.code === "ECONNABORTED"
        ? "⏰ Request timeout. Please try again later."
        : "❌ An error occurred while fetching the APK. Please try again.";

      return repondre(errorMessage);
    }
  }
);
